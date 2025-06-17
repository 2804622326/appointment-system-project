
import { api } from '../../../components/utils/api';
import {
verifyEmail,
resendVerificationToken,
requestPasswordReset,
validateToken,
resetPassword,
loginUser,
logout
} from '../../../components/auth/AuthService';

// Mock the api module
jest.mock('../../../components/utils/api', () => ({
api: {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn()
}
}));

// Mock localStorage
const localStorageMock = {
removeItem: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock window.location
delete window.location;
window.location = { href: '' };

describe('AuthService', () => {
beforeEach(() => {
  jest.clearAllMocks();
});

describe('verifyEmail', () => {
  it('should verify email successfully', async () => {
    const mockResponse = { data: { success: true } };
    api.get.mockResolvedValue(mockResponse);

    const result = await verifyEmail('test-token');

    expect(api.get).toHaveBeenCalledWith('/auth/verify-your-email?token=test-token');
    expect(result).toEqual(mockResponse.data);
  });

  it('should throw error when verification fails', async () => {
    const mockError = new Error('Verification failed');
    api.get.mockRejectedValue(mockError);

    await expect(verifyEmail('invalid-token')).rejects.toThrow('Verification failed');
  });
});

describe('resendVerificationToken', () => {
  it('should resend verification token successfully', async () => {
    const mockResponse = { data: { message: 'Token sent' } };
    api.put.mockResolvedValue(mockResponse);

    const result = await resendVerificationToken('old-token');

    expect(api.put).toHaveBeenCalledWith('/auth/resend-verification-token?token=old-token');
    expect(result).toEqual(mockResponse.data);
  });

  it('should throw error when resend fails', async () => {
    const mockError = new Error('Resend failed');
    api.put.mockRejectedValue(mockError);

    await expect(resendVerificationToken('old-token')).rejects.toThrow('Resend failed');
  });
});

describe('requestPasswordReset', () => {
  it('should request password reset successfully', async () => {
    const mockResponse = { data: { message: 'Reset email sent' } };
    api.post.mockResolvedValue(mockResponse);

    const result = await requestPasswordReset('test@example.com');

    expect(api.post).toHaveBeenCalledWith('/auth/request-password-reset', { email: 'test@example.com' });
    expect(result).toEqual(mockResponse.data);
  });

  it('should throw error when request fails', async () => {
    const mockError = new Error('Request failed');
    api.post.mockRejectedValue(mockError);

    await expect(requestPasswordReset('test@example.com')).rejects.toThrow('Request failed');
  });
});

describe('validateToken', () => {
  it('should validate token successfully', async () => {
    const mockResponse = { data: { valid: true } };
    api.get.mockResolvedValue(mockResponse);

    const result = await validateToken('valid-token');

    expect(api.get).toHaveBeenCalledWith('/verification/check-token-expiration?token=valid-token');
    expect(result).toEqual(mockResponse.data);
  });

  it('should throw error when validation fails', async () => {
    const mockError = new Error('Token invalid');
    api.get.mockRejectedValue(mockError);

    await expect(validateToken('invalid-token')).rejects.toThrow('Token invalid');
  });
});

describe('resetPassword', () => {
  it('should reset password successfully', async () => {
    const mockResponse = { data: { message: 'Password reset' } };
    api.post.mockResolvedValue(mockResponse);

    const result = await resetPassword('reset-token', 'newPassword123');

    expect(api.post).toHaveBeenCalledWith('/auth/reset-password', {
      token: 'reset-token',
      newPassword: 'newPassword123'
    });
    expect(result).toEqual(mockResponse.data);
  });

  it('should throw error when reset fails', async () => {
    const mockError = new Error('Reset failed');
    api.post.mockRejectedValue(mockError);

    await expect(resetPassword('token', 'password')).rejects.toThrow('Reset failed');
  });
});

describe('loginUser', () => {
  it('should login user successfully', async () => {
    const mockResponse = { data: { data: { user: 'userData', token: 'authToken' } } };
    api.post.mockResolvedValue(mockResponse);

    const result = await loginUser('test@example.com', 'password123');

    expect(api.post).toHaveBeenCalledWith('/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });
    expect(result).toEqual(mockResponse.data.data);
  });

  it('should throw error when login fails', async () => {
    const mockError = new Error('Login failed');
    api.post.mockRejectedValue(mockError);

    await expect(loginUser('test@example.com', 'wrongpassword')).rejects.toThrow('Login failed');
  });
});

describe('logout', () => {
  it('should clear localStorage and redirect to home', () => {
    logout();

    expect(localStorageMock.removeItem).toHaveBeenCalledWith('authToken');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('userId');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('userRoles');
    expect(window.location.href).toBe('/');
  });
});
});