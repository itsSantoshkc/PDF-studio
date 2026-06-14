import os
import logging

logger = logging.getLogger(__name__)

try:
    import cv2
    import numpy as np

    HAS_OPENCV = True
except ImportError:
    HAS_OPENCV = False


def detect_edges(image_path, output_path=None):
    if not HAS_OPENCV:
        raise NotImplementedError("OpenCV is required for edge detection")

    if output_path is None:
        base, ext = os.path.splitext(image_path)
        output_path = f"{base}_edges{ext}"

    img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    edges = cv2.Canny(img, 50, 150)
    cv2.imwrite(output_path, edges)
    return output_path


def detect_document_contour(image_path, output_path=None):
    if not HAS_OPENCV:
        raise NotImplementedError("OpenCV is required for contour detection")

    if output_path is None:
        base, ext = os.path.splitext(image_path)
        output_path = f"{base}_contour{ext}"

    img = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    edged = cv2.Canny(blurred, 50, 200)

    contours, _ = cv2.findContours(edged, cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
    contours = sorted(contours, key=cv2.contourArea, reverse=True)[:5]

    for contour in contours:
        peri = cv2.arcLength(contour, True)
        approx = cv2.approxPolyDP(contour, 0.02 * peri, True)

        if len(approx) == 4:
            cv2.drawContours(img, [approx], -1, (0, 255, 0), 3)
            break

    cv2.imwrite(output_path, img)
    return output_path


def dewarp(image_path, output_path=None):
    if not HAS_OPENCV:
        raise NotImplementedError("OpenCV is required for dewarping")

    if output_path is None:
        base, ext = os.path.splitext(image_path)
        output_path = f"{base}_dewarped{ext}"

    img = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    corners = _detect_corners(gray)
    if corners is not None:
        warped = _four_point_transform(img, corners)
        cv2.imwrite(output_path, warped)
    else:
        cv2.imwrite(output_path, img)

    return output_path


def _detect_corners(gray):
    corners = cv2.goodFeaturesToTrack(gray, maxCorners=4, qualityLevel=0.01, minDistance=100)
    if corners is not None and len(corners) == 4:
        return corners.reshape(4, 2)
    return None


def _four_point_transform(image, pts):
    rect = _order_points(pts)
    (tl, tr, br, bl) = rect

    width_a = np.sqrt(((br[0] - bl[0]) ** 2) + ((br[1] - bl[1]) ** 2))
    width_b = np.sqrt(((tr[0] - tl[0]) ** 2) + ((tr[1] - tl[1]) ** 2))
    max_width = max(int(width_a), int(width_b))

    height_a = np.sqrt(((tr[0] - br[0]) ** 2) + ((tr[1] - br[1]) ** 2))
    height_b = np.sqrt(((tl[0] - bl[0]) ** 2) + ((tl[1] - bl[1]) ** 2))
    max_height = max(int(height_a), int(height_b))

    dst = np.array([
        [0, 0],
        [max_width - 1, 0],
        [max_width - 1, max_height - 1],
        [0, max_height - 1],
    ], dtype="float32")

    M = cv2.getPerspectiveTransform(rect, dst)
    warped = cv2.warpPerspective(image, M, (max_width, max_height))
    return warped


def _order_points(pts):
    rect = np.zeros((4, 2), dtype="float32")
    s = pts.sum(axis=1)
    rect[0] = pts[np.argmin(s)]
    rect[2] = pts[np.argmax(s)]
    diff = np.diff(pts, axis=1)
    rect[1] = pts[np.argmin(diff)]
    rect[3] = pts[np.argmax(diff)]
    return rect


def remove_shadows(image_path, output_path=None):
    if not HAS_OPENCV:
        raise NotImplementedError("OpenCV is required for shadow removal")

    if output_path is None:
        base, ext = os.path.splitext(image_path)
        output_path = f"{base}_noshadow{ext}"

    img = cv2.imread(image_path)
    rgb_planes = cv2.split(img)

    result_planes = []
    for plane in rgb_planes:
        dilated_img = cv2.dilate(plane, np.ones((7, 7), np.uint8))
        bg_img = cv2.medianBlur(dilated_img, 21)
        diff_img = 255 - cv2.absdiff(plane, bg_img)
        norm_img = cv2.normalize(
            diff_img, None, alpha=0, beta=255, norm_type=cv2.NORM_MINMAX
        )
        result_planes.append(norm_img)

    result = cv2.merge(result_planes)
    cv2.imwrite(output_path, result)
    return output_path
