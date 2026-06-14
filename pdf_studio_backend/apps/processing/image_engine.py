import os
import logging
from PIL import Image, ImageEnhance, ImageFilter

logger = logging.getLogger(__name__)

try:
    import cv2
    import numpy as np

    HAS_OPENCV = True
except ImportError:
    HAS_OPENCV = False

try:
    from skimage import filters, restoration, exposure

    HAS_SKIMAGE = True
except ImportError:
    HAS_SKIMAGE = False


def enhance(image_path, output_path=None):
    if output_path is None:
        base, ext = os.path.splitext(image_path)
        output_path = f"{base}_enhanced{ext}"

    img = Image.open(image_path)

    enhancer = ImageEnhance.Contrast(img)
    img = enhancer.enhance(1.2)

    enhancer = ImageEnhance.Sharpness(img)
    img = enhancer.enhance(1.5)

    enhancer = ImageEnhance.Brightness(img)
    img = enhancer.enhance(1.1)

    img.save(output_path, quality=95)
    return output_path


def binarize(image_path, output_path=None, method="otsu"):
    if output_path is None:
        base, ext = os.path.splitext(image_path)
        output_path = f"{base}_binary{ext}"

    if HAS_OPENCV:
        img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
        if method == "otsu":
            _, binary = cv2.threshold(img, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        else:
            binary = cv2.adaptiveThreshold(
                img, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
            )
        cv2.imwrite(output_path, binary)
    else:
        img = Image.open(image_path).convert("L")
        img = img.point(lambda x: 0 if x < 128 else 255, "1")
        img.save(output_path)

    return output_path


def denoise(image_path, output_path=None):
    if output_path is None:
        base, ext = os.path.splitext(image_path)
        output_path = f"{base}_denoised{ext}"

    if HAS_OPENCV:
        img = cv2.imread(image_path)
        denoised = cv2.fastNlMeansDenoisingColored(img, None, 10, 10, 7, 21)
        cv2.imwrite(output_path, denoised)
    else:
        img = Image.open(image_path)
        img = img.filter(ImageFilter.MedianFilter(size=3))
        img.save(output_path)

    return output_path


def deskew(image_path, output_path=None):
    if output_path is None:
        base, ext = os.path.splitext(image_path)
        output_path = f"{base}_deskewed{ext}"

    if HAS_OPENCV:
        img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
        coords = np.column_stack(np.where(img > 0))
        angle = cv2.minAreaRect(coords)[-1]

        if angle < -45:
            angle = -(90 + angle)
        else:
            angle = -angle

        (h, w) = img.shape[:2]
        center = (w // 2, h // 2)
        M = cv2.getRotationMatrix2D(center, angle, 1.0)
        rotated = cv2.warpAffine(
            img, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE
        )
        cv2.imwrite(output_path, rotated)
    else:
        img = Image.open(image_path)
        img.save(output_path)

    return output_path
