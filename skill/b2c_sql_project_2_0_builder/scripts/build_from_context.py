"""Генерация DDL и потоков из уже отфильтрованного context_config.json."""

from __future__ import annotations

import argparse
import subprocess
import sys
from pathlib import Path


SCRIPT_DIR = Path(__file__).resolve().parent
DM_SKILL_DIR = SCRIPT_DIR / "dm_skill"


def run(command: list[str]) -> int:
    result = subprocess.run(command, check=False)
    return result.returncode


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Сборка новых потоков из контекста")
    parser.add_argument("context_json")
    parser.add_argument("--storage", required=True, choices=("iceberg", "parquet"))
    parser.add_argument("--dml-json", required=True)
    parser.add_argument("--mart-dir", required=True)
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    context = str(Path(args.context_json).resolve())
    commands = [
        [
            sys.executable,
            str(DM_SKILL_DIR / "ddl_generator" / "main.py"),
            context,
            "--storage",
            args.storage,
        ],
        [
            sys.executable,
            str(DM_SKILL_DIR / "b2c_sql_configurator" / "main.py"),
            context,
            "--storage",
            args.storage,
            "--dml-json",
            str(Path(args.dml_json).resolve()),
        ],
        [
            sys.executable,
            str(DM_SKILL_DIR / "mart_exporter" / "main.py"),
            context,
            "--mart-dir",
            str(Path(args.mart_dir).resolve()),
        ],
    ]
    for command in commands:
        code = run(command)
        if code != 0:
            return code
    print(f"Новые потоки собраны: {Path(args.mart_dir).resolve()}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
