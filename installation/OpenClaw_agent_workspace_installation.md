# Установка общего Skill и создание персональных агентов OpenClaw

## 1. Назначение инструкции

Инструкция описывает:

- общую структуру каталогов OpenClaw на сервере;
- установку общего Skill `b2c-sql-project-2-0-builder`;
- создание персонального агента для каждого пользователя;
- создание отдельного `workspace`, памяти, каталога вложений и рабочих каталогов;
- проверку созданного агента и доступности Skill.

Skill устанавливается на сервере один раз и используется всеми агентами. Для каждого пользователя создаются отдельные рабочие каталоги, память и история диалогов.

## 2. Общая структура каталогов

```text
<OPENCLAW_HOST_DIR>/
│
├── skills/
│   └── b2c-sql-project-2-0-builder/       # общий Skill для всех агентов
│       ├── SKILL.md
│       ├── scripts/
│       └── references/
│
├── agents/
│   └── user-123/
│       ├── agent/
│       │   ├── openclaw-agent.sqlite      # индекс памяти агента
│       │   └── внутреннее состояние
│       └── sessions/                      # история диалогов агента
│
└── user-agents/
    └── user-123/
        └── workspace/
            ├── AGENTS.md                  # правила работы агента
            ├── IDENTITY.md                # имя и назначение агента
            ├── SOUL.md                    # стиль поведения агента
            ├── USER.md                    # сведения о пользователе
            ├── MEMORY.md                  # долговременная память
            │
            ├── memory/
            │   └── YYYY-MM-DD.md           # ежедневные записи памяти
            │
            ├── uploads/
            │   └── package-<UNIQUE_NAME>/ # один пакет вложений
            │       ├── S2T.xlsx
            │       ├── DML_inc_sales.sql
            │       └── DML_arc_sales.sql
            │
            └── mart-updates/
                └── update-<JOB_ID>/       # один запуск обновления
                    ├── repository/
                    │   ├── resources/
                    │   │   ├── b2c_format.json
                    │   │   └── context_config.json
                    │   └── etl/
                    │       ├── stream_1/
                    │       │   ├── DDL.sql
                    │       │   ├── b2c_sql_config.json
                    │       │   └── ...
                    │       └── stream_2/
                    │           └── ...
                    │
                    └── result/
                        ├── existing_context_config.json
                        ├── s2t_context_config.json
                        ├── update_context_config.json
                        ├── update_plan.json
                        ├── dml_scripts.json
                        ├── merge_manifest.json
                        └── built_streams/
                            └── dm_res/
```

В примерах используется:

```text
<OPENCLAW_HOST_DIR> = /var/lib/openclaw
```

## 3. Назначение основных каталогов

### 3.1. Каталог общего Skill

```text
/var/lib/openclaw/skills/b2c-sql-project-2-0-builder/
```

Skill содержит инструкции и скрипты для трёх сценариев:

1. Создание витрины с нуля.
2. Добавление новых потоков в существующую витрину.
3. Расширение атрибутного состава существующих потоков.

Skill устанавливается один раз с параметром `--global`. Повторно устанавливать его для каждого агента не требуется.

### 3.2. Каталог состояния агента

```text
/var/lib/openclaw/agents/<AGENT_ID>/
```

В нём OpenClaw хранит:

- внутреннее состояние агента;
- индекс памяти;
- параметры доступа к модели;
- историю и метаданные сессий.

Этот каталог не является рабочим каталогом агента и не должен использоваться для пользовательских вложений или проектов витрин.

### 3.3. Персональный workspace агента

```text
/var/lib/openclaw/user-agents/<AGENT_ID>/workspace/
```

`workspace` — персональный рабочий каталог агента. В нём находятся:

- инструкции агента;
- долговременная память;
- ежедневные записи памяти;
- вложения пользователя;
- временные копии проектов витрин;
- результаты анализа и сборки.

У каждого агента должен быть собственный `workspace`. Нельзя указывать один и тот же `workspace` разным агентам.

