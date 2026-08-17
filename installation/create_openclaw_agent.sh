#!/usr/bin/env bash

set -euo pipefail
umask 077

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"

OPENCLAW_SERVICE_USER="${OPENCLAW_SERVICE_USER:-openclaw}"
OPENCLAW_HOST_DIR="${OPENCLAW_HOST_DIR:-/var/lib/openclaw}"
OPENCLAW_CONFIG_FILE="${OPENCLAW_CONFIG_FILE:-/etc/openclaw/openclaw.json}"
OPENCLAW_MODEL_DEFAULT="${OPENCLAW_MODEL:-custom-routerai-ru/deepseek/deepseek-v4-pro}"
WORKSPACE_TEMPLATE_DIR="${WORKSPACE_TEMPLATE_DIR:-$SCRIPT_DIR/agent-workspace-template}"
SKILL_NAME="${SKILL_NAME:-b2c-sql-project-2-0-builder}"

AGENT_ID=""
AGENT_DISPLAY_NAME=""
USER_NAME=""
AGENT_MODEL="$OPENCLAW_MODEL_DEFAULT"
STAGE="проверка параметров"

usage() {
  cat <<'USAGE'
Создание или повторная проверка персонального агента OpenClaw.

Обязательные параметры:
  --agent-id <id>       Технический идентификатор агента, например user-123
  --agent-name <name>   Отображаемое имя агента
  --user-name <name>    Имя пользователя для файлов workspace

Необязательные параметры:
  --model <provider/model>  Модель агента
  --help                    Показать справку

Серверные настройки задаются переменными окружения:
  OPENCLAW_SERVICE_USER
  OPENCLAW_HOST_DIR
  OPENCLAW_CONFIG_FILE
  OPENCLAW_MODEL
  WORKSPACE_TEMPLATE_DIR
  SKILL_NAME
USAGE
}

json_message() {
  local success="$1"
  local code="$2"
  local message="$3"
  python3 - "$success" "$code" "$message" "$STAGE" <<'PY'
import json
import sys

print(json.dumps({
    "success": sys.argv[1] == "true",
    "code": sys.argv[2],
    "message": sys.argv[3],
    "stage": sys.argv[4],
}, ensure_ascii=False))
PY
}

die() {
  local code="$1"
  local message="$2"
  json_message false "$code" "$message"
  printf '%s\n' "$message" >&2
  exit 2
}

on_error() {
  local exit_code="$?"
  trap - ERR
  json_message false "PROVISIONING_FAILED" \
    "Не удалось создать или настроить агента OpenClaw. Подробности находятся в stderr процесса."
  exit "$exit_code"
}

trap on_error ERR

