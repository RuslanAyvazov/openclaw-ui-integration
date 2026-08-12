from uuid import UUID

from django.conf import settings
from django.http import JsonResponse
from django.utils import timezone

from studio.api.common import api_login_required, json_api, json_body, method_not_allowed
from studio.models import AiConversation, BuildDraft
from studio.services.b2c_build import cleanup_drafts, run_build
from studio.services.openclaw import (
    agent_card,
    ensure_openclaw_agent,
    gateway_request,
    model_connection,
    save_model_connection,
)


UI_MODE_PROMPT = "\n".join([
    "Запрос приходит из B2C-SQL UI через ИИ-ассистент.",
    "Ты персональный агент текущего пользователя и работаешь только со сборкой B2C-витрин.",
    "Всегда используй общий навык build-b2c-mart.",
    "Не записывай context_config.json, dm_res или SQL-файлы на диск и не спрашивай каталог.",
    "Документы и детерминированную Python-сборку обрабатывает интерфейс кнопкой «Проверить и собрать».",
    "Помогай кратко собрать пакет: S2T.xlsx, формат iceberg/parquet и SQL-прототипы.",
    "Для Iceberg нужны DML_inc.sql и DML_arc.sql на каждую таблицу; для Parquet — только DML_inc.sql.",
    "Не спрашивай повторно формат или документы, которые пользователь уже приложил.",
    "Не придумывай SQL и не сопоставляй прототипы рассуждением модели.",
    "После успешной сборки интерфейс сам предложит создать карточку витрины.",
    "Отвечай кратко; не выводи внутренний анализ и не генерируй блок b2c-project.",
])


@json_api
@api_login_required
def ai_health(request):
    if request.method != "GET":
        return method_not_allowed()
    try:
        response = gateway_request("/v1/models", timeout=3)
        gateway_ok = response.ok
    except Exception:
        gateway_ok = False
    return JsonResponse({"ok": gateway_ok, "agent": agent_card(request.user)})


@json_api
@api_login_required
def agents(request):
    if request.method != "GET":
        return method_not_allowed()
    return JsonResponse([agent_card(request.user)], safe=False)


@json_api
@api_login_required
def llm_connection(request):
    if request.method == "GET":
        try:
            return JsonResponse(model_connection(request.user))
        except Exception as error:
            return JsonResponse({
                "configured": False,
                "providerName": "RouterAI",
                "modelName": "DeepSeek V4 Pro",
                "error": str(error),
            }, status=503)
    if request.method != "PUT":
        return method_not_allowed()
    try:
        data = json_body(request)
    except ValueError as error:
        return JsonResponse({"error": str(error)}, status=400)
    token = str(data.get("token") or "").strip()
    if len(token) < 8 or len(token) > 8192:
        return JsonResponse({"error": "Токен должен содержать от 8 до 8192 символов."}, status=400)
    try:
        return JsonResponse(save_model_connection(request.user, token))
    except Exception as error:
        return JsonResponse({"error": str(error)}, status=502)


@json_api
@api_login_required
def provision_agent(request):
    if request.method != "POST":
        return method_not_allowed()
    ensure_openclaw_agent(request.user)
    return JsonResponse(agent_card(request.user), status=200 if request.user.openclaw_agent_status == "ready" else 202)


@json_api
@api_login_required
def chat(request):
    if request.method != "POST":
        return method_not_allowed()
    try:
        data = json_body(request)
    except ValueError as error:
        return JsonResponse({"error": str(error)}, status=400)
    messages = data.get("messages")
    if not isinstance(messages, list) or not messages:
        return JsonResponse({"error": "messages array is required"}, status=400)
    selected_agent = str(data.get("agentId") or request.user.openclaw_agent_id or "")
    if selected_agent != request.user.openclaw_agent_id:
        return JsonResponse({"error": "Можно обращаться только к своему ИИ-агенту."}, status=403)
    if request.user.openclaw_agent_status != "ready":
        ensure_openclaw_agent(request.user)
        if request.user.openclaw_agent_status != "ready":
            return JsonResponse({"error": "ИИ-агент ещё не создан в OpenClaw.", "detail": request.user.openclaw_agent_error}, status=503)
    try:
        if not model_connection(request.user).get("configured"):
            return JsonResponse({
                "error": "Сначала подключите модель: укажите токен в окне ИИ-ассистента.",
                "code": "llm_token_required",
            }, status=409)
    except Exception as error:
        return JsonResponse({"error": f"Не удалось проверить подключение модели: {error}"}, status=503)

    conversation_id = str(data.get("conversationId") or "main")[:96]
    try:
        response = gateway_request(
            "/v1/chat/completions",
            method="POST",
            json={
                "model": f"openclaw/{selected_agent}",
                "user": f"b2csql:{request.user.id}:{conversation_id}",
                "messages": [{"role": "system", "content": UI_MODE_PROMPT}, *messages],
            },
            timeout=180,
        )
        if not response.ok:
            return JsonResponse({
                "error": f"OpenClaw gateway responded {response.status_code}",
                "detail": response.text[:500],
            }, status=502)
        payload = response.json()
        text = (((payload.get("choices") or [{}])[0].get("message") or {}).get("content") or "")
        return JsonResponse({"text": text, "usage": payload.get("usage")})
    except Exception as error:
        return JsonResponse({"error": f"OpenClaw gateway is unreachable: {error}"}, status=502)