## 4. Память агента

Содержательная память агента хранится в его `workspace`:

| Файл или каталог | Назначение |
|---|---|
| `AGENTS.md` | Правила работы агента и использования Skill |
| `IDENTITY.md` | Имя и назначение агента |
| `SOUL.md` | Стиль поведения и границы действий агента |
| `USER.md` | Постоянные сведения и предпочтения пользователя |
| `MEMORY.md` | Долговременные факты, решения и важный контекст |
| `memory/YYYY-MM-DD.md` | Подробные ежедневные записи |

Технический индекс памяти и история диалогов хранятся отдельно:

```text
/var/lib/openclaw/agents/<AGENT_ID>/agent/
/var/lib/openclaw/agents/<AGENT_ID>/sessions/
```

Для изоляции памяти у каждого агента должны быть уникальными оба параметра:

```text
--workspace
--agent-dir
```

## 5. Каталог `uploads`

Родительский каталог создаётся при регистрации агента:

```text
workspace/uploads/
```

Каждый конкретный пакет создаётся только при загрузке файлов:

```text
workspace/uploads/package-<UNIQUE_NAME>/
```

Пример:

```text
workspace/uploads/package-msrc4mi1-d4be22ec358f/
├── S2T.xlsx
├── DML_inc_sales.sql
└── DML_arc_sales.sql
```

Сервис загрузки возвращает Backend относительный путь:

```json
{
  "uploadPath": "uploads/package-msrc4mi1-d4be22ec358f"
}
```

Backend и агент используют относительный `uploadPath`. Полный путь файловой системы сервера в запрос агента не передаётся.

## 6. Каталог `mart-updates`

Родительский каталог создаётся при регистрации агента:

```text
workspace/mart-updates/
```

При каждом запуске доработки витрины инструмент создаёт отдельную задачу:

```text
workspace/mart-updates/update-<JOB_ID>/
```

Пример:

```text
workspace/mart-updates/update-msrc5fm3-13ac0fe1/
```

Внутри задачи находятся:

- `repository/` — копия выбранной ветки витрины;
- `result/` — результаты анализа, сравнения и сборки.

Агент изменяет только копию проекта в `repository/`. После успешной сборки Backend создаёт из неё новую ветку:

```text
openclaw/update-<UNIQUE_NAME>
```

Исходная ветка `main` не изменяется.

### 6.1. Файлы каталога `result`

| Файл | Назначение |
|---|---|
| `existing_context_config.json` | Состав существующей витрины, полученный из выбранной ветки |
| `s2t_context_config.json` | Полный состав таблиц и атрибутов, прочитанный из нового S2T |
| `update_context_config.json` | Только новые потоки и существующие потоки, которые требуется расширить |
| `update_plan.json` | План обновления: что добавить, что расширить и что оставить без изменений |
| `dml_scripts.json` | SQL-прототипы, распределённые по соответствующим потокам |
| `built_streams/dm_res/` | Собранные новые и обновлённые потоки |
| `merge_manifest.json` | Список файлов, добавленных или изменённых в копии витрины |

## 7. Общие переменные сервера

Команды необходимо выполнять на сервере OpenClaw.

```bash
export OPENCLAW_HOST_DIR=/var/lib/openclaw
export OPENCLAW_CONFIG_FILE=/etc/openclaw/openclaw.json
export OPENCLAW_MODEL=custom-routerai-ru/deepseek/deepseek-v4-pro
export SKILL_SOURCE_DIR=/opt/openclaw-ui-integration/skill/b2c_sql_project_2_0_builder
export WORKSPACE_TEMPLATE_DIR=/opt/openclaw-ui-integration/installation/agent-workspace-template
export SKILL_NAME=b2c-sql-project-2-0-builder
```

Значения переменных:

