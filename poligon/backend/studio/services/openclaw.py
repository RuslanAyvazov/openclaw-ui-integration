import re
from urllib.parse import quote

import requests
from django.conf import settings


AGENT_ID_RE = re.compile(r"^[a-z0-9][a-z0-9_-]{0,63}$")


def desired_agent_id(user):
    login = re.sub(r"[^a-z0-9_-]+", "-", user.username.lower()).strip("-") or "user"
    return f"user-{user.pk}-{login}"[:64].rstrip("-")


def desired_agent_name(user):
    return f"AI Agent — {user.public_name}"


def _control_token():
    try:
        token = settings.OPENCLAW_CONTROL_TOKEN_FILE.read_text(encoding="utf-8").strip()
    except OSError as error:
        raise RuntimeError("Внутренний токен OpenClaw ещё не создан контейнером.") from error
    if not token:
        raise RuntimeError("Внутренний токен OpenClaw пуст.")
    return token


def control_request(path, *, method="GET", json=None, timeout=90, stream=False):
    return requests.request(
        method,
        f"{settings.OPENCLAW_CONTROL_URL}{path}",
        headers={
            "Authorization": f"Bearer {_control_token()}",
            "Content-Type": "application/json",
        },
        json=json,
        timeout=timeout,
        stream=stream,
    )


def ensure_openclaw_agent(user, raise_errors=False):
    agent_id = desired_agent_id(user)
    agent_name = desired_agent_name(user)
    user.openclaw_agent_id = agent_id
    user.openclaw_agent_name = agent_name
    user.openclaw_agent_status = "provisioning"
    user.openclaw_agent_error = ""
    user.save(update_fields=["openclaw_agent_id", "openclaw_agent_name", "openclaw_agent_status", "openclaw_agent_error"])

    try:
        response = control_request(
            "/agents/ensure",
            method="POST",
            json={
                "userId": user.pk,
                "login": user.username,
                "name": user.public_name,
                "agentId": agent_id,
                "agentName": agent_name,
                "model": settings.OPENCLAW_DEFAULT_MODEL,
                "skill": "build-b2c-mart",
            },
            timeout=120,
        )
        response.raise_for_status()
        data = response.json()
        user.openclaw_agent_id = data.get("agentId") or agent_id
        user.openclaw_agent_name = data.get("agentName") or agent_name
        user.openclaw_agent_status = "ready"
        user.openclaw_agent_error = ""
    except Exception as error:
        user.openclaw_agent_status = "error"
        user.openclaw_agent_error = str(error)[:1000]
        if raise_errors:
            user.save(update_fields=["openclaw_agent_id", "openclaw_agent_name", "openclaw_agent_status", "openclaw_agent_error"])
            raise

    user.save(update_fields=["openclaw_agent_id", "openclaw_agent_name", "openclaw_agent_status", "openclaw_agent_error"])
    return user


def agent_card(user):
    agent_id = user.openclaw_agent_id or desired_agent_id(user)
    return {
        "id": agent_id,
        "target": f"openclaw/{agent_id}",
        "name": user.openclaw_agent_name or desired_agent_name(user),
        "sub": f"{settings.OPENCLAW_DEFAULT_MODEL.split('/')[-1]} · OpenClaw · {user.openclaw_agent_status}",
        "icon": "fa-cubes-stacked",
        "accent": "#e67e22",
        "capability": "b2c-mart",
        "status": user.openclaw_agent_status,
        "error": user.openclaw_agent_error,
    }


def model_connection(user):
    agent_id = user.openclaw_agent_id or desired_agent_id(user)
    response = control_request(f"/agents/credential?agentId={quote(agent_id)}", timeout=10)
    response.raise_for_status()
    return response.json()


def save_model_connection(user, token):
    if user.openclaw_agent_status != "ready":
        ensure_openclaw_agent(user, raise_errors=True)
    response = control_request(
        "/agents/credential",
        method="POST",
        json={"agentId": user.openclaw_agent_id, "token": token},
        timeout=120,
    )
    if not response.ok:
        try:
            detail = response.json().get("error")
        except ValueError:
            detail = response.text
        raise RuntimeError(detail or "OpenClaw не сохранил токен модели.")
    return response.json()


def gateway_request(path, *, method="GET", json=None, timeout=180, stream=False):
    return control_request(
        f"/openclaw{path}",
        method=method,
        json=json,
        timeout=timeout,
        stream=stream,
    )


def stage_agent_attachments(user, session_key, files):
    """Сохраняет вложения в uploads текущего workspace персонального агента."""
    if not isinstance(files, list) or not files:
        return None
    response = control_request(
        "/agents/attachments",
        method="POST",
        json={
            "agentId": user.openclaw_agent_id,
            "sessionKey": session_key,
            "files": files,
        },
        timeout=180,
    )
    if not response.ok:
        try:
            detail = response.json().get("error")
        except ValueError:
            detail = response.text
        raise RuntimeError(detail or "OpenClaw не сохранил вложения.")
    return response.json()
