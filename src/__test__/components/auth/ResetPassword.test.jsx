import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResetPassword from '../../../components/auth/ResetPassword.jsx';

jest.mock('../../../components/auth/AuthService.js', () => ({
  validateToken: jest.fn(() => Promise.resolve({ message: 'VALID' })),
  resetPassword: jest.fn(() => Promise.resolve({ message: 'ok' })),
}));

jest.mock('../../../components/common/ProcessSpinner.jsx', () => () => <div data-testid='spinner' />);

jest.mock('../../../components/hooks/UseMessageAlerts', () => ({ __esModule: true, default: jest.fn() }));
import useAlerts from '../../../components/hooks/UseMessageAlerts';
const setErrorMessage = jest.fn();
const setSuccessMessage = jest.fn();
const setShowSuccessAlert = jest.fn();
const setShowErrorAlert = jest.fn();
useAlerts.mockReturnValue({
  errorMessage: '',
  successMessage: '',
  showErrorAlert: false,
  showSuccessAlert: false,
  setErrorMessage,
  setSuccessMessage,
  setShowSuccessAlert,
  setShowErrorAlert,
});

beforeEach(() => {
  window.history.pushState({}, '', '/reset?token=abc');
});

test('submits new password after validation', async () => {
  const { asFragment } = render(<ResetPassword />);
  await waitFor(() => screen.getByText(/reset your password/i));
  fireEvent.change(screen.getByPlaceholderText(/choose a new password/i), { target: { value: 'newpass' } });
  fireEvent.click(screen.getByRole('button', { name: /reset password/i }));
  const { resetPassword } = require('../../../components/auth/AuthService.js');
  await waitFor(() => expect(resetPassword).toHaveBeenCalledWith('abc', 'newpass'));
  expect(setShowSuccessAlert).toHaveBeenCalledWith(true);
  expect(asFragment()).toMatchSnapshot();
});
