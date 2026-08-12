# SQL-прототипы для s2t.xlsx

Прототипы содержат явный перечень полей без `*` и не читают боевые данные: каждый `SELECT` завершается условием `WHERE 1 = 0`.

## Iceberg

На каждую таблицу подготовлены `DML_inc.sql` и `DML_arc.sql`.

```cmd
D:\ai\dm_skill\.venv\Scripts\python.exe D:\ai\dm_skill\main.py D:\ai\dm_skill\s2t.xlsx --storage iceberg --dml-json D:\ai\dm_skill\sql_prototypes\iceberg\dml_scripts.json
```

## Parquet

На каждую таблицу подготовлен только `DML_inc.sql`.

```cmd
D:\ai\dm_skill\.venv\Scripts\python.exe D:\ai\dm_skill\main.py D:\ai\dm_skill\s2t.xlsx --storage parquet --dml-json D:\ai\dm_skill\sql_prototypes\parquet\dml_scripts.json
```

## Повторная сборка пакетов

Если изменён исходный `D:\ai\dm_skill\dml_scripts.json`, пакеты можно пересобрать командой:

```cmd
D:\ai\dm_skill\.venv\Scripts\python.exe D:\ai\dm_skill\sql_prototypes\build_packages.py
```