| Переменная | Назначение |
|---|---|
| `OPENCLAW_HOST_DIR` | Корневой каталог состояния OpenClaw |
| `OPENCLAW_CONFIG_FILE` | Конфигурационный файл OpenClaw Gateway |
| `OPENCLAW_MODEL` | Модель, назначаемая новым агентам |
| `SKILL_SOURCE_DIR` | Исходный каталог устанавливаемого Skill |
| `WORKSPACE_TEMPLATE_DIR` | Каталог с файлами `AGENTS.md`, `IDENTITY.md`, `SOUL.md` и `MEMORY.md` |
| `SKILL_NAME` | Установочное имя общего Skill |

Проверить наличие исходного Skill:

```bash
test -f "$SKILL_SOURCE_DIR/SKILL.md" \
  && echo "Skill найден" \
  || echo "ОШИБКА: SKILL.md не найден"

test -f "$WORKSPACE_TEMPLATE_DIR/AGENTS.md" \
  && test -f "$WORKSPACE_TEMPLATE_DIR/IDENTITY.md" \
  && test -f "$WORKSPACE_TEMPLATE_DIR/SOUL.md" \
  && test -f "$WORKSPACE_TEMPLATE_DIR/MEMORY.md" \
  && echo "Шаблоны workspace найдены" \
  || echo "ОШИБКА: шаблоны workspace найдены не полностью"
```

## 8. Установка общего Skill

Команда выполняется один раз на сервере OpenClaw:

```bash
sudo -u openclaw env \
  HOME="$OPENCLAW_HOST_DIR" \
  OPENCLAW_STATE_DIR="$OPENCLAW_HOST_DIR" \
  OPENCLAW_CONFIG_PATH="$OPENCLAW_CONFIG_FILE" \
  openclaw skills install \
    "$SKILL_SOURCE_DIR" \
    --global \
    --as b2c-sql-project-2-0-builder
```

После установки Skill должен находиться здесь:

```text
/var/lib/openclaw/skills/b2c-sql-project-2-0-builder/
```

Проверить установку:

```bash
sudo -u openclaw env \
  HOME="$OPENCLAW_HOST_DIR" \
  OPENCLAW_STATE_DIR="$OPENCLAW_HOST_DIR" \
  OPENCLAW_CONFIG_PATH="$OPENCLAW_CONFIG_FILE" \
  openclaw skills info \
    b2c-sql-project-2-0-builder \
    --json
```

Для повторной установки обновлённой версии использовать `--force`:

```bash
sudo -u openclaw env \
  HOME="$OPENCLAW_HOST_DIR" \
  OPENCLAW_STATE_DIR="$OPENCLAW_HOST_DIR" \
  OPENCLAW_CONFIG_PATH="$OPENCLAW_CONFIG_FILE" \
  openclaw skills install \
    "$SKILL_SOURCE_DIR" \
    --global \
    --as b2c-sql-project-2-0-builder \
    --force
```

## 9. Автоматическое создание агента из Backend

Для рабочего UI рекомендуется не выполнять команды создания агента по
отдельности. Backend должен один раз вызвать целевой Bash-скрипт:

```text
/opt/openclaw-ui-integration/installation/create_openclaw_agent.sh
```

Скрипт последовательно:

1. Проверяет параметры пользователя и наличие общего Skill.
2. Создаёт персональные `workspace`, `agent`, `sessions`, `memory`, `uploads` и
   `mart-updates`.
3. Вызывает `openclaw agents add`, если агент ещё не существует.
4. Вызывает `openclaw agents set-identity`.
5. Заполняет `AGENTS.md`, `IDENTITY.md` и `SOUL.md` из шаблонов.
6. Создаёт `MEMORY.md` только при отсутствии и никогда не перезаписывает
   накопленную память.
7. Проверяет доступность общего Skill для созданного агента.
8. Возвращает Backend один JSON-ответ.

Подготовить права на сервере:

