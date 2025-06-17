import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PasswordResetRequest from '../../../components/auth/PasswordResetRequest';
import { requestPasswordReset } from '../../../components/auth/AuthService';

// Mock dependencies
jest.mock('../../../components/hooks/UseMessageAlerts', () => {
  return jest.fn(() => ({
    errorMessage: '',
    successMessage: '',
    setShowSuccessAlert: jest.fn(),
    setSuccessMessage: jest.fn(),
    setErrorMessage: jest.fn(),
    showErrorAlert: false,
    setShowErrorAlert: jest.fn(),
  }));
});

jest.mock('../../../components/auth/AuthService', () => ({
  requestPasswordReset: jest.fn(),
}));

jest.mock('../../../components/common/AlertMessage', () => {
  return function AlertMessage({ type, message }) {
    return <div data-testid={`alert-${type}`}>{message}</div>;
  };
});

jest.mock('../../../components/common/ProcessSpinner', () => {
  return function ProcessSpinner({ message }) {
    return <div data-testid="process-spinner">{message}</div>;
  };
});

const mockUseMessageAlerts = require('../../../components/hooks/UseMessageAlerts');

describe('PasswordResetRequest', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders password reset form correctly', () => {
    render(<PasswordResetRequest />);
    
    expect(screen.getByText('Password Reset Request')).toBeInTheDocument();
    expect(screen.getByLabelText('Enter your email address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
    expect(screen.getByText("We'll send a password reset link to your email.")).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send Link' })).toBeInTheDocument();
  });

  test('updates email input value on change', () => {
    render(<PasswordResetRequest />);
    
    const emailInput = screen.getByPlaceholderText('Enter email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    
    expect(emailInput.value).toBe('test@example.com');
  });

  test('shows process spinner when submitting', async () => {
    requestPasswordReset.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(<PasswordResetRequest />);
    
    const emailInput = screen.getByPlaceholderText('Enter email');
    const submitButton = screen.getByRole('button', { name: 'Send Link' });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);
    
    expect(screen.getByTestId('process-spinner')).toBeInTheDocument();
    expect(screen.getByText('Sending Verification link, please, wait...')).toBeInTheDocument();
  });

  test('handles successful password reset request', async () => {
    const mockSetSuccessMessage = jest.fn();
    const mockSetShowSuccessAlert = jest.fn();
    
    mockUseMessageAlerts.mockReturnValue({
      errorMessage: '',
      successMessage: 'Reset link sent successfully',
      setShowSuccessAlert: mockSetShowSuccessAlert,
      setSuccessMessage: mockSetSuccessMessage,
      setErrorMessage: jest.fn(),
      showErrorAlert: false,
      setShowErrorAlert: jest.fn(),
    });

    requestPasswordReset.mockResolvedValue({ message: 'Reset link sent successfully' });
    
    render(<PasswordResetRequest />);
    
    const emailInput = screen.getByPlaceholderText('Enter email');
    const submitButton = screen.getByRole('button', { name: 'Send Link' });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.submit(screen.getByRole('form'));
    
    await waitFor(() => {
      expect(requestPasswordReset).toHaveBeenCalledWith('test@example.com');
      expect(mockSetSuccessMessage).toHaveBeenCalledWith('Reset link sent successfully');
      expect(mockSetShowSuccessAlert).toHaveBeenCalledWith(true);
    });
  });

  test('handles failed password reset request', async () => {
    const mockSetErrorMessage = jest.fn();
    const mockSetShowErrorAlert = jest.fn();
    
    mockUseMessageAlerts.mockReturnValue({
      errorMessage: 'Email not found',
      successMessage: '',
      setShowSuccessAlert: jest.fn(),
      setSuccessMessage: jest.fn(),
      setErrorMessage: mockSetErrorMessage,
      showErrorAlert: true,
      setShowErrorAlert: mockSetShowErrorAlert,
    });

    const errorResponse = {
      response: {
        data: {
          message: 'Email not found'
        }
      }
    };
    
    requestPasswordReset.mockRejectedValue(errorResponse);
    
    render(<PasswordResetRequest />);
    
    const emailInput = screen.getByPlaceholderText('Enter email');
    
    fireEvent.change(emailInput, { target: { value: 'invalid@example.com' } });
    fireEvent.submit(screen.getByRole('form'));
    
    await waitFor(() => {
      expect(mockSetErrorMessage).toHaveBeenCalledWith('Email not found');
      expect(mockSetShowErrorAlert).toHaveBeenCalledWith(true);
    });
  });

  test('displays error alert when showErrorAlert is true', () => {
    mockUseMessageAlerts.mockReturnValue({
      errorMessage: 'Error occurred',
      successMessage: '',
      setShowSuccessAlert: jest.fn(),
      setSuccessMessage: jest.fn(),
      setErrorMessage: jest.fn(),
      showErrorAlert: true,
      setShowErrorAlert: jest.fn(),
    });
    
    render(<PasswordResetRequest />);
    
    expect(screen.getByTestId('alert-danger')).toBeInTheDocument();
    expect(screen.getByText('Error occurred')).toBeInTheDocument();
  });

  test('clears email input after successful submission', async () => {
    requestPasswordReset.mockResolvedValue({ message: 'Success' });
    
    render(<PasswordResetRequest />);
    
    const emailInput = screen.getByPlaceholderText('Enter email');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput.value).toBe('test@example.com');
    
    fireEvent.submit(screen.getByRole('form'));
    
    await waitFor(() => {
      expect(emailInput.value).toBe('');
    });
  });

  test('prevents default form submission', async () => {
    const mockPreventDefault = jest.fn();
    requestPasswordReset.mockResolvedValue({ message: 'Success' });
    
    render(<PasswordResetRequest />);
    
    const form = screen.getByRole('form');
    const event = { preventDefault: mockPreventDefault, target: form };
    
    fireEvent.submit(form, event);
    
    expect(mockPreventDefault).toHaveBeenCalled();
  });
});