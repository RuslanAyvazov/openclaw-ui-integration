import re

from django.contrib.auth import authenticate, login, logout
from django.db import transaction
from django.http import JsonResponse

from studio.api.common import json_api, json_body, method_not_allowed
from studio.models import User, Workspace, WorkspaceMembership
from studio.services.openclaw import ensure_openclaw_agent


LOGIN_RE = re.compile(r"^[A-Za-z0-9._-]{3,64}$")
EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


def serialize_user(user):
    return {
        "id": user.id,
        "login": user.username,
        "name": user.public_name,
        "email": user.email,
        "createdAt": user.date_joined.isoformat(),
        "agent": {
            "id": user.openclaw_agent_id,
            "name": user.openclaw_agent_name,
            "status": user.openclaw_agent_status,
            "error": user.openclaw_agent_error,
        },
    }


def _registration_error(data):
    username = str(data.get("login") or "").strip()
    name = str(data.get("name") or "").strip()
    email = str(data.get("email") or "").strip()
    password = str(data.get("password") or "")
    if not LOGIN_RE.fullmatch(username):
        return "Логин должен содержать 3–64 латинских символа, цифры, точку, дефис или подчёркивание."
    if len(name) < 2:
        return "Укажите имя пользователя."
    if not EMAIL_RE.fullmatch(email):
        return "Укажите корректную почту."
    if len(password) < 8:
        return "Пароль должен содержать не менее 8 символов."
    if len(password) > 128:
        return "Пароль не должен превышать 128 символов."
    return ""


@json_api
def register(request):
    if request.method != "POST":
        return method_not_allowed()
    try:
        data = json_body(request)
    except ValueError as error:
        return JsonResponse({"error": str(error)}, status=400)
    error = _registration_error(data)
    if error:
        return JsonResponse({"error": error}, status=400)
    username = str(data["login"]).strip()
    email = str(data["email"]).strip()
    if User.objects.filter(username__iexact=username).exists():
        return JsonResponse({"error": "Пользователь с таким логином уже существует."}, status=409)
    if User.objects.filter(email__iexact=email).exists():
        return JsonResponse({"error": "Пользователь с такой почтой уже существует."}, status=409)

    with transaction.atomic():
        user = User.objects.create_user(
            username=username,
            email=email,
            password=data["password"],
            display_name=str(data["name"]).strip(),
        )
        workspace = Workspace.objects.create(
            name=f"Пространство {user.public_name}",
            slug=f"user-{user.id}",
            description="Личное пространство пользователя",
            created_by=user,
        )
        WorkspaceMembership.objects.create(workspace=workspace, user=user, role="admin")

    ensure_openclaw_agent(user)
    login(request, user)
    return JsonResponse({"user": serialize_user(user)}, status=201)


@json_api
def login_view(request):
    if request.method != "POST":
        return method_not_allowed()
    try:
        data = json_body(request)
    except ValueError as error:
        return JsonResponse({"error": str(error)}, status=400)
    login_value = str(data.get("login") or "").strip()
    password = str(data.get("password") or "")
    if not login_value or not password:
        return JsonResponse({"error": "Введите логин и пароль."}, status=400)
    matched = User.objects.filter(username__iexact=login_value).first()
    user = authenticate(request, username=matched.username if matched else login_value, password=password)
    if user is None:
        return JsonResponse({"error": "Неверный логин или пароль."}, status=401)
    login(request, user)
    return JsonResponse({"user": serialize_user(user)})


@json_api
def me(request):
    if request.method != "GET":
        return method_not_allowed()
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Сессия не найдена."}, status=401)
    return JsonResponse({"user": serialize_user(request.user)})


@json_api
def logout_view(request):
    if request.method != "POST":
        return method_not_allowed()
    logout(request)
    return JsonResponse({}, status=204)
