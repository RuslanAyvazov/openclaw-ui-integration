#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
venv_python="$script_dir/.venv/bin/python"

if [[ ! -x "$venv_python" ]] || ! "$venv_python" -c 'import pandas, openpyxl, sqlglot' >/dev/null 2>&1; then
  bash "$script_dir/setup.sh"
fi

has_mart_dir=false
for argument in "$@"; do
  if [[ "$argument" == "--mart-dir" ]]; then
    has_mart_dir=true
    break
  fi
done

if [[ "$has_mart_dir" == false ]]; then
  set -- "$@" --mart-dir "$PWD/dm_res"
fi

exec "$venv_python" "$script_dir/dm_skill/main.py" "$@"
