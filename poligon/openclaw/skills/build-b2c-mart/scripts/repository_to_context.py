"""Проверка репозитория витрины 2.0 и восстановление context_config.json."""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path


CREATE_TABLE = re.compile(
    r"\bCREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?"
    r"(?P<schema>`[^`]+`|\"[^\"]+\"|[A-Za-z_][A-Za-z0-9_]*)\."
    r"(?P<table>`[^`]+`|\"[^\"]+\"|[A-Za-z_][A-Za-z0-9_]*)",
    re.IGNORECASE,
)


class RepositoryFormatError(Exception):
    """Репозиторий нельзя использовать как витрину формата 2.0."""


def unquote_identifier(value: str) -> str:
    value = value.strip()
    if len(value) >= 2 and value[0] == value[-1] and value[0] in {'`', '"'}:
        return value[1:-1]
    return value


def normalized_name(value: str) -> str:
    parts = [unquote_identifier(part) for part in str(value).split(".")]
    return ".".join(parts).casefold()


def read_json(path: Path, label: str) -> dict:
    if not path.is_file():
        raise RepositoryFormatError(f"не найден {label}: {path}")
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as error:
        raise RepositoryFormatError(f"не удалось прочитать {label}: {error}") from error
    if not isinstance(value, dict):
        raise RepositoryFormatError(f"{label} должен содержать JSON-объект")
    return value


def table_names_from_ddl(path: Path) -> set[str]:
    if not path.is_file():
        raise RepositoryFormatError(f"не найден обязательный файл {path}")
    text = path.read_text(encoding="utf-8-sig")
    names = {
        normalized_name(f"{match.group('schema')}.{match.group('table')}")
        for match in CREATE_TABLE.finditer(text)
    }
    if not names:
        raise RepositoryFormatError(f"в {path} нет ни одного CREATE TABLE schema.table")
    return names


def validate_stream_config(path: Path) -> None:
    config = read_json(path, "b2c_sql_config.json")
    threads = config.get("treadConfigs")
    relations = config.get("treadRelations")
    if not isinstance(threads, list) or not threads:
        raise RepositoryFormatError(f"в {path} отсутствует непустой treadConfigs")
    if not isinstance(relations, list):
        raise RepositoryFormatError(f"в {path} отсутствует массив treadRelations")


def context_table_map(context: dict) -> dict[str, dict]:
    tables = context.get("validator", {}).get("tables")
    if not isinstance(tables, list) or not tables:
        raise RepositoryFormatError(
            "resources/context_config.json не содержит validator.tables"
        )
    result: dict[str, dict] = {}
    for table in tables:
        pa_name = ((table or {}).get("pa_table") or {}).get("name")
        if not isinstance(pa_name, str) or pa_name.count(".") != 1:
            raise RepositoryFormatError("в validator.tables задано неверное имя PA-таблицы")
        short_name = unquote_identifier(pa_name.rsplit(".", 1)[-1])
        key = short_name.casefold()
        if key in result:
            raise RepositoryFormatError(f"таблица {short_name} повторяется в контексте")
        result[key] = table
    return result


def convert_repository(repository: Path) -> dict:
    repository = repository.resolve()
    if not (repository / "etl").is_dir() or not (repository / "resources").is_dir():
        raise RepositoryFormatError("нет обязательных каталогов etl и resources")

    marker = read_json(repository / "resources" / "b2c_format.json", "маркер формата")
    if str(marker.get("formatVersion")) != "2.0":
        raise RepositoryFormatError("formatVersion должен быть равен 2.0")

    context = read_json(
        repository / "resources" / "context_config.json",
        "resources/context_config.json",
    )
    tables = context_table_map(context)
    configs = context.get("b2c_sql_configs")
    ddl = context.get("ddl")
    if not isinstance(configs, dict) or not configs:
        raise RepositoryFormatError("в контексте отсутствует b2c_sql_configs")
    if not isinstance(ddl, dict) or not ddl:
        raise RepositoryFormatError("в контексте отсутствует ddl")

    checked_streams = []
    for table_name, modes in configs.items():
        table_key = str(table_name).casefold()
        table = tables.get(table_key)
        if table is None:
            raise RepositoryFormatError(
                f"конфигурация {table_name} не связана с validator.tables"
            )
        if not isinstance(modes, dict) or not modes:
            raise RepositoryFormatError(f"у таблицы {table_name} нет режимов потока")

        table_ddl = ddl.get(table_name)
        if not isinstance(table_ddl, dict):
            raise RepositoryFormatError(f"в контексте отсутствует DDL таблицы {table_name}")
        expected = {
            normalized_name((table_ddl.get(kind) or {}).get("name", ""))
            for kind in ("pa_table", "hist_table", "stg_table")
        }
        if "" in expected or len(expected) != 3:
            raise RepositoryFormatError(
                f"для таблицы {table_name} должны быть заданы PA, HIST и STG"
            )

        for mode in modes:
            stream_name = f"{table_name}_{mode}"
            stream_dir = repository / "etl" / stream_name
            if not stream_dir.is_dir():
                raise RepositoryFormatError(f"не найден каталог потока etl/{stream_name}")
            actual = table_names_from_ddl(stream_dir / "DDL.sql")
            missing = sorted(expected - actual)
            if missing:
                raise RepositoryFormatError(
                    f"DDL потока {stream_name} не содержит таблицы: {', '.join(missing)}"
                )
            validate_stream_config(stream_dir / "b2c_sql_config.json")
            checked_streams.append(stream_name)

    context["repository_format"] = {
        "version": "2.0",
        "validatedStreams": sorted(checked_streams, key=str.casefold),
    }
    return context


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Проверка репозитория витрины 2.0 и восстановление контекста"
    )
    parser.add_argument("repository", help="Каталог копии ветки репозитория")
    parser.add_argument("--output-json", required=True)
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    output = Path(args.output_json).resolve()
    try:
        context = convert_repository(Path(args.repository))
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(
            json.dumps(context, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
    except RepositoryFormatError as error:
        print(
            "Витрина не соответствует формату 2.0: " + str(error),
            file=sys.stderr,
        )
        return 2
    except Exception as error:
        print(f"Не удалось проверить репозиторий витрины: {error}", file=sys.stderr)
        return 2

    print(f"Репозиторий формата 2.0 проверен: {output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
