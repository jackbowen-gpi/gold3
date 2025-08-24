import React, { useEffect, useState } from 'react';
import { useAuth } from '../features/authentication/hooks/useAuth';

const defaultNav = [
  { label: 'Home', href: '/', icon: 'home' },
  { label: 'Login', href: '/login', icon: 'lock' },
  { label: 'Register', href: '/register', icon: 'user' },
];

const Icon = ({ name }: { name: string }) => {
  // Small inline SVGs to avoid new dependencies
  if (name === 'home') return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M3 11.5L12 4l9 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 12v7a1 1 0 0 0 1 1h3v-5h6v5h3a1 1 0 0 0 1-1v-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  if (name === 'lock') return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect x="3" y="11" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 11V8a5 5 0 0 1 10 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  if (name === 'user') return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  if (name === 'logout') return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M16 17l5-5-5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 12H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 19H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  return null;
};

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

  const navClass = `sidenav ${collapsed ? 'sidenav--collapsed' : 'sidenav--expanded'}`;

  const doNavigate = (href: string) => {
    if (typeof window !== 'undefined') window.location.assign(href);
  };

  const onKeyNav = (e: React.KeyboardEvent, href: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      doNavigate(href);
    }
  };

  return (
    <aside className={navClass} style={{ background: theme === 'dark' ? '#0f172a' : '#ffffff', color: theme === 'dark' ? '#e6eef8' : '#0f172a' }} aria-label="Primary navigation">
      <div className="sidenav__top">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', padding: '0 8px', marginBottom: 12 }}>
          <div className="sidenav__brand">{collapsed ? 'G' : 'Gold3'}</div>
          <button
            className="sidenav__toggle"
            onClick={() => setCollapsed(s => !s)}
            aria-label="Toggle navigation"
            aria-pressed={collapsed}
            aria-expanded={!collapsed}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setCollapsed(s => !s); } }}
          >
            {collapsed ? '»' : '«'}
          </button>
        </div>
        <nav className="sidenav__nav">
          {defaultNav.map((item) => (
            <div
              key={item.href}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => onKeyNav(e, item.href)}
              onClick={() => doNavigate(item.href)}
              className="sidenav__item"
              aria-label={item.label}
            >
              <div style={{ width: 28, textAlign: 'center' }}>
                <Icon name={item.icon} />
              </div>
              {!collapsed && <div className="sidenav__item__label">{item.label}</div>}
            </div>
          ))}
        </nav>
      </div>

      <div className="sidenav__bottom">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between' }}>
          <button
            className="sidenav__theme"
            onClick={() => setTheme(t => (t === 'light' ? 'dark' : 'light'))}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? '🌞' : '🌙'}
            {!collapsed && <span style={{ marginLeft: 8 }}>{theme === 'light' ? 'Light' : 'Dark'}</span>}
          </button>
          {!collapsed && <div style={{ flex: 1 }} />}
        </div>
        <div style={{ marginTop: 12 }}>
          {isAuthenticated && user ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between' }}>
              {!collapsed && <div style={{ fontSize: 12 }}>{user.email}</div>}
              <button
                onClick={() => { logout(); doNavigate('/login'); }}
                style={{ marginLeft: collapsed ? 0 : 8, padding: '6px 10px', borderRadius: 6, background: '#ef4444', color: 'white', border: 'none' }}
                aria-label="Sign out"
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name="logout" />{collapsed ? null : 'Sign out'}</span>
              </button>
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
