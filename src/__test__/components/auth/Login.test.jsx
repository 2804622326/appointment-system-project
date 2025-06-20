import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../../../components/auth/Login.jsx';

jest.mock('../../../components/auth/AuthService.js', () => ({
  loginUser: jest.fn(() => Promise.reject({ response: { data: { message: 'fail' } } })),
}));

jest.mock('jwt-decode', () => jest.fn(() => ({ roles: ['PATIENT'], id: '1' })));

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  Link: ({ children, to }) => <a href={to}>{children}</a>,
  useNavigate: () => mockNavigate,
  useLocation: () => ({ state: { from: { pathname: '/dashboard' } } }),
}));

jest.mock('../../../components/hooks/UseMessageAlerts', () => ({ __esModule: true, default: jest.fn() }));
import useAlerts from '../../../components/hooks/UseMessageAlerts';
const setErrorMessage = jest.fn();
const setShowErrorAlert = jest.fn();
useAlerts.mockReturnValue({
  errorMessage: '',
  showErrorAlert: false,
  setErrorMessage,
  setShowErrorAlert,
});



test('handles login flow and snapshot', async () => {
  const { asFragment } = render(<Login />);
  fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'u@test.com' } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'pass123' } });
  fireEvent.click(screen.getByRole('button', { name: /login/i }));
  const { loginUser } = require('../../../components/auth/AuthService.js');
  await waitFor(() => expect(loginUser).toHaveBeenCalledWith('u@test.com', 'pass123'));
  expect(setErrorMessage).toHaveBeenCalledWith('fail');
  expect(setShowErrorAlert).toHaveBeenCalledWith(true);
  expect(asFragment()).toMatchSnapshot();
});
