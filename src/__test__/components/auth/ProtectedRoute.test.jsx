import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProtectedRoute from '../../../components/auth/ProtectedRoute.jsx';

jest.mock('react-router-dom', () => ({
  Navigate: ({ to }) => <div>redirect {to}</div>,
  useLocation: () => ({ pathname: '/private' }),
}));

test('redirects to login if not authenticated', () => {
  localStorage.removeItem('authToken');
  const { asFragment } = render(
    <ProtectedRoute allowedRoles={['PATIENT']}>
      <div>secret</div>
    </ProtectedRoute>
  );
  expect(screen.getByText('redirect /login')).toBeInTheDocument();
  expect(asFragment()).toMatchSnapshot();
});

test('redirects to unauthorized if role not allowed', () => {
  localStorage.setItem('authToken', 't');
  localStorage.setItem('userRoles', JSON.stringify(['OTHER']));
  const { asFragment } = render(
    <ProtectedRoute allowedRoles={['PATIENT']}>
      <div>secret</div>
    </ProtectedRoute>
  );
  expect(screen.getByText('redirect /unauthorized')).toBeInTheDocument();
  expect(asFragment()).toMatchSnapshot();
});

test('renders children when authorized', () => {
  localStorage.setItem('authToken', 't');
  localStorage.setItem('userRoles', JSON.stringify(['PATIENT']));
  const { asFragment } = render(
    <ProtectedRoute allowedRoles={['PATIENT']}>
      <div>secret</div>
    </ProtectedRoute>
  );
  expect(screen.getByText('secret')).toBeInTheDocument();
  expect(asFragment()).toMatchSnapshot();
});
