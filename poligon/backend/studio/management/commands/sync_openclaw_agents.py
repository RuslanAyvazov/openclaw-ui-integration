from django.core.management.base import BaseCommand

from studio.models import User
from studio.services.openclaw import ensure_openclaw_agent


class Command(BaseCommand):
    help = "Создать или проверить персонального OpenClaw-агента каждого пользователя."

    def handle(self, *args, **options):
        ready = 0
        failed = 0
        for user in User.objects.order_by("id"):
            ensure_openclaw_agent(user)
            if user.openclaw_agent_status == "ready":
                ready += 1
                self.stdout.write(self.style.SUCCESS(f"{user.username}: {user.openclaw_agent_id} готов"))
            else:
                failed += 1
                self.stdout.write(self.style.WARNING(f"{user.username}: {user.openclaw_agent_error}"))
        self.stdout.write(f"Готово: {ready}; с ошибкой: {failed}.")
