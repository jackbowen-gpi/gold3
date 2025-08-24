import React, { useEffect, useState } from 'react';
import { useAuth } from '../features/authentication/hooks/useAuth';

const defaultNav = [
  { label: 'Home', href: '/' },
  { label: 'Login', href: '/login' },
  { label: 'Register', href: '/register' },
];

export const SideNav: React.FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('gold3_nav_collapsed') === '1';
    } catch (e) {
      return false;
    }
  });
  const [theme, setTheme] = useState<string>(() => (typeof window !== 'undefined' && localStorage.getItem('gold3_theme')) || 'light');
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    try {
      localStorage.setItem('gold3_nav_collapsed', collapsed ? '1' : '0');
    } catch (e) {}
  }, [collapsed]);

  useEffect(() => {
    try {
      localStorage.setItem('gold3_theme', theme);
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', theme);
      }
    } catch (e) {}
  }, [theme]);

  const navStyle: React.CSSProperties = {
    width: collapsed ? 60 : 220,
    transition: 'width 200ms ease',
    height: '100vh',
    position: 'sticky',
    top: 0,
    left: 0,
    background: theme === 'dark' ? '#0f172a' : '#ffffff',
    color: theme === 'dark' ? '#e6eef8' : '#0f172a',
    borderRight: '1px solid rgba(0,0,0,0.06)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  };

  const navTopStyle: React.CSSProperties = {
    padding: '16px 8px',
  };

  const navItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 12px',
    cursor: 'pointer',
    borderRadius: 6,
    marginBottom: 6,
  };

  const bottomStyle: React.CSSProperties = {
    padding: 12,
    borderTop: '1px solid rgba(0,0,0,0.04)',
  };

  const doNavigate = (href: string) => {
    if (typeof window !== 'undefined') window.location.assign(href);
  };

  return (
    <aside style={navStyle} aria-label="Primary navigation">
      <div style={navTopStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', padding: '0 8px', marginBottom: 12 }}>
          <div style={{ fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{collapsed ? 'G' : 'Gold3'}</div>
          <button onClick={() => setCollapsed(s => !s)} aria-label="Toggle navigation" style={{ marginLeft: 8, background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer' }}>{collapsed ? '»' : '«'}</button>
        </div>
        <nav>
          {defaultNav.map((item) => (
            <div key={item.href} style={{ ...navItemStyle }} onClick={() => doNavigate(item.href)}>
              <div style={{ width: 28, textAlign: 'center' }}>{/* icon placeholder */}</div>
              {!collapsed && <div style={{ marginLeft: 8 }}>{item.label}</div>}
            </div>
          ))}
        </nav>
      </div>

      <div style={bottomStyle}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between' }}>
          <button onClick={() => setTheme(t => (t === 'light' ? 'dark' : 'light'))} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit' }} aria-label="Toggle theme">
            {theme === 'light' ? '🌞' : '🌙'}
            {!collapsed && <span style={{ marginLeft: 8 }}>{theme === 'light' ? 'Light' : 'Dark'}</span>}
          </button>
          {!collapsed && <div style={{ flex: 1 }} />}
        </div>
        <div style={{ marginTop: 12 }}>
          {isAuthenticated && user ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between' }}>
              {!collapsed && <div style={{ fontSize: 12 }}>{user.email}</div>}
              <button onClick={() => { logout(); doNavigate('/login'); }} style={{ marginLeft: collapsed ? 0 : 8, padding: '6px 10px', borderRadius: 6, background: '#ef4444', color: 'white', border: 'none' }}>{collapsed ? '↵' : 'Sign out'}</button>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <a href="/login" style={{ color: 'inherit', textDecoration: 'none' }}>{collapsed ? '🔐' : 'Sign in'}</a>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default SideNav;
