#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
venv_python="$script_dir/.venv/bin/python"

if [[ $# -lt 1 ]]; then
  echo "Использование: run_from_files.sh S2T.xlsx --storage iceberg|parquet --sql-file FILE [...]" >&2
  exit 2
fi

s2t_file="$1"
shift
storage=""
dml_json="$PWD/dml_scripts.json"
output_json="$PWD/context_config.json"
mart_dir="$PWD/dm_res"
sql_files=()

while [[ $# -gt 0 ]]; do
  case "$1" in
    --storage)
      storage="${2:-}"
      shift 2
      ;;
    --sql-file)
      sql_files+=("${2:-}")
      shift 2
      ;;
    --dml-json)
      dml_json="${2:-}"
      shift 2
      ;;
    --output-json)
      output_json="${2:-}"
      shift 2
      ;;
    --mart-dir)
      mart_dir="${2:-}"
      shift 2
      ;;
    *)
      echo "Неизвестный параметр: $1" >&2
      exit 2
      ;;
  esac
done

if [[ "$storage" != "iceberg" && "$storage" != "parquet" ]]; then
  echo "Нужно указать --storage iceberg или --storage parquet." >&2
  exit 2
fi
if [[ ${#sql_files[@]} -eq 0 ]]; then
  echo "Не переданы отдельные SQL-файлы через --sql-file." >&2
  exit 2
fi

if [[ ! -x "$venv_python" ]] || ! "$venv_python" -c 'import pandas, openpyxl, sqlglot' >/dev/null 2>&1; then
  bash "$script_dir/setup.sh"
fi

package_args=(
  "$s2t_file"
  --storage "$storage"
  --output "$dml_json"
  --context-json "$output_json"
)
for sql_file in "${sql_files[@]}"; do
  package_args+=(--sql-file "$sql_file")
done

"$venv_python" "$script_dir/package_sql_files.py" "${package_args[@]}"

exec bash "$script_dir/run.sh" "$s2t_file" \
  --storage "$storage" \
  --dml-json "$dml_json" \
  --output-json "$output_json" \
  --mart-dir "$mart_dir"