```bash
sudo chown root:root \
  /opt/openclaw-ui-integration/installation/create_openclaw_agent.sh

sudo chmod 750 \
  /opt/openclaw-ui-integration/installation/create_openclaw_agent.sh

sudo chmod 644 \
  /opt/openclaw-ui-integration/installation/agent-workspace-template/AGENTS.md \
  /opt/openclaw-ui-integration/installation/agent-workspace-template/IDENTITY.md \
  /opt/openclaw-ui-integration/installation/agent-workspace-template/SOUL.md \
  /opt/openclaw-ui-integration/installation/agent-workspace-template/MEMORY.md
```

Пример ручного вызова того же скрипта:

```bash
sudo /opt/openclaw-ui-integration/installation/create_openclaw_agent.sh \
  --agent-id user-123 \
  --agent-name "B2C SQL Builder — user-123" \
  --user-name "Пользователь user-123"
```

Модель можно переопределить серверным параметром:

```bash
sudo /opt/openclaw-ui-integration/installation/create_openclaw_agent.sh \
  --agent-id user-123 \
  --agent-name "B2C SQL Builder — user-123" \
  --user-name "Пользователь user-123" \
  --model custom-routerai-ru/deepseek/deepseek-v4-pro
```

Успешный ответ:

```json
{
  "success": true,
  "created": true,
  "agentId": "user-123",
  "agentName": "B2C SQL Builder — user-123",
  "userName": "Пользователь user-123",
  "model": "custom-routerai-ru/deepseek/deepseek-v4-pro",
  "workspace": "/var/lib/openclaw/user-agents/user-123/workspace",
  "agentDir": "/var/lib/openclaw/agents/user-123/agent",
  "skill": "b2c-sql-project-2-0-builder",
  "directories": {
    "uploads": "/var/lib/openclaw/user-agents/user-123/workspace/uploads",
    "martUpdates": "/var/lib/openclaw/user-agents/user-123/workspace/mart-updates",
    "memory": "/var/lib/openclaw/user-agents/user-123/workspace/memory"
  }
}
```

При безопасном повторе запроса для того же агента возвращается:

```json
{
  "success": true,
  "created": false,
  "agentId": "user-123"
}
```

Это означает, что агент уже существовал с тем же `workspace`. Его каталоги и
служебные файлы проверены повторно, а `MEMORY.md` сохранён без перезаписи.

Backend должен запускать скрипт массивом аргументов, а не собирать одну командную
строку. Общий пример на Python:

```python
import json
import subprocess


completed = subprocess.run(
    [
        "sudo",
        "/opt/openclaw-ui-integration/installation/create_openclaw_agent.sh",
        "--agent-id",
        agent_id,
        "--agent-name",
        agent_display_name,
        "--user-name",
        user_display_name,
    ],
    capture_output=True,
    text=True,
    timeout=120,
    check=False,
)

result = json.loads(completed.stdout)
if completed.returncode != 0 or not result.get("success"):
    raise RuntimeError(result.get("message", "Не удалось создать агента"))
```

Если Backend работает, например, от пользователя `www-data`, ему следует
разрешить без пароля только этот скрипт. Открыть отдельный файл настроек:

```bash
sudo visudo -f /etc/sudoers.d/b2c-openclaw-agent-provisioning
```

Добавить одну строку:

```text
www-data ALL=(root) NOPASSWD: /opt/openclaw-ui-integration/installation/create_openclaw_agent.sh *
```

Параметры `agent-id`, имени и модели проверяются самим скриптом. Пути серверных
каталогов не принимаются из UI.

## 10. Ручное создание персонального агента

Для каждого пользователя задать уникальный идентификатор и отображаемое имя:

```bash
export AGENT_ID=user-123
export AGENT_DISPLAY_NAME="B2C SQL Builder — user-123"
export USER_NAME="user-123"
```

`AGENT_ID` должен начинаться с латинской буквы или цифры. Допускаются строчные латинские буквы, цифры, дефис и подчёркивание.

### 10.1. Подготовка корневых каталогов

```bash
sudo install -d \
  -o openclaw \
  -g openclaw \
  -m 700 \
  "$OPENCLAW_HOST_DIR/user-agents/$AGENT_ID/workspace" \
  "$OPENCLAW_HOST_DIR/agents/$AGENT_ID/agent" \
  "$OPENCLAW_HOST_DIR/agents/$AGENT_ID/sessions"
```

