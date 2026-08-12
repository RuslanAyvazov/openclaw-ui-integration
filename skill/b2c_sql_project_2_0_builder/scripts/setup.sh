#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
venv_dir="$script_dir/.venv"
python_bin="${PYTHON_BIN:-python3}"

if [[ ! -x "$venv_dir/bin/python" ]]; then
  "$python_bin" -m venv "$venv_dir"
fi

"$venv_dir/bin/python" -m pip install \
  --disable-pip-version-check \
  --no-index \
  --find-links "$script_dir/wheelhouse" \
  --requirement "$script_dir/requirements.lock.txt"
