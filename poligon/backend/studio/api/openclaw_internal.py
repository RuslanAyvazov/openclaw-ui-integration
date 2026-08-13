"""Закрытые методы между OpenClaw Tool и Django-backend."""

import secrets

from django.conf import settings
from django.db.models import Q
from django.http import JsonResponse

from studio.api.common import json_api, json_body, method_not_allowed
from studio.models import Datamart, User
from studio.services.repositories import create_agent_branch, export_branch


def _expected_token():
    try:
        return settings.OPENCLAW_CONTROL_TOKEN_FILE.read_text(encoding="utf-8").strip()
    except OSError:
        return ""


def _authorized(request):
    expected = _expected_token()
    supplied = str(request.headers.get("Authorization") or "")
    return bool(expected) and secrets.compare_digest(supplied, f"Bearer {expected}")


def _user_for_agent(agent_id):
    return User.objects.filter(
        openclaw_agent_id=str(agent_id or ""),
        openclaw_agent_status="ready",
    ).first()


def _allowed_datamarts(user):
    return Datamart.objects.filter(
        Q(created_by=user) | Q(workspace__memberships__user=user)
    ).select_related("workspace", "created_by").distinct()


def _resolve_datamart(user, workspace_name, datamart_name):
    rows = _allowed_datamarts(user).filter(
        Q(workspace__name__iexact=workspace_name)
        | Q(workspace__slug__iexact=workspace_name)
    ).filter(
        Q(name__iexact=datamart_name)
        | Q(display_name__iexact=datamart_name)
    )
    matches = list(rows[:3])
    if not matches:
        raise ValueError(
            "В доступных пространствах пользователя такая витрина не найдена."
        )
    if len(matches) > 1:
        raise ValueError(
            "Название витрины неоднозначно. Укажите точное пространство и техническое имя."
        )
    return matches[0]


def _error_status(message):
    if "не найден" in message:
        return 404
    if "неоднознач" in message or "Некоррект" in message or "долж" in message:
        return 400
    return 422


@json_api
def catalog(request):
    if request.method != "POST":
        return method_not_allowed()
    if not _authorized(request):
        return JsonResponse({"error": "Неверный внутренний токен OpenClaw."}, status=401)
    try:
        data = json_body(request)
    except ValueError as error:
        return JsonResponse({"error": str(error)}, status=400)
    user = _user_for_agent(data.get("agentId"))
    if user is None:
        return JsonResponse({"error": "Персональный агент не связан с пользователем."}, status=404)

    memberships = {
        item.workspace_id: item
        for item in user.workspace_memberships.select_related("workspace").all()
    }
    datamarts = _allowed_datamarts(user).filter(workspace_id__in=memberships)
    items = []
    for workspace_id, membership in sorted(
        memberships.items(), key=lambda item: item[1].workspace.name.casefold()
    ):
        workspace_marts = [
            {
                "id": mart.id,
                "name": mart.name,
                "displayName": mart.display_name,
            }
            for mart in datamarts
            if mart.workspace_id == workspace_id
        ]
        items.append({
            "id": workspace_id,
            "name": membership.workspace.name,
            "slug": membership.workspace.slug,
            "role": membership.role,
            "datamarts": sorted(
                workspace_marts,
                key=lambda item: (item["displayName"].casefold(), item["name"].casefold()),
            ),
        })
    return JsonResponse({"agentId": user.openclaw_agent_id, "workspaces": items})


@json_api
def repository(request):
    if request.method != "POST":
        return method_not_allowed()
    if not _authorized(request):
        return JsonResponse({"error": "Неверный внутренний токен OpenClaw."}, status=401)
    try:
        data = json_body(request)
        user = _user_for_agent(data.get("agentId"))
        if user is None:
            return JsonResponse({"error": "Персональный агент не связан с пользователем."}, status=404)
        item = _resolve_datamart(
            user,
            str(data.get("workspace") or "").strip(),
            str(data.get("datamart") or "").strip(),
        )
        branch = str(data.get("branch") or "main").strip()
        exported = export_branch(item, branch)
    except ValueError as error:
        return JsonResponse({"error": str(error)}, status=_error_status(str(error)))

    return JsonResponse({
        "workspace": {
            "id": item.workspace_id,
            "name": item.workspace.name if item.workspace else "",
            "slug": item.workspace.slug if item.workspace else "",
        },
        "datamart": {
            "id": item.id,
            "name": item.name,
            "displayName": item.display_name,
        },
        **exported,
    })


@json_api
def import_branch(request):
    if request.method != "POST":
        return method_not_allowed()
    if not _authorized(request):
        return JsonResponse({"error": "Неверный внутренний токен OpenClaw."}, status=401)
    try:
        data = json_body(request)
        user = _user_for_agent(data.get("agentId"))
        if user is None:
            return JsonResponse({"error": "Персональный агент не связан с пользователем."}, status=404)
        item = _resolve_datamart(
            user,
            str(data.get("workspace") or "").strip(),
            str(data.get("datamart") or "").strip(),
        )
        contents = data.get("contents")
        if not isinstance(contents, dict):
            raise ValueError("contents должен быть объектом путь-содержимое.")
        result = create_agent_branch(
            item,
            str(data.get("branch") or ""),
            str(data.get("baseBranch") or "main"),
            contents,
            user.public_name,
        )
    except ValueError as error:
        return JsonResponse({"error": str(error)}, status=_error_status(str(error)))
    return JsonResponse(result, status=201)
