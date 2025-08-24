import React from 'react';
import { useAuth } from '../hooks/useAuth';

export const AuthHeader: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();

  const toggleSidenav = () => {
    try {
      const body = document.body;
      if (body.classList.contains('sidenav-open')) body.classList.remove('sidenav-open');
      else body.classList.add('sidenav-open');
    } catch (e) {}
  };

  return (
    <div className="auth-header">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button className="hamburger" aria-label="Open navigation" onClick={toggleSidenav}>☰</button>
        <div className="auth-header__brand">Gold3</div>
      </div>
      <div className="auth-header__actions">
        {isAuthenticated && user ? (
          <>
            <span style={{ marginRight: 12 }}>{user.email}</span>
            <button className="auth-header__signout" onClick={() => logout()}>Sign out</button>
          </>
        ) : (
          <a href="/login">Sign in</a>
        )}
      </div>
    </div>
  );
};
