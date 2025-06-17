import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  createMemoryRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
  Outlet,
} from 'react-router-dom';

// Mock route components to avoid rendering the real implementation
jest.mock('../components/layout/RootLayout', () => {
  const React = require('react');
  const { Outlet } = require('react-router-dom');
  return {
    __esModule: true,
    default: () => (
      <div data-testid="root-layout">
        <Outlet />
      </div>
    ),
  };
});

jest.mock('../components/home/Home', () => ({
  __esModule: true,
  default: () => <div>Home Page</div>,
}));

jest.mock('../components/veterinarian/VeterinarianListing', () => ({
  __esModule: true,
  default: () => <div>Veterinarian List</div>,
}));

jest.mock('../components/user/UserRegistration', () => ({
  __esModule: true,
  default: () => <div>User Registration Form</div>,
}));

jest.mock('../components/auth/Login', () => ({
  __esModule: true,
  default: () => <div>Login Page</div>,
}));

jest.mock('../components/admin/AdminDashboard', () => ({
  __esModule: true,
  default: () => <div>Admin Dashboard Page</div>,
}));

const RootLayout = require('../components/layout/RootLayout').default;
const Home = require('../components/home/Home').default;
const VeterinarianListing =
  require('../components/veterinarian/VeterinarianListing').default;
const UserRegistration = require('../components/user/UserRegistration').default;
const Login = require('../components/auth/Login').default;
const AdminDashboard = require('../components/admin/AdminDashboard').default;

const routes = createRoutesFromElements(
  <Route path="/" element={<RootLayout />} errorElement={<h1>Not Found</h1>}>
    <Route index element={<Home />} />
    <Route path="doctors" element={<VeterinarianListing />} />
    <Route path="register-user" element={<UserRegistration />} />
    <Route path="login" element={<Login />} />
    <Route
      path="admin-dashboard/:userId/admin-dashboard"
      element={<AdminDashboard />}
    />
  </Route>
);

const renderWithRouter = (initialEntries) => {
  const router = createMemoryRouter(routes, { initialEntries });
  return render(<RouterProvider router={router} />);
};

describe('App Routing', () => {
  test('renders Home component on default route', () => {
    renderWithRouter(['/']);
    expect(screen.getByText(/home page/i)).toBeInTheDocument();
  });

  test('renders VeterinarianListing component on /doctors', () => {
    renderWithRouter(['/doctors']);
    expect(screen.getByText(/veterinarian list/i)).toBeInTheDocument();
  });

  test('renders UserRegistration component on /register-user', () => {
    renderWithRouter(['/register-user']);
    expect(screen.getByText(/user registration form/i)).toBeInTheDocument();
  });

  test('renders Login component on /login', () => {
    renderWithRouter(['/login']);
    expect(screen.getByText(/login page/i)).toBeInTheDocument();
  });

  test('renders AdminDashboard component on /admin-dashboard', () => {
    renderWithRouter(['/admin-dashboard/1/admin-dashboard']);
    expect(screen.getByText(/admin dashboard page/i)).toBeInTheDocument();
  });

  test('renders Not Found on unknown route', () => {
    renderWithRouter(['/unknown-route']);
    expect(screen.getByText(/not found/i)).toBeInTheDocument();
  });
});