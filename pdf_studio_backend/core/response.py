from rest_framework.response import Response


def success_response(data=None, message="Success", status_code=200):
    response_data = {
        "error": False,
        "message": message,
    }
    if data is not None:
        response_data["data"] = data
    return Response(response_data, status=status_code)


def error_response(message="Error", errors=None, status_code=400):
    response_data = {
        "error": True,
        "message": message,
    }
    if errors:
        response_data["errors"] = errors
    return Response(response_data, status=status_code)


def paginated_response(paginator, page, serializer_class, many=True):
    serializer = serializer_class(page, many=many)
    return {
        "error": False,
        "count": paginator.count,
        "next": paginator.get_next_link(),
        "previous": paginator.get_previous_link(),
        "results": serializer.data,
    }
