from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.documents.models import Document, Page
from .tasks import process_pdf_document, run_ocr_on_page, enhance_image, dewarp_page
from .serializers import ProcessDocumentSerializer, OCRRequestSerializer


class ProcessingViewSet(viewsets.GenericViewSet):
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=["post"])
    def process_document(self, request):
        serializer = ProcessDocumentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        document_id = serializer.validated_data["document_id"]
        try:
            document = Document.objects.get(id=document_id, owner=request.user)
        except Document.DoesNotExist:
            return Response(
                {"error": "Document not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        task = process_pdf_document.delay(str(document_id))

        return Response(
            {
                "task_id": str(task.id),
                "status": "queued",
                "document_id": str(document_id),
            },
            status=status.HTTP_202_ACCEPTED,
        )

    @action(detail=False, methods=["post"])
    def run_ocr(self, request):
        serializer = OCRRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        page_id = serializer.validated_data["page_id"]
        engine = serializer.validated_data.get("engine", "tesseract")

        try:
            page = Page.objects.get(id=page_id, document__owner=request.user)
        except Page.DoesNotExist:
            return Response(
                {"error": "Page not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        task = run_ocr_on_page.delay(str(page_id))

        return Response(
            {
                "task_id": str(task.id),
                "status": "queued",
                "page_id": str(page_id),
            },
            status=status.HTTP_202_ACCEPTED,
        )

    @action(detail=False, methods=["post"])
    def enhance(self, request):
        page_id = request.data.get("page_id")
        if not page_id:
            return Response(
                {"error": "page_id is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            page = Page.objects.get(id=page_id, document__owner=request.user)
        except Page.DoesNotExist:
            return Response(
                {"error": "Page not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        task = enhance_image.delay(str(page_id))

        return Response(
            {
                "task_id": str(task.id),
                "status": "queued",
                "page_id": str(page_id),
            },
            status=status.HTTP_202_ACCEPTED,
        )

    @action(detail=False, methods=["post"])
    def dewarp(self, request):
        page_id = request.data.get("page_id")
        if not page_id:
            return Response(
                {"error": "page_id is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            page = Page.objects.get(id=page_id, document__owner=request.user)
        except Page.DoesNotExist:
            return Response(
                {"error": "Page not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        task = dewarp_page.delay(str(page_id))

        return Response(
            {
                "task_id": str(task.id),
                "status": "queued",
                "page_id": str(page_id),
            },
            status=status.HTTP_202_ACCEPTED,
        )

    @action(detail=False, methods=["get"])
    def task_status(self, request):
        task_id = request.query_params.get("task_id")
        if not task_id:
            return Response(
                {"error": "task_id query parameter is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        from celery.result import AsyncResult

        result = AsyncResult(task_id)

        return Response(
            {
                "task_id": task_id,
                "status": result.status,
                "result": result.result if result.ready() else None,
            }
        )
