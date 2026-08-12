# Инструмент OpenClaw `b2c_build_from_upload`

## 1. Назначение

Инструмент запускается внутри OpenClaw и собирает SQL-проект из ранее загруженного пакета файлов.

Вызов инструмента:

```json
{
  "uploadId": "upload-789",
  "storage": "iceberg"
}
```

Параметры:

| Параметр | Обязателен | Допустимые значения | Назначение |
|---|---:|---|---|
| `uploadId` | да | буквы, цифры, `-`, `_` | Идентификатор, возвращённый сервисом загрузки |
| `storage` | нет | `iceberg`, `parquet` | Тип целевого хранилища; по умолчанию `iceberg` |

`agentId` в параметры не входит. OpenClaw сам передаёт инструменту рабочий каталог текущего агента. Поэтому инструмент читает только:

```text
<WORKSPACE_ТЕКУЩЕГО_АГЕНТА>/uploads/<UPLOAD_ID>/
```

## 2. Какие файлы ожидаются

Пример пакета:

```text
workspace/
└── uploads/
    └── upload-789/
        ├── S2T.xlsx
        ├── DML_inc_sales.txt
        └── DML_arc_sales.txt
```

Правила выбора файлов:

1. Используется `S2T.xlsx`. Если имя отличается, в пакете должен быть только один файл `.xlsx`.
2. SQL-прототипами считаются файлы `.sql` и `.txt`, в имени которых есть `DML_inc` или `DML_arc`.
3. Остальные `.txt` и `.json` инструмент не передаёт в скрипт.
4. Полный набор `DML_inc` и `DML_arc` проверяет существующий `package_sql_files.py`, вызываемый из `run_from_files.sh`.

## 3. Что именно запускается

Инструмент выполняет на сервере OpenClaw:

```bash
bash <SKILL_ROOT>/scripts/run_from_files.sh \
  <WORKSPACE>/uploads/<UPLOAD_ID>/S2T.xlsx \
  --storage iceberg \
  --sql-file <WORKSPACE>/uploads/<UPLOAD_ID>/DML_inc_sales.txt \
  --sql-file <WORKSPACE>/uploads/<UPLOAD_ID>/DML_arc_sales.txt \
  --dml-json <WORKSPACE>/uploads/<UPLOAD_ID>/result/dml_scripts.json \
  --output-json <WORKSPACE>/uploads/<UPLOAD_ID>/result/context_config.json \
  --mart-dir <WORKSPACE>/uploads/<UPLOAD_ID>/result/dm_res
```

Команда запускается через `spawn` — системный вызов Node.js с отдельным массивом аргументов. Строка команды из `uploadId` не собирается.

## 4. Результат

После успешного выполнения каталог выглядит так:

```text
workspace/uploads/upload-789/
├── S2T.xlsx
├── DML_inc_sales.txt
├── DML_arc_sales.txt
└── result/
    ├── dml_scripts.json
    ├── context_config.json
    └── dm_res/
        └── ...сгенерированные файлы проекта...
```

Инструмент возвращает OpenClaw объект:

```json
{
  "success": true,
  "tool": "b2c_build_from_upload",
  "agentId": "user-123",
  "uploadId": "upload-789",
  "storage": "iceberg",
  "inputFiles": {
    "s2t": "uploads/upload-789/S2T.xlsx",
    "sql": [
      "uploads/upload-789/DML_inc_sales.txt",
      "uploads/upload-789/DML_arc_sales.txt"
    ]
  },
  "output": {
    "dmlJson": "uploads/upload-789/result/dml_scripts.json",
    "contextConfig": "uploads/upload-789/result/context_config.json",
    "martDirectory": "uploads/upload-789/result/dm_res",
    "generatedFiles": []
  },
  "execution": {
    "exitCode": 0,
    "durationMs": 12540,
    "stdout": "...",
    "stderr": ""
  }
}
```

Все пути в ответе относительные к workspace агента.

## 5. Предварительные условия

Команды выполняются на сервере OpenClaw от имени пользователя, под которым работает OpenClaw Gateway.

Проверить версию:

```bash
openclaw --version
```

Этот пакет рассчитан на OpenClaw `2026.5.17` или новее и проверен на `2026.7.1`.

До установки инструмента должен быть установлен Skill:

```bash
openclaw skills info b2c-sql-project-2-0-builder
```

Проверить наличие исполняемого скрипта:

```bash
test -f <OPENCLAW_HOST_DIR>/skills/b2c-sql-project-2-0-builder/scripts/run_from_files.sh \
  && echo "run_from_files.sh найден"
```

