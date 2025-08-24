const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', 'frontend', 'public');
const port = process.env.PORT || 8081;

function sendFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const map = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.json': 'application/json',
    '.woff2': 'font/woff2'
  };
  const contentType = map[ext] || 'application/octet-stream';
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  try {
    const urlPath = decodeURIComponent(req.url.split('?')[0]);
    let filePath = path.join(root, urlPath);
    if (urlPath === '/' || urlPath === '') filePath = path.join(root, 'index.html');
    // prevent path traversal
    if (!filePath.startsWith(root)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }
    // if directory, try index.html
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
      // If the exact file exists, serve it. Otherwise, for SPA client-side routes
      // (e.g. /login, /some/path) return index.html so the frontend router can handle it.
      if (fs.existsSync(filePath)) {
        sendFile(res, filePath);
      } else {
        // If the request looks like an asset (contains frontend/webpack_bundles), return 404
        if (urlPath.includes('/frontend/webpack_bundles/') || urlPath.includes('.') ) {
          res.writeHead(404);
          res.end('Not found');
          return;
        }
        // Serve SPA index.html as a fallback for client-side routes
        const indexPath = path.join(root, 'index.html');
        if (fs.existsSync(indexPath)) {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(fs.readFileSync(indexPath));
          return;
        }
        res.writeHead(404);
        res.end('Not found');
      }
  } catch (e) {
    res.writeHead(500);
    res.end('Server error');
  }
});

server.listen(port, () => console.log('loader_server listening on', port, 'serving', root));

process.on('SIGINT', () => process.exit(0));
