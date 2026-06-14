from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = "storage"

router = DefaultRouter()
router.register(r"assets", views.FileAssetViewSet, basename="fileasset")

urlpatterns = [
    path("", include(router.urls)),
]
