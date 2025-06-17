import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import ProtectedRoute from '../../../components/auth/ProtectedRoute';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Navigate: ({ to, state }) => <div data-testid="navigate" data-to={to} data-state={JSON.stringify(state)} />,
  Outlet: () => <div data-testid="outlet">Outlet Component</div>,
  useLocation: () => ({ pathname: '/current-path' }),
}));

describe('ProtectedRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Authentication Tests', () => {
    test('redirects to login when not authenticated', () => {
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === 'authToken') return null;
        if (key === 'userRoles') return '[]';
        return null;
      });

      render(
        <MemoryRouter>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </MemoryRouter>
      );

      const navigate = screen.getByTestId('navigate');
      expect(navigate).toHaveAttribute('data-to', '/login');
      expect(JSON.parse(navigate.getAttribute('data-state'))).toEqual({
        from: { pathname: '/current-path' }
      });
    });

    test('renders children when authenticated and authorized', () => {
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === 'authToken') return 'valid-token';
        if (key === 'userRoles') return '["admin"]';
        return null;
      });

      render(
        <MemoryRouter>
          <ProtectedRoute allowedRoles={['admin']}>
            <div data-testid="protected-content">Protected Content</div>
          </ProtectedRoute>
        </MemoryRouter>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });
  });

  describe('Authorization Tests', () => {
    test('redirects to unauthorized when authenticated but not authorized', () => {
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === 'authToken') return 'valid-token';
        if (key === 'userRoles') return '["user"]';
        return null;
      });

      render(
        <MemoryRouter>
          <ProtectedRoute allowedRoles={['admin']}>
            <div>Protected Content</div>
          </ProtectedRoute>
        </MemoryRouter>
      );

      const navigate = screen.getByTestId('navigate');
      expect(navigate).toHaveAttribute('data-to', '/unauthorized');
    });

    test('handles case-insensitive role matching', () => {
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === 'authToken') return 'valid-token';
        if (key === 'userRoles') return '["ADMIN"]';
        return null;
      });

      render(
        <MemoryRouter>
          <ProtectedRoute allowedRoles={['admin']}>
            <div data-testid="protected-content">Protected Content</div>
          </ProtectedRoute>
        </MemoryRouter>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    test('authorizes user with multiple roles', () => {
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === 'authToken') return 'valid-token';
        if (key === 'userRoles') return '["user", "admin", "manager"]';
        return null;
      });

      render(
        <MemoryRouter>
          <ProtectedRoute allowedRoles={['admin']}>
            <div data-testid="protected-content">Protected Content</div>
          </ProtectedRoute>
        </MemoryRouter>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    test('handles empty allowed roles array', () => {
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === 'authToken') return 'valid-token';
        if (key === 'userRoles') return '["user"]';
        return null;
      });

      render(
        <MemoryRouter>
          <ProtectedRoute allowedRoles={[]}>
            <div>Protected Content</div>
          </ProtectedRoute>
        </MemoryRouter>
      );

      const navigate = screen.getByTestId('navigate');
      expect(navigate).toHaveAttribute('data-to', '/unauthorized');
    });
  });

  describe('Outlet Tests', () => {
    test('renders Outlet when useOutlet is true and user is authorized', () => {
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === 'authToken') return 'valid-token';
        if (key === 'userRoles') return '["admin"]';
        return null;
      });

      render(
        <MemoryRouter>
          <ProtectedRoute allowedRoles={['admin']} useOutlet={true}>
            <div>This should not render</div>
          </ProtectedRoute>
        </MemoryRouter>
      );

      expect(screen.getByTestId('outlet')).toBeInTheDocument();
      expect(screen.queryByText('This should not render')).not.toBeInTheDocument();
    });

    test('renders children when useOutlet is false and user is authorized', () => {
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === 'authToken') return 'valid-token';
        if (key === 'userRoles') return '["admin"]';
        return null;
      });

      render(
        <MemoryRouter>
          <ProtectedRoute allowedRoles={['admin']} useOutlet={false}>
            <div data-testid="protected-content">Protected Content</div>
          </ProtectedRoute>
        </MemoryRouter>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      expect(screen.queryByTestId('outlet')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('handles null userRoles in localStorage', () => {
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === 'authToken') return 'valid-token';
        if (key === 'userRoles') return null;
        return null;
      });

      render(
        <MemoryRouter>
          <ProtectedRoute allowedRoles={['admin']}>
            <div>Protected Content</div>
          </ProtectedRoute>
        </MemoryRouter>
      );

      const navigate = screen.getByTestId('navigate');
      expect(navigate).toHaveAttribute('data-to', '/unauthorized');
    });

    test('handles invalid JSON in userRoles', () => {
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === 'authToken') return 'valid-token';
        if (key === 'userRoles') return 'invalid-json';
        return null;
      });

      expect(() => {
        render(
          <MemoryRouter>
            <ProtectedRoute allowedRoles={['admin']}>
              <div>Protected Content</div>
            </ProtectedRoute>
          </MemoryRouter>
        );
      }).toThrow();
    });

    test('works without allowedRoles prop (default empty array)', () => {
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === 'authToken') return 'valid-token';
        if (key === 'userRoles') return '["user"]';
        return null;
      });

      render(
        <MemoryRouter>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </MemoryRouter>
      );

      const navigate = screen.getByTestId('navigate');
      expect(navigate).toHaveAttribute('data-to', '/unauthorized');
    });

    test('works without useOutlet prop (default false)', () => {
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === 'authToken') return 'valid-token';
        if (key === 'userRoles') return '["admin"]';
        return null;
      });

      render(
        <MemoryRouter>
          <ProtectedRoute allowedRoles={['admin']}>
            <div data-testid="protected-content">Protected Content</div>
          </ProtectedRoute>
        </MemoryRouter>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      expect(screen.queryByTestId('outlet')).not.toBeInTheDocument();
    });
  });
});