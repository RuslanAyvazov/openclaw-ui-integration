"""Добавление новых и замена изменённых потоков в копии репозитория."""

from __future__ import annotations

import argparse
import json
import shutil
import sys
from pathlib import Path


class MergeError(Exception):
    """Обновлённые потоки нельзя безопасно объединить с копией витрины."""


def read_json(path: Path) -> dict:
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as error:
        raise MergeError(f"не удалось прочитать {path}: {error}") from error
    if not isinstance(value, dict):
        raise MergeError(f"{path} должен быть JSON-объектом")
    return value


def write_json(path: Path, value: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(value, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def pa_key(table: dict) -> str:
    name = ((table or {}).get("pa_table") or {}).get("name")
    if not isinstance(name, str) or name.count(".") != 1:
        raise MergeError("обнаружено некорректное имя PA-таблицы")
    return name.casefold()


def short_key(table: dict) -> str:
    return pa_key(table).rsplit(".", 1)[-1]


def merged_context(existing: dict, build: dict, plan: dict) -> dict:
    result = dict(existing)
    existing_tables = list((existing.get("validator") or {}).get("tables") or [])
    build_tables = list((build.get("validator") or {}).get("tables") or [])
    build_by_pa = {pa_key(table): table for table in build_tables}
    updated_pa = {
        str(item.get("name") or "").casefold()
        for item in plan.get("updatedTables") or []
    }
    new_pa = {str(name).casefold() for name in plan.get("newTables") or []}
    if set(build_by_pa) != updated_pa | new_pa:
        raise MergeError("план обновления не совпадает с контекстом собранных потоков")

    merged_tables = []
    replaced = set()
    for table in existing_tables:
        key = pa_key(table)
        if key in updated_pa:
            merged_tables.append(build_by_pa[key])
            replaced.add(key)
        else:
            merged_tables.append(table)
    if replaced != updated_pa:
        raise MergeError("не все обновляемые таблицы найдены в существующем контексте")
    merged_tables.extend(build_by_pa[key] for key in build_by_pa if key in new_pa)
    result["validator"] = {
        **(existing.get("validator") or {}),
        "tables": merged_tables,
    }

    updated_short = {short_key(build_by_pa[key]) for key in updated_pa}
    new_short = {short_key(build_by_pa[key]) for key in new_pa}
    for section in ("ddl", "b2c_sql_configs"):
        left = dict(existing.get(section) or {})
        right = dict(build.get(section) or {})
        right_by_key = {str(key).casefold(): value for key, value in right.items()}
        if set(right_by_key) != updated_short | new_short:
            raise MergeError(f"раздел {section} не совпадает с планом обновления")
        existing_keys = {str(key).casefold(): key for key in left}
        for key in new_short:
            if key in existing_keys:
                raise MergeError(f"новая таблица {key} уже присутствует в {section}")
        for key in updated_short:
            original_key = existing_keys.get(key)
            if original_key is None:
                raise MergeError(f"обновляемая таблица {key} отсутствует в {section}")
            left[original_key] = right_by_key[key]
        for key in new_short:
            original_key = next(raw for raw in right if str(raw).casefold() == key)
            left[original_key] = right_by_key[key]
        result[section] = left

    result["repository_format"] = {"version": "2.0"}
    return result


def replace_stream(source: Path, target: Path, target_etl: Path) -> None:
    if target.parent.resolve() != target_etl.resolve():
        raise MergeError(f"путь потока вышел за границы etl: {target}")
    if not target.is_dir():
        raise MergeError(f"обновляемый поток не найден: {target.name}")
    shutil.rmtree(target)
    shutil.copytree(source, target)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Объединение обновления с копией витрины")
    parser.add_argument("repository")
    parser.add_argument("built_mart")
    parser.add_argument("existing_context")
    parser.add_argument("build_context")
    parser.add_argument("update_plan")
    parser.add_argument("--manifest-json", required=True)
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    repository = Path(args.repository).resolve()
    built_mart = Path(args.built_mart).resolve()
    try:
        plan = read_json(Path(args.update_plan).resolve())
        added_streams = list(plan.get("newStreams") or [])
        updated_streams = list(plan.get("updatedStreams") or [])
        expected_streams = set(added_streams) | set(updated_streams)
        source_etl = built_mart / "etl"
        target_etl = repository / "etl"
        if not source_etl.is_dir() or not target_etl.is_dir():
            raise MergeError("не найден каталог etl")
        source_streams = {
            item.name: item
            for item in source_etl.iterdir()
            if item.is_dir()
        }
        if set(source_streams) != expected_streams:
            raise MergeError(
                "собранные потоки не совпадают с планом: "
                + ", ".join(sorted(set(source_streams) ^ expected_streams, key=str.casefold))
            )

        for name in added_streams:
            target = target_etl / name
            if target.exists():
                raise MergeError(f"новый поток уже существует: {name}")
            shutil.copytree(source_streams[name], target)
        for name in updated_streams:
            replace_stream(source_streams[name], target_etl / name, target_etl)

        resources = repository / "resources"
        resources.mkdir(parents=True, exist_ok=True)
        devops = resources / "devops.json"
        if not devops.exists() and (built_mart / "resources" / "devops.json").is_file():
            shutil.copy2(built_mart / "resources" / "devops.json", devops)

        context = merged_context(
            read_json(Path(args.existing_context).resolve()),
            read_json(Path(args.build_context).resolve()),
            plan,
        )
        write_json(resources / "context_config.json", context)
        write_json(resources / "b2c_format.json", {"formatVersion": "2.0"})
        manifest = {
            "addedStreams": added_streams,
            "addedStreamCount": len(added_streams),
            "updatedStreams": updated_streams,
            "updatedStreamCount": len(updated_streams),
            "repository": str(repository),
        }
        write_json(Path(args.manifest_json).resolve(), manifest)
    except MergeError as error:
        print(f"Обновление потоков не выполнено: {error}", file=sys.stderr)
        return 2
    except Exception as error:
        print(f"Не удалось объединить копию витрины: {error}", file=sys.stderr)
        return 2

    print(
        f"В копию витрины добавлено потоков: {manifest['addedStreamCount']}; "
        f"обновлено потоков: {manifest['updatedStreamCount']}."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
