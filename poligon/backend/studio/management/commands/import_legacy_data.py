import json
from pathlib import Path

from django.core.management.base import BaseCommand
from django.db import connection, transaction

from studio.models import Datamart, User, Workspace, WorkspaceMembership


def _read(path):
    file_path = Path(path)
    if not file_path.is_file():
        return []
    payload = json.loads(file_path.read_text(encoding="utf-8"))
    return payload.get("items") if isinstance(payload, dict) and isinstance(payload.get("items"), list) else []


def _legacy_password(value):
    parts = str(value or "").split(":", 1)
    return f"legacy_scrypt${parts[0]}${parts[1]}" if len(parts) == 2 else "!"


class Command(BaseCommand):
    help = "Однократно импортировать JSON старого Node.js backend в PostgreSQL."

    def add_arguments(self, parser):
        parser.add_argument("--users", default="/legacy/users.json")
        parser.add_argument("--datamarts", default="/legacy/datamarts.json")

    @transaction.atomic
    def handle(self, *args, **options):
        imported_users = []
        for row in _read(options["users"]):
            username = str(row.get("login") or "").strip()
            email = str(row.get("email") or "").strip()
            if not username or not email:
                continue
            user, created = User.objects.get_or_create(
                username=username,
                defaults={
                    "id": row.get("id"),
                    "email": email,
                    "display_name": str(row.get("name") or username),
                    "password": _legacy_password(row.get("passwordHash")),
                    "openclaw_agent_status": "pending",
                },
            )
            if created:
                workspace = Workspace.objects.create(
                    name=f"Пространство {user.public_name}",
                    slug=f"user-{user.id}",
                    description="Личное пространство пользователя",
                    created_by=user,
                )
                WorkspaceMembership.objects.create(workspace=workspace, user=user, role="admin")
            imported_users.append(user)

        owner = imported_users[0] if imported_users else User.objects.order_by("id").first()
        imported_datamarts = 0
        if owner:
            membership = owner.workspace_memberships.select_related("workspace").first()
            for row in _read(options["datamarts"]):
                legacy_id = row.get("id")
                if legacy_id and Datamart.objects.filter(pk=legacy_id).exists():
                    continue
                passport = row.get("passport") if isinstance(row.get("passport"), dict) else {}
                designer = {"pages": row.get("pages") or []} if isinstance(row.get("pages"), list) else {}
                Datamart.objects.create(
                    id=legacy_id,
                    workspace=membership.workspace if membership else None,
                    created_by=owner,
                    name=str(row.get("name") or f"datamart-{legacy_id}"),
                    display_name=str(row.get("displayName") or row.get("name") or f"Витрина {legacy_id}"),
                    description=str(row.get("description") or ""),
                    owner_name=str(row.get("owner") or owner.public_name),
                    status=str(row.get("status") or "draft"),
                    passport=passport,
                    designer_state=designer,
                )
                imported_datamarts += 1

        with connection.cursor() as cursor:
            for table in [User._meta.db_table, Datamart._meta.db_table]:
                cursor.execute(
                    f"SELECT setval(pg_get_serial_sequence(%s, 'id'), COALESCE(MAX(id), 1), MAX(id) IS NOT NULL) FROM {table}",
                    [table],
                )
        self.stdout.write(self.style.SUCCESS(
            f"Импорт завершён: пользователей {len(imported_users)}, витрин {imported_datamarts}."
        ))
