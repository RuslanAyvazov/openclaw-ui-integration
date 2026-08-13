# Skill для Ubuntu OpenClaw

Каталог `b2c_sql_project_2_0_builder` предназначен для глобальной установки на сервере OpenClaw через CLI:

В Skill входят создание новой витрины, добавление новых потоков и расширение
атрибутов существующих потоков. Для сценариев обновления дополнительно требуется
TypeScript-плагин из каталога `b2c_build_from_upload`.

```bash
openclaw skills install \
  ./skill/b2c_sql_project_2_0_builder \
  --global \
  --as b2c-sql-project-2-0-builder
```

После установки при `OPENCLAW_STATE_DIR=/var/lib/openclaw` Skill располагается в:

```text
/var/lib/openclaw/skills/b2c-sql-project-2-0-builder/SKILL.md
```

Проверка:

```bash
openclaw skills info b2c-sql-project-2-0-builder \
  --agent <AGENT_ID> --json
openclaw skills check --agent <AGENT_ID> --json
```
