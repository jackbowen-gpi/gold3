import React from 'react';
import { render, screen } from '@testing-library/react';
import DevHealth from '../DevHealth';

test('renders developer health page', () => {
  render(<DevHealth />);
  expect(screen.getByText(/Developer Health/i)).toBeInTheDocument();
  expect(screen.getByText(/Backend \/api\/health/i)).toBeInTheDocument();
});
