const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(process.env.URL || 'http://localhost:3000', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'scripts/screenshot.png', fullPage: true });
  console.log('Screenshot saved to scripts/screenshot.png');
  await browser.close();
})();
