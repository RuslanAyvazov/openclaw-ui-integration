---
name: b2c_sql_project_2_0_builder
description: Создавать B2C-витрину по S2T с нуля, добавлять новые потоки и расширять атрибутный состав существующих потоков. Использовать также при короткой команде «обнови», если пользователь приложил S2T и SQL-прототипы для существующей витрины.
---

# Создание и обновление B2C-витрины

Работать только по проверенному листу `Target columns`. Не придумывать поля,
типы, ключи, партиции и SQL-прототипы.

## Каталоги workspace агента

Backend сохраняет каждый пакет пользователя и возвращает `uploadPath` —
относительный путь внутри workspace текущего агента.

```text
<AGENT_WORKSPACE>/
├── uploads/
│   └── package-<UNIQUE_NAME>/       # uploadPath
│       ├── S2T.xlsx
│       ├── DML_inc_*.sql или .txt
│       └── DML_arc_*.sql или .txt
└── mart-updates/
    └── update-<JOB_ID>/
        ├── repository/              # копия выбранной ветки витрины
        └── result/
            ├── existing_context_config.json
            ├── s2t_context_config.json
            ├── update_context_config.json
            ├── update_plan.json
            ├── dml_scripts.json
            ├── built_streams/dm_res/
            └── merge_manifest.json
```

Всегда передавать инструменту `uploadPath` вида
`uploads/package-<UNIQUE_NAME>`.

Копию проекта обрабатывать только в
`<AGENT_WORKSPACE>/mart-updates/<JOB_ID>/repository`. Не монтировать и не
изменять исходный репозиторий backend.

## Входные данные

Для сборки нужны:

1. Один `S2T.xlsx` с листом `Target columns`.
2. Формат `iceberg` или `parquet`.
3. Готовые SQL-прототипы только для новых или обновляемых таблиц:
   - Iceberg: `DML_inc` и `DML_arc` для каждой такой таблицы;
   - Parquet: `DML_inc` для каждой такой таблицы.

Допускается приложить полный комплект SQL для всех таблиц S2T. Прототипы
неизменившихся таблиц проверить по S2T и не включать в пересборку.

Разрешены `.sql` и `.txt`. Запрещён `SELECT *`. Выходные поля внешнего
`SELECT` должны точно совпадать с новым составом STG-полей S2T. Полный контракт
читать в `{baseDir}/references/input-contract.md`.

## Определение сценария

Поддерживать три сценария.

1. **Создание с нуля** — пользователь создаёт новую витрину.
2. **Добавление потоков** — в S2T есть таблицы, которых ещё нет в витрине.
3. **Расширение атрибутов** — таблица уже есть, но S2T содержит дополнительные
   поля при сохранении всех существующих полей, типов, порядка, первичного
   ключа и партиционирования.

Если пользователь приложил S2T и SQL-прототипы и написал только «обнови»,
рассматривать это как единое обновление существующей витрины. Один запуск
должен одновременно:

- добавить потоки для новых таблиц;
- пересобрать потоки существующих таблиц с новыми атрибутами;
- оставить без изменений совпадающие таблицы.

Не просить пользователя отдельно выбирать сценарии 2 и 3: их определяет
Python-сравнение.

## Сценарий 1. Создание с нуля

### В B2C-SQL UI

1. Проверить наличие S2T, формата и SQL-прототипов.
2. Направить пользователя к кнопке «Проверить и собрать».
3. Не запускать сборку самостоятельно: backend вызывает
   `run_from_files.sh`.
4. Не выводить `context_config.json`, `dm_res` или блок `b2c-project`.

### В прямом CLI-режиме OpenClaw

```bash
bash {baseDir}/scripts/run_from_files.sh <S2T.xlsx> \
  --storage <iceberg|parquet> \
  --sql-file <DML_inc.sql> \
  --sql-file <DML_arc.sql> \
  --dml-json <WORK_DIR>/dml_scripts.json \
  --output-json <WORK_DIR>/context_config.json \
  --mart-dir <WORK_DIR>/dm_res
```

## Сценарии 2 и 3. Обновление существующей витрины

### Обязательный первый вопрос

До запуска инструмента задать один вопрос:

> В каком пространстве находится витрина и как она называется?

Не определять витрину по открытой странице UI и не просить файловый путь
репозитория. Получить подтверждённую пару: пространство + витрина.

### Проверка доступа

После ответа пользователя:

1. Вызвать `b2c_list_accessible_datamarts`.
2. Найти пространство по точному `name` или `slug`.
3. В нём найти витрину по `name` или `displayName`.
4. Не использовать витрину, отсутствующую в результате инструмента.
5. При нескольких совпадениях попросить точное техническое имя.

Backend связывает `agentId` с пользователем и возвращает только доступные ему
пространства и витрины.

### Проверка пакета

Backend добавляет в сообщение `uploadPath` и список файлов. Если `uploadPath`
или `S2T.xlsx` отсутствует, попросить приложить пакет.

