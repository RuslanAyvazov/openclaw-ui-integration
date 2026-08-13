#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
venv_python="$script_dir/.venv/bin/python"

if [[ $# -lt 2 ]]; then
  echo "Использование: run_update_from_files.sh REPOSITORY S2T.xlsx --storage iceberg|parquet --sql-file FILE [...] --work-dir DIR" >&2
  exit 2
fi

repository="$1"
s2t_file="$2"
shift 2
storage=""
work_dir=""
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
    --work-dir)
      work_dir="${2:-}"
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
if [[ -z "$work_dir" ]]; then
  echo "Не указан --work-dir." >&2
  exit 2
fi

if [[ ! -x "$venv_python" ]] || ! "$venv_python" -c 'import pandas, openpyxl, sqlglot' >/dev/null 2>&1; then
  bash "$script_dir/setup.sh"
fi

mkdir -p "$work_dir"
existing_context="$work_dir/existing_context_config.json"
build_context="$work_dir/update_context_config.json"
plan_json="$work_dir/update_plan.json"
dml_json="$work_dir/dml_scripts.json"
built_mart="$work_dir/built_streams/dm_res"
manifest_json="$work_dir/merge_manifest.json"

"$venv_python" "$script_dir/repository_to_context.py" "$repository" \
  --output-json "$existing_context"

set +e
"$venv_python" "$script_dir/prepare_mart_update.py" \
  "$existing_context" "$s2t_file" \
  --storage "$storage" \
  --build-context "$build_context" \
  --plan-json "$plan_json"
prepare_code=$?
set -e

if [[ $prepare_code -eq 3 ]]; then
  echo "S2T совпадает с витриной; новые таблицы и новые атрибуты отсутствуют."
  exit 3
fi
if [[ $prepare_code -ne 0 ]]; then
  exit "$prepare_code"
fi
if [[ ${#sql_files[@]} -eq 0 ]]; then
  echo "Для новых или обновляемых потоков не приложены SQL-прототипы." >&2
  exit 2
fi

package_args=(
  "$s2t_file"
  --storage "$storage"
  --output "$dml_json"
  --context-json "$build_context"
  --source-context "$build_context"
  --accepted-context "$work_dir/s2t_context_config.json"
)
for sql_file in "${sql_files[@]}"; do
  package_args+=(--sql-file "$sql_file")
done
"$venv_python" "$script_dir/package_sql_files.py" "${package_args[@]}"

"$venv_python" "$script_dir/build_from_context.py" "$build_context" \
  --storage "$storage" \
  --dml-json "$dml_json" \
  --mart-dir "$built_mart"

"$venv_python" "$script_dir/merge_mart_update.py" \
  "$repository" "$built_mart" "$existing_context" "$build_context" "$plan_json" \
  --manifest-json "$manifest_json"

echo "Обновление подготовлено: $repository"
echo "План: $plan_json"
echo "Манифест: $manifest_json"
