import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RegistrationChart from '../../../components/charts/RegistrationChart';
import { getAggregateUsersByMonthAndType } from '../../../components/user/UserService';

// Mock the UserService
jest.mock('../../../components/user/UserService');

// Mock NoDataAvailable component
jest.mock('../../../components/common/NoDataAvailable', () => {
  return function MockNoDataAvailable({ dataType, message }) {
    return (
      <div data-testid="no-data-available">
        <span>No data: {dataType}</span>
        {message && <span>Error: {message}</span>}
      </div>
    );
  };
});

// Mock Recharts components
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
  BarChart: ({ children, data }) => (
    <div data-testid="bar-chart" data-chart-data={JSON.stringify(data)}>
      {children}
    </div>
  ),
  Bar: ({ dataKey, fill }) => <div data-testid={`bar-${dataKey}`} data-fill={fill} />,
  XAxis: ({ dataKey }) => <div data-testid="x-axis" data-key={dataKey} />,
  YAxis: () => <div data-testid="y-axis" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
}));

describe('RegistrationChart', () => {
  const mockGetAggregateUsersByMonthAndType = getAggregateUsersByMonthAndType;

  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn();
  });

  it('renders chart with data successfully', async () => {
    const mockData = {
      'January 2024': { VET: 5, PATIENT: 10 },
      'February 2024': { VET: 3, PATIENT: 8 },
    };

    mockGetAggregateUsersByMonthAndType.mockResolvedValue({
      data: mockData,
    });

    render(<RegistrationChart />);

    await waitFor(() => {
      expect(screen.getByText('Users Registration Overview')).toBeInTheDocument();
    });

    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('bar-Veterinarians')).toBeInTheDocument();
    expect(screen.getByTestId('bar-Patients')).toBeInTheDocument();
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    expect(screen.getByTestId('legend')).toBeInTheDocument();
  });

  it('renders NoDataAvailable when userData is empty', async () => {
    mockGetAggregateUsersByMonthAndType.mockResolvedValue({
      data: {},
    });

    render(<RegistrationChart />);

    await waitFor(() => {
      expect(screen.getByTestId('no-data-available')).toBeInTheDocument();
    });

    expect(screen.getByText('No data: user registration data')).toBeInTheDocument();
    expect(screen.queryByTestId('responsive-container')).not.toBeInTheDocument();
  });

  it('handles API error and displays error message', async () => {
    const errorMessage = 'Network error';
    mockGetAggregateUsersByMonthAndType.mockRejectedValue(new Error(errorMessage));

    render(<RegistrationChart />);

    await waitFor(() => {
      expect(screen.getByTestId('no-data-available')).toBeInTheDocument();
    });

    expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
    expect(console.log).toHaveBeenCalledWith('The error : ', expect.any(Error));
  });

  it('transforms data correctly', async () => {
    const mockData = {
      'March 2024': { VET: 7, PATIENT: 12 },
      'April 2024': { VET: 4 },
    };

    mockGetAggregateUsersByMonthAndType.mockResolvedValue({
      data: mockData,
    });

    render(<RegistrationChart />);

    await waitFor(() => {
      const barChart = screen.getByTestId('bar-chart');
      const chartData = JSON.parse(barChart.getAttribute('data-chart-data'));
      
      expect(chartData).toEqual([
        { name: 'March 2024', Veterinarians: 7, Patients: 12 },
        { name: 'April 2024', Veterinarians: 4, Patients: 0 },
      ]);
    });

    expect(console.log).toHaveBeenCalledWith('The userdata here :', mockData);
  });

  it('handles missing patient data with default value', async () => {
    const mockData = {
      'May 2024': { VET: 2 },
    };

    mockGetAggregateUsersByMonthAndType.mockResolvedValue({
      data: mockData,
    });

    render(<RegistrationChart />);

    await waitFor(() => {
      const barChart = screen.getByTestId('bar-chart');
      const chartData = JSON.parse(barChart.getAttribute('data-chart-data'));
      
      expect(chartData[0].Patients).toBe(0);
      expect(chartData[0].Veterinarians).toBe(2);
    });
  });

  it('handles missing veterinarian data with default value', async () => {
    const mockData = {
      'June 2024': { PATIENT: 15 },
    };

    mockGetAggregateUsersByMonthAndType.mockResolvedValue({
      data: mockData,
    });

    render(<RegistrationChart />);

    await waitFor(() => {
      const barChart = screen.getByTestId('bar-chart');
      const chartData = JSON.parse(barChart.getAttribute('data-chart-data'));
      
      expect(chartData[0].Veterinarians).toBe(0);
      expect(chartData[0].Patients).toBe(15);
    });
  });

  it('calls getAggregateUsersByMonthAndType on component mount', () => {
    mockGetAggregateUsersByMonthAndType.mockResolvedValue({
      data: {},
    });

    render(<RegistrationChart />);

    expect(mockGetAggregateUsersByMonthAndType).toHaveBeenCalledTimes(1);
  });

  it('renders correct bar colors', async () => {
    const mockData = {
      'July 2024': { VET: 1, PATIENT: 1 },
    };

    mockGetAggregateUsersByMonthAndType.mockResolvedValue({
      data: mockData,
    });

    render(<RegistrationChart />);

    await waitFor(() => {
      const vetBar = screen.getByTestId('bar-Veterinarians');
      const patientBar = screen.getByTestId('bar-Patients');
      
      expect(vetBar).toHaveAttribute('data-fill', '#2f6a32');
      expect(patientBar).toHaveAttribute('data-fill', '#d26161');
    });
  });
});