### 10.2. Создание агента

```bash
sudo -u openclaw env \
  HOME="$OPENCLAW_HOST_DIR" \
  OPENCLAW_STATE_DIR="$OPENCLAW_HOST_DIR" \
  OPENCLAW_CONFIG_PATH="$OPENCLAW_CONFIG_FILE" \
  openclaw agents add "$AGENT_ID" \
    --non-interactive \
    --workspace "$OPENCLAW_HOST_DIR/user-agents/$AGENT_ID/workspace" \
    --agent-dir "$OPENCLAW_HOST_DIR/agents/$AGENT_ID/agent" \
    --model "$OPENCLAW_MODEL" \
    --json
```

### 10.3. Установка отображаемого имени

```bash
sudo -u openclaw env \
  HOME="$OPENCLAW_HOST_DIR" \
  OPENCLAW_STATE_DIR="$OPENCLAW_HOST_DIR" \
  OPENCLAW_CONFIG_PATH="$OPENCLAW_CONFIG_FILE" \
  openclaw agents set-identity \
    --agent "$AGENT_ID" \
    --name "$AGENT_DISPLAY_NAME" \
    --json
```

## 11. Создание каталогов workspace

```bash
sudo install -d \
  -o openclaw \
  -g openclaw \
  -m 700 \
  "$OPENCLAW_HOST_DIR/user-agents/$AGENT_ID/workspace/memory" \
  "$OPENCLAW_HOST_DIR/user-agents/$AGENT_ID/workspace/uploads" \
  "$OPENCLAW_HOST_DIR/user-agents/$AGENT_ID/workspace/mart-updates"
```

Правильное название рабочего каталога — `mart-updates` через дефис.

Конкретные каталоги создаются автоматически:

```text
uploads/package-<UNIQUE_NAME>   # сервисом загрузки файлов
mart-updates/update-<JOB_ID>    # TypeScript-инструментом обновления витрины
```

## 12. Установка файлов агента в workspace

После `openclaw agents add` в персональный `workspace` необходимо установить
подготовленные файлы агента:

```text
installation/agent-workspace-template/
├── AGENTS.md
├── IDENTITY.md
├── SOUL.md
└── MEMORY.md
```

В `AGENTS.md` уже описаны три сценария: создание новой витрины, добавление
потоков и расширение атрибутного состава. В шаблонах используются переменные:

```text
{{AGENT_ID}}
{{AGENT_NAME}}
{{USER_NAME}}
{{SKILL_NAME}}
```

Задать путь workspace и функцию подстановки значений:

```bash
export AGENT_WORKSPACE="$OPENCLAW_HOST_DIR/user-agents/$AGENT_ID/workspace"

render_workspace_template() {
  local source_file="$1"
  local target_file="$2"

  sudo -u openclaw sed \
    -e "s|{{AGENT_ID}}|$AGENT_ID|g" \
    -e "s|{{AGENT_NAME}}|$AGENT_DISPLAY_NAME|g" \
    -e "s|{{USER_NAME}}|$USER_NAME|g" \
    -e "s|{{SKILL_NAME}}|$SKILL_NAME|g" \
    "$source_file" \
    | sudo -u openclaw tee "$target_file" >/dev/null

  sudo chmod 600 "$target_file"
}
```

Установить правила, идентичность и стиль поведения:

```bash
render_workspace_template \
  "$WORKSPACE_TEMPLATE_DIR/AGENTS.md" \
  "$AGENT_WORKSPACE/AGENTS.md"

render_workspace_template \
  "$WORKSPACE_TEMPLATE_DIR/IDENTITY.md" \
  "$AGENT_WORKSPACE/IDENTITY.md"

render_workspace_template \
  "$WORKSPACE_TEMPLATE_DIR/SOUL.md" \
  "$AGENT_WORKSPACE/SOUL.md"
```

