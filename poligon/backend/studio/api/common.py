import json
from functools import wraps

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


def health(_request):
    return JsonResponse({"status": "ok"})


def json_body(request):
    if not request.body:
        return {}
    try:
        return json.loads(request.body.decode("utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError) as error:
        raise ValueError("Тело запроса должно быть корректным JSON.") from error


def api_login_required(view):
    @wraps(view)
    def wrapped(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return JsonResponse({"error": "Требуется вход в систему."}, status=401)
        return view(request, *args, **kwargs)

    return wrapped


def method_not_allowed():
    return JsonResponse({"error": "Метод не поддерживается."}, status=405)


json_api = csrf_exempt
