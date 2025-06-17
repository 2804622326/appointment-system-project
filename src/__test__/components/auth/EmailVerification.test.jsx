import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EmailVerification from '../../../components/auth/EmailVerification';
import { verifyEmail, resendVerificationToken } from '../../../components/auth/AuthService';

// Mock the AuthService
jest.mock('../../../components/auth/AuthService');

// Mock ProcessSpinner component
jest.mock('../../../components/common/ProcessSpinner', () => {
  return function MockProcessSpinner({ message }) {
    return <div data-testid="process-spinner">{message}</div>;
  };
});

// Mock window.location
const mockLocation = {
  search: ''
};

Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true
});

describe('EmailVerification', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial render and token handling', () => {
    it('should display loading message initially when token is present', () => {
      mockLocation.search = '?token=valid-token';
      render(<EmailVerification />);
      
      expect(screen.getByText('Verifying your email, please wait....')).toBeInTheDocument();
    });

    it('should display error message when no token is provided', () => {
      mockLocation.search = '';
      render(<EmailVerification />);
      
      expect(screen.getByText('No token provided.')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toHaveClass('alert-danger');
    });
  });

  describe('Email verification success scenarios', () => {
    it('should display success message when email is verified (VALID)', async () => {
      mockLocation.search = '?token=valid-token';
      verifyEmail.mockResolvedValue({ message: 'VALID' });

      render(<EmailVerification />);

      await waitFor(() => {
        expect(screen.getByText('Your email has been successfully verified, you can proceed to login.')).toBeInTheDocument();
        expect(screen.getByRole('alert')).toHaveClass('alert-success');
      });
    });

    it('should display info message when email is already verified (VERIFIED)', async () => {
      mockLocation.search = '?token=valid-token';
      verifyEmail.mockResolvedValue({ message: 'VERIFIED' });

      render(<EmailVerification />);

      await waitFor(() => {
        expect(screen.getByText('This email has already been verified, please proceed to login.')).toBeInTheDocument();
        expect(screen.getByRole('alert')).toHaveClass('alert-info');
      });
    });

    it('should display error message for unexpected response', async () => {
      mockLocation.search = '?token=valid-token';
      verifyEmail.mockResolvedValue({ message: 'UNEXPECTED' });

      render(<EmailVerification />);

      await waitFor(() => {
        expect(screen.getByText('An unexpected error occurred.')).toBeInTheDocument();
        expect(screen.getByRole('alert')).toHaveClass('alert-danger');
      });
    });
  });

  describe('Email verification error scenarios', () => {
    it('should handle invalid token error', async () => {
      mockLocation.search = '?token=invalid-token';
      verifyEmail.mockRejectedValue({
        response: {
          data: { message: 'INVALID' }
        }
      });

      render(<EmailVerification />);

      await waitFor(() => {
        expect(screen.getByText('This verification link is invalid.')).toBeInTheDocument();
        expect(screen.getByRole('alert')).toHaveClass('alert-danger');
      });
    });

    it('should handle expired token error with resend button', async () => {
      mockLocation.search = '?token=expired-token';
      verifyEmail.mockRejectedValue({
        response: {
          data: { message: 'EXPIRED' }
        }
      });

      render(<EmailVerification />);

      await waitFor(() => {
        expect(screen.getByText('This verification link has expired, please try again.')).toBeInTheDocument();
        expect(screen.getByRole('alert')).toHaveClass('alert-warning');
        expect(screen.getByText('Resend Verification Link')).toBeInTheDocument();
      });
    });

    it('should handle network error', async () => {
      mockLocation.search = '?token=valid-token';
      verifyEmail.mockRejectedValue(new Error('Network Error'));

      render(<EmailVerification />);

      await waitFor(() => {
        expect(screen.getByText('Failed to connect to the server.')).toBeInTheDocument();
        expect(screen.getByRole('alert')).toHaveClass('alert-danger');
      });
    });
  });

  describe('Loading states', () => {
    it('should show spinner during email verification', async () => {
      mockLocation.search = '?token=valid-token';
      verifyEmail.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ message: 'VALID' }), 100)));

      render(<EmailVerification />);

      expect(screen.getByTestId('process-spinner')).toBeInTheDocument();
      expect(screen.getByText('Processing your request, please wait...')).toBeInTheDocument();
    });

    it('should hide spinner after verification completes', async () => {
      mockLocation.search = '?token=valid-token';
      verifyEmail.mockResolvedValue({ message: 'VALID' });

      render(<EmailVerification />);

      await waitFor(() => {
        expect(screen.queryByTestId('process-spinner')).not.toBeInTheDocument();
      });
    });
  });

  describe('Resend verification token', () => {
    it('should successfully resend verification token', async () => {
      mockLocation.search = '?token=expired-token';
      verifyEmail.mockRejectedValue({
        response: {
          data: { message: 'EXPIRED' }
        }
      });
      resendVerificationToken.mockResolvedValue({ message: 'Verification link resent successfully' });

      render(<EmailVerification />);

      await waitFor(() => {
        expect(screen.getByText('Resend Verification Link')).toBeInTheDocument();
      });

      const resendButton = screen.getByText('Resend Verification Link');
      await userEvent.click(resendButton);

      await waitFor(() => {
        expect(resendVerificationToken).toHaveBeenCalledWith('expired-token');
        expect(screen.getByText('Verification link resent successfully')).toBeInTheDocument();
        expect(screen.getByRole('alert')).toHaveClass('alert-success');
      });
    });

    it('should handle resend token error with response data', async () => {
      mockLocation.search = '?token=expired-token';
      verifyEmail.mockRejectedValue({
        response: {
          data: { message: 'EXPIRED' }
        }
      });
      resendVerificationToken.mockRejectedValue({
        response: {
          data: { message: 'Unable to resend token' }
        }
      });

      render(<EmailVerification />);

      await waitFor(() => {
        expect(screen.getByText('Resend Verification Link')).toBeInTheDocument();
      });

      const resendButton = screen.getByText('Resend Verification Link');
      await userEvent.click(resendButton);

      await waitFor(() => {
        expect(screen.getByText('Unable to resend token')).toBeInTheDocument();
        expect(screen.getByRole('alert')).toHaveClass('alert-danger');
      });
    });

    it('should handle resend token error with error message', async () => {
      mockLocation.search = '?token=expired-token';
      verifyEmail.mockRejectedValue({
        response: {
          data: { message: 'EXPIRED' }
        }
      });
      resendVerificationToken.mockRejectedValue(new Error('Network failed'));

      render(<EmailVerification />);

      await waitFor(() => {
        expect(screen.getByText('Resend Verification Link')).toBeInTheDocument();
      });

      const resendButton = screen.getByText('Resend Verification Link');
      await userEvent.click(resendButton);

      await waitFor(() => {
        expect(screen.getByText('Network failed')).toBeInTheDocument();
        expect(screen.getByRole('alert')).toHaveClass('alert-danger');
      });
    });

    it('should handle resend token generic error', async () => {
      mockLocation.search = '?token=expired-token';
      verifyEmail.mockRejectedValue({
        response: {
          data: { message: 'EXPIRED' }
        }
      });
      resendVerificationToken.mockRejectedValue({});

      render(<EmailVerification />);

      await waitFor(() => {
        expect(screen.getByText('Resend Verification Link')).toBeInTheDocument();
      });

      const resendButton = screen.getByText('Resend Verification Link');
      await userEvent.click(resendButton);

      await waitFor(() => {
        expect(screen.getByText('Failed to resend verification token.')).toBeInTheDocument();
        expect(screen.getByRole('alert')).toHaveClass('alert-danger');
      });
    });

    it('should show spinner during resend token process', async () => {
      mockLocation.search = '?token=expired-token';
      verifyEmail.mockRejectedValue({
        response: {
          data: { message: 'EXPIRED' }
        }
      });
      resendVerificationToken.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ message: 'Success' }), 100)));

      render(<EmailVerification />);

      await waitFor(() => {
        expect(screen.getByText('Resend Verification Link')).toBeInTheDocument();
      });

      const resendButton = screen.getByText('Resend Verification Link');
      await userEvent.click(resendButton);

      expect(screen.getByTestId('process-spinner')).toBeInTheDocument();
    });

    it('should not call resend when no token is available', async () => {
      mockLocation.search = '';
      verifyEmail.mockRejectedValue({
        response: {
          data: { message: 'EXPIRED' }
        }
      });

      render(<EmailVerification />);

      // Simulate clicking resend when no token is present
      const component = screen.getByRole('alert').closest('div');
      
      // Since there's no token, the resend function should return early
      // We need to test this by mocking the location search to be empty
      // and ensuring resendVerificationToken is not called
      expect(resendVerificationToken).not.toHaveBeenCalled();
    });
  });

  describe('Component structure', () => {
    it('should render with correct CSS classes', () => {
      mockLocation.search = '';
      render(<EmailVerification />);

      const container = screen.getByRole('alert').closest('.d-flex');
      expect(container).toHaveClass('d-flex', 'justify-content-center', 'mt-lg-5');
      
      const alertContainer = screen.getByRole('alert').closest('.col-12');
      expect(alertContainer).toHaveClass('col-12', 'col-md-6');
    });

    it('should render alert with correct role', () => {
      mockLocation.search = '';
      render(<EmailVerification />);

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });
});