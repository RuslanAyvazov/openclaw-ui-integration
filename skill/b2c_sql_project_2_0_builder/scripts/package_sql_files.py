"""Детерминированно собирает dml_scripts.json из отдельных SQL-файлов."""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path


SCRIPT_DIR = Path(__file__).resolve().parent
DM_SKILL_DIR = SCRIPT_DIR / "dm_skill"
CONFIGURATOR_DIR = DM_SKILL_DIR / "b2c_sql_configurator"
sys.path.insert(0, str(CONFIGURATOR_DIR))

from helpers.sql_prototype import (  # noqa: E402
    is_wildcard_projection,
    output_name,
    parse_outer_select,
)


SCRIPT_PATTERNS = {
    "DML_inc.sql": re.compile(r"(^|[^a-z0-9])dml[_-]?inc([^a-z0-9]|$)"),
    "DML_arc.sql": re.compile(r"(^|[^a-z0-9])dml[_-]?arc([^a-z0-9]|$)"),
}
REQUIRED_SCRIPTS = {
    "iceberg": ("DML_inc.sql", "DML_arc.sql"),
    "parquet": ("DML_inc.sql",),
}


class PackageError(Exception):
    """Ошибка детерминированной сборки пакета SQL-прототипов."""


def validate_s2t(s2t_path: Path, context_path: Path) -> list[dict]:
    """Запускает валидатор S2T и возвращает таблицы валидатора."""
    context_path.parent.mkdir(parents=True, exist_ok=True)
    result = subprocess.run(
        [
            sys.executable,
            str(DM_SKILL_DIR / "validator" / "main.py"),
            str(s2t_path),
            "--output-json",
            str(context_path),
        ],
        check=False,
    )
    if result.returncode != 0:
        raise PackageError("S2T не прошёл проверку; SQL-прототипы не сопоставлены.")

    context = json.loads(context_path.read_text(encoding="utf-8"))
    tables = context.get("validator", {}).get("tables")
    if not isinstance(tables, list) or not tables:
        raise PackageError("В результате валидатора отсутствуют таблицы.")
    return tables


def script_name(path: Path) -> str:
    """Определяет режим DML по имени отдельного SQL-файла."""
    normalized = path.name.casefold()
    matches = [
        name for name, pattern in SCRIPT_PATTERNS.items() if pattern.search(normalized)
    ]
    if len(matches) != 1:
        raise PackageError(
            f"Не удалось определить режим файла {path.name}; "
            "в имени должно быть DML_inc или DML_arc."
        )
    return matches[0]


def select_columns(path: Path, sql: str) -> list[str]:
    """Возвращает явные выходные поля внешнего SELECT."""
    try:
        select = parse_outer_select(sql)
    except Exception as error:
        raise PackageError(
            f"Не удалось разобрать внешний SELECT файла {path.name}: {error}."
        ) from error

    projections = list(select.expressions)
    if any(is_wildcard_projection(item) for item in projections):
        raise PackageError(f"Файл {path.name} содержит запрещённую звёздочку *.")

    names = [output_name(item) for item in projections]
    if any(not name for name in names):
        raise PackageError(
            f"В файле {path.name} есть выражение без выходного имени или AS <имя>."
        )

    normalized = [name.casefold() for name in names]
    duplicates = sorted({name for name in normalized if normalized.count(name) > 1})
    if duplicates:
        raise PackageError(
            f"В файле {path.name} повторяются выходные поля: {', '.join(duplicates)}."
        )
    return names


def table_specs(tables: list[dict]) -> list[dict]:
    """Формирует ожидаемые наборы STG-полей в порядке S2T."""
    result = []
    for table in tables:
        stream = table["pa_table"]["name"].rsplit(".", 1)[-1]
        columns = [column["name"] for column in table["stg_table"]["columns"]]
        result.append(
            {
                "stream": stream,
                "columns": columns,
                "column_set": {column.casefold() for column in columns},
            }
        )
    return result


