import React, { useEffect, useState } from 'react';
import { useAuth } from '../features/authentication/hooks/useAuth';
import { FiHome, FiLock, FiUser, FiLogOut, FiTool, FiActivity } from 'react-icons/fi';

const defaultNav = [
  { label: 'Home', href: '/', icon: 'home' },
  { label: 'Login', href: '/login', icon: 'lock' },
  { label: 'Register', href: '/register', icon: 'user' },
];

// Dev navigation: only surface System Health here. The Dev section is collapsible.
const devNav = [
  { label: 'System Health', href: '/health', icon: 'activity' },
];

const Icon = ({ name, size = 18 }: { name: string; size?: number }) => {
  if (name === 'home') return <FiHome size={size} aria-hidden />;
  if (name === 'lock') return <FiLock size={size} aria-hidden />;
  if (name === 'user') return <FiUser size={size} aria-hidden />;
  if (name === 'logout') return <FiLogOut size={size} aria-hidden />;
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
  const [devOpen, setDevOpen] = useState<boolean>(false);

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

  const [overlayOpen, setOverlayOpen] = useState<boolean>(false);
  const navClass = `sidenav ${collapsed ? 'sidenav--collapsed' : 'sidenav--expanded'} ${overlayOpen ? 'sidenav--overlay-open' : ''}`;

  const doNavigate = (href: string) => {
    if (typeof window !== 'undefined') {
      // close overlay on navigation
      setOverlayOpen(false);
      window.location.assign(href);
    }
  };

  const onKeyNav = (e: React.KeyboardEvent, href: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      doNavigate(href);
    }
  };

  return (
  <aside className={navClass} style={{ background: theme === 'dark' ? '#0f172a' : '#ffffff', color: theme === 'dark' ? '#e6eef8' : '#0f172a' }} aria-label="Primary navigation" data-overlay-open={overlayOpen}>
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
          {/** hide login/register when the user is authenticated */}
          {defaultNav
            .filter((item) => !(isAuthenticated && (item.href === '/login' || item.href === '/register')))
            .map((item) => (
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

          {/* Dev section */}
          <div style={{ height: 10 }} />
          <div className="sidenav__section">
            <div
              className="sidenav__item"
              role="button"
              tabIndex={0}
              aria-expanded={devOpen}
              onClick={() => setDevOpen(o => !o)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setDevOpen(o => !o); } }}
              aria-label="Dev"
            >
              <div style={{ width: 28, textAlign: 'center' }}>
                <FiTool size={18} aria-hidden />
              </div>
              {!collapsed && <div className="sidenav__item__label">Dev</div>}
            </div>
            {devOpen && devNav.map((item) => (
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
          </div>
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
                className="sidenav__signout"
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
