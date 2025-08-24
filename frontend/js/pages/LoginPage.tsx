import React from 'react';
import { LoginForm } from '../../src/features/authentication/components/LoginForm';

const LoginPage: React.FC = () => (
  <div>
    <main style={{ padding: 24 }}>
      <LoginForm />
    </main>
  </div>
);

export default LoginPage;