@json_api
@api_login_required
def build(request):
    if request.method != "POST":
        return method_not_allowed()
    try:
        return JsonResponse(run_build(request.user, json_body(request)), status=201)
    except (ValueError, TypeError) as error:
        return JsonResponse({"error": str(error)}, status=422)


@json_api
@api_login_required
def draft(request, draft_id):
    cleanup_drafts()
    try:
        UUID(str(draft_id))
    except ValueError:
        return JsonResponse({"error": "Некорректный идентификатор черновика."}, status=400)
    item = BuildDraft.objects.filter(pk=draft_id, user=request.user, expires_at__gt=timezone.now()).first()
    if item is None:
        return JsonResponse({"error": "Черновик сборки не найден или уже удалён."}, status=404)
    if request.method == "GET":
        return JsonResponse({
            "id": str(item.id),
            "createdAt": int(item.created_at.timestamp() * 1000),
            "expiresAt": int(item.expires_at.timestamp() * 1000),
            "contextConfig": item.context_config,
            "files": item.project_files,
            "summary": item.summary,
        })
    if request.method == "DELETE":
        item.delete()
        return JsonResponse({}, status=204)
    return method_not_allowed()


def _scope(request):
    value = str(request.GET.get("scope") or "global")[:80]
    return value or "global"


def _serialize_conversation(item):
    return {
        "id": item.conversation_id,
        "title": item.title,
        "count": len(item.messages or []),
        "messages": item.messages or [],
        "updatedAt": int(item.updated_at.timestamp() * 1000),
        "projectName": item.project_name,
    }


@json_api
@api_login_required
def conversations(request, conversation_id=None):
    scope = _scope(request)
    if request.method == "GET" and conversation_id is None:
        rows = AiConversation.objects.filter(user=request.user, scope=scope).order_by("-updated_at")[:50]
        active = (request.user.ui_preferences or {}).get("activeConversations", {}).get(scope)
        return JsonResponse({"items": [_serialize_conversation(row) for row in rows], "activeConversationId": active})
    if conversation_id is None:
        return method_not_allowed()
    if request.method == "PUT":
        try:
            data = json_body(request)
        except ValueError as error:
            return JsonResponse({"error": str(error)}, status=400)
        messages = data.get("messages") if isinstance(data.get("messages"), list) else []
        item, _ = AiConversation.objects.update_or_create(
            user=request.user,
            scope=scope,
            conversation_id=str(conversation_id)[:96],
            defaults={
                "title": str(data.get("title") or "Новый диалог")[:180],
                "messages": messages,
                "project_name": str(data.get("projectName") or "")[:180],
            },
        )
        preferences = request.user.ui_preferences or {}
        active = dict(preferences.get("activeConversations") or {})
        active[scope] = item.conversation_id
        preferences["activeConversations"] = active
        request.user.ui_preferences = preferences
        request.user.save(update_fields=["ui_preferences"])
        return JsonResponse(_serialize_conversation(item))
    if request.method == "DELETE":
        AiConversation.objects.filter(user=request.user, scope=scope, conversation_id=conversation_id).delete()
        preferences = request.user.ui_preferences or {}
        active = dict(preferences.get("activeConversations") or {})
        if active.get(scope) == conversation_id:
            active.pop(scope, None)
            preferences["activeConversations"] = active
            request.user.ui_preferences = preferences
            request.user.save(update_fields=["ui_preferences"])
        return JsonResponse({}, status=204)
    return method_not_allowed()


@json_api
@api_login_required
def active_conversation(request):
    if request.method != "PUT":
        return method_not_allowed()
    try:
        data = json_body(request)
    except ValueError as error:
        return JsonResponse({"error": str(error)}, status=400)
    scope = str(data.get("scope") or "global")[:80]
    conversation_id = str(data.get("conversationId") or "")[:96]
    preferences = request.user.ui_preferences or {}
    active = dict(preferences.get("activeConversations") or {})
    if conversation_id:
        active[scope] = conversation_id
    else:
        active.pop(scope, None)
    preferences["activeConversations"] = active
    request.user.ui_preferences = preferences
    request.user.save(update_fields=["ui_preferences"])
    return JsonResponse({"scope": scope, "conversationId": conversation_id})
