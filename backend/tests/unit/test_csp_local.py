from importlib import import_module, reload
import os

from django.test import SimpleTestCase


class CSPLocalSettingsTest(SimpleTestCase):
    """Verify the dev CSP opt-in behavior in local settings."""

    def setUp(self):
        # Ensure clean env for each test
        os.environ.pop("ALLOW_DEV_CSP_HOST", None)
        # reload base so CSP_* are in their original state, then reload local_base
        base = import_module("gold3.settings.base")
        reload(base)
        local_base = import_module("gold3.settings.local_base")
        reload(local_base)

    def test_csp_not_allowed_by_default(self):
        """When ALLOW_DEV_CSP_HOST is not set the dev host should not be in CSP lists."""
        local_base = import_module("gold3.settings.local_base")

        dev_host = getattr(local_base, "LOCAL_HOST_URL", None)
        self.assertIsNotNone(dev_host)

        # Assert dev host is not present when env var is unset
        self.assertNotIn(dev_host, local_base.CSP_SCRIPT_SRC)
        self.assertNotIn(dev_host, local_base.CSP_CONNECT_SRC)
        self.assertNotIn(dev_host, local_base.CSP_FONT_SRC)
        self.assertNotIn(dev_host, local_base.CSP_IMG_SRC)
        self.assertNotIn(dev_host, local_base.CSP_STYLE_SRC)

    def test_csp_allowed_when_env_set(self):
        """When ALLOW_DEV_CSP_HOST is truthy, the dev host should be added to CSP lists."""
        os.environ["ALLOW_DEV_CSP_HOST"] = "1"
        base = import_module("gold3.settings.base")
        reload(base)
        local_base = import_module("gold3.settings.local_base")
        reload(local_base)

        dev_host = getattr(local_base, "LOCAL_HOST_URL", None)
        self.assertIsNotNone(dev_host)

        # Assert dev host is present when env var is set
        self.assertIn(dev_host, local_base.CSP_SCRIPT_SRC)
        self.assertIn(dev_host, local_base.CSP_CONNECT_SRC)
        self.assertIn(dev_host, local_base.CSP_FONT_SRC)
        self.assertIn(dev_host, local_base.CSP_IMG_SRC)
        self.assertIn(dev_host, local_base.CSP_STYLE_SRC)
