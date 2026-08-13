import copy
import json
import re
import shutil
import tempfile
from pathlib import Path

from errors import (
    CONFIGS_MISSING,
    DUPLICATE_FILE,
    FILE_NOT_FOUND,
    INVALID_CONFIG,
    INVALID_FILEDQC,
    INVALID_FILEGSQL,
    INVALID_MODES,
    INVALID_NAME,
    INVALID_STAGES,
    INVALID_THREADS,
    JSON_READ_FAILED,
    WRITE_FAILED,
    MartExportError,
)


SAFE_NAME = re.compile(r"^[A-Za-z_][A-Za-z0-9_]*$")
HDFS_APP_ROOT = "{{hdfs_path_app_full}}"
DEVOPS_CONFIG = {
    "spark.executor.instances": 6,
    "spark.executor.memory": "4g",
    "spark.executor.cores": 2,
    "spark.driver.memory": "2g",
    "spark.sql.shuffle.partitions": 200,
    "spark.dynamicAllocation.enabled": True,
    "spark.dynamicAllocation.maxExecutors": 12,
}


def read_context(path):
    """Читает общий контекст витрины формата 2.0."""
    path = Path(path)
    if not path.is_file():
        raise MartExportError(FILE_NOT_FOUND.format(path=path))
    try:
        context = json.loads(path.read_text(encoding="utf-8"))
    except Exception as error:
        raise MartExportError(JSON_READ_FAILED.format(reason=error)) from error
    configs = context.get("b2c_sql_configs") if isinstance(context, dict) else None
    if not isinstance(configs, dict) or not configs:
        raise MartExportError(CONFIGS_MISSING)
    return context


def validate_name(value, kind):
    """Проверяет безопасное имя каталога или файла витрины."""
    value = str(value).strip()
    if not SAFE_NAME.fullmatch(value):
        raise MartExportError(INVALID_NAME.format(kind=kind, name=value))
    return value


