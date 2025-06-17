import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChangePasswordModal from '../../../components/modals/ChangePasswordModal';
import { changeUserPassword } from '../../../components/user/UserService';

// Mock dependencies
jest.mock('../../../components/user/UserService');
jest.mock('../../../components/common/AlertMessage', () => {
  return function AlertMessage({ type, message }) {
    return <div data-testid={`alert-${type}`}>{message}</div>;
  };
});
jest.mock('../../../components/hooks/UseMessageAlerts', () => {
  const React = require('react');
  return function UseMessageAlerts() {
    const [successMessage, setSuccessMessage] = React.useState('');
    const [errorMessage, setErrorMessage] = React.useState('');
    const [showSuccessAlert, setShowSuccessAlert] = React.useState(false);
    const [showErrorAlert, setShowErrorAlert] = React.useState(false);
    
    return {
      successMessage,
      setSuccessMessage,
      errorMessage,
      setErrorMessage,
      showSuccessAlert,
      setShowSuccessAlert,
      showErrorAlert,
      setShowErrorAlert,
    };
  };
});

const mockChangeUserPassword = changeUserPassword;

describe('ChangePasswordModal', () => {
  const defaultProps = {
    userId: 1,
    show: true,
    handleClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders modal when show is true', () => {
    render(<ChangePasswordModal {...defaultProps} />);
    
    expect(screen.getByText('Change Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Current Password:')).toBeInTheDocument();
    expect(screen.getByLabelText('New Password:')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm New Password:')).toBeInTheDocument();
  });

  test('does not render modal when show is false', () => {
    render(<ChangePasswordModal {...defaultProps} show={false} />);
    
    expect(screen.queryByText('Change Password')).not.toBeInTheDocument();
  });

  test('handles input changes correctly', () => {
    render(<ChangePasswordModal {...defaultProps} />);
    
    const currentPasswordInput = screen.getByLabelText('Current Password:');
    const newPasswordInput = screen.getByLabelText('New Password:');
    const confirmPasswordInput = screen.getByLabelText('Confirm New Password:');

    fireEvent.change(currentPasswordInput, { target: { value: 'oldpass123' } });
    fireEvent.change(newPasswordInput, { target: { value: 'newpass123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'newpass123' } });

    expect(currentPasswordInput).toHaveValue('oldpass123');
    expect(newPasswordInput).toHaveValue('newpass123');
    expect(confirmPasswordInput).toHaveValue('newpass123');
  });

  test('toggles password visibility', () => {
    render(<ChangePasswordModal {...defaultProps} />);
    
    const passwordInputs = screen.getAllByDisplayValue('');
    const toggleButton = screen.getByRole('button', { name: /eye/i });

    // Initially password type
    passwordInputs.forEach(input => {
      expect(input).toHaveAttribute('type', 'password');
    });

    // Click to show password
    fireEvent.click(toggleButton);
    
    passwordInputs.forEach(input => {
      expect(input).toHaveAttribute('type', 'text');
    });

    // Click to hide password again
    fireEvent.click(toggleButton);
    
    passwordInputs.forEach(input => {
      expect(input).toHaveAttribute('type', 'password');
    });
  });

  test('handles successful password change', async () => {
    const mockResponse = { message: 'Password changed successfully' };
    mockChangeUserPassword.mockResolvedValueOnce(mockResponse);

    render(<ChangePasswordModal {...defaultProps} />);
    
    // Fill form
    fireEvent.change(screen.getByLabelText('Current Password:'), { target: { value: 'oldpass123' } });
    fireEvent.change(screen.getByLabelText('New Password:'), { target: { value: 'newpass123' } });
    fireEvent.change(screen.getByLabelText('Confirm New Password:'), { target: { value: 'newpass123' } });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: 'Change Password' }));

    await waitFor(() => {
      expect(mockChangeUserPassword).toHaveBeenCalledWith(1, 'oldpass123', 'newpass123', 'newpass123');
    });

    await waitFor(() => {
      expect(screen.getByTestId('alert-success')).toHaveTextContent('Password changed successfully');
    });

    // Check if form is reset
    expect(screen.getByLabelText('Current Password:')).toHaveValue('');
    expect(screen.getByLabelText('New Password:')).toHaveValue('');
    expect(screen.getByLabelText('Confirm New Password:')).toHaveValue('');
  });

  test('handles password change error', async () => {
    const mockError = {
      response: {
        data: {
          message: 'Current password is incorrect'
        }
      },
      message: 'Request failed'
    };
    mockChangeUserPassword.mockRejectedValueOnce(mockError);

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<ChangePasswordModal {...defaultProps} />);
    
    // Fill form
    fireEvent.change(screen.getByLabelText('Current Password:'), { target: { value: 'wrongpass' } });
    fireEvent.change(screen.getByLabelText('New Password:'), { target: { value: 'newpass123' } });
    fireEvent.change(screen.getByLabelText('Confirm New Password:'), { target: { value: 'newpass123' } });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: 'Change Password' }));

    await waitFor(() => {
      expect(screen.getByTestId('alert-danger')).toHaveTextContent('Current password is incorrect');
    });

    expect(consoleSpy).toHaveBeenCalledWith('Request failed');
    consoleSpy.mockRestore();
  });

  test('resets form when reset button is clicked', () => {
    render(<ChangePasswordModal {...defaultProps} />);
    
    // Fill form
    fireEvent.change(screen.getByLabelText('Current Password:'), { target: { value: 'oldpass123' } });
    fireEvent.change(screen.getByLabelText('New Password:'), { target: { value: 'newpass123' } });
    fireEvent.change(screen.getByLabelText('Confirm New Password:'), { target: { value: 'newpass123' } });

    // Click reset
    fireEvent.click(screen.getByRole('button', { name: 'Reset' }));

    // Check if form is reset
    expect(screen.getByLabelText('Current Password:')).toHaveValue('');
    expect(screen.getByLabelText('New Password:')).toHaveValue('');
    expect(screen.getByLabelText('Confirm New Password:')).toHaveValue('');
  });

  test('calls handleClose when modal is closed', () => {
    render(<ChangePasswordModal {...defaultProps} />);
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(defaultProps.handleClose).toHaveBeenCalled();
  });

  test('prevents default form submission', () => {
    mockChangeUserPassword.mockResolvedValueOnce({ message: 'Success' });
    
    render(<ChangePasswordModal {...defaultProps} />);
    
    const form = screen.getByRole('form');
    const mockPreventDefault = jest.fn();
    
    fireEvent.submit(form, { preventDefault: mockPreventDefault });

    expect(mockPreventDefault).toHaveBeenCalled();
  });

  test('renders buttons with correct variants and sizes', () => {
    render(<ChangePasswordModal {...defaultProps} />);
    
    const changePasswordButton = screen.getByRole('button', { name: 'Change Password' });
    const resetButton = screen.getByRole('button', { name: 'Reset' });

    expect(changePasswordButton).toHaveClass('btn-secondary', 'btn-sm');
    expect(resetButton).toHaveClass('btn-danger', 'btn-sm');
  });
});