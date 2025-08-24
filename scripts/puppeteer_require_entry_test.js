const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setBypassCSP(true);
  page.on('console', msg => console.log('PAGE:', msg.type(), msg.text()));
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  const diag = await page.evaluate(() => {
    try {
      const req = window.__webpack_require__ || window.__webpack_require__;
      if (!req) return { ok: false, reason: 'no req' };
      const keys = Object.keys(req.m || {}).slice(0,20);
      let entry;
      try { entry = req('./frontend/js/index.tsx'); } catch (e) { return { ok: false, reason: 'require-failed', err: String(e), keys: keys }; }
      return { ok: true, type: typeof entry, keys: keys, entryKeys: Object.keys(entry || {}) };
    } catch (e) {
      return { ok: false, reason: String(e) };
    }
  });
  console.log('DIAG:', diag);
  await browser.close();
})();
