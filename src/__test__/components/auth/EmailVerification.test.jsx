import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EmailVerification from '../../../components/auth/EmailVerification.jsx';

jest.mock('../../../components/auth/AuthService.js', () => ({
  verifyEmail: jest.fn(() => Promise.resolve({ message: 'VALID' })),
  resendVerificationToken: jest.fn(() => Promise.resolve({ message: 'resent' })),
}));

jest.mock('../../../components/common/ProcessSpinner.jsx', () => () => <div data-testid='spinner' />);

beforeEach(() => {
  window.history.pushState({}, '', '/verify?token=test');
});

test('shows verification success and snapshot', async () => {
  const { asFragment } = render(<EmailVerification />);
  const { verifyEmail } = require('../../../components/auth/AuthService.js');
  await waitFor(() => expect(verifyEmail).toHaveBeenCalledWith('test'));
  expect(screen.getByText(/successfully verified/i)).toBeInTheDocument();
  expect(asFragment()).toMatchSnapshot();
});

test('resends token when link expired', async () => {
  const { verifyEmail, resendVerificationToken } = require('../../../components/auth/AuthService.js');
  verifyEmail.mockRejectedValueOnce({ response: { data: { message: 'EXPIRED' } } });
  const { asFragment } = render(<EmailVerification />);
  await waitFor(() => screen.getByRole('button', { name: /resend verification link/i }));
  fireEvent.click(screen.getByRole('button', { name: /resend verification link/i }));
  await waitFor(() => expect(resendVerificationToken).toHaveBeenCalled());
  expect(asFragment()).toMatchSnapshot();
});