def choose_stream(path: Path, sql: str, columns: list[str], specs: list[dict]) -> str:
    """Сопоставляет SQL с единственной таблицей по точному набору STG-полей."""
    actual = {column.casefold() for column in columns}
    candidates = [spec for spec in specs if spec["column_set"] == actual]
    if len(candidates) == 1:
        return candidates[0]["stream"]

    if len(candidates) > 1:
        text = f"{path.name}\n{sql}".casefold()
        hinted = [
            spec for spec in candidates if spec["stream"].casefold() in text
        ]
        if len(hinted) == 1:
            return hinted[0]["stream"]
        names = ", ".join(spec["stream"] for spec in candidates)
        raise PackageError(
            f"Файл {path.name} одинаково подходит таблицам: {names}."
        )

    nearest = min(
        specs,
        key=lambda spec: (
            len(actual ^ spec["column_set"]),
            spec["stream"].casefold(),
        ),
    )
    missing = [
        column for column in nearest["columns"] if column.casefold() not in actual
    ]
    extra = [column for column in columns if column.casefold() not in nearest["column_set"]]
    raise PackageError(
        f"Файл {path.name} не совпадает ни с одной STG-таблицей. "
        f"Ближайшая — {nearest['stream']}; "
        f"отсутствуют: {', '.join(missing) or 'нет'}; "
        f"лишние: {', '.join(extra) or 'нет'}."
    )


def build_package(
    tables: list[dict], sql_paths: list[Path], storage: str
) -> tuple[dict, list[str]]:
    """Собирает пакет и список выполненных сопоставлений."""
    specs = table_specs(tables)
    assignments: dict[tuple[str, str], str] = {}
    report = []
    errors = []

    for path in sorted(sql_paths, key=lambda item: (item.name.casefold(), str(item))):
        try:
            if not path.is_file():
                raise PackageError(f"SQL-файл не найден: {path}.")
            sql = path.read_text(encoding="utf-8-sig").strip()
            if not sql:
                raise PackageError(f"SQL-файл пуст: {path.name}.")
            dml_name = script_name(path)
            if storage == "parquet" and dml_name == "DML_arc.sql":
                continue
            columns = select_columns(path, sql)
            stream = choose_stream(path, sql, columns, specs)
            key = (stream.casefold(), dml_name)
            if key in assignments:
                raise PackageError(
                    f"Для {stream}/{dml_name} передано больше одного файла."
                )
            assignments[key] = sql
            report.append(f"{path.name} -> {stream}/{dml_name}")
        except PackageError as error:
            errors.append(str(error))

    required = REQUIRED_SCRIPTS[storage]
    for spec in specs:
        for dml_name in required:
            if (spec["stream"].casefold(), dml_name) not in assignments:
                errors.append(f"Не хватает: {spec['stream']}/{dml_name}.")

    if errors:
        raise PackageError("\n".join(f"- {error}" for error in errors))

    package = {}
    for spec in specs:
        stream = spec["stream"]
        package[stream] = {
            dml_name: assignments[(stream.casefold(), dml_name)]
            for dml_name in required
        }
    return package, report


def parse_args() -> argparse.Namespace:
    """Читает параметры командной строки."""
    parser = argparse.ArgumentParser(
        description="Сборка dml_scripts.json из отдельных SQL-прототипов"
    )
    parser.add_argument("s2t_file", help="Путь к S2T.xlsx")
    parser.add_argument("--storage", required=True, choices=("iceberg", "parquet"))
    parser.add_argument("--sql-file", action="append", required=True)
    parser.add_argument("--output", required=True, help="Путь к dml_scripts.json")
    parser.add_argument("--context-json", required=True)
    return parser.parse_args()


def main() -> int:
    """Проверяет S2T, сопоставляет SQL и записывает детерминированный JSON."""
    args = parse_args()
    try:
        tables = validate_s2t(Path(args.s2t_file).resolve(), Path(args.context_json).resolve())
        package, report = build_package(
            tables,
            [Path(path).resolve() for path in args.sql_file],
            args.storage,
        )
        output = Path(args.output).resolve()
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(
            json.dumps(package, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
            newline="\n",
        )
    except PackageError as error:
        print("SQL-прототипы не сопоставлены:", file=sys.stderr)
        print(error, file=sys.stderr)
        return 2

    print(f"SQL-прототипы сопоставлены: {len(report)} из {len(report)}.")
    for line in report:
        print(f"- {line}")
    print(f"DML JSON: {output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
