import os
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "dev-only-change-me")
DEBUG = os.getenv("DJANGO_DEBUG", "false").lower() == "true"
ALLOWED_HOSTS = [item.strip() for item in os.getenv("DJANGO_ALLOWED_HOSTS", "*").split(",") if item.strip()]

INSTALLED_APPS = [
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "studio",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
]

ROOT_URLCONF = "b2c_backend.urls"
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    }
]
WSGI_APPLICATION = "b2c_backend.wsgi.application"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv("POSTGRES_DB", "b2csql"),
        "USER": os.getenv("POSTGRES_USER", "b2csql"),
        "PASSWORD": os.getenv("POSTGRES_PASSWORD", "b2csql"),
        "HOST": os.getenv("POSTGRES_HOST", "postgres"),
        "PORT": os.getenv("POSTGRES_PORT", "5432"),
        "CONN_MAX_AGE": 60,
    }
}

AUTH_USER_MODEL = "studio.User"
PASSWORD_HASHERS = [
    "django.contrib.auth.hashers.PBKDF2PasswordHasher",
    "studio.hashers.LegacyScryptPasswordHasher",
]

LANGUAGE_CODE = "ru-ru"
TIME_ZONE = "Europe/Moscow"
USE_I18N = True
USE_TZ = True

STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

SESSION_COOKIE_NAME = "b2c_session"
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = "Lax"
SESSION_COOKIE_SECURE = os.getenv("COOKIE_SECURE", "false").lower() == "true"
SESSION_COOKIE_AGE = 7 * 24 * 60 * 60
SESSION_SAVE_EVERY_REQUEST = True

DATA_UPLOAD_MAX_MEMORY_SIZE = 100 * 1024 * 1024
REPOSITORIES_ROOT = Path(os.getenv("REPOSITORIES_ROOT", "/data/repositories"))
OPENCLAW_CONTROL_URL = os.getenv("OPENCLAW_CONTROL_URL", "http://openclaw:18890").rstrip("/")
OPENCLAW_CONTROL_TOKEN_FILE = Path(os.getenv("OPENCLAW_CONTROL_TOKEN_FILE", "/run/openclaw-control/token"))
OPENCLAW_DEFAULT_MODEL = os.getenv(
    "OPENCLAW_DEFAULT_MODEL",
    "custom-routerai-ru/deepseek/deepseek-v4-pro",
)
B2C_SKILL_ROOT = Path(os.getenv("B2C_SKILL_ROOT", "/app/openclaw/skills/build-b2c-mart"))
B2C_UI_TMPFS_DIR = Path(os.getenv("B2C_UI_TMPFS_DIR", "/dev/shm"))
