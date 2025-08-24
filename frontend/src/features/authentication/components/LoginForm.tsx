import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export const LoginForm: React.FC = () => {
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      // redirect or UI update handled by caller
    } catch (err) {
      // error shown by hook
    }
  };

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 420, margin: 'auto' }}>
      <h2>Sign in</h2>
      <label style={{ display: 'block', marginBottom: 8 }}>
        <div style={{ fontSize: 12 }}>Email</div>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: 8 }} required />
      </label>
      <label style={{ display: 'block', marginBottom: 8 }}>
        <div style={{ fontSize: 12 }}>Password</div>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: 8 }} required />
      </label>
      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
      <button type="submit" disabled={isLoading} style={{ padding: '10px 16px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: 6 }}>
        {isLoading ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  );
};
