(async () => {
  const puppeteer = require('puppeteer');
  const url = process.env.SMOKE_URL || 'http://host.docker.internal:3000/';
  const result = { url, console: [], requests: [], failedRequests: [] };

  const launchOpts = { args: ['--no-sandbox', '--disable-setuid-sandbox'] };
  let browser;
  try {
    browser = await puppeteer.launch(launchOpts);
  } catch (err) {
    // Fallback: try common system-installed Chromium paths
    const paths = ['/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome-stable'];
    for (const p of paths) {
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

  try {
    const resp = await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    result.mainResponse = { status: resp ? resp.status() : null, ok: resp ? resp.ok() : null };
    // Give browsers a moment to load dynamic resources
    await sleep(1000);
  } catch (err) {
    result.error = String(err);
  }

  console.log(JSON.stringify(result, null, 2));
  await browser.close();
  if (result.failedRequests.length) process.exit(2);
  if (result.error) process.exit(3);
  process.exit(0);
})();
