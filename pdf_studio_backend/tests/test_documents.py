from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from io import BytesIO
from django.core.files.uploadedfile import SimpleUploadedFile
from .factories import UserFactory, DocumentFactory


class DocumentTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = UserFactory()
        self.client.force_authenticate(user=self.user)

    def test_create_document(self):
        pdf_content = b"%PDF-1.4 fake content"
        file = SimpleUploadedFile("test.pdf", pdf_content, content_type="application/pdf")
        data = {
            "title": "Test Document",
            "description": "A test document",
            "original_file": file,
        }
        response = self.client.post("/api/v1/documents/", data, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_list_documents(self):
        DocumentFactory(owner=self.user)
        DocumentFactory(owner=self.user)
        response = self.client.get("/api/v1/documents/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 2)

    def test_get_document(self):
        document = DocumentFactory(owner=self.user)
        response = self.client.get(f"/api/v1/documents/{document.id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], document.title)

    def test_update_document(self):
        document = DocumentFactory(owner=self.user)
        data = {"title": "Updated Title"}
        response = self.client.patch(f"/api/v1/documents/{document.id}/", data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], "Updated Title")

    def test_delete_document(self):
        document = DocumentFactory(owner=self.user)
        response = self.client.delete(f"/api/v1/documents/{document.id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_duplicate_document(self):
        document = DocumentFactory(owner=self.user)
        response = self.client.post(f"/api/v1/documents/{document.id}/duplicate/")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["title"], f"{document.title} (Copy)")

    def test_shared_documents(self):
        other_user = UserFactory()
        DocumentFactory(owner=other_user, is_public=True)
        DocumentFactory(owner=other_user, is_public=False)
        response = self.client.get("/api/v1/documents/shared/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)

    def test_filter_by_status(self):
        DocumentFactory(owner=self.user, status="draft")
        DocumentFactory(owner=self.user, status="ready")
        response = self.client.get("/api/v1/documents/?status=draft")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)
