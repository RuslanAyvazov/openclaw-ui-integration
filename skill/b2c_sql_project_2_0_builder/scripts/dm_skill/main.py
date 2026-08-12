import argparse
import subprocess
import sys
from pathlib import Path

from input_package.errors import InputPackageError
from input_package.package_validator import (
    missing_document_errors,
    validate_prototype_package,
)


for stream in (sys.stdout, sys.stderr):
    if hasattr(stream, "reconfigure"):
        stream.reconfigure(encoding="utf-8")


def main():
    """Запускает проверку, генераторы и раскладку витрины dm_res."""
    parser = argparse.ArgumentParser(
        description="Проверка S2T, формирование DDL и B2C SQL-конфигураций"
    )
    parser.add_argument("s2t_file", help="Путь к S2T.xlsx")
    parser.add_argument(
        "--storage",
        required=True,
        choices=("iceberg", "parquet"),
        help="Формат хранения целевых таблиц",
    )
    parser.add_argument(
        "--output-json",
        help="Путь к общему JSON; по умолчанию context_config.json рядом с S2T",
    )
    parser.add_argument(
        "--dml-json",
        help=(
            "JSON с DML_inc.sql для Parquet; "
            "с DML_inc.sql и DML_arc.sql для Iceberg"
        ),
    )
    parser.add_argument(
        "--mart-dir",
        help="Каталог витрины; по умолчанию dm_res рядом с main.py",
    )
    args = parser.parse_args()

    root = Path(__file__).resolve().parent
    source = Path(args.s2t_file).resolve()
    dml_path = Path(args.dml_json).resolve() if args.dml_json else None
    output = (
        Path(args.output_json).resolve()
        if args.output_json
        else source.with_name("context_config.json")
    )

    document_errors = missing_document_errors(source, dml_path)
    if not source.is_file():
        print(InputPackageError(document_errors), file=sys.stderr)
        return 2

    validator_command = [
        sys.executable,
        str(root / "validator" / "main.py"),
        str(source),
        "--output-json",
        str(output),
    ]
    validator_result = subprocess.run(validator_command, check=False)
    if validator_result.returncode != 0:
        dml_errors = [
            error
            for error in document_errors
            if "S2T" not in error
        ]
        if dml_errors:
            print(InputPackageError(dml_errors), file=sys.stderr)
        print("Генерация DDL не запущена: S2T не прошёл проверку.", file=sys.stderr)
        return validator_result.returncode

    try:
        package = validate_prototype_package(
            output,
            dml_path,
            args.storage,
        )
    except InputPackageError as error:
        print(error, file=sys.stderr)
        print(
            "Генерация DDL не запущена: входной пакет неполный.",
            file=sys.stderr,
        )
        return 2

    print(
        "Входной пакет полный: "
        f"таблиц в S2T — {package['table_count']}; "
        f"SQL-прототипов — {package['provided_count']} из "
        f"{package['expected_count']}.",
        flush=True,
    )

    ddl_command = [
        sys.executable,
        str(root / "ddl_generator" / "main.py"),
        str(output),
        "--storage",
        args.storage,
    ]
    ddl_result = subprocess.run(ddl_command, check=False)
    if ddl_result.returncode != 0:
        return ddl_result.returncode

    configurator_command = [
        sys.executable,
        str(root / "b2c_sql_configurator" / "main.py"),
        str(output),
        "--storage",
        args.storage,
    ]
    configurator_command.extend(["--dml-json", str(dml_path)])
    configurator_result = subprocess.run(configurator_command, check=False)
    if configurator_result.returncode != 0:
        return configurator_result.returncode

    exporter_command = [
        sys.executable,
        str(root / "mart_exporter" / "main.py"),
        str(output),
    ]
    mart_dir = (
        Path(args.mart_dir).resolve()
        if args.mart_dir
        else root / "dm_res"
    )
    exporter_command.extend(["--mart-dir", str(mart_dir)])
    exporter_result = subprocess.run(exporter_command, check=False)
    if exporter_result.returncode != 0:
        return exporter_result.returncode

    print(f"Цепочка завершена: {output}; витрина — {mart_dir}.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
