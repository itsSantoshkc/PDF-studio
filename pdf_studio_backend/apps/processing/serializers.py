from rest_framework import serializers


class ProcessDocumentSerializer(serializers.Serializer):
    document_id = serializers.UUIDField()


class OCRRequestSerializer(serializers.Serializer):
    page_id = serializers.UUIDField()
    engine = serializers.ChoiceField(
        choices=[("tesseract", "Tesseract"), ("easyocr", "EasyOCR")],
        default="tesseract",
        required=False,
    )
