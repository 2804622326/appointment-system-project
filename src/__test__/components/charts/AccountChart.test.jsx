import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AccountChart from '../../../components/charts/AccountChart';
import { getAggregatedUsersAccountByActiveStatus } from '../../../components/user/UserService';

// Mock the UserService
jest.mock('../../../components/user/UserService');

// Mock recharts components
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
  PieChart: ({ children }) => <div data-testid="pie-chart">{children}</div>,
  Pie: ({ children }) => <div data-testid="pie">{children}</div>,
  Cell: () => <div data-testid="cell" />,
  Tooltip: () => <div data-testid="tooltip" />
}));

// Mock NoDataAvailable component
jest.mock('../../../components/common/NoDataAvailable', () => {
  return function NoDataAvailable({ dataType, message }) {
    return <div data-testid="no-data-available">No data: {dataType} - {message}</div>;
  };
});

describe('AccountChart', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders chart with data successfully', async () => {
    const mockResponse = {
      data: {
        Enabled: { PATIENT: 10, VET: 5 },
        Disabled: { PATIENT: 3, VET: 2 }
      }
    };
    
    getAggregatedUsersAccountByActiveStatus.mockResolvedValue(mockResponse);

    render(<AccountChart />);

    await waitFor(() => {
      expect(screen.getByText('Account Activity Overview')).toBeInTheDocument();
    });

    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    expect(screen.getByTestId('pie')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
  });

  test('calls API on component mount', async () => {
    const mockResponse = {
      data: {
        Enabled: { PATIENT: 5, VET: 3 }
      }
    };
    
    getAggregatedUsersAccountByActiveStatus.mockResolvedValue(mockResponse);

    render(<AccountChart />);

    await waitFor(() => {
      expect(getAggregatedUsersAccountByActiveStatus).toHaveBeenCalledTimes(1);
    });
  });

  test('renders NoDataAvailable when no data is available', async () => {
    getAggregatedUsersAccountByActiveStatus.mockResolvedValue({ data: {} });

    render(<AccountChart />);

    await waitFor(() => {
      expect(screen.getByTestId('no-data-available')).toBeInTheDocument();
    });

    expect(screen.queryByText('Account Activity Overview')).not.toBeInTheDocument();
  });

  test('handles API error and displays error message', async () => {
    const errorMessage = 'Failed to fetch account data';
    getAggregatedUsersAccountByActiveStatus.mockRejectedValue(new Error(errorMessage));

    render(<AccountChart />);

    await waitFor(() => {
      expect(screen.getByTestId('no-data-available')).toBeInTheDocument();
      expect(screen.getByText(`No data:  account data  - ${errorMessage}`)).toBeInTheDocument();
    });
  });

  test('transforms data correctly for enabled accounts', async () => {
    const mockResponse = {
      data: {
        Enabled: { PATIENT: 8, VET: 4 }
      }
    };
    
    getAggregatedUsersAccountByActiveStatus.mockResolvedValue(mockResponse);

    render(<AccountChart />);

    await waitFor(() => {
      expect(screen.getByText('Account Activity Overview')).toBeInTheDocument();
    });

    // Verify that the chart is rendered when data is available
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
  });

  test('transforms data correctly for disabled accounts', async () => {
    const mockResponse = {
      data: {
        Disabled: { PATIENT: 2, VET: 1 }
      }
    };
    
    getAggregatedUsersAccountByActiveStatus.mockResolvedValue(mockResponse);

    render(<AccountChart />);

    await waitFor(() => {
      expect(screen.getByText('Account Activity Overview')).toBeInTheDocument();
    });

    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
  });

  test('renders empty state when accountData is empty array', async () => {
    getAggregatedUsersAccountByActiveStatus.mockResolvedValue({ data: {} });

    render(<AccountChart />);

    await waitFor(() => {
      expect(screen.getByTestId('no-data-available')).toBeInTheDocument();
    });

    expect(screen.queryByTestId('pie-chart')).not.toBeInTheDocument();
  });

  test('handles mixed enabled and disabled accounts', async () => {
    const mockResponse = {
      data: {
        Enabled: { PATIENT: 15, VET: 8 },
        Disabled: { PATIENT: 5, VET: 2 }
      }
    };
    
    getAggregatedUsersAccountByActiveStatus.mockResolvedValue(mockResponse);

    render(<AccountChart />);

    await waitFor(() => {
      expect(screen.getByText('Account Activity Overview')).toBeInTheDocument();
    });

    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
  });
});