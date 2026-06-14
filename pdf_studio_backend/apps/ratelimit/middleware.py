import time
import json
import logging
from django.conf import settings
from django.core.cache import cache

logger = logging.getLogger(__name__)


class RateLimitMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.rate_limit = getattr(settings, "RATE_LIMIT_REQUESTS", 100)
        self.window = getattr(settings, "RATE_LIMIT_WINDOW", 60)

    def __call__(self, request):
        if not self._should_rate_limit(request):
            return self.get_response(request)

        client_ip = self._get_client_ip(request)
        key = f"ratelimit:{client_ip}"

        try:
            current_time = time.time()
            window_start = current_time - self.window

            pipe = cache.client.get_client().pipeline()
            pipe.zremrangebyscore(key, 0, window_start)
            pipe.zadd(key, {str(current_time): current_time})
            pipe.zcard(key)
            pipe.expire(key, self.window)
            results = pipe.execute()

            request_count = results[2]

            if request_count > self.rate_limit:
                from django.http import JsonResponse

                return JsonResponse(
                    {
                        "error": "Rate limit exceeded",
                        "detail": f"Too many requests. Limit: {self.rate_limit} per {self.window} seconds",
                        "retry_after": self.window,
                    },
                    status=429,
                )

            response = self.get_response(request)
            response["X-RateLimit-Limit"] = str(self.rate_limit)
            response["X-RateLimit-Remaining"] = str(
                max(0, self.rate_limit - request_count)
            )
            response["X-RateLimit-Reset"] = str(int(current_time + self.window))

            return response

        except Exception as e:
            logger.exception("Rate limit check failed")
            return self.get_response(request)

    def _should_rate_limit(self, request):
        if request.path.startswith("/admin/"):
            return False
        if request.path.startswith("/api/schema/"):
            return False
        return request.path.startswith("/api/")

    def _get_client_ip(self, request):
        x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
        if x_forwarded_for:
            return x_forwarded_for.split(",")[0].strip()
        return request.META.get("REMOTE_ADDR", "0.0.0.0")
