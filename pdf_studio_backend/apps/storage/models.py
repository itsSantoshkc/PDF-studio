import os
import uuid
from django.conf import settings
from django.db import models


class FileAsset(models.Model):
    class StorageType(models.TextChoices):
        LOCAL = "local", "Local"
        S3 = "s3", "Amazon S3"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="file_assets",
    )
    file = models.FileField(upload_to="assets/%Y/%m/%d/")
    original_name = models.CharField(max_length=255)
    file_size = models.PositiveBigIntegerField(default=0)
    content_type = models.CharField(max_length=100, blank=True, default="")
    storage_type = models.CharField(
        max_length=10,
        choices=StorageType.choices,
        default=StorageType.LOCAL,
    )
    is_public = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.original_name

    def save(self, *args, **kwargs):
        if not self.original_name and self.file:
            self.original_name = os.path.basename(self.file.name)
        if not self.file_size and self.file:
            self.file_size = self.file.size
        super().save(*args, **kwargs)
