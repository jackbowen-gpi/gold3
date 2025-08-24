// scripts/mock_backend.js
// Very small express server that stubs a few API endpoints used by the frontend smoke tests.
const express = require('express');
const app = express();
const port = process.env.MOCK_BACKEND_PORT || 4000;

app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.get('/api/user', (_req, res) => res.json({ user: { id: 1, name: 'Dev User' } }));
app.post('/api/login', (req, res) => {
  // echo back a fake token
  res.json({ token: 'dev-token', body: req.body });
});

app.listen(port, () => console.log(`mock backend listening on http://localhost:${port}`));
