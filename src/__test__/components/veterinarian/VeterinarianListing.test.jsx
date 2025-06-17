import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import VeterinarianListing from '../../../components/veterinarian/VeterinarianListing';
import { getVeterinarians } from '../../../components/veterinarian/VeterinarianService';

// Mock the dependencies
jest.mock('../../../components/veterinarian/VeterinarianService');
jest.mock('../../../components/veterinarian/VeterinarianCard', () => {
  return function MockVeterinarianCard({ vet }) {
    return <div data-testid="veterinarian-card">{vet.name}</div>;
  };
});
jest.mock('../../../components/veterinarian/VeterinarianSearch', () => {
  return function MockVeterinarianSearch({ onSearchResult }) {
    return (
      <div data-testid="veterinarian-search">
        <button onClick={() => onSearchResult(null)}>Reset Search</button>
        <button onClick={() => onSearchResult([{ name: 'Dr. Smith' }])}>Search</button>
        <button onClick={() => onSearchResult([])}>Empty Search</button>
      </div>
    );
  };
});
jest.mock('../../../components/hooks/UseMessageAlerts', () => {
  return jest.fn(() => ({
    errorMessage: '',
    setErrorMessage: jest.fn(),
    showErrorAlert: false,
    setShowErrorAlert: jest.fn()
  }));
});
jest.mock('../../../components/common/NoDataAvailable', () => {
  return function MockNoDataAvailable({ dataType, message }) {
    return <div data-testid="no-data-available">{dataType} - {message}</div>;
  };
});
jest.mock('../../../components/common/LoadSpinner', () => {
  return function MockLoadSpinner() {
    return <div data-testid="load-spinner">Loading...</div>;
  };
});

const mockVeterinarians = [
  { id: 1, name: 'Dr. John Doe', specialty: 'General' },
  { id: 2, name: 'Dr. Jane Smith', specialty: 'Surgery' }
];

describe('VeterinarianListing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading spinner initially', () => {
    getVeterinarians.mockImplementation(() => new Promise(() => {}));
    render(<VeterinarianListing />);
    expect(screen.getByTestId('load-spinner')).toBeInTheDocument();
  });

  test('renders veterinarians successfully', async () => {
    getVeterinarians.mockResolvedValue({ data: mockVeterinarians });
    render(<VeterinarianListing />);

    await waitFor(() => {
      expect(screen.queryByTestId('load-spinner')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Meet Our Veterinarians')).toBeInTheDocument();
    expect(screen.getAllByTestId('veterinarian-card')).toHaveLength(2);
    expect(screen.getByText('Dr. John Doe')).toBeInTheDocument();
    expect(screen.getByText('Dr. Jane Smith')).toBeInTheDocument();
  });

  test('renders NoDataAvailable when no veterinarians', async () => {
    getVeterinarians.mockResolvedValue({ data: [] });
    render(<VeterinarianListing />);

    await waitFor(() => {
      expect(screen.queryByTestId('load-spinner')).not.toBeInTheDocument();
    });

    expect(screen.getByTestId('no-data-available')).toBeInTheDocument();
  });

  test('handles API error', async () => {
    const mockError = {
      response: { data: { message: 'Failed to fetch veterinarians' } }
    };
    getVeterinarians.mockRejectedValue(mockError);
    
    render(<VeterinarianListing />);

    await waitFor(() => {
      expect(screen.queryByTestId('load-spinner')).not.toBeInTheDocument();
    });

    expect(screen.getByTestId('no-data-available')).toBeInTheDocument();
  });

  test('handles search result with null (reset)', async () => {
    getVeterinarians.mockResolvedValue({ data: mockVeterinarians });
    render(<VeterinarianListing />);

    await waitFor(() => {
      expect(screen.queryByTestId('load-spinner')).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Reset Search'));
    expect(screen.getAllByTestId('veterinarian-card')).toHaveLength(2);
  });

  test('handles search result with filtered veterinarians', async () => {
    getVeterinarians.mockResolvedValue({ data: mockVeterinarians });
    render(<VeterinarianListing />);

    await waitFor(() => {
      expect(screen.queryByTestId('load-spinner')).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Search'));
    expect(screen.getAllByTestId('veterinarian-card')).toHaveLength(1);
    expect(screen.getByText('Dr. Smith')).toBeInTheDocument();
  });

  test('handles search result with empty array', async () => {
    getVeterinarians.mockResolvedValue({ data: mockVeterinarians });
    render(<VeterinarianListing />);

    await waitFor(() => {
      expect(screen.queryByTestId('load-spinner')).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Empty Search'));
    expect(screen.queryByTestId('veterinarian-card')).not.toBeInTheDocument();
    expect(screen.getByTestId('no-data-available')).toBeInTheDocument();
  });

  test('renders VeterinarianSearch component', async () => {
    getVeterinarians.mockResolvedValue({ data: mockVeterinarians });
    render(<VeterinarianListing />);

    await waitFor(() => {
      expect(screen.queryByTestId('load-spinner')).not.toBeInTheDocument();
    });

    expect(screen.getByTestId('veterinarian-search')).toBeInTheDocument();
  });
});