import argparse
import sys
from pathlib import Path

from helpers.json_io import create_context_config, write_json
from s2t_validator import validate
from validation_errors import S2TValidationError


for stream in (sys.stdout, sys.stderr):
    if hasattr(stream, "reconfigure"):
        stream.reconfigure(encoding="utf-8")


def main():
    """Проверяет S2T и после успеха сохраняет раздел validator общего JSON."""
    parser = argparse.ArgumentParser(description="Проверка листа 'Target columns' в S2T.xlsx")
    parser.add_argument("s2t_file", help="Путь к файлу S2T.xlsx")
    parser.add_argument(
        "--output-json",
        help="Путь к общему context_config.json",
    )
    args = parser.parse_args()
    source = Path(args.s2t_file)
    output = Path(args.output_json) if args.output_json else source.with_name("context_config.json")

    try:
        result = validate(source)
        write_json(output, create_context_config(result))
    except S2TValidationError as error:
        print(error, file=sys.stderr)
        return 1
    except Exception as error:
        print(f"Не удалось сохранить общий JSON: {error}", file=sys.stderr)
        return 1

    table_count = len(result["tables"])
    column_count = sum(
        len(table["pa_table"]["columns"])
        for table in result["tables"]
    )
    print(f"Проверка пройдена: таблиц — {table_count}, полей — {column_count}, JSON — {output.resolve()}.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
