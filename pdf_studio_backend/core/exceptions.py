from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None:
        error_data = {
            "error": True,
            "status_code": response.status_code,
        }

        if isinstance(response.data, dict):
            error_data["detail"] = response.data
        elif isinstance(response.data, list):
            error_data["detail"] = response.data
        else:
            error_data["detail"] = str(response.data)

        response.data = error_data
    else:
        response = Response(
            {
                "error": True,
                "status_code": 500,
                "detail": "Internal server error",
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    return response


class AppException(Exception):
    def __init__(self, detail, code=None, status_code=None):
        self.detail = detail
        self.code = code or "error"
        self.status_code = status_code or status.HTTP_400_BAD_REQUEST
        super().__init__(detail)


class NotFoundException(AppException):
    def __init__(self, detail="Resource not found"):
        super().__init__(
            detail=detail,
            code="not_found",
            status_code=status.HTTP_404_NOT_FOUND,
        )


class PermissionDeniedException(AppException):
    def __init__(self, detail="Permission denied"):
        super().__init__(
            detail=detail,
            code="permission_denied",
            status_code=status.HTTP_403_FORBIDDEN,
        )


class ValidationException(AppException):
    def __init__(self, detail="Validation error"):
        super().__init__(
            detail=detail,
            code="validation_error",
            status_code=status.HTTP_400_BAD_REQUEST,
        )
