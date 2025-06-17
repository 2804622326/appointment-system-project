import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import ResetPassword from '../../../components/auth/ResetPassword';
import { validateToken, resetPassword } from '../../../components/auth/AuthService';

// Mock dependencies
jest.mock('../../../components/auth/AuthService');
jest.mock('../../../components/hooks/UseMessageAlerts');
jest.mock('../../../components/common/AlertMessage');
jest.mock('../../../components/common/ProcessSpinner');

// Mock window.location.search
delete window.location;
window.location = { search: '' };

const mockUseMessageAlerts = {
  errorMessage: '',
  setErrorMessage: jest.fn(),
  successMessage: '',
  setSuccessMessage: jest.fn(),
  setShowSuccessAlert: jest.fn(),
  showSuccessAlert: false,
  showErrorAlert: false,
  setShowErrorAlert: jest.fn(),
};

describe('ResetPassword Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    require('../../../components/hooks/UseMessageAlerts').default.mockReturnValue(mockUseMessageAlerts);
    require('../../../components/common/AlertMessage').default.mockImplementation(({ type, message }) => (
      <div data-testid={`alert-${type}`}>{message}</div>
    ));
    require('../../../components/common/ProcessSpinner').default.mockImplementation(({ message }) => (
      <div data-testid="process-spinner">{message}</div>
    ));
  });

  test('renders pending state initially when token is present', () => {
    window.location.search = '?token=valid-token';
    validateToken.mockResolvedValue({ message: 'VALID' });

    render(<ResetPassword />);
    
    expect(screen.getByTestId('process-spinner')).toBeInTheDocument();
    expect(screen.getByText('Validating token, please wait...')).toBeInTheDocument();
  });

  test('renders password reset form when token is valid', async () => {
    window.location.search = '?token=valid-token';
    validateToken.mockResolvedValue({ message: 'VALID' });

    render(<ResetPassword />);

    await waitFor(() => {
      expect(screen.getByText('Reset Your Password')).toBeInTheDocument();
      expect(screen.getByLabelText('Set a new password')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('choose a new password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Reset Password' })).toBeInTheDocument();
    });
  });

  test('renders error message when token validation fails', async () => {
    window.location.search = '?token=invalid-token';
    validateToken.mockRejectedValue({ 
      response: { data: { message: 'Invalid token' } } 
    });

    render(<ResetPassword />);

    await waitFor(() => {
      expect(mockUseMessageAlerts.setErrorMessage).toHaveBeenCalledWith('Invalid token');
      expect(mockUseMessageAlerts.setShowErrorAlert).toHaveBeenCalledWith(true);
    });
  });

  test('renders invalid token message when token status is not VALID or PENDING', async () => {
    window.location.search = '?token=expired-token';
    validateToken.mockResolvedValue({ message: 'EXPIRED' });

    render(<ResetPassword />);

    await waitFor(() => {
      expect(screen.getByTestId('alert-danger')).toBeInTheDocument();
      expect(screen.getByText('Invalid or expired link, process aborted. please try again!')).toBeInTheDocument();
    });
  });

  test('handles password input change', async () => {
    window.location.search = '?token=valid-token';
    validateToken.mockResolvedValue({ message: 'VALID' });

    render(<ResetPassword />);

    await waitFor(() => {
      const passwordInput = screen.getByPlaceholderText('choose a new password');
      fireEvent.change(passwordInput, { target: { value: 'newpassword123' } });
      expect(passwordInput.value).toBe('newpassword123');
    });
  });

  test('handles successful password reset', async () => {
    window.location.search = '?token=valid-token';
    validateToken.mockResolvedValue({ message: 'VALID' });
    resetPassword.mockResolvedValue({ message: 'Password reset successfully' });

    render(<ResetPassword />);

    await waitFor(() => {
      const passwordInput = screen.getByPlaceholderText('choose a new password');
      const submitButton = screen.getByRole('button', { name: 'Reset Password' });
      
      fireEvent.change(passwordInput, { target: { value: 'newpassword123' } });
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(resetPassword).toHaveBeenCalledWith('valid-token', 'newpassword123');
      expect(mockUseMessageAlerts.setSuccessMessage).toHaveBeenCalledWith('Password reset successfully');
      expect(mockUseMessageAlerts.setShowSuccessAlert).toHaveBeenCalledWith(true);
    });
  });

  test('handles password reset error', async () => {
    window.location.search = '?token=valid-token';
    validateToken.mockResolvedValue({ message: 'VALID' });
    resetPassword.mockRejectedValue({ 
      response: { data: { message: 'Password reset failed' } } 
    });

    render(<ResetPassword />);

    await waitFor(() => {
      const passwordInput = screen.getByPlaceholderText('choose a new password');
      const submitButton = screen.getByRole('button', { name: 'Reset Password' });
      
      fireEvent.change(passwordInput, { target: { value: 'newpassword123' } });
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockUseMessageAlerts.setErrorMessage).toHaveBeenCalledWith('Password reset failed');
      expect(mockUseMessageAlerts.setShowErrorAlert).toHaveBeenCalledWith(true);
    });
  });

  test('shows processing spinner during password reset', async () => {
    window.location.search = '?token=valid-token';
    validateToken.mockResolvedValue({ message: 'VALID' });
    resetPassword.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(<ResetPassword />);

    await waitFor(() => {
      const passwordInput = screen.getByPlaceholderText('choose a new password');
      const submitButton = screen.getByRole('button', { name: 'Reset Password' });
      
      fireEvent.change(passwordInput, { target: { value: 'newpassword123' } });
      fireEvent.click(submitButton);
    });

    expect(screen.getByText('Resetting your password, please wait...')).toBeInTheDocument();
  });

  test('does not validate token when no token is present', () => {
    window.location.search = '';
    
    render(<ResetPassword />);
    
    expect(validateToken).not.toHaveBeenCalled();
  });

  test('renders error alert when showErrorAlert is true', () => {
    const mockAlertsWithError = {
      ...mockUseMessageAlerts,
      showErrorAlert: true,
      errorMessage: 'Test error message'
    };
    require('../../../components/hooks/UseMessageAlerts').default.mockReturnValue(mockAlertsWithError);

    render(<ResetPassword />);

    expect(screen.getByTestId('alert-danger')).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  test('renders success alert when showSuccessAlert is true', () => {
    const mockAlertsWithSuccess = {
      ...mockUseMessageAlerts,
      showSuccessAlert: true,
      successMessage: 'Test success message'
    };
    require('../../../components/hooks/UseMessageAlerts').default.mockReturnValue(mockAlertsWithSuccess);

    render(<ResetPassword />);

    expect(screen.getByTestId('alert-success')).toBeInTheDocument();
    expect(screen.getByText('Test success message')).toBeInTheDocument();
  });
});