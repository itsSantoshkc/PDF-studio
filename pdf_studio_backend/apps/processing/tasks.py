import os
import logging
from celery import shared_task

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3)
def process_pdf_document(self, document_id):
    from apps.documents.models import Document

    try:
        document = Document.objects.get(id=document_id)
        document.status = Document.Status.PROCESSING
        document.save(update_fields=["status"])

        from .pdf_engine import extract_pages, extract_metadata

        metadata = extract_metadata(document.original_file.path)
        document.page_count = metadata.get("page_count", 0)
        document.save(update_fields=["page_count"])

        extract_pages(document)

        document.status = Document.Status.READY
        document.save(update_fields=["status"])

        return {
            "document_id": str(document_id),
            "status": "completed",
            "page_count": document.page_count,
        }
    except Document.DoesNotExist:
        logger.error(f"Document {document_id} not found")
        return {"error": "Document not found"}
    except Exception as exc:
        logger.exception(f"Error processing document {document_id}")
        self.retry(exc=exc, countdown=60)


@shared_task(bind=True, max_retries=3)
def run_ocr_on_page(self, page_id):
    from apps.documents.models import Page

    try:
        page = Page.objects.get(id=page_id)
        from .ocr_engine import extract_text

        text = extract_text(page.image.path)
        page.ocr_text = text
        page.save(update_fields=["ocr_text"])

        return {"page_id": str(page_id), "status": "completed"}
    except Page.DoesNotExist:
        logger.error(f"Page {page_id} not found")
        return {"error": "Page not found"}
    except Exception as exc:
        logger.exception(f"Error running OCR on page {page_id}")
        self.retry(exc=exc, countdown=60)


@shared_task(bind=True, max_retries=3)
def enhance_image(self, page_id):
    from apps.documents.models import Page

    try:
        page = Page.objects.get(id=page_id)
        from .image_engine import enhance

        enhanced_path = enhance(page.image.path)
        page.image = enhanced_path
        page.save(update_fields=["image"])

        return {"page_id": str(page_id), "status": "completed"}
    except Page.DoesNotExist:
        logger.error(f"Page {page_id} not found")
        return {"error": "Page not found"}
    except Exception as exc:
        logger.exception(f"Error enhancing page {page_id}")
        self.retry(exc=exc, countdown=60)


@shared_task(bind=True, max_retries=3)
def dewarp_page(self, page_id):
    from apps.documents.models import Page

    try:
        page = Page.objects.get(id=page_id)
        from .cv_engine import dewarp

        dewarped_path = dewarp(page.image.path)
        page.image = dewarped_path
        page.save(update_fields=["image"])

        return {"page_id": str(page_id), "status": "completed"}
    except Page.DoesNotExist:
        logger.error(f"Page {page_id} not found")
        return {"error": "Page not found"}
    except Exception as exc:
        logger.exception(f"Error dewarping page {page_id}")
        self.retry(exc=exc, countdown=60)
