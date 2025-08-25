import React, { useEffect, useState } from 'react';

type Check = {
  name: string;
  ok: boolean | null;
  info?: string;
};

const DevHealth: React.FC = () => {
  const [checks, setChecks] = useState<Check[]>([
    { name: 'Backend /api/health', ok: null },
    { name: 'Frontend static asset', ok: null },
    { name: 'API POST /api/login (CSRF/auth smoke)', ok: null },
  ]);

  useEffect(() => {
    const run = async () => {
      // Backend health
      try {
        const res = await fetch('/api/health');
        const ok = res.ok;
        const text = await res.text().catch(() => 'no-body');
        setChecks(prev => prev.map(c => c.name === 'Backend /api/health' ? { ...c, ok, info: `${res.status} ${text}` } : c));
      } catch (e: any) {
        setChecks(prev => prev.map(c => c.name === 'Backend /api/health' ? { ...c, ok: false, info: String(e) } : c));
      }

      // Frontend static asset
      try {
        // choose a small known static file in public built bundles
        const staticPath = '/frontend/webpack_bundles/4c677b78d12c96ea7add.png';
        const res = await fetch(staticPath, { cache: 'no-store' });
        setChecks(prev => prev.map(c => c.name === 'Frontend static asset' ? { ...c, ok: res.ok, info: `${res.status} ${staticPath}` } : c));
      } catch (e: any) {
        setChecks(prev => prev.map(c => c.name === 'Frontend static asset' ? { ...c, ok: false, info: String(e) } : c));
      }

      // API POST (non-destructive) to verify basic request pipeline
      try {
        const res = await fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: 'smoke', password: 'smoke' }) });
        setChecks(prev => prev.map(c => c.name === 'API POST /api/login (CSRF/auth smoke)' ? { ...c, ok: res.ok || res.status === 401, info: `${res.status}` } : c));
      } catch (e: any) {
        setChecks(prev => prev.map(c => c.name === 'API POST /api/login (CSRF/auth smoke)' ? { ...c, ok: false, info: String(e) } : c));
      }
    };

    run();
  }, []);

  return (
    <main style={{ padding: 24 }}>
      <h1>Developer Health</h1>
      <p>This page runs a set of quick smoke checks to verify frontend and backend availability.</p>
      <ul>
        {checks.map((c) => (
          <li key={c.name}>
            <strong>{c.name}:</strong> {c.ok === null ? 'checking…' : c.ok ? 'OK' : 'FAIL'} {c.info ? `— ${c.info}` : ''}
          </li>
        ))}
      </ul>
    </main>
  );
};

export default DevHealth;
