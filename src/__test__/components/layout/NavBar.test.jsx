import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NavBar from '../../../components/layout/NavBar';
import { logout } from '../../../components/auth/AuthService';

// Mock the AuthService
jest.mock('../../../components/auth/AuthService', () => ({
  logout: jest.fn()
}));

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('NavBar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders navbar with brand name', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    renderWithRouter(<NavBar />);
    
    expect(screen.getByText('uniPetcare')).toBeInTheDocument();
  });

  test('renders "Meet Our Veterinarians" link', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    renderWithRouter(<NavBar />);
    
    expect(screen.getByText('Meet Our Veterinarians')).toBeInTheDocument();
  });

  test('shows register and login options when not logged in', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    renderWithRouter(<NavBar />);
    
    expect(screen.getByText('Register')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  test('shows dashboard and logout options when logged in', () => {
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'authToken') return 'mock-token';
      if (key === 'userId') return '123';
      if (key === 'userRoles') return '["ROLE_USER"]';
      return null;
    });

    renderWithRouter(<NavBar />);
    
    expect(screen.getByText('My Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  test('shows admin dashboard when user has ROLE_ADMIN', () => {
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'authToken') return 'mock-token';
      if (key === 'userId') return '123';
      if (key === 'userRoles') return '["ROLE_ADMIN"]';
      return null;
    });

    renderWithRouter(<NavBar />);
    
    expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
  });

  test('does not show admin dashboard when user does not have ROLE_ADMIN', () => {
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'authToken') return 'mock-token';
      if (key === 'userId') return '123';
      if (key === 'userRoles') return '["ROLE_USER"]';
      return null;
    });

    renderWithRouter(<NavBar />);
    
    expect(screen.queryByText('Admin Dashboard')).not.toBeInTheDocument();
  });

  test('calls logout function when logout is clicked', () => {
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'authToken') return 'mock-token';
      if (key === 'userId') return '123';
      if (key === 'userRoles') return '["ROLE_USER"]';
      return null;
    });

    renderWithRouter(<NavBar />);
    
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);
    
    expect(logout).toHaveBeenCalledTimes(1);
  });

  test('renders correct dashboard link with userId', () => {
    const mockUserId = '456';
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'authToken') return 'mock-token';
      if (key === 'userId') return mockUserId;
      if (key === 'userRoles') return '["ROLE_USER"]';
      return null;
    });

    renderWithRouter(<NavBar />);
    
    const dashboardLink = screen.getByText('My Dashboard').closest('a');
    expect(dashboardLink).toHaveAttribute('href', `/user-dashboard/${mockUserId}/my-dashboard`);
  });

  test('renders correct admin dashboard link with userId', () => {
    const mockUserId = '789';
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'authToken') return 'mock-token';
      if (key === 'userId') return mockUserId;
      if (key === 'userRoles') return '["ROLE_ADMIN"]';
      return null;
    });

    renderWithRouter(<NavBar />);
    
    const adminDashboardLink = screen.getByText('Admin Dashboard').closest('a');
    expect(adminDashboardLink).toHaveAttribute('href', `/admin-dashboard/${mockUserId}/admin-dashboard`);
  });

  test('handles empty userRoles gracefully', () => {
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'authToken') return 'mock-token';
      if (key === 'userId') return '123';
      if (key === 'userRoles') return null;
      return null;
    });

    renderWithRouter(<NavBar />);
    
    expect(screen.getByText('My Dashboard')).toBeInTheDocument();
    expect(screen.queryByText('Admin Dashboard')).not.toBeInTheDocument();
  });
});