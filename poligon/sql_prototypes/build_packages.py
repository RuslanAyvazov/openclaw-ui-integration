"""Собирает отдельные пакеты SQL-прототипов для Iceberg и Parquet."""

from __future__ import annotations

import json
from pathlib import Path


CATALOG_DIR = Path(__file__).resolve().parent
PROJECT_DIR = CATALOG_DIR.parent
SOURCE_DML = PROJECT_DIR / "dml_scripts.json"
CONTEXT_CONFIG = PROJECT_DIR / "context_config.json"


def read_json(path: Path) -> dict:
    """Читает JSON-файл и возвращает его содержимое."""
    return json.loads(path.read_text(encoding="utf-8-sig"))


def table_names_from_context(context: dict) -> list[str]:
    """Берёт из валидатора имена потоков в порядке таблиц S2T."""
    return [
        table["pa_table"]["name"].rsplit(".", 1)[-1]
        for table in context["validator"]["tables"]
    ]


def write_package(storage: str, source: dict, table_names: list[str]) -> None:
    """Создаёт SQL-файлы и готовый dml_scripts.json для формата хранения."""
    required_scripts = ("DML_inc.sql", "DML_arc.sql") if storage == "iceberg" else ("DML_inc.sql",)
    package_dir = CATALOG_DIR / storage
    package: dict[str, dict[str, str]] = {}

    for table_name in table_names:
        scripts = source.get(table_name)
        if scripts is None:
            raise ValueError(f"В исходном DML нет потока {table_name}.")

        table_dir = package_dir / table_name
        table_dir.mkdir(parents=True, exist_ok=True)
        package[table_name] = {}

        for script_name in required_scripts:
            sql = scripts.get(script_name)
            if not isinstance(sql, str) or not sql.strip():
                raise ValueError(f"Для {table_name} отсутствует {script_name}.")
            sql = sql.rstrip() + "\n"
            (table_dir / script_name).write_text(sql, encoding="utf-8", newline="\n")
            package[table_name][script_name] = sql.rstrip("\n")

    (package_dir / "dml_scripts.json").write_text(
        json.dumps(package, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
        newline="\n",
    )


def write_readme() -> None:
    """Записывает готовые команды запуска обоих пакетов."""
    text = """# SQL-прототипы для s2t.xlsx

Прототипы содержат явный перечень полей без `*` и не читают боевые данные: каждый `SELECT` завершается условием `WHERE 1 = 0`.

## Iceberg

На каждую таблицу подготовлены `DML_inc.sql` и `DML_arc.sql`.

```cmd
D:\\ai\\dm_skill\\.venv\\Scripts\\python.exe D:\\ai\\dm_skill\\main.py D:\\ai\\dm_skill\\s2t.xlsx --storage iceberg --dml-json D:\\ai\\dm_skill\\sql_prototypes\\iceberg\\dml_scripts.json
```

## Parquet

На каждую таблицу подготовлен только `DML_inc.sql`.

```cmd
D:\\ai\\dm_skill\\.venv\\Scripts\\python.exe D:\\ai\\dm_skill\\main.py D:\\ai\\dm_skill\\s2t.xlsx --storage parquet --dml-json D:\\ai\\dm_skill\\sql_prototypes\\parquet\\dml_scripts.json
```

## Повторная сборка пакетов

Если изменён исходный `D:\\ai\\dm_skill\\dml_scripts.json`, пакеты можно пересобрать командой:

```cmd
D:\\ai\\dm_skill\\.venv\\Scripts\\python.exe D:\\ai\\dm_skill\\sql_prototypes\\build_packages.py
```
"""
    (CATALOG_DIR / "README.md").write_text(text, encoding="utf-8", newline="\n")


def main() -> None:
    """Проверяет состав потоков и формирует два детерминированных пакета."""
    context = read_json(CONTEXT_CONFIG)
    source = read_json(SOURCE_DML)
    table_names = table_names_from_context(context)

    extra_tables = sorted(set(source) - set(table_names))
    if extra_tables:
        raise ValueError(f"В исходном DML есть лишние потоки: {', '.join(extra_tables)}.")

    write_package("iceberg", source, table_names)
    write_package("parquet", source, table_names)
    write_readme()
    print(f"Пакеты сформированы: {CATALOG_DIR}")


if __name__ == "__main__":
    main()
