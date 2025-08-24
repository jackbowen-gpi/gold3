import React from 'react';
import { LoginForm } from '../features/authentication/components/LoginForm';
import { AuthHeader } from '../features/authentication/components/AuthHeader';

export const LoginPage: React.FC = () => (
  <div>
    <AuthHeader />
    <main style={{ padding: 24 }}>
      <LoginForm />
    </main>
  </div>
);

export default LoginPage;
