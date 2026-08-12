from django.urls import include, path
from studio.api.common import health


urlpatterns = [
    path("health", health),
    path("api/", include("studio.urls")),
]
