import os
from django.core.exceptions import ValidationError


def validate_file_size(max_size_mb=50):
    def validator(file):
        max_size = max_size_mb * 1024 * 1024
        if file.size > max_size:
            raise ValidationError(
                f"File size exceeds maximum allowed size of {max_size_mb}MB"
            )
    return validator


def validate_file_extension(allowed_extensions):
    def validator(file):
        ext = os.path.splitext(file.name)[1].lower()
        if ext not in allowed_extensions:
            raise ValidationError(
                f"File extension '{ext}' is not allowed. "
                f"Allowed extensions: {', '.join(allowed_extensions)}"
            )
    return validator


ALLOWED_PDF_EXTENSIONS = [".pdf"]
ALLOWED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".tiff", ".bmp", ".webp"]
ALLOWED_DOCUMENT_EXTENSIONS = ALLOWED_PDF_EXTENSIONS + ALLOWED_IMAGE_EXTENSIONS


def validate_pdf_file(file):
    validate_file_extension(ALLOWED_PDF_EXTENSIONS)(file)
    validate_file_size(max_size_mb=100)(file)


def validate_image_file(file):
    validate_file_extension(ALLOWED_IMAGE_EXTENSIONS)(file)
    validate_file_size(max_size_mb=50)(file)


def validate_email(value):
    import re
    pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    if not re.match(pattern, value):
        raise ValidationError("Invalid email address")


def validate_password_strength(value):
    if len(value) < 8:
        raise ValidationError("Password must be at least 8 characters long")
    if not any(c.isupper() for c in value):
        raise ValidationError("Password must contain at least one uppercase letter")
    if not any(c.islower() for c in value):
        raise ValidationError("Password must contain at least one lowercase letter")
    if not any(c.isdigit() for c in value):
        raise ValidationError("Password must contain at least one digit")
