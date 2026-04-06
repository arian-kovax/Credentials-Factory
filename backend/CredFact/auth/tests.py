from django.contrib.auth import get_user_model
from django.core import mail
from django.test import TestCase
from rest_framework.test import APIClient

from .models import PasswordResetCode

User = get_user_model()


class PasswordResetFlowTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='janedoe',
            email='jane@example.com',
            phone='1234567890',
            department='IT',
            access_level='Student',
            password='InitialPass@123',
        )

    def test_user_can_request_verify_and_reset_password(self):
        request_response = self.client.post(
            '/api/password-reset/request/',
            {
                'username': 'janedoe',
                'email': 'jane@example.com',
            },
            format='json',
        )
        self.assertEqual(request_response.status_code, 200)
        self.assertEqual(len(mail.outbox), 1)

        code = PasswordResetCode.objects.get(user=self.user).code

        verify_response = self.client.post(
            '/api/password-reset/verify-code/',
            {
                'username': 'janedoe',
                'email': 'jane@example.com',
                'code': code,
            },
            format='json',
        )
        self.assertEqual(verify_response.status_code, 200)

        confirm_response = self.client.post(
            '/api/password-reset/confirm/',
            {
                'username': 'janedoe',
                'email': 'jane@example.com',
                'code': code,
                'newPassword': 'UpdatedPass@123',
                'confirmPassword': 'UpdatedPass@123',
            },
            format='json',
        )
        self.assertEqual(confirm_response.status_code, 200)

        login_response = self.client.post(
            '/api/token/',
            {
                'username': 'janedoe',
                'password': 'UpdatedPass@123',
            },
            format='json',
        )
        self.assertEqual(login_response.status_code, 200)


class SignupValidationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        User.objects.create_user(
            username='existinguser',
            email='existing@example.com',
            phone='1234567890',
            department='IT',
            access_level='Student',
            password='InitialPass@123',
        )

    def test_email_validation_rejects_existing_email(self):
        response = self.client.post(
            '/api/register/validate-identity/',
            {
                'username': 'newuser',
                'email': 'existing@example.com',
            },
            format='json',
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.json()['email'][0],
            'A user with that email already exists.',
        )

    def test_email_validation_accepts_new_email(self):
        response = self.client.post(
            '/api/register/validate-identity/',
            {
                'username': 'newuser',
                'email': 'new@example.com',
            },
            format='json',
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['detail'], 'Signup details are available.')

    def test_email_validation_rejects_existing_username(self):
        response = self.client.post(
            '/api/register/validate-identity/',
            {
                'username': 'existinguser',
                'email': 'new@example.com',
            },
            format='json',
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.json()['username'][0],
            'A user with that username already exists.',
        )
