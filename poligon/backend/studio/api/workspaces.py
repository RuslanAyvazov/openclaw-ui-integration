from django.db import transaction
from django.db.models import Count
from django.http import JsonResponse
from django.utils.text import slugify

from studio.api.common import api_login_required, json_api, json_body, method_not_allowed
from studio.models import User, Workspace, WorkspaceJoinRequest, WorkspaceMembership


def _initials(name):
    return "".join(part[0] for part in str(name).split()[:2]).upper()


def _membership(user, workspace_id):
    return WorkspaceMembership.objects.select_related("workspace", "user").filter(user=user, workspace_id=workspace_id).first()


def _serialize_workspace(workspace, role=None):
    return {
        "id": str(workspace.id),
        "name": workspace.name,
        "slug": workspace.slug,
        "description": workspace.description,
        "color": workspace.color,
        "membersCount": getattr(workspace, "members_count", workspace.memberships.count()),
        "datamartsCount": getattr(workspace, "datamarts_count", workspace.datamarts.count()),
        "role": role,
        "isPublic": workspace.is_public,
    }


@json_api
@api_login_required
def workspaces(request, workspace_id=None):
    if workspace_id is None and request.method == "GET":
        memberships = request.user.workspace_memberships.select_related("workspace").order_by("workspace__name")
        return JsonResponse([_serialize_workspace(item.workspace, item.role) for item in memberships], safe=False)
    if workspace_id is None and request.method == "POST":
        try:
            data = json_body(request)
        except ValueError as error:
            return JsonResponse({"error": str(error)}, status=400)
        name = str(data.get("name") or "").strip()
        if not name:
            return JsonResponse({"error": "Укажите название пространства."}, status=400)
        base_slug = slugify(data.get("slug") or name)[:70] or f"workspace-{request.user.id}"
        candidate = base_slug
        index = 2
        while Workspace.objects.filter(slug=candidate).exists():
            candidate = f"{base_slug[:65]}-{index}"
            index += 1
        with transaction.atomic():
            workspace = Workspace.objects.create(
                name=name,
                slug=candidate,
                description=str(data.get("description") or ""),
                color=str(data.get("color") or "#3498db"),
                is_public=bool(data.get("isPublic")),
                created_by=request.user,
            )
            WorkspaceMembership.objects.create(workspace=workspace, user=request.user, role="admin")
        return JsonResponse(_serialize_workspace(workspace, "admin"), status=201)

    membership = _membership(request.user, workspace_id)
    if membership is None:
        return JsonResponse({"error": "Пространство не найдено."}, status=404)
    workspace = membership.workspace
    if request.method == "PUT":
        if membership.role != "admin":
            return JsonResponse({"error": "Только администратор может менять пространство."}, status=403)
        try:
            data = json_body(request)
        except ValueError as error:
            return JsonResponse({"error": str(error)}, status=400)
        for field, source in [("name", "name"), ("description", "description"), ("color", "color")]:
            if source in data:
                setattr(workspace, field, str(data[source]))
        if "isPublic" in data:
            workspace.is_public = bool(data["isPublic"])
        workspace.save()
        return JsonResponse(_serialize_workspace(workspace, membership.role))
    return method_not_allowed()


@json_api
@api_login_required
def public_workspaces(request):
    if request.method != "GET":
        return method_not_allowed()
    joined_ids = request.user.workspace_memberships.values_list("workspace_id", flat=True)
    rows = Workspace.objects.filter(is_public=True).exclude(id__in=joined_ids).annotate(
        members_count=Count("memberships", distinct=True), datamarts_count=Count("datamarts", distinct=True)
    ).order_by("name")
    return JsonResponse([_serialize_workspace(row) for row in rows], safe=False)


