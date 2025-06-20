import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PasswordResetRequest from '../../../components/auth/PasswordResetRequest.jsx';

jest.mock('../../../components/auth/AuthService.js', () => ({
  requestPasswordReset: jest.fn(() => Promise.resolve({ message: 'sent' })),
}));

jest.mock('../../../components/hooks/UseMessageAlerts', () => ({ __esModule: true, default: jest.fn() }));
import useAlerts from '../../../components/hooks/UseMessageAlerts';
const setShowSuccessAlert = jest.fn();
const setSuccessMessage = jest.fn();
const setErrorMessage = jest.fn();
const setShowErrorAlert = jest.fn();
useAlerts.mockReturnValue({
  errorMessage: '',
  successMessage: '',
  showErrorAlert: false,
  setShowSuccessAlert,
  setSuccessMessage,
  setErrorMessage,
  setShowErrorAlert,
});

jest.mock('../../../components/common/ProcessSpinner.jsx', () => () => <div data-testid='spinner' />);

test('submits email and shows success', async () => {
  const { asFragment } = render(<PasswordResetRequest />);
  fireEvent.change(screen.getByPlaceholderText(/enter email/i), { target: { value: 'me@example.com' } });
  fireEvent.click(screen.getByRole('button', { name: /send link/i }));
  const { requestPasswordReset } = require('../../../components/auth/AuthService.js');
  await waitFor(() => expect(requestPasswordReset).toHaveBeenCalledWith('me@example.com'));
  expect(setSuccessMessage).toHaveBeenCalled();
  expect(asFragment()).toMatchSnapshot();
});
