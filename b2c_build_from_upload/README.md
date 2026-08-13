# TypeScript-инструмент обновления витрины

Каталог сохранил прежнее имя `b2c_build_from_upload`, но версия 3.0 использует
`uploadPath` и регистрирует в OpenClaw два инструмента:

- `b2c_list_accessible_datamarts` — возвращает только пространства и витрины,
  доступные пользователю текущего персонального агента;
- `b2c_update_mart_from_upload_path` — копирует выбранную ветку в workspace
  агента, сравнивает её с S2T и создаёт новую ветку `openclaw/update-*`.

Инструмент поддерживает два сценария обновления за один запуск:

1. добавление потоков для новых таблиц S2T;
2. пересборку существующих потоков при добавлении новых атрибутов.

Удаление полей, изменение типов, порядка существующих полей, первичного ключа
или партиционирования отклоняется.

## Сборка и проверка

Требуются Node.js 24 и OpenClaw 2026.7.1 или новее.

```bash
npm ci
npm run build
openclaw plugins validate --entry ./dist/index.js --root "$(pwd)"
```

## Установка

Сначала установите Skill `b2c-sql-project-2-0-builder`, затем инструмент:

```bash
openclaw plugins install "$(pwd)"
openclaw plugins enable b2c-build-tool
```

Настройте пути и адрес Backend:

```bash
openclaw config set \
  'plugins.entries.b2c-build-tool.config.skillRoot' \
  '"/var/lib/openclaw/skills/b2c-sql-project-2-0-builder"' \
  --strict-json

openclaw config set \
  'plugins.entries.b2c-build-tool.config.backendBaseUrl' \
  '"https://<UI_BACKEND_HOST>"' \
  --strict-json

openclaw config set \
  'plugins.entries.b2c-build-tool.config.controlTokenFile' \
  '"/run/openclaw-control/token"' \
  --strict-json
```

Один и тот же внутренний токен должен быть доступен Backend и OpenClaw. Backend
проверяет его только на закрытых маршрутах `/api/internal/openclaw/*`.

Разрешите инструменты персональному агенту:

```bash
openclaw config set \
  'agents.list[<AGENT_INDEX>].tools.alsoAllow' \
  '["b2c_list_accessible_datamarts","b2c_update_mart_from_upload_path"]' \
  --strict-json
```

Если у агента уже задан `tools.allow`, добавьте оба имени в этот массив вместо
создания `alsoAllow`.

## Контракт обновления

```json
{
  "workspace": "<SPACE_NAME_OR_SLUG>",
  "datamart": "<MART_NAME>",
  "branch": "main",
  "uploadPath": "uploads/package-<UNIQUE_NAME>",
  "storage": "iceberg"
}
```

Файлы должны быть заранее сохранены Backend в workspace текущего агента:

```text
<AGENT_WORKSPACE>/uploads/package-<UNIQUE_NAME>/
├── S2T.xlsx
├── DML_inc_<table>.sql
└── DML_arc_<table>.sql
```

Инструмент получает разрешённую копию ветки через Backend, выполняет
`scripts/run_update_from_files.sh` установленного Skill и публикует результат в
новую ветку. Исходная ветка `main` не изменяется.
