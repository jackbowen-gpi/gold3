from django.test import TestCase, Client
import json
from users.models import User


class LoginFlowTestCase(TestCase):
    def setUp(self):
        self.email = "test@example.com"
        self.password = "password"
        User.objects.create_user(email=self.email, password=self.password)
        self.client = Client()

    def test_login_sets_session_and_me_returns_user(self):
        # Get CSRF token by GETting the SPA login page
        resp = self.client.get('/login/')
        self.assertEqual(resp.status_code, 200)
        # POST login to API endpoint
        login_url = '/api/v1/auth/login/'
        payload = json.dumps({"email": self.email, "password": self.password})
        resp = self.client.post(login_url, payload, content_type='application/json')
        self.assertEqual(resp.status_code, 200)
        # Ensure session was created in the test client session
        self.assertTrue(self.client.session.session_key)
        # Use client (with session) to call me endpoint
        me_url = '/api/v1/auth/me/'
        resp = self.client.get(me_url)
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data.get('email'), self.email)
