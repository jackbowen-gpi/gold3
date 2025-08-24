import React from 'react';
import { useAuth } from '../hooks/useAuth';

export const AuthHeader: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 24px', alignItems: 'center', borderBottom: '1px solid #e6e6e6' }}>
      <div style={{ fontWeight: 700 }}>Gold3</div>
      <div>
        {isAuthenticated && user ? (
          <>
            <span style={{ marginRight: 12 }}>{user.email}</span>
            <button onClick={() => logout()} style={{ padding: '6px 10px', borderRadius: 6, background: '#ef4444', color: 'white', border: 'none' }}>Sign out</button>
          </>
        ) : (
          <a href="/login">Sign in</a>
        )}
      </div>
    </div>
  );
};
