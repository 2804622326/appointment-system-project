import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Component from '../../../components/admin/AdminDashboardSidebar.jsx';

test('renders without crashing', () => {
  expect(Component).toBeDefined();
});

test('renders sidebar with correct brand name', () => {
  const mockProps = {
    openSidebarToggle: false,
    OpenSidebar: jest.fn(),
    onNavigate: jest.fn(),
    activeTab: 'overview'
  };
  
  render(<Component {...mockProps} />);
  expect(screen.getByText('UniPet Care')).toBeInTheDocument();
});

test('applies sidebar-responsive class when openSidebarToggle is true', () => {
  const mockProps = {
    openSidebarToggle: true,
    OpenSidebar: jest.fn(),
    onNavigate: jest.fn(),
    activeTab: 'overview'
  };
  
  render(<Component {...mockProps} />);
  const sidebar = screen.getByRole('complementary');
  expect(sidebar).toHaveClass('sidebar-responsive');
});

test('does not apply sidebar-responsive class when openSidebarToggle is false', () => {
  const mockProps = {
    openSidebarToggle: false,
    OpenSidebar: jest.fn(),
    onNavigate: jest.fn(),
    activeTab: 'overview'
  };
  
  render(<Component {...mockProps} />);
  const sidebar = screen.getByRole('complementary');
  expect(sidebar).not.toHaveClass('sidebar-responsive');
});

test('calls OpenSidebar when close button is clicked', () => {
  const mockOpenSidebar = jest.fn();
  const mockProps = {
    openSidebarToggle: false,
    OpenSidebar: mockOpenSidebar,
    onNavigate: jest.fn(),
    activeTab: 'overview'
  };
  
  render(<Component {...mockProps} />);
  const closeButton = screen.getByRole('button', { hidden: true });
  fireEvent.click(closeButton);
  expect(mockOpenSidebar).toHaveBeenCalledTimes(1);
});

test('renders all navigation items', () => {
  const mockProps = {
    openSidebarToggle: false,
    OpenSidebar: jest.fn(),
    onNavigate: jest.fn(),
    activeTab: 'overview'
  };
  
  render(<Component {...mockProps} />);
  expect(screen.getByText('Dashboard Overview')).toBeInTheDocument();
  expect(screen.getByText('Veterinarians')).toBeInTheDocument();
  expect(screen.getByText('Patients')).toBeInTheDocument();
});

test('applies active class to overview tab when activeTab is overview', () => {
  const mockProps = {
    openSidebarToggle: false,
    OpenSidebar: jest.fn(),
    onNavigate: jest.fn(),
    activeTab: 'overview'
  };
  
  render(<Component {...mockProps} />);
  const overviewItem = screen.getByText('Dashboard Overview').closest('li');
  expect(overviewItem).toHaveClass('active');
});

test('applies active class to veterinarians tab when activeTab is veterinarians', () => {
  const mockProps = {
    openSidebarToggle: false,
    OpenSidebar: jest.fn(),
    onNavigate: jest.fn(),
    activeTab: 'veterinarians'
  };
  
  render(<Component {...mockProps} />);
  const veterinariansItem = screen.getByText('Veterinarians').closest('li');
  expect(veterinariansItem).toHaveClass('active');
});

test('applies active class to patients tab when activeTab is patients', () => {
  const mockProps = {
    openSidebarToggle: false,
    OpenSidebar: jest.fn(),
    onNavigate: jest.fn(),
    activeTab: 'patients'
  };
  
  render(<Component {...mockProps} />);
  const patientsItem = screen.getByText('Patients').closest('li');
  expect(patientsItem).toHaveClass('active');
});

test('calls onNavigate with correct parameter when overview is clicked', () => {
  const mockOnNavigate = jest.fn();
  const mockProps = {
    openSidebarToggle: false,
    OpenSidebar: jest.fn(),
    onNavigate: mockOnNavigate,
    activeTab: 'overview'
  };
  
  render(<Component {...mockProps} />);
  const overviewItem = screen.getByText('Dashboard Overview').closest('li');
  fireEvent.click(overviewItem);
  expect(mockOnNavigate).toHaveBeenCalledWith('overview');
});

test('calls onNavigate with correct parameter when veterinarians is clicked', () => {
  const mockOnNavigate = jest.fn();
  const mockProps = {
    openSidebarToggle: false,
    OpenSidebar: jest.fn(),
    onNavigate: mockOnNavigate,
    activeTab: 'overview'
  };
  
  render(<Component {...mockProps} />);
  const veterinariansItem = screen.getByText('Veterinarians').closest('li');
  fireEvent.click(veterinariansItem);
  expect(mockOnNavigate).toHaveBeenCalledWith('veterinarians');
});

test('calls onNavigate with correct parameter when patients is clicked', () => {
  const mockOnNavigate = jest.fn();
  const mockProps = {
    openSidebarToggle: false,
    OpenSidebar: jest.fn(),
    onNavigate: mockOnNavigate,
    activeTab: 'overview'
  };
  
  render(<Component {...mockProps} />);
  const patientsItem = screen.getByText('Patients').closest('li');
  fireEvent.click(patientsItem);
  expect(mockOnNavigate).toHaveBeenCalledWith('patients');
});