while (($# > 0)); do
  case "$1" in
    --agent-id)
      (($# >= 2)) || die "ARGUMENT_REQUIRED" "Для --agent-id не указано значение."
      AGENT_ID="$2"
      shift 2
      ;;
    --agent-name)
      (($# >= 2)) || die "ARGUMENT_REQUIRED" "Для --agent-name не указано значение."
      AGENT_DISPLAY_NAME="$2"
      shift 2
      ;;
    --user-name)
      (($# >= 2)) || die "ARGUMENT_REQUIRED" "Для --user-name не указано значение."
      USER_NAME="$2"
      shift 2
      ;;
    --model)
      (($# >= 2)) || die "ARGUMENT_REQUIRED" "Для --model не указано значение."
      AGENT_MODEL="$2"
      shift 2
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      die "UNKNOWN_ARGUMENT" "Неизвестный параметр: $1"
      ;;
  esac
done

[[ -n "$AGENT_ID" ]] || die "AGENT_ID_REQUIRED" "Не указан --agent-id."
[[ "$AGENT_ID" =~ ^[a-z0-9][a-z0-9_-]{0,63}$ ]] \
  || die "INVALID_AGENT_ID" \
    "agent-id должен содержать только a-z, 0-9, дефис или подчёркивание и иметь длину до 64 символов."

[[ -n "$AGENT_DISPLAY_NAME" ]] \
  || die "AGENT_NAME_REQUIRED" "Не указан --agent-name."
[[ ${#AGENT_DISPLAY_NAME} -le 200 && "$AGENT_DISPLAY_NAME" != *$'\n'* && "$AGENT_DISPLAY_NAME" != *$'\r'* ]] \
  || die "INVALID_AGENT_NAME" "Некорректное отображаемое имя агента."

[[ -n "$USER_NAME" ]] || die "USER_NAME_REQUIRED" "Не указан --user-name."
[[ ${#USER_NAME} -le 200 && "$USER_NAME" != *$'\n'* && "$USER_NAME" != *$'\r'* ]] \
  || die "INVALID_USER_NAME" "Некорректное имя пользователя."

[[ "$AGENT_MODEL" =~ ^[A-Za-z0-9._:@/+_-]+$ ]] \
  || die "INVALID_MODEL" "Некорректный идентификатор модели."
[[ "$OPENCLAW_HOST_DIR" == /* && "$OPENCLAW_HOST_DIR" != "/" ]] \
  || die "INVALID_HOST_DIR" "OPENCLAW_HOST_DIR должен быть абсолютным каталогом и не может быть корнем файловой системы."

for command_name in python3 install chmod id realpath; do
  command -v "$command_name" >/dev/null \
    || die "COMMAND_NOT_FOUND" "На сервере отсутствует команда $command_name."
done

if [[ "$EUID" -eq 0 ]]; then
  command -v runuser >/dev/null \
    || die "COMMAND_NOT_FOUND" "На сервере отсутствует команда runuser."
fi

id "$OPENCLAW_SERVICE_USER" >/dev/null 2>&1 \
  || die "SERVICE_USER_NOT_FOUND" "Системный пользователь $OPENCLAW_SERVICE_USER не найден."

if [[ "$EUID" -ne 0 && "$(id -un)" != "$OPENCLAW_SERVICE_USER" ]]; then
  die "EXECUTION_USER_INVALID" \
    "Скрипт должен выполняться от root или от пользователя $OPENCLAW_SERVICE_USER."
fi

for template_name in AGENTS.md IDENTITY.md SOUL.md MEMORY.md; do
  [[ -f "$WORKSPACE_TEMPLATE_DIR/$template_name" ]] \
    || die "TEMPLATE_NOT_FOUND" \
      "Не найден шаблон $WORKSPACE_TEMPLATE_DIR/$template_name."
done

OPENCLAW_GROUP="$(id -gn "$OPENCLAW_SERVICE_USER")"
WORKSPACE="$OPENCLAW_HOST_DIR/user-agents/$AGENT_ID/workspace"
AGENT_DIR="$OPENCLAW_HOST_DIR/agents/$AGENT_ID/agent"
SESSIONS_DIR="$OPENCLAW_HOST_DIR/agents/$AGENT_ID/sessions"

run_as_service() {
  if [[ "$EUID" -eq 0 ]]; then
    runuser -u "$OPENCLAW_SERVICE_USER" -- "$@"
  else
    "$@"
  fi
}

run_openclaw() {
  run_as_service env \
    HOME="$OPENCLAW_HOST_DIR" \
    OPENCLAW_STATE_DIR="$OPENCLAW_HOST_DIR" \
    OPENCLAW_CONFIG_PATH="$OPENCLAW_CONFIG_FILE" \
    openclaw "$@"
}

run_as_service sh -c 'command -v openclaw >/dev/null' \
  || die "COMMAND_NOT_FOUND" \
    "Команда openclaw недоступна пользователю $OPENCLAW_SERVICE_USER."

ensure_private_dir() {
  local directory="$1"
  if [[ "$EUID" -eq 0 ]]; then
    install -d -o "$OPENCLAW_SERVICE_USER" -g "$OPENCLAW_GROUP" -m 700 "$directory"
  else
    install -d -m 700 "$directory"
  fi
}

render_template() {
  local source_file="$1"
  local target_file="$2"

  run_as_service python3 - \
    "$source_file" "$target_file" \
    "$AGENT_ID" "$AGENT_DISPLAY_NAME" "$USER_NAME" "$SKILL_NAME" <<'PY'
import os
from pathlib import Path
import sys
import tempfile

source = Path(sys.argv[1])
target = Path(sys.argv[2])
values = {
    "{{AGENT_ID}}": sys.argv[3],
    "{{AGENT_NAME}}": sys.argv[4],
    "{{USER_NAME}}": sys.argv[5],
    "{{SKILL_NAME}}": sys.argv[6],
}

text = source.read_text(encoding="utf-8")
for placeholder, value in values.items():
    text = text.replace(placeholder, value)

unresolved = [key for key in values if key in text]
if unresolved:
    raise RuntimeError("Не заменены переменные шаблона: " + ", ".join(unresolved))

target.parent.mkdir(parents=True, exist_ok=True)
with tempfile.NamedTemporaryFile(
    mode="w",
    encoding="utf-8",
    dir=target.parent,
    prefix=f".{target.name}.",
    delete=False,
) as handle:
    handle.write(text)
    temporary = Path(handle.name)

os.chmod(temporary, 0o600)
os.replace(temporary, target)
PY
}

STAGE="проверка общего Skill"
run_openclaw skills info "$SKILL_NAME" --json >/dev/null

STAGE="создание каталогов агента"
ensure_private_dir "$WORKSPACE"
ensure_private_dir "$AGENT_DIR"
ensure_private_dir "$SESSIONS_DIR"
ensure_private_dir "$WORKSPACE/memory"
ensure_private_dir "$WORKSPACE/uploads"
ensure_private_dir "$WORKSPACE/mart-updates"

STAGE="проверка существующего агента"
AGENTS_JSON="$(run_openclaw agents list --json)"
EXISTING_WORKSPACE="$(AGENTS_JSON="$AGENTS_JSON" python3 - "$AGENT_ID" <<'PY'
import json
import os
import sys

payload = json.loads(os.environ["AGENTS_JSON"])
if isinstance(payload, list):
    agents = payload
elif isinstance(payload, dict):
    agents = payload.get("agents") or payload.get("items") or payload.get("data") or []
else:
    agents = []

agent_id = sys.argv[1]
for agent in agents:
    current_id = str(agent.get("id") or agent.get("agentId") or "")
    if current_id == agent_id:
        print(str(agent.get("workspace") or ""))
        raise SystemExit(0)

print("__NOT_FOUND__")
PY
)"

CREATED="false"
if [[ "$EXISTING_WORKSPACE" == "__NOT_FOUND__" ]]; then
  STAGE="создание агента OpenClaw"
  run_openclaw agents add "$AGENT_ID" \
    --non-interactive \
    --workspace "$WORKSPACE" \
    --agent-dir "$AGENT_DIR" \
    --model "$AGENT_MODEL" \
    --json >/dev/null
  CREATED="true"
else
  [[ -n "$EXISTING_WORKSPACE" ]] \
    || die "EXISTING_WORKSPACE_UNKNOWN" \
      "Агент $AGENT_ID существует, но OpenClaw не вернул его workspace."

  EXPECTED_WORKSPACE="$(realpath -m "$WORKSPACE")"
  ACTUAL_WORKSPACE="$(realpath -m "$EXISTING_WORKSPACE")"
  [[ "$ACTUAL_WORKSPACE" == "$EXPECTED_WORKSPACE" ]] \
    || die "WORKSPACE_MISMATCH" \
      "Агент $AGENT_ID уже связан с другим workspace: $ACTUAL_WORKSPACE."
fi

STAGE="установка имени агента"
run_openclaw agents set-identity \
  --agent "$AGENT_ID" \
  --name "$AGENT_DISPLAY_NAME" \
  --json >/dev/null

STAGE="установка файлов workspace"
render_template "$WORKSPACE_TEMPLATE_DIR/AGENTS.md" "$WORKSPACE/AGENTS.md"
render_template "$WORKSPACE_TEMPLATE_DIR/IDENTITY.md" "$WORKSPACE/IDENTITY.md"
render_template "$WORKSPACE_TEMPLATE_DIR/SOUL.md" "$WORKSPACE/SOUL.md"

if [[ ! -e "$WORKSPACE/MEMORY.md" ]]; then
  render_template "$WORKSPACE_TEMPLATE_DIR/MEMORY.md" "$WORKSPACE/MEMORY.md"
fi

if [[ ! -e "$WORKSPACE/USER.md" ]]; then
  run_as_service touch "$WORKSPACE/USER.md"
  run_as_service chmod 600 "$WORKSPACE/USER.md"
fi

STAGE="проверка агента и Skill"
run_openclaw skills info "$SKILL_NAME" --agent "$AGENT_ID" --json >/dev/null
run_openclaw skills check --agent "$AGENT_ID" --json >/dev/null

STAGE="завершено"
python3 - \
  "$CREATED" "$AGENT_ID" "$AGENT_DISPLAY_NAME" "$USER_NAME" \
  "$AGENT_MODEL" "$WORKSPACE" "$AGENT_DIR" "$SKILL_NAME" <<'PY'
import json
import sys

print(json.dumps({
    "success": True,
    "created": sys.argv[1] == "true",
    "agentId": sys.argv[2],
    "agentName": sys.argv[3],
    "userName": sys.argv[4],
    "model": sys.argv[5],
    "workspace": sys.argv[6],
    "agentDir": sys.argv[7],
    "skill": sys.argv[8],
    "directories": {
        "uploads": f"{sys.argv[6]}/uploads",
        "martUpdates": f"{sys.argv[6]}/mart-updates",
        "memory": f"{sys.argv[6]}/memory",
    },
}, ensure_ascii=False))
PY
