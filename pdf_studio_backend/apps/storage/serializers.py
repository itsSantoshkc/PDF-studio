from rest_framework import serializers
from .models import FileAsset


class FileAssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileAsset
        fields = (
            "id", "owner", "file", "original_name", "file_size",
            "content_type", "storage_type", "is_public",
            "created_at", "updated_at",
        )
        read_only_fields = (
            "id", "owner", "original_name", "file_size",
            "content_type", "created_at", "updated_at",
        )
