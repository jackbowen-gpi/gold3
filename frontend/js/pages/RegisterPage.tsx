import React from 'react';
import { RegisterForm } from '../../src/features/authentication/components/RegisterForm';

const RegisterPage: React.FC = () => (
  <div>
    <main style={{ padding: 24 }}>
      <RegisterForm />
    </main>
  </div>
);

export default RegisterPage;
