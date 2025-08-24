import React from 'react';
import { LoginForm } from '../features/authentication/components/LoginForm';

export const LoginPage: React.FC = () => (
  <div>
    <main style={{ padding: 24 }}>
      <LoginForm />
    </main>
  </div>
);

export default LoginPage;
