from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from .factories import UserFactory


class AuthenticationTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = UserFactory()

    def test_register(self):
        data = {
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "StrongPass123",
            "password_confirm": "StrongPass123",
            "first_name": "New",
            "last_name": "User",
        }
        response = self.client.post("/api/v1/auth/register/", data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("tokens", response.data)
        self.assertIn("user", response.data)

    def test_register_password_mismatch(self):
        data = {
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "StrongPass123",
            "password_confirm": "DifferentPass123",
            "first_name": "New",
            "last_name": "User",
        }
        response = self.client.post("/api/v1/auth/register/", data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login(self):
        data = {
            "email": self.user.email,
            "password": "testpass123",
        }
        response = self.client.post("/api/v1/auth/login/", data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_profile(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get("/api/v1/auth/profile/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], self.user.email)

    def test_change_password(self):
        self.client.force_authenticate(user=self.user)
        data = {
            "old_password": "testpass123",
            "new_password": "NewStrongPass123",
        }
        response = self.client.put("/api/v1/auth/change-password/", data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_unauthorized_profile(self):
        response = self.client.get("/api/v1/auth/profile/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
