from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    email = models.EmailField(unique=True)
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)
    storage_used = models.PositiveBigIntegerField(default=0)
    storage_limit = models.PositiveBigIntegerField(default=524288000)  # 500MB
    is_premium = models.BooleanField(default=False)

    class Meta:
        ordering = ["-date_joined"]

    def __str__(self):
        return self.email

    @property
    def storage_used_mb(self):
        return round(self.storage_used / (1024 * 1024), 2)

    @property
    def storage_limit_mb(self):
        return round(self.storage_limit / (1024 * 1024), 2)

    @property
    def storage_percentage(self):
        if self.storage_limit == 0:
            return 0
        return round((self.storage_used / self.storage_limit) * 100, 2)
