import time
import functools
from django.core.cache import cache
from django.http import JsonResponse


def rate_limit(requests=100, window=60, key_func=None):
    def decorator(view_func):
        @functools.wraps(view_func)
        def wrapper(request, *args, **kwargs):
            if key_func:
                cache_key = key_func(request)
            else:
                client_ip = _get_client_ip(request)
                cache_key = f"ratelimit:{view_func.__name__}:{client_ip}"

            try:
                current_time = time.time()
                window_start = current_time - window

                pipe = cache.client.get_client().pipeline()
                pipe.zremrangebyscore(cache_key, 0, window_start)
                pipe.zadd(cache_key, {str(current_time): current_time})
                pipe.zcard(cache_key)
                pipe.expire(cache_key, window)
                results = pipe.execute()

                request_count = results[2]

                if request_count > requests:
                    return JsonResponse(
                        {
                            "error": "Rate limit exceeded",
                            "detail": f"Too many requests. Limit: {requests} per {window} seconds",
                            "retry_after": window,
                        },
                        status=429,
                    )

                response = view_func(request, *args, **kwargs)
                response["X-RateLimit-Limit"] = str(requests)
                response["X-RateLimit-Remaining"] = str(
                    max(0, requests - request_count)
                )
                response["X-RateLimit-Reset"] = str(int(current_time + window))

                return response

            except Exception:
                return view_func(request, *args, **kwargs)

        return wrapper
    return decorator


def _get_client_ip(request):
    x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if x_forwarded_for:
        return x_forwarded_for.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR", "0.0.0.0")
