#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
INSTALLATION_DIR="$(cd -- "$SCRIPT_DIR/.." && pwd)"
TEST_ROOT="$(mktemp -d)"
trap 'rm -rf -- "$TEST_ROOT"' EXIT

mkdir -p "$TEST_ROOT/bin" "$TEST_ROOT/state"
touch "$TEST_ROOT/openclaw.json"

cat >"$TEST_ROOT/bin/openclaw" <<'FAKE'
#!/usr/bin/env bash
set -euo pipefail

case "$1 $2" in
  "skills info"|"skills check")
    printf '{"ok":true}\n'
    ;;
  "agents list")
    if [[ -f "$OPENCLAW_STATE_DIR/fake-agent-id" ]]; then
      agent_id="$(cat "$OPENCLAW_STATE_DIR/fake-agent-id")"
      workspace="$(cat "$OPENCLAW_STATE_DIR/fake-workspace")"
      printf '{"agents":[{"id":"%s","workspace":"%s"}]}\n' "$agent_id" "$workspace"
    else
      printf '{"agents":[]}\n'
    fi
    ;;
  "agents add")
    agent_id="$3"
    shift 3
    workspace=""
    while (($# > 0)); do
      if [[ "$1" == "--workspace" ]]; then
        workspace="$2"
        break
      fi
      shift
    done
    printf '%s' "$agent_id" >"$OPENCLAW_STATE_DIR/fake-agent-id"
    printf '%s' "$workspace" >"$OPENCLAW_STATE_DIR/fake-workspace"
    printf '{"created":true}\n'
    ;;
  "agents set-identity")
    printf '{"updated":true}\n'
    ;;
  *)
    printf 'Неожиданная команда fake OpenClaw: %s %s\n' "$1" "$2" >&2
    exit 1
    ;;
esac
FAKE
chmod +x "$TEST_ROOT/bin/openclaw"

run_provisioning() {
  PATH="$TEST_ROOT/bin:$PATH" \
  OPENCLAW_SERVICE_USER="$(id -un)" \
  OPENCLAW_HOST_DIR="$TEST_ROOT/state" \
  OPENCLAW_CONFIG_FILE="$TEST_ROOT/openclaw.json" \
  WORKSPACE_TEMPLATE_DIR="$INSTALLATION_DIR/agent-workspace-template" \
  bash "$INSTALLATION_DIR/create_openclaw_agent.sh" \
    --agent-id user-123 \
    --agent-name "B2C SQL Builder — user-123" \
    --user-name "Тестовый пользователь"
}

first_result="$(run_provisioning)"
python3 -c 'import json,sys; value=json.loads(sys.argv[1]); assert value["success"] and value["created"]' "$first_result"

workspace="$TEST_ROOT/state/user-agents/user-123/workspace"
test -d "$workspace/memory"
test -d "$workspace/uploads"
test -d "$workspace/mart-updates"
test -f "$workspace/AGENTS.md"
test -f "$workspace/IDENTITY.md"
test -f "$workspace/SOUL.md"
test -f "$workspace/MEMORY.md"
test -f "$workspace/USER.md"

grep -q "Создание новой витрины" "$workspace/AGENTS.md"
grep -q "Добавление потоков" "$workspace/AGENTS.md"
grep -q "Расширение атрибутного состава" "$workspace/AGENTS.md"
if grep -R -E '\{\{[A-Z_]+\}\}' "$workspace" >/dev/null; then
  printf 'В workspace остались незаменённые переменные шаблонов.\n' >&2
  exit 1
fi

printf '\n- Проверка сохранения памяти при повторном вызове.\n' >>"$workspace/MEMORY.md"
second_result="$(run_provisioning)"
python3 -c 'import json,sys; value=json.loads(sys.argv[1]); assert value["success"] and not value["created"]' "$second_result"
grep -q "Проверка сохранения памяти" "$workspace/MEMORY.md"

printf 'CREATE_OPENCLAW_AGENT_TEST_OK\n'
