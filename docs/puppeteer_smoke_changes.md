# Puppeteer smoke test changes

Summary of edits made to add a headless Puppeteer smoke test for the SideNav collapse + theme toggle.

Files added
- `.github/workflows/smoke.yml` — GitHub Actions workflow that builds the frontend and runs the smoke script.
- `scripts/ci_smoke_run.sh` — CI helper to install Chromium, start the loader server, and run the Puppeteer script.

Files changed
- `scripts/puppeteer_sidenav_test.js` — Main Puppeteer smoke test. Key changes:
  - Request interception: rewrite `/frontend/webpack_bundles/*` requests to the loader origin; rewrite localhost:3000 requests.
  - Asset stub: respond with 1x1 PNG for missing image/font assets to avoid client-side 404 crashes during tests.
  - Robustness: flexible Chromium executable handling (use `CHROME_BIN` when set), programmatic login is non-fatal if backend unreachable, localStorage fallbacks when reading collapsed/theme state.
  - Improved lifecycle handling: immediate exit after logging JSON result to avoid late frame-detached errors flipping exit code, handlers for unhandledRejection/uncaughtException for diagnostics.

- `scripts/loader_server.js` — small static server used to serve `frontend/public` during smoke tests (SPA fallback; returns 404 for missing bundle assets).

Why these changes
- The production frontend bundle referenced absolute asset/host paths and sometimes caused 404s and client navigation that broke deterministic smoke tests. The loader + request rewriting/stubbing allows the test to exercise the production bundle in a reproducible way.

How to run locally
- Start loader server:
  - `node scripts/loader_server.js`
- Run smoke test (PowerShell):
  - `$env:SMOKE_URL='http://localhost:8081/puppeteer_prod_loader.html'; $env:SMOKE_BACKEND_URL='http://backend:8000'; node .\scripts\puppeteer_sidenav_test.js`

CI
- The workflow `.github/workflows/smoke.yml` runs on pushes to `main` and on manual dispatch. It builds the frontend and runs `scripts/ci_smoke_run.sh`.

Notes
- The smoke test intentionally stubs some API responses and assets to avoid flakes; if you prefer stricter validation, update `scripts/puppeteer_sidenav_test.js` and `scripts/loader_server.js` to provide full mocks and assets.