Создать начальный `MEMORY.md` только при его отсутствии:

```bash
if [ ! -e "$AGENT_WORKSPACE/MEMORY.md" ]; then
  render_workspace_template \
    "$WORKSPACE_TEMPLATE_DIR/MEMORY.md" \
    "$AGENT_WORKSPACE/MEMORY.md"
else
  echo "MEMORY.md уже существует и не был перезаписан"
fi
```

`MEMORY.md` нельзя заменять при повторной настройке существующего агента: в нём
накапливаются подтверждённые решения и долговременный контекст пользователя.

Если нужен отдельный файл сведений о пользователе, создать пустой `USER.md`,
не изменяя существующий:

```bash
sudo -u openclaw touch "$AGENT_WORKSPACE/USER.md"
sudo chmod 600 "$AGENT_WORKSPACE/USER.md"
```

## 13. Проверка агента

Проверить регистрацию агента:

```bash
sudo -u openclaw env \
  HOME="$OPENCLAW_HOST_DIR" \
  OPENCLAW_STATE_DIR="$OPENCLAW_HOST_DIR" \
  OPENCLAW_CONFIG_PATH="$OPENCLAW_CONFIG_FILE" \
  openclaw agents list \
    --json
```

Проверить доступность общего Skill для созданного агента:

```bash
sudo -u openclaw env \
  HOME="$OPENCLAW_HOST_DIR" \
  OPENCLAW_STATE_DIR="$OPENCLAW_HOST_DIR" \
  OPENCLAW_CONFIG_PATH="$OPENCLAW_CONFIG_FILE" \
  openclaw skills info \
    b2c-sql-project-2-0-builder \
    --agent "$AGENT_ID" \
    --json
```

Проверить готовность Skill и его зависимостей:

```bash
sudo -u openclaw env \
  HOME="$OPENCLAW_HOST_DIR" \
  OPENCLAW_STATE_DIR="$OPENCLAW_HOST_DIR" \
  OPENCLAW_CONFIG_PATH="$OPENCLAW_CONFIG_FILE" \
  openclaw skills check \
    --agent "$AGENT_ID" \
    --json
```

Проверить структуру каталогов:

```bash
find \
  "$OPENCLAW_HOST_DIR/user-agents/$AGENT_ID/workspace" \
  "$OPENCLAW_HOST_DIR/agents/$AGENT_ID" \
  -maxdepth 3 \
  -print
```

## 14. Создание следующего агента

Для следующего пользователя изменить только идентификатор и отображаемое имя:

```bash
export AGENT_ID=user-456
export AGENT_DISPLAY_NAME="B2C SQL Builder — user-456"
export USER_NAME="user-456"
```

При автоматическом создании повторить раздел 9. При ручной установке повторить
разделы 10–13.

Общий Skill повторно устанавливать не требуется.

Итоговая структура нескольких агентов:

```text
/var/lib/openclaw/
├── skills/
│   └── b2c-sql-project-2-0-builder/   # установлен один раз
│
├── agents/
│   ├── user-123/                      # состояние и сессии user-123
│   └── user-456/                      # состояние и сессии user-456
│
└── user-agents/
    ├── user-123/
    │   └── workspace/                 # память и файлы user-123
    └── user-456/
        └── workspace/                 # память и файлы user-456
```

У каждого пользователя отдельны:

- память;
- история сессий;
- вложения;
- рабочие копии витрин;
- результаты сборки.

Общим для всех агентов остаётся только Skill.

## 15. Официальная документация OpenClaw

- [Команды управления агентами](https://docs.openclaw.ai/cli/agents)
- [Установка и проверка Skill](https://docs.openclaw.ai/cli/skills)
- [Структура workspace агента](https://docs.openclaw.ai/agent-workspace)
- [Память OpenClaw](https://docs.openclaw.ai/concepts/memory)
- [Несколько изолированных агентов](https://docs.openclaw.ai/multi-agent)
