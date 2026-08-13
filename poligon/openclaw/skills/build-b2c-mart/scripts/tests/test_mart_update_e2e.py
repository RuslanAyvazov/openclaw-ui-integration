"""Сквозная проверка добавления таблиц и расширения атрибутов."""

from __future__ import annotations

import json
import subprocess
import tempfile
from pathlib import Path

from openpyxl import Workbook


SCRIPT_DIR = Path(__file__).resolve().parents[1]
HEADERS = [
    "T-schema",
    "T-name",
    "T-col-name",
    "T-col-type",
    "T-col-pk",
    "codePartition",
]
TECHNICAL_COLUMNS = [
    ("report_dt", "date", "no"),
    ("ctl_validfrom", "timestamp", "no"),
    ("ctl_loading", "timestamp", "no"),
    ("ctl_action", "string", "no"),
]


def write_s2t(path: Path, tables: list[tuple[str, str, list[tuple[str, str, str]]]]) -> None:
    book = Workbook()
    sheet = book.active
    sheet.title = "Target columns"
    sheet.append(HEADERS)
    for schema, table, columns in tables:
        for name, data_type, primary_key in columns:
            sheet.append([schema, table, name, data_type, primary_key, ""])
    book.save(path)


def write_sql(path: Path, columns: list[str]) -> None:
    projection = ",\n  ".join(f"src.{name} AS {name}" for name in columns)
    path.write_text(f"SELECT\n  {projection}\nFROM source_events src\n", encoding="utf-8")


def run(command: list[str], expected: int = 0) -> subprocess.CompletedProcess[str]:
    result = subprocess.run(command, text=True, capture_output=True, check=False)
    if result.returncode != expected:
        raise AssertionError(
            f"Ожидался код {expected}, получен {result.returncode}.\n"
            f"STDOUT:\n{result.stdout}\nSTDERR:\n{result.stderr}"
        )
    return result


def iceberg_sql(root: Path, table: str, columns: list[str]) -> list[Path]:
    result = []
    for mode in ("inc", "arc"):
        path = root / f"DML_{mode}_{table}.sql"
        write_sql(path, columns)
        result.append(path)
    return result


def main() -> None:
    with tempfile.TemporaryDirectory(prefix="b2c-mart-update-") as temporary:
        root = Path(temporary)
        base = root / "base"
        base.mkdir()
        base_s2t = base / "S2T.xlsx"
        orders = [
            ("order_id", "bigint", "yes"),
            ("amount", "decimal(18,2)", "no"),
            *TECHNICAL_COLUMNS,
        ]
        write_s2t(base_s2t, [("dm_sales", "t_fct_orders", orders)])
        base_sql = iceberg_sql(base, "t_fct_orders", ["order_id", "amount"])
        base_context = base / "context_config.json"
        repository = base / "dm_res"
        command = [
            "bash",
            str(SCRIPT_DIR / "run_from_files.sh"),
            str(base_s2t),
            "--storage",
            "iceberg",
        ]
        for item in base_sql:
            command.extend(["--sql-file", str(item)])
        command.extend([
            "--dml-json",
            str(base / "dml_scripts.json"),
            "--output-json",
            str(base_context),
            "--mart-dir",
            str(repository),
        ])
        run(command)

        update = root / "update"
        update.mkdir()
        update_s2t = update / "S2T.xlsx"
        expanded_orders = [
            ("order_id", "bigint", "yes"),
            ("amount", "decimal(18,2)", "no"),
            ("currency", "string", "no"),
            *TECHNICAL_COLUMNS,
        ]
        returns = [
            ("return_id", "bigint", "yes"),
            ("return_amount", "decimal(18,2)", "no"),
            *TECHNICAL_COLUMNS,
        ]
        write_s2t(
            update_s2t,
            [
                ("dm_sales", "t_fct_orders", expanded_orders),
                ("dm_sales", "t_fct_returns", returns),
            ],
        )
        update_sql = [
            *iceberg_sql(update, "t_fct_orders", ["order_id", "amount", "currency"]),
            *iceberg_sql(update, "t_fct_returns", ["return_id", "return_amount"]),
        ]
        work = update / "result"
        command = [
            "bash",
            str(SCRIPT_DIR / "run_update_from_files.sh"),
            str(repository),
            str(update_s2t),
            "--storage",
            "iceberg",
            "--work-dir",
            str(work),
        ]
        for item in update_sql:
            command.extend(["--sql-file", str(item)])
        run(command)

        plan = json.loads((work / "update_plan.json").read_text(encoding="utf-8"))
        assert plan["newTables"] == ["dm_sales.t_fct_returns"]
        assert plan["newStreamCount"] == 2
        assert plan["updatedTableCount"] == 1
        assert plan["updatedTables"][0]["name"] == "dm_sales.t_fct_orders"
        assert plan["updatedTables"][0]["addedColumns"] == [
            {"name": "currency", "type": "string"}
        ]
        assert plan["updatedStreamCount"] == 2

        manifest = json.loads((work / "merge_manifest.json").read_text(encoding="utf-8"))
        assert set(manifest["addedStreams"]) == {"t_fct_returns_inc", "t_fct_returns_arc"}
        assert set(manifest["updatedStreams"]) == {"t_fct_orders_inc", "t_fct_orders_arc"}
        context = json.loads(
            (repository / "resources" / "context_config.json").read_text(encoding="utf-8")
        )
        tables = {
            item["pa_table"]["name"]: item
            for item in context["validator"]["tables"]
        }
        assert set(tables) == {"dm_sales.t_fct_orders", "dm_sales.t_fct_returns"}
        order_columns = [item["name"] for item in tables["dm_sales.t_fct_orders"]["pa_table"]["columns"]]
        assert "currency" in order_columns

        repeat = root / "repeat"
        result = run([
            "bash",
            str(SCRIPT_DIR / "run_update_from_files.sh"),
            str(repository),
            str(update_s2t),
            "--storage",
            "iceberg",
            "--work-dir",
            str(repeat),
        ], expected=3)
        assert "новые таблицы и новые атрибуты отсутствуют" in result.stdout

        incompatible = root / "incompatible"
        incompatible.mkdir()
        incompatible_s2t = incompatible / "S2T.xlsx"
        changed_type = [
            (name, "string" if name == "amount" else data_type, pk)
            for name, data_type, pk in expanded_orders
        ]
        write_s2t(
            incompatible_s2t,
            [
                ("dm_sales", "t_fct_orders", changed_type),
                ("dm_sales", "t_fct_returns", returns),
            ],
        )
        result = run([
            "bash",
            str(SCRIPT_DIR / "run_update_from_files.sh"),
            str(repository),
            str(incompatible_s2t),
            "--storage",
            "iceberg",
            "--work-dir",
            str(incompatible / "result"),
        ], expected=2)
        assert "изменены типы" in result.stderr

        print("E2E_OK: новая таблица добавлена, атрибут расширен, повтор и смена типа проверены")


if __name__ == "__main__":
    main()