Не требовать SQL для неизменившихся таблиц. Для каждой новой или расширяемой
таблицы требовать полный новый SQL-прототип. Не пытаться дописать старый SQL
самостоятельно.

### Вызов единого инструмента

```text
b2c_update_mart_from_upload_path(
  workspace=<SPACE_NAME_OR_SLUG>,
  datamart=<MART_NAME>,
  branch=main,
  uploadPath=<UPLOAD_PATH>,
  storage=<iceberg|parquet>
)
```

Инструмент сам определяет сценарии 2 и 3. Не сравнивать таблицы рассуждением
модели и не вызывать Bash вручную вместо инструмента.

### Bash-команда инструмента

```bash
bash {baseDir}/scripts/run_update_from_files.sh \
  <AGENT_WORKSPACE>/mart-updates/<JOB_ID>/repository \
  <AGENT_WORKSPACE>/<UPLOAD_PATH>/S2T.xlsx \
  --storage <iceberg|parquet> \
  --sql-file <AGENT_WORKSPACE>/<UPLOAD_PATH>/DML_inc_1.sql \
  --sql-file <AGENT_WORKSPACE>/<UPLOAD_PATH>/DML_arc_1.sql \
  --work-dir <AGENT_WORKSPACE>/mart-updates/<JOB_ID>/result
```

Внутри Bash последовательно выполнять:

```bash
python {baseDir}/scripts/repository_to_context.py \
  <repository> --output-json <result>/existing_context_config.json

python {baseDir}/scripts/prepare_mart_update.py \
  <result>/existing_context_config.json <S2T.xlsx> \
  --storage <iceberg|parquet> \
  --build-context <result>/update_context_config.json \
  --plan-json <result>/update_plan.json

python {baseDir}/scripts/package_sql_files.py <S2T.xlsx> \
  --storage <iceberg|parquet> \
  --sql-file <DML-файл> \
  --output <result>/dml_scripts.json \
  --context-json <result>/update_context_config.json \
  --source-context <result>/update_context_config.json \
  --accepted-context <result>/s2t_context_config.json

python {baseDir}/scripts/build_from_context.py \
  <result>/update_context_config.json \
  --storage <iceberg|parquet> \
  --dml-json <result>/dml_scripts.json \
  --mart-dir <result>/built_streams/dm_res

python {baseDir}/scripts/merge_mart_update.py \
  <repository> <result>/built_streams/dm_res \
  <result>/existing_context_config.json \
  <result>/update_context_config.json \
  <result>/update_plan.json \
  --manifest-json <result>/merge_manifest.json
```

## Правило формата 2.0

`repository_to_context.py` принимает витрину только при всех условиях:

1. Есть `resources/b2c_format.json` с `formatVersion: "2.0"`.
2. Есть `resources/context_config.json`.
3. Для каждого потока есть `etl/<stream>/DDL.sql` и
   `etl/<stream>/b2c_sql_config.json`.
4. DDL содержит PA-, HIST- и STG-таблицы из контекста.
5. В конфигурации есть `treadConfigs` и `treadRelations`.

При нарушении ответить:

> Витрина не соответствует формату 2.0: <точная причина из инструмента>.

Не восстанавливать отсутствующие данные догадкой.

## Правила сравнения

### Новая таблица

- Сравнивать по полному имени PA-таблицы `schema.table` без учёта регистра.
- Если полного имени нет, создать новые потоки.
- Одинаковое короткое имя в другой схеме считать конфликтом.
- Iceberg: создать `<table>_inc` и `<table>_arc`.
- Parquet: создать `<table>_inc`.

### Расширение атрибутов

- Сравнивать поля `pa_table.columns` по имени и типу.
- Разрешать только добавление полей.
- Существующие поля должны сохранить имя, тип и взаимный порядок.
- Первичный ключ и партиционирование должны остаться прежними.
- Для расширяемой таблицы проверить полный новый SQL-прототип по точному
  составу STG-полей S2T.
- После проверки полностью пересобрать соответствующие потоки и заменить их
  только в копии репозитория.
- Обновить DDL, `b2c_sql_config.json` и `resources/context_config.json`.

Удаление поля, переименование, изменение типа, порядка существующих полей,
ключа или партиционирования не считать расширением. Остановить обновление и
передать точную ошибку пользователю.

## Результат

После успешной проверки backend создаёт ветку:

```text
openclaw/update-<JOB_ID>
```

Ветка `main` остаётся без изменений. Сообщить пользователю:

- пространство и витрину;
- добавленные таблицы и потоки;
- расширенные таблицы, новые поля и обновлённые потоки;
- имя созданной ветки.

Если различий нет, ветку не создавать. Если не хватает хотя бы одного SQL или
его поля не совпадают с S2T, ничего не публиковать.

## Ограничения

- Не придумывать SQL.
- Не принимать `SELECT *`.
- Не сокращать ошибки валидаторов.
- Не менять порядок таблиц и колонок S2T.
- Не изменять `main`.
- Не использовать интернет; зависимости брать из
  `{baseDir}/scripts/wheelhouse`.
