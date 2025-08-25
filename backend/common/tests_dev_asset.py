import json
import os
import tempfile

from django.test import SimpleTestCase
from django.test.utils import override_settings


class DevAssetEndpointTest(SimpleTestCase):
    def test_returns_manifest_asset_when_stats_file_present(self):
        # create a temporary webpack-stats.json with a known asset
        stats = {
            "assets": {
                "logo.png": {
                    "publicPath": "/static/frontend/webpack_bundles/logo.png",
                    "name": "logo.png",
                }
            },
            "publicPath": "/static/",
        }

        fd, path = tempfile.mkstemp(suffix=".json")
        try:
            with os.fdopen(fd, "w", encoding="utf-8") as fh:
                json.dump(stats, fh)
                fh.flush()

            # Ensure DEBUG and point WEBPACK_STATS_FILE to our temp file
            with override_settings(DEBUG=True, WEBPACK_STATS_FILE=path):
                response = self.client.get("/dev-asset/")
                self.assertEqual(response.status_code, 200)
                data = response.json()
                # Should return the manifest-selected asset
                self.assertIn("asset", data)
                self.assertEqual(data["asset"], "/static/frontend/webpack_bundles/logo.png")
        finally:
            try:
                os.unlink(path)
            except Exception:
                pass

    def test_returns_null_when_no_stats_file(self):
        # If WEBPACK_STATS_FILE not set or missing, asset should be null
        with override_settings(DEBUG=True, WEBPACK_STATS_FILE="/nonexistent/stats.json"):
            response = self.client.get("/dev-asset/")
            self.assertEqual(response.status_code, 200)
            data = response.json()
            self.assertIn("asset", data)
            self.assertIsNone(data["asset"])