@json_api
@api_login_required
def members(request, workspace_id, user_id=None):
    actor = _membership(request.user, workspace_id)
    if actor is None:
        return JsonResponse({"error": "Пространство не найдено."}, status=404)
    if request.method == "GET" and user_id is None:
        rows = WorkspaceMembership.objects.filter(workspace_id=workspace_id).select_related("user").order_by("joined_at")
        return JsonResponse([
            {
                "id": str(row.user_id), "name": row.user.public_name, "email": row.user.email,
                "initials": _initials(row.user.public_name), "role": row.role,
                "joinedAt": row.joined_at.date().isoformat(),
            }
            for row in rows
        ], safe=False)
    if actor.role != "admin":
        return JsonResponse({"error": "Только администратор управляет участниками."}, status=403)
    if request.method == "POST" and user_id is None:
        try:
            data = json_body(request)
        except ValueError as error:
            return JsonResponse({"error": str(error)}, status=400)
        user = User.objects.filter(email__iexact=str(data.get("email") or "").strip()).first()
        if user is None:
            return JsonResponse({"error": "Пользователь с такой почтой ещё не зарегистрирован."}, status=404)
        row, _ = WorkspaceMembership.objects.get_or_create(workspace_id=workspace_id, user=user, defaults={"role": data.get("role") or "analyst"})
        return JsonResponse({"id": str(user.id), "name": user.public_name, "email": user.email, "initials": _initials(user.public_name), "role": row.role, "joinedAt": row.joined_at.date().isoformat()}, status=201)
    row = WorkspaceMembership.objects.filter(workspace_id=workspace_id, user_id=user_id).first()
    if row is None:
        return JsonResponse({"error": "Участник не найден."}, status=404)
    if request.method == "PUT":
        data = json_body(request)
        role = data.get("role")
        if role not in {"admin", "developer", "analyst"}:
            return JsonResponse({"error": "Неизвестная роль."}, status=400)
        row.role = role
        row.save(update_fields=["role"])
        return JsonResponse({"id": str(row.user_id), "role": row.role})
    if request.method == "DELETE":
        if row.user_id == request.user.id:
            return JsonResponse({"error": "Нельзя удалить себя из пространства этим действием."}, status=400)
        row.delete()
        return JsonResponse({}, status=204)
    return method_not_allowed()


@json_api
@api_login_required
def join_requests(request, workspace_id, request_id=None):
    membership = _membership(request.user, workspace_id)
    if request.method == "POST" and request_id is None:
        workspace = Workspace.objects.filter(pk=workspace_id, is_public=True).first()
        if workspace is None:
            return JsonResponse({"error": "Открытое пространство не найдено."}, status=404)
        data = json_body(request)
        row, _ = WorkspaceJoinRequest.objects.get_or_create(
            workspace=workspace, user=request.user, status="pending",
            defaults={"message": str(data.get("message") or "")},
        )
        return JsonResponse({"id": str(row.id), "status": row.status}, status=201)
    if membership is None or membership.role != "admin":
        return JsonResponse({"error": "Только администратор управляет заявками."}, status=403)
    if request.method == "GET" and request_id is None:
        rows = WorkspaceJoinRequest.objects.filter(workspace_id=workspace_id, status="pending").select_related("user").order_by("requested_at")
        return JsonResponse([
            {
                "id": str(row.id),
                "user": {"id": str(row.user_id), "name": row.user.public_name, "email": row.user.email, "initials": _initials(row.user.public_name)},
                "message": row.message,
                "requestedAt": row.requested_at.date().isoformat(),
            }
            for row in rows
        ], safe=False)
    row = WorkspaceJoinRequest.objects.filter(pk=request_id, workspace_id=workspace_id, status="pending").select_related("user").first()
    if row is None:
        return JsonResponse({"error": "Заявка не найдена."}, status=404)
    if request.method == "PUT":
        data = json_body(request)
        action = data.get("action")
        if action == "approve":
            WorkspaceMembership.objects.get_or_create(workspace_id=workspace_id, user=row.user, defaults={"role": "analyst"})
            row.status = "approved"
        elif action == "decline":
            row.status = "declined"
        else:
            return JsonResponse({"error": "Укажите action=approve или action=decline."}, status=400)
        row.save(update_fields=["status"])
        return JsonResponse({"id": str(row.id), "status": row.status})
    return method_not_allowed()
