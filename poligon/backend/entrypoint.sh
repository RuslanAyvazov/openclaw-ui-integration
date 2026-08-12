#!/usr/bin/env bash
set -euo pipefail

python manage.py migrate --noinput
python manage.py import_legacy_data --users /legacy/users.json --datamarts /legacy/datamarts.json
python manage.py collectstatic --noinput >/dev/null

python manage.py sync_openclaw_agents || true

exec "$@"
