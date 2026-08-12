from django.db.models import Q
from django.http import JsonResponse

from studio.api.common import api_login_required, json_api, json_body, method_not_allowed
from studio.models import Datamart, RepositoryState
from studio.services.repositories import delete_repository, reset_repository, save_repository, serialize_repository


def _allowed_datamarts(user):
    return Datamart.objects.filter(
        Q(created_by=user) | Q(workspace__memberships__user=user)
    ).select_related("created_by", "workspace").distinct()


def get_datamart(user, datamart_id):
    return _allowed_datamarts(user).filter(pk=datamart_id).first()


def _status_for(passport, fallback="draft"):
    clusters = passport.get("clusters") if isinstance(passport, dict) else None
    return ("active" if clusters else "draft") if isinstance(clusters, list) else (fallback or "draft")


def serialize_datamart(item):
    designer_state = item.designer_state or {}
    return {
        "id": item.id,
        "name": item.name,
        "displayName": item.display_name,
        "description": item.description,
        "owner": item.owner_name or item.created_by.public_name,
        "status": item.status,
        "createdAt": item.created_at.date().isoformat(),
        "passport": item.passport or {},
        "workspaceId": item.workspace_id,
        "designerState": designer_state,
        "pages": designer_state.get("pages") or [],
    }


@json_api
@api_login_required
def datamarts(request, datamart_id=None):
    if datamart_id is None and request.method == "GET":
        rows = _allowed_datamarts(request.user).order_by("id")
        return JsonResponse([serialize_datamart(item) for item in rows], safe=False)

    if datamart_id is None and request.method == "POST":
        try:
            data = json_body(request)
        except ValueError as error:
            return JsonResponse({"error": str(error)}, status=400)
        name = str(data.get("name") or "").strip()
        if not name:
            return JsonResponse({"error": "name is required"}, status=400)
        passport = data.get("passport") if isinstance(data.get("passport"), dict) else {}
        workspace_id = data.get("workspaceId")
        membership = request.user.workspace_memberships.select_related("workspace").filter(workspace_id=workspace_id).first() if workspace_id else request.user.workspace_memberships.select_related("workspace").first()
        item = Datamart.objects.create(
            workspace=membership.workspace if membership else None,
            created_by=request.user,
            name=name,
            display_name=str(data.get("displayName") or name),
            description=str(data.get("description") or ""),
            owner_name=str(data.get("owner") or request.user.public_name),
            status=_status_for(passport, data.get("status")),
            passport=passport,
            designer_state=data.get("designerState") if isinstance(data.get("designerState"), dict) else {},
        )
        RepositoryState.objects.create(datamart=item)
        serialize_repository(item)
        return JsonResponse(serialize_datamart(item), status=201)

    item = get_datamart(request.user, datamart_id)
    if item is None:
        return JsonResponse({"error": "Not found"}, status=404)
    if request.method == "GET":
        return JsonResponse(serialize_datamart(item))
    if request.method == "PUT":
        try:
            data = json_body(request)
        except ValueError as error:
            return JsonResponse({"error": str(error)}, status=400)
        if "name" in data:
            item.name = str(data["name"] or item.name)
        if "displayName" in data:
            item.display_name = str(data["displayName"] or item.name)
        if "description" in data:
            item.description = str(data["description"] or "")
        if "owner" in data:
            item.owner_name = str(data["owner"] or "")
        if isinstance(data.get("passport"), dict):
            item.passport = data["passport"]
            item.status = _status_for(item.passport, data.get("status") or item.status)
        elif "status" in data:
            item.status = str(data["status"] or item.status)
        if isinstance(data.get("designerState"), dict):
            item.designer_state = data["designerState"]
        item.save()
        return JsonResponse(serialize_datamart(item))
    if request.method == "DELETE":
        delete_repository(item)
        item.delete()
        return JsonResponse({}, status=204)
    return method_not_allowed()


@json_api
@api_login_required
def designer_state(request, datamart_id):
    item = get_datamart(request.user, datamart_id)
    if item is None:
        return JsonResponse({"error": "Not found"}, status=404)
    if request.method == "GET":
        return JsonResponse(item.designer_state or {})
    if request.method == "PUT":
        try:
            data = json_body(request)
        except ValueError as error:
            return JsonResponse({"error": str(error)}, status=400)
        if not isinstance(data, dict):
            return JsonResponse({"error": "Состояние конструктора должно быть объектом."}, status=400)
        item.designer_state = data
        item.save(update_fields=["designer_state", "updated_at"])
        return JsonResponse(item.designer_state)
    if request.method == "DELETE":
        item.designer_state = {}
        item.save(update_fields=["designer_state", "updated_at"])
        return JsonResponse({}, status=204)
    return method_not_allowed()


@json_api
@api_login_required
def repository(request, datamart_id):
    item = get_datamart(request.user, datamart_id)
    if item is None:
        return JsonResponse({"error": "Not found"}, status=404)
    try:
        if request.method == "GET":
            return JsonResponse(serialize_repository(item))
        if request.method == "PUT":
            return JsonResponse(save_repository(item, json_body(request)))
        if request.method == "DELETE":
            reset_repository(item)
            return JsonResponse({}, status=204)
    except ValueError as error:
        return JsonResponse({"error": str(error)}, status=400)
    return method_not_allowed()
