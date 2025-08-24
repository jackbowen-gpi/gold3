const puppeteer = require('puppeteer');

async function run() {
  const url = process.env.SMOKE_URL || 'http://localhost:8000';
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });

  // Wait for the sidenav to be present
  await page.waitForSelector('aside.sidenav', { timeout: 5000 });

  // Click the collapse toggle (button with aria-label Toggle navigation)
  const toggle = await page.$('button[aria-label="Toggle navigation"]');
  if (toggle) {
    await toggle.click();
    await page.waitForTimeout(300);
  }

  // Check collapsed state by checking class on sidenav
  const collapsed = await page.evaluate(() => {
    const nav = document.querySelector('aside.sidenav');
    return nav ? nav.classList.contains('sidenav--collapsed') : null;
  });

  // Toggle theme via button with aria-label Toggle theme
  const themeBtn = await page.$('button[aria-label="Toggle theme"]');
  if (themeBtn) {
    await themeBtn.click();
    await page.waitForTimeout(300);
  }

  const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));

  console.log({ url, collapsed, theme });
  await browser.close();
  if (theme === null) process.exit(2);
  process.exit(0);
}

run().catch((err) => { console.error(err); process.exit(3); });
