import os
import logging
from abc import ABC, abstractmethod

from django.conf import settings

logger = logging.getLogger(__name__)


class StorageBackend(ABC):
    @abstractmethod
    def upload(self, file, path):
        pass

    @abstractmethod
    def download(self, path):
        pass

    @abstractmethod
    def delete(self, path):
        pass

    @abstractmethod
    def get_url(self, path, expires=3600):
        pass

    @abstractmethod
    def exists(self, path):
        pass


class LocalStorageBackend(StorageBackend):
    def __init__(self):
        self.base_path = settings.MEDIA_ROOT

    def upload(self, file, path):
        full_path = os.path.join(self.base_path, path)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)

        with open(full_path, "wb+") as destination:
            for chunk in file.chunks():
                destination.write(chunk)
        return path

    def download(self, path):
        full_path = os.path.join(self.base_path, path)
        if os.path.exists(full_path):
            return open(full_path, "rb")
        raise FileNotFoundError(f"File not found: {path}")

    def delete(self, path):
        full_path = os.path.join(self.base_path, path)
        if os.path.exists(full_path):
            os.remove(full_path)
            return True
        return False

    def get_url(self, path, expires=3600):
        return os.path.join(settings.MEDIA_URL, path)

    def exists(self, path):
        full_path = os.path.join(self.base_path, path)
        return os.path.exists(full_path)


class S3StorageBackend(StorageBackend):
    def __init__(self):
        try:
            import boto3

            self.client = boto3.client(
                "s3",
                aws_access_key_id=os.environ.get("AWS_ACCESS_KEY_ID"),
                aws_secret_access_key=os.environ.get("AWS_SECRET_ACCESS_KEY"),
                region_name=os.environ.get("AWS_REGION", "us-east-1"),
            )
            self.bucket = os.environ.get("AWS_STORAGE_BUCKET_NAME", "")
        except ImportError:
            logger.error("boto3 is required for S3 storage")
            raise

    def upload(self, file, path):
        self.client.upload_fileobj(file, self.bucket, path)
        return path

    def download(self, path):
        from io import BytesIO

        buffer = BytesIO()
        self.client.download_fileobj(self.bucket, path, buffer)
        buffer.seek(0)
        return buffer

    def delete(self, path):
        try:
            self.client.delete_object(Bucket=self.bucket, Key=path)
            return True
        except Exception as e:
            logger.exception(f"Error deleting {path} from S3")
            return False

    def get_url(self, path, expires=3600):
        return self.client.generate_presigned_url(
            "get_object",
            Params={"Bucket": self.bucket, "Key": path},
            ExpiresIn=expires,
        )

    def exists(self, path):
        try:
            self.client.head_object(Bucket=self.bucket, Key=path)
            return True
        except Exception:
            return False


def get_storage_backend():
    backend_type = os.environ.get("STORAGE_BACKEND", "local")

    if backend_type == "s3":
        return S3StorageBackend()
    return LocalStorageBackend()
