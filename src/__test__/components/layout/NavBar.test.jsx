import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import NavBar from '../../../components/layout/NavBar.jsx';

jest.mock('../../../components/auth/AuthService.js', () => ({
  logout: jest.fn(),
}));
const { logout } = require('../../../components/auth/AuthService.js');

test('shows account links when logged in', () => {
  localStorage.setItem('authToken', 't');
  localStorage.setItem('userRoles', JSON.stringify(['ROLE_ADMIN']));
  localStorage.setItem('userId', '5');
  const { asFragment } = render(
    <MemoryRouter>
      <NavBar />
    </MemoryRouter>
  );
  fireEvent.click(screen.getByRole('button', { name: /account/i }));
  fireEvent.click(screen.getByText(/logout/i));
  expect(logout).toHaveBeenCalled();
  expect(screen.getByText(/admin dashboard/i)).toBeInTheDocument();
  expect(asFragment()).toMatchSnapshot();
});