def write_json(path, value):
    """Сохраняет JSON детерминированно и с переводом строки в конце."""
    path.write_text(
        json.dumps(value, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def sql_text(value, stream, module):
    """Преобразует filegsql в содержимое отдельного SQL-файла."""
    if isinstance(value, str):
        return value.rstrip() + "\n"
    if isinstance(value, list) and all(isinstance(line, str) for line in value):
        return "\n".join(value).rstrip() + "\n"
    raise MartExportError(
        INVALID_FILEGSQL.format(stream=stream, module=module)
    )


def replace_config_key(config, old_key, new_key, value):
    """Заменяет встроенное содержимое на путь, сохраняя порядок ключей."""
    return {
        (new_key if key == old_key else key): (value if key == old_key else item)
        for key, item in config.items()
    }


def export_stream(stream_dir, stream_name, config, ddl):
    """Выносит встроенные SQL и DQC одного потока в отдельные файлы."""
    if not isinstance(config, dict):
        raise MartExportError(INVALID_CONFIG.format(stream=stream_name))
    result = copy.deepcopy(config)
    threads = result.get("treadConfigs")
    if not isinstance(threads, list):
        raise MartExportError(INVALID_THREADS.format(stream=stream_name))

    files = set()
    for thread in threads:
        module = validate_name(
            thread.get("name") if isinstance(thread, dict) else "",
            "модуля",
        )
        stages = thread.get("stages")
        if not isinstance(stages, list):
            raise MartExportError(
                INVALID_STAGES.format(stream=stream_name, module=module)
            )
        file_stages = [
            stage
            for stage in stages
            if isinstance(stage, dict)
            and isinstance(stage.get("config"), dict)
            and (
                "filegsql" in stage["config"]
                or "filedqc" in stage["config"]
            )
        ]
        for index, stage in enumerate(file_stages, start=1):
            suffix = "" if len(file_stages) == 1 else f"_{index}"
            stage_config = stage["config"]
            if "filegsql" in stage_config:
                filename = f"{module}{suffix}.sql"
                if filename in files:
                    raise MartExportError(
                        DUPLICATE_FILE.format(stream=stream_name, file=filename)
                    )
                files.add(filename)
                (stream_dir / filename).write_text(
                    sql_text(stage_config["filegsql"], stream_name, module),
                    encoding="utf-8",
                )
                stage["config"] = replace_config_key(
                    stage_config,
                    "filegsql",
                    "filePath",
                    f"{HDFS_APP_ROOT}/etl/{stream_name}/{filename}",
                )
                stage_config = stage["config"]

            if "filedqc" in stage_config:
                payload = stage_config["filedqc"]
                if not isinstance(payload, dict):
                    raise MartExportError(
                        INVALID_FILEDQC.format(stream=stream_name, module=module)
                    )
                filename = f"{module}{suffix}.json"
                if filename in files:
                    raise MartExportError(
                        DUPLICATE_FILE.format(stream=stream_name, file=filename)
                    )
                files.add(filename)
                write_json(stream_dir / filename, payload)
                stage["config"] = replace_config_key(
                    stage_config,
                    "filedqc",
                    "DqJsonPath",
                    f"{HDFS_APP_ROOT}/etl/{stream_name}/{filename}",
                )

    ddl_sections = []
    for table_kind in ("pa_table", "hist_table", "stg_table"):
        table_ddl = ddl.get(table_kind) if isinstance(ddl, dict) else None
        lines = table_ddl.get("create_table") if isinstance(table_ddl, dict) else None
        if not isinstance(lines, list) or not lines:
            raise MartExportError(
                WRITE_FAILED.format(
                    path=stream_dir / "DDL.sql",
                    reason=f"в context_config.json отсутствует DDL {table_kind}",
                )
            )
        ddl_sections.append("\n".join(str(line) for line in lines).rstrip())

    (stream_dir / "DDL.sql").write_text(
        "\n\n".join(ddl_sections) + "\n",
        encoding="utf-8",
    )
    write_json(stream_dir / "b2c_sql_config.json", result)
    return len(files) + 2


def replace_mart(staging, target):
    """Атомарно заменяет только каталог dm_res готовой сборкой."""
    backup = None
    target_moved = False
    try:
        if target.exists():
            backup = target.with_name(f".{target.name}_backup")
            if backup.exists():
                shutil.rmtree(backup)
            target.replace(backup)
            target_moved = True
        staging.replace(target)
        if target_moved:
            shutil.rmtree(backup)
    except Exception:
        if target_moved and target.exists():
            shutil.rmtree(target)
        if target_moved and backup.exists():
            backup.replace(target)
        raise


def export_mart(context_path, target_path=None):
    """Раскладывает b2c_sql_configs в фиксированную витрину dm_res."""
    context = read_context(context_path)
    configs = context["b2c_sql_configs"]
    ddl_by_table = context.get("ddl")
    if not isinstance(ddl_by_table, dict) or not ddl_by_table:
        raise MartExportError(
            WRITE_FAILED.format(path=context_path, reason="отсутствует раздел ddl")
        )
    project_root = Path(__file__).resolve().parents[1]
    target = (
        Path(target_path).resolve()
        if target_path
        else (project_root / "dm_res").resolve()
    )
    if target.name != "dm_res":
        raise MartExportError(WRITE_FAILED.format(path=target, reason="неверный путь"))

    target.parent.mkdir(parents=True, exist_ok=True)
    staging = Path(tempfile.mkdtemp(prefix=".dm_res_build_", dir=target.parent))
    stream_count = 0
    file_count = 0
    try:
        etl_dir = staging / "etl"
        resources_dir = staging / "resources"
        etl_dir.mkdir()
        resources_dir.mkdir()
        write_json(resources_dir / "devops.json", DEVOPS_CONFIG)
        write_json(resources_dir / "b2c_format.json", {"formatVersion": "2.0"})
        write_json(resources_dir / "context_config.json", context)
        file_count += 3

        for table, modes in configs.items():
            table = validate_name(table, "таблицы")
            if not isinstance(modes, dict) or not modes:
                raise MartExportError(INVALID_MODES.format(table=table))
            for mode, config in modes.items():
                mode = validate_name(mode, "режима")
                stream_name = validate_name(f"{table}_{mode}", "потока")
                stream_dir = etl_dir / stream_name
                stream_dir.mkdir()
                file_count += export_stream(
                    stream_dir,
                    stream_name,
                    config,
                    ddl_by_table.get(table),
                )
                stream_count += 1

        replace_mart(staging, target)
    except MartExportError:
        if staging.exists():
            shutil.rmtree(staging)
        raise
    except Exception as error:
        if staging.exists():
            shutil.rmtree(staging)
        raise MartExportError(
            WRITE_FAILED.format(path=target, reason=error)
        ) from error

    return target, stream_count, file_count
