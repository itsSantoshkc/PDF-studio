from rest_framework.routers import DefaultRouter
from django.urls import path, include
from . import views

app_name = "processing"

router = DefaultRouter()
router.register(r"", views.ProcessingViewSet, basename="processing")

urlpatterns = [
    path("", include(router.urls)),
]
