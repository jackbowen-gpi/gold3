// scripts/check_workspace_ts.js
// Verifies workspace TypeScript is installed and prints its version.
try {
  const ts = require('typescript');
  console.log('workspace typescript:', ts.version);
  process.exit(0);
} catch (e) {
  console.error('workspace typescript not found. Run npm install --save-dev typescript');
  process.exit(2);
}
