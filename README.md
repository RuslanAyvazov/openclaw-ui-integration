# OpenClaw UI Integration

Набор независимых компонентов для интеграции B2CSQL Studio с OpenClaw.

## Состав

| Каталог | Содержимое |
|---|---|
| `skill/` | Skill `b2c_sql_project_2_0_builder` для установки в OpenClaw через CLI на Ubuntu-сервере. Это не Docker-копия Skill. |
| `installation/` | Руководство `OpenClaw_UI_CJM.docx`. |
| `poligon/` | Проверочное приложение: React UI, Backend, PostgreSQL и OpenClaw в Docker Compose. |
| `b2c_build_from_upload/` | TypeScript-плагин OpenClaw для поиска доступных витрин и их обновления по `uploadPath`. |

Skill поддерживает три сценария:

1. создание новой витрины по S2T с нуля;
2. добавление потоков для новых таблиц;
3. расширение атрибутного состава существующих потоков.

## Установка Skill на Ubuntu-сервере

Команды выполнять от имени пользователя, под которым работает OpenClaw Gateway. В примере каталог состояния OpenClaw — `/var/lib/openclaw`.

```bash
sudo -u openclaw env \
  HOME=/var/lib/openclaw \
  OPENCLAW_STATE_DIR=/var/lib/openclaw \
  OPENCLAW_CONFIG_PATH=/etc/openclaw/openclaw.json \
  openclaw skills install \
    "$(pwd)/skill/b2c_sql_project_2_0_builder" \
    --global \
    --as b2c-sql-project-2-0-builder
```

Проверка на конкретном агенте:

```bash
sudo -u openclaw env \
  HOME=/var/lib/openclaw \
  OPENCLAW_STATE_DIR=/var/lib/openclaw \
  OPENCLAW_CONFIG_PATH=/etc/openclaw/openclaw.json \
  openclaw skills info b2c-sql-project-2-0-builder \
    --agent <AGENT_ID> --json

sudo -u openclaw env \
  HOME=/var/lib/openclaw \
  OPENCLAW_STATE_DIR=/var/lib/openclaw \
  OPENCLAW_CONFIG_PATH=/etc/openclaw/openclaw.json \
  openclaw skills check --agent <AGENT_ID> --json
```

Подчёркивания сохранены в имени исходного каталога и в `name` внутри `SKILL.md`. Для параметра `--as` используется `b2c-sql-project-2-0-builder`, потому что OpenClaw CLI не принимает подчёркивания в установочном идентификаторе.

## Установка TypeScript-инструмента

```bash
cd b2c_build_from_upload
npm ci
npm run build
openclaw plugins validate --entry ./dist/index.js --root "$(pwd)"

openclaw plugins install "$(pwd)"
openclaw plugins enable b2c-build-tool

openclaw config set \
  'plugins.entries.b2c-build-tool.config.skillRoot' \
  '"/var/lib/openclaw/skills/b2c-sql-project-2-0-builder"' \
  --strict-json

openclaw config set \
  'plugins.entries.b2c-build-tool.config.backendBaseUrl' \
  '"https://<UI_BACKEND_HOST>"' \
  --strict-json

openclaw config set \
  'agents.list[<AGENT_INDEX>].tools.alsoAllow' \
  '["b2c_list_accessible_datamarts","b2c_update_mart_from_upload_path"]' \
  --strict-json
```

Подробные параметры инструмента и настройка его доступности агенту приведены в `b2c_build_from_upload/README.md`.

## Запуск полигона

```bash
cd poligon
cp .env.example .env
docker compose up --build -d
docker compose ps
```

После запуска UI доступен по адресу `http://localhost:8088`. Порт можно изменить через `UI_PORT` в `.env`.

## Руководство по интеграции

Откройте `installation/OpenClaw_UI_CJM.docx`.
