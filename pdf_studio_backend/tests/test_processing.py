from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from unittest.mock import patch, MagicMock
from .factories import UserFactory, DocumentFactory, PageFactory


class ProcessingTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = UserFactory()
        self.client.force_authenticate(user=self.user)

    @patch("apps.processing.tasks.process_pdf_document.delay")
    def test_process_document(self, mock_task):
        mock_task.return_value = MagicMock(id="test-task-id")
        document = DocumentFactory(owner=self.user)
        data = {"document_id": str(document.id)}
        response = self.client.post("/api/v1/processing/process_document/", data)
        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)
        self.assertIn("task_id", response.data)

    @patch("apps.processing.tasks.run_ocr_on_page.delay")
    def test_run_ocr(self, mock_task):
        mock_task.return_value = MagicMock(id="test-task-id")
        page = PageFactory(document__owner=self.user)
        data = {"page_id": str(page.id)}
        response = self.client.post("/api/v1/processing/run_ocr/", data)
        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)

    @patch("apps.processing.tasks.enhance_image.delay")
    def test_enhance(self, mock_task):
        mock_task.return_value = MagicMock(id="test-task-id")
        page = PageFactory(document__owner=self.user)
        data = {"page_id": str(page.id)}
        response = self.client.post("/api/v1/processing/enhance/", data)
        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)

    @patch("apps.processing.tasks.dewarp_page.delay")
    def test_dewarp(self, mock_task):
        mock_task.return_value = MagicMock(id="test-task-id")
        page = PageFactory(document__owner=self.user)
        data = {"page_id": str(page.id)}
        response = self.client.post("/api/v1/processing/dewarp/", data)
        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)

    def test_task_status(self):
        response = self.client.get("/api/v1/processing/task_status/?task_id=invalid-id")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_process_nonexistent_document(self):
        from uuid import uuid4
        data = {"document_id": str(uuid4())}
        response = self.client.post("/api/v1/processing/process_document/", data)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
