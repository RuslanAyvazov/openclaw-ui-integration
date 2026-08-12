import argparse
import sys

from ddl_generator import add_ddl_to_context
from errors import DDLGenerationError


for stream in (sys.stdout, sys.stderr):
    if hasattr(stream, "reconfigure"):
        stream.reconfigure(encoding="utf-8")


def main():
    """Принимает общий JSON, добавляет раздел DDL и сохраняет результат."""
    parser = argparse.ArgumentParser(
        description="Формирование Spark SQL DDL из проверенного общего JSON"
    )
    parser.add_argument("context_json", help="Путь к общему context_config.json")
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
        result_path, stream_count = add_ddl_to_context(
            args.context_json,
            args.storage,
            args.output_json,
        )
    except DDLGenerationError as error:
        print(error, file=sys.stderr)
        return 1

    print(f"DDL сформирован: потоков — {stream_count}, JSON — {result_path}.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
