(async()=>{
  try {
    const p = require('puppeteer');
    const url = process.env.SMOKE_URL || 'http://localhost:3000';
    const browser = await p.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 5000));
    const html = await page.evaluate(() => document.body.innerHTML);
    console.log(html.slice(0, 4000));
    await browser.close();
  } catch (err) {
    console.error('debug_puppeteer_dump error:');
    console.error(err && err.stack ? err.stack : err);
    process.exit(2);
  }
})();
