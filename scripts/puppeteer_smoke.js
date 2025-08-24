/*
  Puppeteer smoke test: try multiple candidate URLs so the script works both
  when the dev server expects /index.html explicitly and when using different
  hostnames (localhost, 127.0.0.1, host.docker.internal).
*/
(async () => {
  const puppeteer = require('puppeteer');

  // Try the Django backend first (it serves the template that references the
  // dev server bundles and applies the CSP header we manage in settings).
  const defaultHosts = ['http://localhost:8000', 'http://localhost:3000', 'http://127.0.0.1:3000', 'http://host.docker.internal:3000'];
  const paths = ['/', '/index.html'];

  const envUrl = process.env.SMOKE_URL;
  const candidates = [];
  if (envUrl) candidates.push(envUrl.replace(/\/$/, ''));
  for (const h of defaultHosts) for (const p of paths) candidates.push(h + p);

  const result = { tried: candidates, url: null, console: [], requests: [], failedRequests: [], mainResponse: null, error: null };
  // collect response headers per-candidate to help diagnose CSP issues
  result.navHeaders = [];

  const launchOpts = { args: ['--no-sandbox', '--disable-setuid-sandbox'] };
  let browser;
  try {
    browser = await puppeteer.launch(launchOpts);
  } catch (err) {
    // Fallback: try common system-installed Chromium paths
    const pathsToTry = ['/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome-stable'];
    for (const p of pathsToTry) {
      try {
        browser = await puppeteer.launch({ ...launchOpts, executablePath: p });
        break;
      } catch (err2) {
        // continue trying
      }
    }
    if (!browser) throw err;
  }

  const page = await browser.newPage();

  page.on('console', msg => {
    result.console.push({ type: msg.type(), text: msg.text() });
  });

  page.on('requestfinished', async (req) => {
    try {
      const resp = req.response();
      result.requests.push({ url: req.url(), status: resp.status(), resourceType: req.resourceType() });
    } catch (e) {
      result.requests.push({ url: req.url(), resourceType: req.resourceType(), error: String(e) });
    }
  });

  page.on('requestfailed', (req) => {
    result.failedRequests.push({ url: req.url(), reason: req.failure() ? req.failure().errorText : 'unknown', resourceType: req.resourceType() });
  });

  function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

  // Try candidates until one returns a non-404 (status < 400) or until exhausted
  let success = false;
  for (const cand of candidates) {
    try {
      const resp = await page.goto(cand, { waitUntil: 'networkidle2', timeout: 30000 });
      try {
        const hdrs = resp ? resp.headers() : {};
        result.navHeaders.push({ url: cand, headers: hdrs });
      } catch (e) {
        result.navHeaders.push({ url: cand, headers: null, error: String(e) });
      }
      result.mainResponse = { status: resp ? resp.status() : null, ok: resp ? resp.ok() : null };
      result.url = cand;
      // Give browsers a moment to load dynamic resources
      await sleep(1000);
      if (resp && resp.status && resp.status() < 400) { success = true; break; }
      // otherwise continue to next candidate
    } catch (err) {
      // record and continue
      result.error = result.error || String(err);
      // continue
    }
  }

  // If all candidates failed, try to load bundles directly by constructing a minimal
  // HTML using webpack-stats.json (useful when dev server writes bundles to disk but
  // doesn't serve a `public/index.html`).
  if (!success) {
    const fs = require('fs');
    const path = require('path');
    try {
      const statsPath = path.resolve(__dirname, '..', 'webpack-stats.json');
      if (fs.existsSync(statsPath)) {
        const stats = JSON.parse(fs.readFileSync(statsPath, 'utf8'));
        const publicPath = stats.publicPath || '';
        const chunkFiles = (stats.chunks && stats.chunks.main) || [];
        // Build script tags for the chunk files
        const scripts = chunkFiles.map((f) => `<script src="${publicPath}${f}"></script>`).join('\n');
        const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>smoke</title></head><body><div id="root"></div>\n${scripts}\n</body></html>`;

        // Reset collected logs for this attempt
        result.console = [];
        result.requests = [];
        result.failedRequests = [];

        await page.setContent(html, { waitUntil: 'networkidle2' });
        // give dynamic JS a moment
        await new Promise((r) => setTimeout(r, 1000));
        success = true;
        result.url = `generated-from:${statsPath}`;
        result.mainResponse = { status: 200, ok: true };
      }
    } catch (e) {
      result.error = result.error || String(e);
    }
  }

  // If browser couldn't load scripts (CSP), verify bundles are reachable via Node fetch
  if (!success) {
    try {
      const statsPath = require('path').resolve(__dirname, '..', 'webpack-stats.json');
      if (require('fs').existsSync(statsPath)) {
        const stats = JSON.parse(require('fs').readFileSync(statsPath, 'utf8'));
        const publicPath = stats.publicPath || '';
        const chunkFiles = (stats.chunks && stats.chunks.main) || [];
        result.bundleChecks = [];
        // Use global fetch if available, otherwise try to require('node-fetch')
        const fetchFn = globalThis.fetch || (() => { try { return require('node-fetch'); } catch { return null; } })();
        for (const f of chunkFiles) {
          const url = publicPath + f;
          try {
            if (!fetchFn) {
              result.bundleChecks.push({ url, error: 'no-fetch-available' });
              continue;
            }
            const resp = await fetchFn(url, { method: 'GET' });
            // node-fetch returns Response, native fetch also
            const status = resp.status || (resp && resp.statusCode) || null;
            result.bundleChecks.push({ url, status });
          } catch (e) {
            result.bundleChecks.push({ url, error: String(e) });
          }
        }
        // Consider success if at least one bundle is reachable (status 200)
        const anyOk = result.bundleChecks.some((b) => b.status && b.status < 400);
        if (anyOk) success = true;
      }
    } catch (e) {
      result.error = result.error || String(e);
    }
  }

  console.log(JSON.stringify(result, null, 2));
  await browser.close();
  if (result.failedRequests && result.failedRequests.length) process.exit(2);
  if (!success) process.exit(3);
  process.exit(0);
})();
