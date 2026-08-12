import argparse
import sys

from b2c_sql_configurator import add_b2c_sql_configs
from errors import B2CSQLConfigurationError


for stream in (sys.stdout, sys.stderr):
    if hasattr(stream, "reconfigure"):
        stream.reconfigure(encoding="utf-8")


def main():
    """Добавляет B2C SQL-конфигурации в общий JSON после генерации DDL."""
    parser = argparse.ArgumentParser(
        description="Формирование B2C SQL-конфигураций из общего JSON"
    )
    parser.add_argument("context_json", help="Путь к общему context_config.json")
    parser.add_argument(
        "--dml-json",
        help=(
            "JSON с DML_inc.sql для Parquet; "
            "с DML_inc.sql и DML_arc.sql для Iceberg"
        ),
    )
    parser.add_argument(
        "--storage",
        required=True,
        choices=("iceberg", "parquet"),
        help="Формат хранения целевых таблиц",
    )
    parser.add_argument(
        "--output-json",
        help="Путь для результата; если не указан, исходный JSON обновляется на месте",
    )
    args = parser.parse_args()

    try:
        result_path, stream_count = add_b2c_sql_configs(
            args.context_json,
            args.dml_json,
            args.storage,
            args.output_json,
        )
    except B2CSQLConfigurationError as error:
        print(error, file=sys.stderr)
        return 1

    print(
        f"B2C SQL-конфигурации сформированы: потоков — {stream_count}, "
        f"JSON — {result_path}."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
