from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Document, Page, DocumentVersion
from .serializers import (
    DocumentListSerializer,
    DocumentDetailSerializer,
    DocumentUploadSerializer,
    PageSerializer,
    DocumentVersionSerializer,
)
from .filters import DocumentFilter


class DocumentViewSet(viewsets.ModelViewSet):
    filterset_class = DocumentFilter
    search_fields = ["title", "description"]
    ordering_fields = ["created_at", "updated_at", "title", "file_size"]

    def get_queryset(self):
        return Document.objects.filter(owner=self.request.user)

    def get_serializer_class(self):
        if self.action == "list":
            return DocumentListSerializer
        if self.action == "create":
            return DocumentUploadSerializer
        return DocumentDetailSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=["post"])
    def duplicate(self, request, pk=None):
        document = self.get_object()
        new_document = Document.objects.create(
            owner=request.user,
            title=f"{document.title} (Copy)",
            description=document.description,
            original_file=document.original_file,
            file_size=document.file_size,
            page_count=document.page_count,
        )
        return Response(
            DocumentDetailSerializer(new_document).data,
            status=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=["get"])
    def pages(self, request, pk=None):
        document = self.get_object()
        pages = document.pages.all()
        serializer = PageSerializer(pages, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["get"])
    def versions(self, request, pk=None):
        document = self.get_object()
        versions = document.versions.all()
        serializer = DocumentVersionSerializer(versions, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def shared(self, request):
        shared_docs = Document.objects.filter(is_public=True).exclude(
            owner=request.user
        )
        page = self.paginate_queryset(shared_docs)
        if page is not None:
            serializer = DocumentListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = DocumentListSerializer(shared_docs, many=True)
        return Response(serializer.data)
