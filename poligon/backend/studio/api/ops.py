import time

from django.core.paginator import Paginator
from django.http import JsonResponse

from studio.api.common import api_login_required, json_api, json_body, method_not_allowed
from studio.api.datamarts import get_datamart
from studio.models import DeployRun, MonitoringRun


@json_api
@api_login_required
def deploy(request, deploy_id=None):
    if request.method == "POST" and deploy_id is None:
        data = json_body(request)
        datamart = get_datamart(request.user, data.get("datamartId"))
        if datamart is None:
            return JsonResponse({"error": "datamartId is required"}, status=400)
        identifier = f"DPL-{int(time.time() * 1000)}"
        run = DeployRun.objects.create(
            deploy_id=identifier,
            datamart=datamart,
            created_by=request.user,
            environment=data.get("environment") or "PSI",
            cluster=data.get("cluster") or "cluster-a",
            mode=data.get("mode") or "Full",
        )
        MonitoringRun.objects.create(user=request.user, datamart=datamart, payload={
            "id": identifier,
            "datamart": datamart.display_name,
            "flow": "Ручной запуск",
            "cluster": run.cluster,
            "deployType": run.mode,
            "sourceEnv": run.environment,
            "status": run.status,
            "startTime": run.created_at.isoformat(),
        })
        return JsonResponse({
            "deployId": identifier, "datamartId": datamart.id, "environment": run.environment,
            "cluster": run.cluster, "mode": run.mode, "status": run.status,
            "createdAt": run.created_at.isoformat(),
        }, status=202)
    if request.method == "GET" and deploy_id:
        run = DeployRun.objects.filter(deploy_id=deploy_id, created_by=request.user).first()
        if run is None:
            return JsonResponse({"error": "Запуск не найден."}, status=404)
        return JsonResponse({"deployId": run.deploy_id, "status": run.status, "progress": run.progress})
    return method_not_allowed()


@json_api
@api_login_required
def monitoring(request):
    if request.method != "GET":
        return method_not_allowed()
    try:
        page = max(1, int(request.GET.get("page", 1)))
        page_size = min(100, max(1, int(request.GET.get("pageSize", 20))))
    except ValueError:
        return JsonResponse({"error": "page и pageSize должны быть числами."}, status=400)
    queryset = MonitoringRun.objects.filter(user=request.user).order_by("-created_at")
    paginator = Paginator(queryset, page_size)
    current = paginator.get_page(page)
    return JsonResponse({
        "rows": [row.payload for row in current.object_list],
        "total": paginator.count,
        "page": page,
        "pageSize": page_size,
        "totalPages": paginator.num_pages,
    })


@json_api
@api_login_required
def streams(request, datamart_id):
    if request.method != "GET":
        return method_not_allowed()
    datamart = get_datamart(request.user, datamart_id)
    if datamart is None:
        return JsonResponse({"error": "Витрина не найдена."}, status=404)
    pages = (datamart.designer_state or {}).get("pages") or []
    return JsonResponse([
        {"id": page.get("id") or index + 1, "name": page.get("name") or f"Поток {index + 1}"}
        for index, page in enumerate(pages)
    ], safe=False)
