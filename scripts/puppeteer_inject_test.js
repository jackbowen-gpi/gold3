const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setBypassCSP(true);
  // expose console
  page.on('console', msg => console.log('PAGE:', msg.type(), msg.text()));
  await page.goto('about:blank');
  // add an inline marker
  await page.evaluate(() => { window.__INJECT_TEST__ = 'before'; });
  // create script element pointing to bundle
  const res = await page.evaluate(async () => {
    return await new Promise((res) => {
      const s = document.createElement('script');
      s.src = '/frontend/webpack_bundles/main.js';
      s.onload = () => { res({ loaded: true, err: null }); };
      s.onerror = (e) => { res({ loaded: false, err: String(e) }); };
      document.body.appendChild(s);
    });
  });
  console.log('script load result:', res);
  const diag = await page.evaluate(() => ({
    inline: window.__INLINE_MARKER__ || null,
    entryGlobal: window.__FRONTEND_ENTRY__ || null,
    puppeteerEval: window.__PUPPETEER_EVAL__ || null,
    injectTest: window.__INJECT_TEST__ || null,
    hasSidenav: !!document.querySelector('aside.sidenav')
  }));
  console.log('diag:', diag);
  await browser.close();
})();
