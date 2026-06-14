import os
import logging
from PIL import Image

logger = logging.getLogger(__name__)

try:
    from pypdf import PdfReader
except ImportError:
    PdfReader = None

try:
    import pikepdf
except ImportError:
    pikepdf = None


def extract_metadata(file_path):
    if PdfReader:
        reader = PdfReader(file_path)
        return {
            "page_count": len(reader.pages),
            "metadata": dict(reader.metadata) if reader.metadata else {},
        }
    elif pikepdf:
        with pikepdf.open(file_path) as pdf:
            return {
                "page_count": len(pdf.pages),
                "metadata": dict(pdf.docinfo) if pdf.docinfo else {},
            }
    return {"page_count": 0, "metadata": {}}


def extract_pages(document):
    from apps.documents.models import Page

    file_path = document.original_file.path
    output_dir = os.path.join(
        os.path.dirname(file_path),
        "pages",
        str(document.id),
    )
    os.makedirs(output_dir, exist_ok=True)

    if PdfReader:
        reader = PdfReader(file_path)
        for i, page in enumerate(reader.pages, 1):
            page_obj = Page.objects.create(
                document=document,
                page_number=i,
                image=os.path.join(output_dir, f"page_{i:04d}.png"),
                width=int(page.mediabox.width),
                height=int(page.mediabox.height),
            )
    return True


def merge_pdfs(file_paths, output_path):
    if pikepdf:
        with pikepdf.Pdf.new() as merged:
            for path in file_paths:
                with pikepdf.open(path) as pdf:
                    merged.pages.extend(pdf.pages)
            merged.save(output_path)
        return output_path
    raise NotImplementedError("No PDF library available")


def split_pdf(file_path, page_range, output_path):
    if pikepdf:
        start, end = page_range
        with pikepdf.open(file_path) as pdf:
            new_pdf = pikepdf.Pdf.new()
            new_pdf.pages.extend(pdf.pages[start - 1 : end])
            new_pdf.save(output_path)
        return output_path
    raise NotImplementedError("No PDF library available")


def rotate_page(file_path, page_number, angle, output_path):
    if pikepdf:
        with pikepdf.open(file_path) as pdf:
            pdf.pages[page_number - 1].rotate(angle)
            pdf.save(output_path)
        return output_path
    raise NotImplementedError("No PDF library available")


def compress_pdf(file_path, output_path, quality=85):
    if PdfReader:
        from reportlab.lib.pagesizes import letter
        from reportlab.pdfgen import canvas

        reader = PdfReader(file_path)
        c = canvas.Canvas(output_path, pagesize=letter)

        for page in reader.pages:
            text = page.extract_text()
            if text:
                c.drawString(72, 720, text)
            c.showPage()

        c.save()
        return output_path
    raise NotImplementedError("No PDF library available")
