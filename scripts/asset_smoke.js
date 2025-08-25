#!/usr/bin/env node
// Simple smoke script to probe /dev-asset/ and the returned asset URL.
// Usage: node scripts/asset_smoke.js [baseUrl]

const http = require('http');
const https = require('https');
const url = require('url');

const base = process.argv[2] || 'http://localhost:8000';

function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }

async function fetchJson(path, attempts = 5) {
  const u = new URL(path, base);
  for (let i=0;i<attempts;i++){
    try {
      const client = u.protocol === 'https:' ? https : http;
      const res = await new Promise((resolve, reject) => {
        const req = client.get(u.href, { timeout: 5000 }, (res) => resolve(res));
        req.on('error', reject);
        req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
      });
      const body = await new Promise((resolve) => {
        let data=''; res.setEncoding('utf8'); res.on('data', c=>data+=c); res.on('end', ()=>resolve(data));
      });
      return { status: res.statusCode, body: JSON.parse(body) };
    } catch (e) {
      if (i === attempts-1) throw e;
      await sleep(500 * (i+1));
    }
  }
}

async function headUrl(u, attempts = 5){
  for (let i=0;i<attempts;i++){
    try{
      const client = u.protocol === 'https:' ? https : http;
      const res = await new Promise((resolve, reject)=>{
        const req = client.request(u.href, { method: 'HEAD', timeout: 5000 }, (res) => resolve(res));
        req.on('error', reject);
        req.on('timeout', ()=>{ req.destroy(); reject(new Error('timeout')); });
        req.end();
      });
      return { status: res.statusCode, headers: res.headers };
    }catch(e){
      if (i === attempts-1) throw e;
      await sleep(500 * (i+1));
    }
  }
}

(async function main(){
  try {
    console.log('Fetching /dev-asset/ from', base);
    const j = await fetchJson('/dev-asset/');
    if (j.status !== 200) { console.error('dev-asset returned', j.status); process.exit(2); }
    const asset = j.body && j.body.asset;
    if (!asset) { console.error('No asset returned by /dev-asset/'); process.exit(3); }
    console.log('Asset URL:', asset);
    const parsed = new URL(asset, base);
    const head = await headUrl(parsed);
    console.log('Asset HEAD status:', head.status);
    const ctype = head.headers['content-type'] || '';
    const clen = head.headers['content-length'] ? parseInt(head.headers['content-length'], 10) : null;
    if (!(ctype.startsWith('image/') || ctype.startsWith('text/') || ctype.includes('javascript') || ctype.includes('css'))) {
      console.error('Unexpected content-type:', ctype);
      process.exit(4);
    }
    if (clen !== null && clen < 50) {
      console.error('Asset too small:', clen);
      process.exit(5);
    }
    console.log('Asset appears healthy:', { contentType: ctype, contentLength: clen });
    process.exit(0);
  } catch (e) {
    console.error('Error during smoke check:', e && e.message ? e.message : e);
    process.exit(1);
  }
})();
