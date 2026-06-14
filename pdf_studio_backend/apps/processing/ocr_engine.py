import logging

logger = logging.getLogger(__name__)

try:
    import pytesseract

    HAS_TESSERACT = True
except ImportError:
    HAS_TESSERACT = False

try:
    import easyocr

    HAS_EASYOCR = True
except ImportError:
    HAS_EASYOCR = False

_reader = None


def _get_easyocr_reader():
    global _reader
    if _reader is None and HAS_EASYOCR:
        _reader = easyocr.Reader(["en"], gpu=False)
    return _reader


def extract_text(image_path, engine="tesseract", lang="eng"):
    if engine == "tesseract" and HAS_TESSERACT:
        return _extract_tesseract(image_path, lang)
    elif engine == "easyocr" and HAS_EASYOCR:
        return _extract_easyocr(image_path)
    else:
        logger.warning(f"OCR engine '{engine}' not available, trying fallback")
        if HAS_TESSERACT:
            return _extract_tesseract(image_path, lang)
        elif HAS_EASYOCR:
            return _extract_easyocr(image_path)
        raise NotImplementedError("No OCR engine available")


def _extract_tesseract(image_path, lang="eng"):
    try:
        from PIL import Image

        img = Image.open(image_path)
        text = pytesseract.image_to_string(img, lang=lang)
        return text.strip()
    except Exception as e:
        logger.exception(f"Tesseract OCR failed: {e}")
        return ""


def _extract_easyocr(image_path):
    try:
        reader = _get_easyocr_reader()
        if reader is None:
            return ""
        results = reader.readtext(image_path)
        text_parts = [result[1] for result in results]
        return " ".join(text_parts)
    except Exception as e:
        logger.exception(f"EasyOCR failed: {e}")
        return ""


def extract_text_with_boxes(image_path, engine="tesseract", lang="eng"):
    if engine == "tesseract" and HAS_TESSERACT:
        return _extract_tesseract_with_boxes(image_path, lang)
    elif engine == "easyocr" and HAS_EASYOCR:
        return _extract_easyocr_with_boxes(image_path)
    return []


def _extract_tesseract_with_boxes(image_path, lang="eng"):
    try:
        from PIL import Image

        img = Image.open(image_path)
        data = pytesseract.image_to_data(img, lang=lang, output_type=pytesseract.Output.DICT)

        boxes = []
        for i in range(len(data["text"])):
            if data["text"][i].strip():
                boxes.append({
                    "text": data["text"][i],
                    "x": data["left"][i],
                    "y": data["top"][i],
                    "width": data["width"][i],
                    "height": data["height"][i],
                    "confidence": data["conf"][i],
                })
        return boxes
    except Exception as e:
        logger.exception(f"Tesseract OCR with boxes failed: {e}")
        return []


def _extract_easyocr_with_boxes(image_path):
    try:
        reader = _get_easyocr_reader()
        if reader is None:
            return []
        results = reader.readtext(image_path)

        boxes = []
        for result in results:
            bbox, text, confidence = result
            x = min(point[0] for point in bbox)
            y = min(point[1] for point in bbox)
            width = max(point[0] for point in bbox) - x
            height = max(point[1] for point in bbox) - y
            boxes.append({
                "text": text,
                "x": int(x),
                "y": int(y),
                "width": int(width),
                "height": int(height),
                "confidence": confidence,
            })
        return boxes
    except Exception as e:
        logger.exception(f"EasyOCR with boxes failed: {e}")
        return []
