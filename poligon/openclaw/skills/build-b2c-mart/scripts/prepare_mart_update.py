"""План новых таблиц и расширения атрибутного состава существующих таблиц."""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
from pathlib import Path


SCRIPT_DIR = Path(__file__).resolve().parent
VALIDATOR = SCRIPT_DIR / "dm_skill" / "validator" / "main.py"


class UpdatePlanError(Exception):
    """Невозможно безопасно сформировать план обновления витрины."""


def read_json(path: Path, label: str) -> dict:
    if not path.is_file():
        raise UpdatePlanError(f"не найден {label}: {path}")
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as error:
        raise UpdatePlanError(f"не удалось прочитать {label}: {error}") from error
    if not isinstance(value, dict):
        raise UpdatePlanError(f"{label} должен быть JSON-объектом")
    return value


def pa_name(table: dict) -> str:
    value = ((table or {}).get("pa_table") or {}).get("name")
    if not isinstance(value, str) or value.count(".") != 1:
        raise UpdatePlanError("обнаружено некорректное имя PA-таблицы")
    return value.strip()


def short_name(table: dict) -> str:
    return pa_name(table).rsplit(".", 1)[-1]


def index_tables(tables: list[dict], source: str) -> dict[str, dict]:
    result = {}
    for table in tables:
        name = pa_name(table)
        key = name.casefold()
        if key in result:
            raise UpdatePlanError(f"в {source} повторяется таблица {name}")
        result[key] = table
    return result


def normalized_type(value: object) -> str:
    return " ".join(str(value or "").split()).casefold()


def table_columns(table: dict, source: str) -> list[dict[str, str]]:
    raw_columns = ((table or {}).get("pa_table") or {}).get("columns")
    if not isinstance(raw_columns, list) or not raw_columns:
        raise UpdatePlanError(f"в {source} у таблицы {pa_name(table)} отсутствуют поля")
    result = []
    seen = set()
    for raw in raw_columns:
        name = str((raw or {}).get("name") or "").strip()
        data_type = str((raw or {}).get("type") or "").strip()
        if not name or not data_type:
            raise UpdatePlanError(
                f"в {source} у таблицы {pa_name(table)} найдено поле без имени или типа"
            )
        key = name.casefold()
        if key in seen:
            raise UpdatePlanError(
                f"в {source} у таблицы {pa_name(table)} повторяется поле {name}"
            )
        seen.add(key)
        result.append({"name": name, "type": data_type})
    return result


def metadata_signature(table: dict) -> dict:
    return {
        "primaryKey": [str(value).casefold() for value in ((table.get("primary_key") or {}).get("columns") or [])],
        "partitioning": [str(value).casefold() for value in ((table.get("partitioning") or {}).get("expressions") or [])],
    }


def compare_existing_table(existing: dict, candidate: dict) -> dict:
    existing_columns = table_columns(existing, "существующей витрине")
    candidate_columns = table_columns(candidate, "S2T")
    existing_by_name = {item["name"].casefold(): item for item in existing_columns}
    candidate_by_name = {item["name"].casefold(): item for item in candidate_columns}

    removed = [item["name"] for item in existing_columns if item["name"].casefold() not in candidate_by_name]
    type_changes = []
    for key, old in existing_by_name.items():
        new = candidate_by_name.get(key)
        if new and normalized_type(old["type"]) != normalized_type(new["type"]):
            type_changes.append({"name": old["name"], "from": old["type"], "to": new["type"]})

    existing_order = [item["name"].casefold() for item in existing_columns]
    common_candidate_order = [
        item["name"].casefold()
        for item in candidate_columns
        if item["name"].casefold() in existing_by_name
    ]
    order_changed = not removed and common_candidate_order != existing_order
    metadata_changed = metadata_signature(existing) != metadata_signature(candidate)
    if removed or type_changes or order_changed or metadata_changed:
        details = []
        if removed:
            details.append("удалены поля: " + ", ".join(removed))
        if type_changes:
            details.append(
                "изменены типы: "
                + ", ".join(f"{item['name']} ({item['from']} -> {item['to']})" for item in type_changes)
            )
        if order_changed:
            details.append("изменён порядок существующих полей")
        if metadata_changed:
            details.append("изменены первичный ключ или партиционирование")
        raise UpdatePlanError(
            f"таблица {pa_name(candidate)} содержит неподдерживаемое изменение: "
            + "; ".join(details)
        )

    added = [item for item in candidate_columns if item["name"].casefold() not in existing_by_name]
    return {
        "changed": bool(added),
        "addedColumns": added,
        "existingColumnCount": len(existing_columns),
        "s2tColumnCount": len(candidate_columns),
    }


