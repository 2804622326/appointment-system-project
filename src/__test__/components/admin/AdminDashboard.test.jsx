import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminDashboard from '../../../components/admin/AdminDashboard';

// Mock the child components
jest.mock('../../../components/admin/AdminOverview', () => {
  return function AdminOverview() {
    return <div data-testid="admin-overview">Admin Overview</div>;
  };
});

jest.mock('../../../components/admin/AdminDashboardSidebar', () => {
  return function AdminDashboardSidebar({ openSidebarToggle, OpenSidebar, onNavigate, activeTab }) {
    return (
      <div data-testid="admin-sidebar">
        <button onClick={OpenSidebar}>Toggle Sidebar</button>
        <div>Sidebar Open: {openSidebarToggle ? 'true' : 'false'}</div>
        <div>Active Tab: {activeTab}</div>
        <button onClick={() => onNavigate('veterinarians')}>Veterinarians</button>
        <button onClick={() => onNavigate('patients')}>Patients</button>
        <button onClick={() => onNavigate('overview')}>Overview</button>
      </div>
    );
  };
});

jest.mock('../../../components/admin/VeterinarianComponent', () => {
  return function VeterinarianComponent() {
    return <div data-testid="veterinarian-component">Veterinarian Component</div>;
  };
});

jest.mock('../../../components/admin/PatientComponent', () => {
  return function PatientComponent() {
    return <div data-testid="patient-component">Patient Component</div>;
  };
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock;

describe('AdminDashboard', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
  });

  test('renders admin dashboard with default structure', () => {
    localStorageMock.getItem.mockReturnValue('overview');
    render(<AdminDashboard />);
    
    expect(screen.getByRole('main')).toHaveClass('admin-body');
    expect(screen.getByTestId('admin-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('admin-overview')).toBeInTheDocument();
  });

  test('initializes with overview when no localStorage value', () => {
    localStorageMock.getItem.mockReturnValue(null);
    render(<AdminDashboard />);
    
    expect(screen.getByText('Active Tab: overview')).toBeInTheDocument();
    expect(screen.getByTestId('admin-overview')).toBeInTheDocument();
  });

  test('initializes with stored active content from localStorage', () => {
    localStorageMock.getItem.mockReturnValue('veterinarians');
    render(<AdminDashboard />);
    
    expect(screen.getByText('Active Tab: veterinarians')).toBeInTheDocument();
    expect(screen.getByTestId('veterinarian-component')).toBeInTheDocument();
  });

  test('toggles sidebar state when OpenSidebar is called', () => {
    render(<AdminDashboard />);
    
    expect(screen.getByText('Sidebar Open: false')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Toggle Sidebar'));
    expect(screen.getByText('Sidebar Open: true')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Toggle Sidebar'));
    expect(screen.getByText('Sidebar Open: false')).toBeInTheDocument();
  });

  test('navigates to veterinarians component and saves to localStorage', () => {
    render(<AdminDashboard />);
    
    fireEvent.click(screen.getByText('Veterinarians'));
    
    expect(screen.getByTestId('veterinarian-component')).toBeInTheDocument();
    expect(screen.queryByTestId('admin-overview')).not.toBeInTheDocument();
    expect(localStorageMock.setItem).toHaveBeenCalledWith('activeContent', 'veterinarians');
  });

  test('navigates to patients component and saves to localStorage', () => {
    render(<AdminDashboard />);
    
    fireEvent.click(screen.getByText('Patients'));
    
    expect(screen.getByTestId('patient-component')).toBeInTheDocument();
    expect(screen.queryByTestId('admin-overview')).not.toBeInTheDocument();
    expect(localStorageMock.setItem).toHaveBeenCalledWith('activeContent', 'patients');
  });

  test('navigates back to overview component', () => {
    localStorageMock.getItem.mockReturnValue('veterinarians');
    render(<AdminDashboard />);
    
    expect(screen.getByTestId('veterinarian-component')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Overview'));
    
    expect(screen.getByTestId('admin-overview')).toBeInTheDocument();
    expect(screen.queryByTestId('veterinarian-component')).not.toBeInTheDocument();
    expect(localStorageMock.setItem).toHaveBeenCalledWith('activeContent', 'overview');
  });

  test('passes correct props to AdminDashboardSidebar', () => {
    render(<AdminDashboard />);
    
    const sidebar = screen.getByTestId('admin-sidebar');
    expect(sidebar).toBeInTheDocument();
    expect(screen.getByText('Sidebar Open: false')).toBeInTheDocument();
    expect(screen.getByText('Active Tab: overview')).toBeInTheDocument();
  });

  test('renders only one active component at a time', () => {
    render(<AdminDashboard />);
    
    // Initially shows overview
    expect(screen.getByTestId('admin-overview')).toBeInTheDocument();
    expect(screen.queryByTestId('veterinarian-component')).not.toBeInTheDocument();
    expect(screen.queryByTestId('patient-component')).not.toBeInTheDocument();
    
    // Switch to veterinarians
    fireEvent.click(screen.getByText('Veterinarians'));
    expect(screen.queryByTestId('admin-overview')).not.toBeInTheDocument();
    expect(screen.getByTestId('veterinarian-component')).toBeInTheDocument();
    expect(screen.queryByTestId('patient-component')).not.toBeInTheDocument();
    
    // Switch to patients
    fireEvent.click(screen.getByText('Patients'));
    expect(screen.queryByTestId('admin-overview')).not.toBeInTheDocument();
    expect(screen.queryByTestId('veterinarian-component')).not.toBeInTheDocument();
    expect(screen.getByTestId('patient-component')).toBeInTheDocument();
  });
});