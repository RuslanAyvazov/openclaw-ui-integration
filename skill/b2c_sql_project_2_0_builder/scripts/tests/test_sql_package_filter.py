"""Проверка SQL для изменяемых и неизменившихся таблиц общего пакета."""

from __future__ import annotations

import sys
import tempfile
from pathlib import Path


SCRIPT_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(SCRIPT_DIR))

from package_sql_files import PackageError, build_package  # noqa: E402


def table(name: str, columns: list[str]) -> dict:
    return {
        "pa_table": {"name": f"dm_sales.{name}", "columns": []},
        "stg_table": {
            "name": f"dm_sales_stg.{name}",
            "columns": [{"name": column, "type": "string"} for column in columns],
        },
    }


def write_sql(root: Path, table_name: str, mode: str, columns: list[str]) -> Path:
    path = root / f"DML_{mode}_{table_name}.sql"
    projections = ", ".join(f"src.{column} AS {column}" for column in columns)
    path.write_text(f"SELECT {projections} FROM source_data src\n", encoding="utf-8")
    return path


def main() -> None:
    updated = table("t_fct_orders", ["order_id", "amount", "currency"])
    unchanged = table("t_fct_customers", ["customer_id", "name"])
    with tempfile.TemporaryDirectory(prefix="b2c-sql-filter-") as temporary:
        root = Path(temporary)
        files = [
            write_sql(root, "t_fct_orders", "inc", ["order_id", "amount", "currency"]),
            write_sql(root, "t_fct_orders", "arc", ["order_id", "amount", "currency"]),
            write_sql(root, "t_fct_customers", "inc", ["customer_id", "name"]),
            write_sql(root, "t_fct_customers", "arc", ["customer_id", "name"]),
        ]
        package, matched, ignored = build_package(
            [updated], files, "iceberg", [updated, unchanged]
        )
        assert set(package) == {"t_fct_orders"}
        assert len(matched) == 2
        assert len(ignored) == 2

        wrong = write_sql(root, "t_fct_orders_wrong", "inc", ["order_id", "amount"])
        try:
            build_package([updated], [wrong, files[1]], "iceberg", [updated, unchanged])
        except PackageError as error:
            assert "не совпадает ни с одной STG-таблицей" in str(error)
        else:
            raise AssertionError("SQL без нового поля currency ошибочно принят")

    print("SQL_FILTER_OK: полный пакет принят, неизменившийся SQL пропущен, неполный SQL отклонён")


if __name__ == "__main__":
    main()
