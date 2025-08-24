import React from 'react';
import { RegisterForm } from '../features/authentication/components/RegisterForm';

export const RegisterPage: React.FC = () => (
  <div>
    <main style={{ padding: 24 }}>
      <RegisterForm />
    </main>
  </div>
);

export default RegisterPage;
