const fs = require('fs');
const path = '/app/frontend/webpack_bundles/main.js';
try {
  const s = fs.readFileSync(path, 'utf8');
  const needle = 'createRoot(document.getElementById';
  const idx = s.indexOf(needle);
  console.log('IDX:', idx);
  if (idx === -1) {
    console.error('createRoot not found');
    process.exit(2);
  }
  const before = s.slice(Math.max(0, idx - 1200), idx + 400);
  console.log('---SNIPPET---\n' + before + '\n---END---');
} catch (err) {
  console.error('ERR', err && err.stack || err);
  process.exit(1);
}
