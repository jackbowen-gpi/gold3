Visual QA: SideNav and Theme
=================================

Quick manual checks to verify the SideNav behavior on your dev machine:

- Start the backend and frontend dev servers (docker compose dev or your usual dev flow).
- Open http://localhost:8000 (or the frontend dev server URL) in your browser.
- Verify the left SideNav appears on desktop widths and shows full labels.
- Click the collapse toggle — the nav should shrink to icons only and remain collapsed on reload.
- Click the theme toggle (sun/moon) — the page background and basic components should switch between light and dark palettes.
- On small screens (or by resizing the browser to < 768px) the SideNav is hidden — open the site in a mobile-sized viewport to confirm.

Automated headless smoke test (Puppeteer)
----------------------------------------

There's a puppeteer smoke script at `scripts/puppeteer_smoke.js` that will try a set of candidate URLs and attempt to load the SPA bundles. It collects console logs, requests and response headers and exits non-zero on failures.

Run locally with Node.js:

```bash
# install puppeteer if needed
npm install --no-save puppeteer
node scripts/puppeteer_smoke.js
```

Target a specific URL (e.g., frontend dev server on :3000):

```bash
SMOKE_URL=http://localhost:3000 node scripts/puppeteer_smoke.js
```

Interpretation:
- Exit code 0: the page loaded and no failed requests were observed.
- Exit code 2: there were failed network requests.
- Exit code 3: none of the candidate navigation URLs returned a successful page; check CSP or dev-server availability.

Use this script to validate that the SPA loads and that the SideNav JS and CSS are reachable by the browser.
