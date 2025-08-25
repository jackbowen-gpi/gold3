from django.test import SimpleTestCase
from django.test.utils import override_settings


class DevAssetTokenTest(SimpleTestCase):
    def test_requires_token_when_configured(self):
        with override_settings(DEBUG=True, DEV_HEALTH_TOKEN="s3cr3t"):
            # no token provided -> forbidden
            r = self.client.get("/dev-asset/")
            self.assertEqual(r.status_code, 403)

            # token via header -> ok
            r2 = self.client.get("/dev-asset/", HTTP_X_DEV_HEALTH_TOKEN="s3cr3t")
            self.assertEqual(r2.status_code, 200)

            # token via query param -> ok
            r3 = self.client.get("/dev-asset/?token=s3cr3t")
            self.assertEqual(r3.status_code, 200)

    def test_no_token_required_when_not_configured(self):
        with override_settings(DEBUG=True):
            r = self.client.get("/dev-asset/")
            self.assertEqual(r.status_code, 200)
