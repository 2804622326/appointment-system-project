import {
  verifyEmail,
  resendVerificationToken,
  requestPasswordReset,
  validateToken,
  resetPassword,
  loginUser,
  logout,
} from '../../../components/auth/AuthService.js';
import { api } from '../../../components/utils/api.js';

jest.mock('../../../components/utils/api.js', () => ({
  api: {
    get: jest.fn(() => Promise.resolve({ data: 'get' })),
    post: jest.fn(() => Promise.resolve({ data: { data: 'post' } })),
    put: jest.fn(() => Promise.resolve({ data: 'put' })),
  },
}));

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('verifyEmail calls api', async () => {
    await verifyEmail('tok');
    expect(api.get).toHaveBeenCalledWith('/auth/verify-your-email?token=tok');
  });

  test('resendVerificationToken calls api', async () => {
    await resendVerificationToken('old');
    expect(api.put).toHaveBeenCalledWith('/auth/resend-verification-token?token=old');
  });

  test('requestPasswordReset calls api', async () => {
    await requestPasswordReset('a@b.com');
    expect(api.post).toHaveBeenCalledWith('/auth/request-password-reset', { email: 'a@b.com' });
  });

  test('validateToken calls api', async () => {
    await validateToken('tok');
    expect(api.get).toHaveBeenCalledWith('/verification/check-token-expiration?token=tok');
  });

  test('resetPassword calls api', async () => {
    await resetPassword('t', 'p');
    expect(api.post).toHaveBeenCalledWith('/auth/reset-password', { token: 't', newPassword: 'p' });
  });

  test('loginUser posts credentials', async () => {
    await loginUser('e', 'p');
    expect(api.post).toHaveBeenCalledWith('/auth/login', { email: 'e', password: 'p' });
  });

  test('logout clears storage', () => {
    localStorage.setItem('authToken', 't');
    logout();
    expect(localStorage.getItem('authToken')).toBeNull();
  });
});
