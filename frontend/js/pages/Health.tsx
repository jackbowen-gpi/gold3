import React from 'react';

const Health: React.FC = () => (
  <main style={{ padding: 24 }}>
    <h1>System Health</h1>
    <p>This page displays a basic health status for the backend.</p>
    <p>Backend health is available at <code>/api/health</code>.</p>
  </main>
);

export default Health;