`<OPENCLAW_HOST_DIR>` — каталог OpenClaw пользователя Gateway, например `/home/openclaw/.openclaw`.

## 6. Сборка пакета

Скопировать каталог `b2c-build-tool` на сервер OpenClaw, например в:

```text
/opt/openclaw/plugins/b2c-build-tool
```

Выполнить:

```bash
cd /opt/openclaw/plugins/b2c-build-tool
npm ci
npm run plugin:build
npm run plugin:validate
npm test
```

Если `package-lock.json` не передавался, вместо `npm ci` выполнить один раз:

```bash
npm install
```

## 7. Установка в OpenClaw

```bash
openclaw plugins install /opt/openclaw/plugins/b2c-build-tool
openclaw plugins enable b2c-build-tool
```

Указать фактический каталог установленного Skill:

```bash
openclaw config set \
  'plugins.entries.b2c-build-tool.config.skillRoot' \
  '"<OPENCLAW_HOST_DIR>/skills/b2c-sql-project-2-0-builder"' \
  --strict-json
```

При необходимости изменить предельное время сборки:

```bash
openclaw config set \
  'plugins.entries.b2c-build-tool.config.timeoutSeconds' \
  '900' \
  --strict-json
```

## 8. Разрешение инструмента конкретному агенту

Инструмент объявлен как необязательный: модель увидит его только после явного добавления в список инструментов агента.

Сначала вывести список агентов в конфигурации:

```bash
openclaw config get agents.list --json
```

Найти позицию агента `<AGENT_ID>` в массиве. Нумерация начинается с нуля. Затем выполнить:

```bash
openclaw config set \
  'agents.list[<AGENT_INDEX>].tools.alsoAllow' \
  '["b2c_build_from_upload"]' \
  --strict-json
```

Пример: если `user-123` является первым элементом массива, `<AGENT_INDEX>` равен `0`:

```bash
openclaw config set \
  'agents.list[0].tools.alsoAllow' \
  '["b2c_build_from_upload"]' \
  --strict-json
```

Если у агента уже задан `tools.allow`, добавить `b2c_build_from_upload` именно в существующий массив `allow`. Одновременно задавать `allow` и `alsoAllow` в одном агенте нельзя.

## 9. Перезапуск и проверка

```bash
openclaw gateway restart --safe
openclaw plugins inspect b2c-build-tool --runtime --json
```

Прямой проверочный вызов без обращения к модели:

```bash
curl --request POST \
  'https://<OPENCLAW_HOST>/tools/invoke' \
  --header 'Authorization: Bearer <OPENCLAW_GATEWAY_TOKEN>' \
  --header 'Content-Type: application/json' \
  --data '{
    "tool": "b2c_build_from_upload",
    "agentId": "<AGENT_ID>",
    "args": {
      "uploadId": "<UPLOAD_ID>",
      "storage": "iceberg"
    }
  }'
```

Перед проверкой каталог `workspace/uploads/<UPLOAD_ID>` уже должен быть создан сервисом загрузки и содержать входные файлы.

## 10. Основные ошибки

| Код | Причина |
|---|---|
| `WORKSPACE_CONTEXT_MISSING` | Инструмент вызван без контекста агента |
| `UPLOAD_NOT_FOUND` | Каталог `uploads/<UPLOAD_ID>` отсутствует |
| `S2T_FILE_NOT_UNIQUE` | Нет единственного файла S2T |
| `SQL_FILES_NOT_FOUND` | Нет файлов `DML_inc`/`DML_arc` с расширением `.sql` или `.txt` |
| `SKILL_NOT_FOUND` | Неверно указан каталог Skill |
| `BUILD_TIMEOUT` | Скрипт не закончил работу за заданное время |
| `BUILD_SCRIPT_FAILED` | `run_from_files.sh` завершился с ненулевым кодом |
| `MART_DIRECTORY_NOT_CREATED` | Скрипт не создал `result/dm_res` |

## 11. Состав пакета

```text
b2c-build-tool/
├── src/
│   ├── build.ts
│   ├── index.ts
│   └── index.test.ts
├── scripts/
│   └── run_from_files.sh
├── openclaw.plugin.json
├── package.json
├── package-lock.json
├── tsconfig.json
└── vitest.config.ts
```

Файл `scripts/run_from_files.sh` приложен как точная копия существующего скрипта из проекта. Во время работы инструмент запускает не эту справочную копию, а скрипт из установленного Skill по пути `<SKILL_ROOT>/scripts/run_from_files.sh`.
