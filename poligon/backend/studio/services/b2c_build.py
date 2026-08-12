import base64
import json
import shutil
import subprocess
import tempfile
from datetime import timedelta
from pathlib import Path

from django.conf import settings
from django.utils import timezone

from studio.models import BuildDraft


MAX_S2T_BYTES = 25 * 1024 * 1024
MAX_SQL_FILES = 200


def _safe_file_name(name, index):
    clean = "".join(char if char.isalnum() or char in "_.-" else "_" for char in str(name or "prototype.sql"))
    clean = clean.lstrip(".") or "prototype.sql"
    return f"{index + 1:03d}_{clean}"


def _decode_s2t(payload):
    encoded = (payload or {}).get("base64")
    if not isinstance(encoded, str):
        raise ValueError("Не передан S2T.xlsx.")
    try:
        data = base64.b64decode(encoded, validate=True)
    except ValueError as error:
        raise ValueError("S2T.xlsx передан в некорректном формате.") from error
    if not data:
        raise ValueError("S2T.xlsx пуст.")
    if len(data) > MAX_S2T_BYTES:
        raise ValueError("S2T.xlsx превышает допустимый размер 25 МБ.")
    return data


def _collect_files(root):
    result = {}
    for file_path in sorted(Path(root).rglob("*"), key=lambda item: item.as_posix()):
        if file_path.is_file():
            result[file_path.relative_to(root).as_posix()] = file_path.read_text(encoding="utf-8")
    return result


def _summary(context, files, storage):
    tables = ((context or {}).get("validator") or {}).get("tables") or []
    configs = (context or {}).get("b2c_sql_configs") or {}
    names = [((table.get("pa_table") or {}).get("name")) for table in tables]
    names = [name for name in names if name]
    return {
        "storage": storage,
        "tableCount": len(names),
        "tableNames": names,
        "columnCount": sum(len((table.get("pa_table") or {}).get("columns") or []) for table in tables),
        "streamCount": sum(len(modes or {}) for modes in configs.values() if isinstance(modes, dict)),
        "fileCount": len(files),
    }


def cleanup_drafts():
    BuildDraft.objects.filter(expires_at__lte=timezone.now()).delete()


def run_build(user, payload):
    cleanup_drafts()
    storage = payload.get("storage")
    files = payload.get("files") or []
    if storage not in {"iceberg", "parquet"}:
        raise ValueError("Выберите формат iceberg или parquet.")
    if not isinstance(files, list) or not files:
        raise ValueError("Не переданы SQL-прототипы.")
    if len(files) > MAX_SQL_FILES:
        raise ValueError(f"Передано слишком много файлов: {len(files)}.")
    if not settings.B2C_UI_TMPFS_DIR.exists():
        raise ValueError(f"Временный каталог {settings.B2C_UI_TMPFS_DIR} недоступен.")

    temp_dir = Path(tempfile.mkdtemp(prefix="b2c-ui-", dir=settings.B2C_UI_TMPFS_DIR))
    s2t_path = temp_dir / "S2T.xlsx"
    context_path = temp_dir / "context_config.json"
    mart_dir = temp_dir / "dm_res"
    dml_path = temp_dir / "dml_scripts.json"
    try:
        s2t_path.write_bytes(_decode_s2t(payload.get("s2t")))
        json_files = [item for item in files if str(item.get("name", "")).lower().startswith("dml_scripts") and str(item.get("name", "")).lower().endswith(".json")]
        sql_files = [item for item in files if str(item.get("name", "")).lower().endswith(".sql")]
        if len(json_files) > 1:
            raise ValueError("Передано больше одного dml_scripts.json.")
        if json_files and sql_files:
            raise ValueError("Передайте либо dml_scripts.json, либо отдельные SQL-прототипы, но не оба варианта одновременно.")

        if json_files:
            dml_path.write_text(str(json_files[0].get("text") or ""), encoding="utf-8")
            command = [
                "bash", str(settings.B2C_SKILL_ROOT / "scripts" / "run.sh"), str(s2t_path),
                "--storage", storage, "--dml-json", str(dml_path),
                "--output-json", str(context_path), "--mart-dir", str(mart_dir),
            ]
        else:
            if not sql_files:
                raise ValueError("Не найдены отдельные файлы SQL или dml_scripts.json.")
            sql_paths = []
            for index, item in enumerate(sql_files):
                sql_path = temp_dir / _safe_file_name(item.get("name"), index)
                sql_path.write_text(str(item.get("text") or ""), encoding="utf-8")
                sql_paths.append(sql_path)
            command = [
                "bash", str(settings.B2C_SKILL_ROOT / "scripts" / "run_from_files.sh"), str(s2t_path),
                "--storage", storage,
            ]
            for sql_path in sql_paths:
                command.extend(["--sql-file", str(sql_path)])
            command.extend(["--dml-json", str(dml_path), "--output-json", str(context_path), "--mart-dir", str(mart_dir)])

        result = subprocess.run(
            command,
            cwd=temp_dir,
            text=True,
            capture_output=True,
            timeout=300,
            check=False,
        )
        if result.returncode != 0:
            detail = "\n".join(part.strip() for part in [result.stderr, result.stdout] if part and part.strip())
            raise ValueError(detail or "Сборка завершилась с ошибкой.")

        context = json.loads(context_path.read_text(encoding="utf-8"))
        project_files = _collect_files(mart_dir)
        summary = _summary(context, project_files, storage)
        draft = BuildDraft.objects.create(
            user=user,
            context_config=context,
            project_files=project_files,
            summary=summary,
            expires_at=timezone.now() + timedelta(hours=1),
        )
        return {
            "draftId": str(draft.id),
            "expiresAt": int(draft.expires_at.timestamp() * 1000),
            "summary": summary,
        }
    except subprocess.TimeoutExpired as error:
        raise ValueError("Сборка не завершилась за 5 минут.") from error
    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)
