import argparse
import sys

from errors import MartExportError
from mart_exporter import export_mart


for stream in (sys.stdout, sys.stderr):
    if hasattr(stream, "reconfigure"):
        stream.reconfigure(encoding="utf-8")


def main():
    """Раскладывает общий JSON в фиксированный каталог витрины dm_res."""
    parser = argparse.ArgumentParser(
        description="Раскладка b2c_sql_configs в витрину dm_res"
    )
    parser.add_argument("context_json", help="Путь к context_config.json")
    parser.add_argument(
        "--mart-dir",
        help="Каталог результата; его имя должно быть dm_res",
    )
    args = parser.parse_args()

    try:
        path, streams, files = export_mart(args.context_json, args.mart_dir)
    except MartExportError as error:
        print(f"Витрина dm_res не сформирована:\n- {error}", file=sys.stderr)
        return 1

    print(
        f"Витрина сформирована: потоков — {streams}, файлов — {files}, "
        f"каталог — {path}."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
