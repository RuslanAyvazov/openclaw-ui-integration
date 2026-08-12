# OpenClaw UI Integration

Набор независимых компонентов для интеграции B2CSQL Studio с OpenClaw.

## Состав

| Каталог | Содержимое |
|---|---|
| `skill/` | Skill `b2c_sql_project_2_0_builder` для установки в OpenClaw через CLI на Ubuntu-сервере. Это не Docker-копия Skill. |
| `installation/` | Руководство `OpenClaw_UI_CJM.docx`. |
| `poligon/` | Проверочное приложение: React UI, Backend, PostgreSQL и OpenClaw в Docker Compose. |
| `b2c_build_from_upload/` | Отдельный TypeScript-инструмент OpenClaw `b2c_build_from_upload`. |

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
npm run plugin:build
npm run plugin:validate
npm test

openclaw plugins install "$(pwd)"
openclaw plugins enable b2c-build-tool

openclaw config set \
  'plugins.entries.b2c-build-tool.config.skillRoot' \
  '"/var/lib/openclaw/skills/b2c-sql-project-2-0-builder"' \
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
