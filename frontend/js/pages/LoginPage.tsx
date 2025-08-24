import React from 'react';
import { LoginForm } from '../../src/features/authentication/components/LoginForm';
import { AuthHeader } from '../../src/features/authentication/components/AuthHeader';

const LoginPage: React.FC = () => (
  <div>
    <AuthHeader />
    <main style={{ padding: 24 }}>
      <LoginForm />
    </main>
  </div>
);

export default LoginPage;
