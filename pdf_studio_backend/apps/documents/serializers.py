from rest_framework import serializers
from .models import Document, Page, DocumentVersion


class PageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Page
        fields = (
            "id", "document", "page_number", "image", "thumbnail",
            "ocr_text", "width", "height", "created_at",
        )
        read_only_fields = ("id", "created_at")


class DocumentVersionSerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = DocumentVersion
        fields = (
            "id", "document", "version_number", "file", "file_size",
            "changes_summary", "created_at", "created_by",
        )
        read_only_fields = ("id", "created_at", "created_by")


class DocumentListSerializer(serializers.ModelSerializer):
    page_count = serializers.ReadOnlyField()

    class Meta:
        model = Document
        fields = (
            "id", "title", "description", "status", "file_size",
            "page_count", "is_public", "created_at", "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")


class DocumentDetailSerializer(serializers.ModelSerializer):
    pages = PageSerializer(many=True, read_only=True)
    versions = DocumentVersionSerializer(many=True, read_only=True)

    class Meta:
        model = Document
        fields = (
            "id", "title", "description", "status", "original_file",
            "file_size", "page_count", "is_public", "pages", "versions",
            "created_at", "updated_at",
        )
        read_only_fields = (
            "id", "file_size", "page_count", "created_at", "updated_at",
        )


class DocumentUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ("id", "title", "description", "original_file", "is_public")
        read_only_fields = ("id",)
