from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser

from .models import FileAsset
from .serializers import FileAssetSerializer
from .backends import get_storage_backend


class FileAssetViewSet(viewsets.ModelViewSet):
    serializer_class = FileAssetSerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        return FileAsset.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        uploaded_file = self.request.FILES.get("file")
        if not uploaded_file:
            return

        backend = get_storage_backend()
        path = f"assets/{self.request.user.id}/{uploaded_file.name}"
        backend.upload(uploaded_file, path)

        serializer.save(
            owner=self.request.user,
            file=path,
            original_name=uploaded_file.name,
            file_size=uploaded_file.size,
            content_type=uploaded_file.content_type,
        )

    @action(detail=True, methods=["get"])
    def presigned_url(self, request, pk=None):
        asset = self.get_object()
        backend = get_storage_backend()
        url = backend.get_url(asset.file.name)
        return Response({"url": url})

    @action(detail=False, methods=["post"])
    def bulk_delete(self, request):
        ids = request.data.get("ids", [])
        if not ids:
            return Response(
                {"error": "ids list is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        assets = FileAsset.objects.filter(id__in=ids, owner=request.user)
        backend = get_storage_backend()

        deleted_count = 0
        for asset in assets:
            backend.delete(asset.file.name)
            asset.delete()
            deleted_count += 1

        return Response({"deleted": deleted_count})

    @action(detail=False, methods=["get"])
    def storage_info(self, request):
        total_size = FileAsset.objects.filter(
            owner=request.user
        ).aggregate(total=models.Sum("file_size"))["total"] or 0

        return Response({
            "total_size": total_size,
            "total_size_mb": round(total_size / (1024 * 1024), 2),
            "file_count": FileAsset.objects.filter(owner=request.user).count(),
        })


from django.db import models  # noqa: E402