def stream_modes(existing: dict, table: dict, storage: str) -> list[str]:
    configs = existing.get("b2c_sql_configs")
    if not isinstance(configs, dict):
        raise UpdatePlanError("в существующей витрине отсутствует b2c_sql_configs")
    table_key = short_name(table).casefold()
    matched = [value for key, value in configs.items() if str(key).casefold() == table_key]
    if len(matched) != 1 or not isinstance(matched[0], dict):
        raise UpdatePlanError(f"не найдены режимы потоков таблицы {pa_name(table)}")
    actual = sorted((str(value).casefold() for value in matched[0]), key=str.casefold)
    expected = ["arc", "inc"] if storage == "iceberg" else ["inc"]
    if actual != expected:
        raise UpdatePlanError(
            f"таблица {pa_name(table)} имеет режимы {', '.join(actual)}, "
            f"которые не соответствуют формату {storage}"
        )
    return actual


def build_plan(existing: dict, candidate: dict, storage: str) -> tuple[dict, dict]:
    existing_tables = existing.get("validator", {}).get("tables")
    candidate_tables = candidate.get("validator", {}).get("tables")
    if not isinstance(existing_tables, list) or not existing_tables:
        raise UpdatePlanError("в существующей витрине отсутствуют validator.tables")
    if not isinstance(candidate_tables, list) or not candidate_tables:
        raise UpdatePlanError("S2T не содержит таблиц")

    existing_by_name = index_tables(existing_tables, "существующей витрине")
    candidate_by_name = index_tables(candidate_tables, "S2T")
    existing_by_short = {
        short_name(table).casefold(): pa_name(table)
        for table in existing_tables
    }

    new_tables = []
    updated_tables = []
    unchanged_tables = []
    new_streams = []
    updated_streams = []
    mode_names = ["inc", "arc"] if storage == "iceberg" else ["inc"]

    for key, table in candidate_by_name.items():
        name = pa_name(table)
        existing_table = existing_by_name.get(key)
        if existing_table is None:
            short = short_name(table).casefold()
            if short in existing_by_short:
                raise UpdatePlanError(
                    f"обнаружен конфликт имён: {name} и {existing_by_short[short]}"
                )
            new_tables.append(table)
            new_streams.extend(f"{short_name(table)}_{mode}" for mode in mode_names)
            continue

        comparison = compare_existing_table(existing_table, table)
        if not comparison["changed"]:
            unchanged_tables.append(name)
            continue
        modes = stream_modes(existing, existing_table, storage)
        streams = [f"{short_name(table)}_{mode}" for mode in modes]
        updated_streams.extend(streams)
        updated_tables.append({
            "name": name,
            "addedColumns": comparison["addedColumns"],
            "existingColumnCount": comparison["existingColumnCount"],
            "s2tColumnCount": comparison["s2tColumnCount"],
            "streams": streams,
            "table": table,
        })

    tables_to_build = [*new_tables, *(item["table"] for item in updated_tables)]
    plan = {
        "storage": storage,
        "s2tTableCount": len(candidate_tables),
        "unchangedTables": unchanged_tables,
        "newTables": [pa_name(table) for table in new_tables],
        "newTableCount": len(new_tables),
        "newStreams": new_streams,
        "newStreamCount": len(new_streams),
        "updatedTables": [
            {key: value for key, value in item.items() if key != "table"}
            for item in updated_tables
        ],
        "updatedTableCount": len(updated_tables),
        "updatedStreams": updated_streams,
        "updatedStreamCount": len(updated_streams),
        "changedTableCount": len(tables_to_build),
        "changedStreamCount": len(new_streams) + len(updated_streams),
    }
    build_context = {
        "format_version": candidate.get("format_version", 1),
        "validator": {
            **(candidate.get("validator") or {}),
            "tables": tables_to_build,
        },
        "ddl": {},
        "b2c_sql_configs": {},
    }
    return plan, build_context


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="План обновления существующей витрины")
    parser.add_argument("existing_context")
    parser.add_argument("s2t_file")
    parser.add_argument("--storage", required=True, choices=("iceberg", "parquet"))
    parser.add_argument("--build-context", required=True)
    parser.add_argument("--plan-json", required=True)
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    build_context_path = Path(args.build_context).resolve()
    candidate_path = build_context_path.with_name("s2t_context_config.json")
    result = subprocess.run(
        [
            sys.executable,
            str(VALIDATOR),
            str(Path(args.s2t_file).resolve()),
            "--output-json",
            str(candidate_path),
        ],
        check=False,
    )
    if result.returncode != 0:
        return result.returncode

    try:
        existing = read_json(Path(args.existing_context).resolve(), "контекст витрины")
        candidate = read_json(candidate_path, "контекст S2T")
        plan, build_context = build_plan(existing, candidate, args.storage)
        plan_path = Path(args.plan_json).resolve()
        plan_path.parent.mkdir(parents=True, exist_ok=True)
        plan_path.write_text(
            json.dumps(plan, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        build_context_path.write_text(
            json.dumps(build_context, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
    except UpdatePlanError as error:
        print(f"Обновление витрины не определено: {error}", file=sys.stderr)
        return 2

    print(
        f"Сравнение завершено: новых таблиц — {plan['newTableCount']}, "
        f"обновляемых таблиц — {plan['updatedTableCount']}, "
        f"изменяемых потоков — {plan['changedStreamCount']}."
    )
    return 3 if plan["changedTableCount"] == 0 else 0


if __name__ == "__main__":
    raise SystemExit(main())
