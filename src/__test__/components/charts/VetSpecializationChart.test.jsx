import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import VetSpecializationChart from '../../../components/charts/VetSpecializationChart';
import { aggregateVetBySpecialization } from '../../../components/user/UserService';
import { generateColor } from '../../../components/utils/utilities';

// Mock dependencies
jest.mock('../../../components/user/UserService');
jest.mock('../../../components/utils/utilities');
jest.mock('../../../components/common/NoDataAvailable', () => {
  return function MockNoDataAvailable({ dataType, message }) {
    return <div data-testid="no-data-available">No data: {dataType} - {message}</div>;
  };
});

// Mock recharts
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
  BarChart: ({ children, data }) => <div data-testid="bar-chart" data-chart-data={JSON.stringify(data)}>{children}</div>,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  Bar: ({ children }) => <div data-testid="bar">{children}</div>,
  Cell: ({ fill }) => <div data-testid="cell" data-fill={fill} />
}));

describe('VetSpecializationChart', () => {
  const mockVetData = [
    { specialization: 'Cardiology', count: 5 },
    { specialization: 'Dermatology', count: 3 },
    { specialization: 'Surgery', count: 7 }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    generateColor.mockImplementation((spec) => `#${spec.toLowerCase()}`);
  });

  it('renders chart with veterinarian specialization data', async () => {
    aggregateVetBySpecialization.mockResolvedValue(mockVetData);

    render(<VetSpecializationChart />);

    await waitFor(() => {
      expect(screen.getByText('Veterinarians by Specializations')).toBeInTheDocument();
    });

    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    expect(screen.getByTestId('legend')).toBeInTheDocument();
    expect(screen.getByTestId('bar')).toBeInTheDocument();
  });

  it('processes data correctly and adds colors', async () => {
    aggregateVetBySpecialization.mockResolvedValue(mockVetData);

    render(<VetSpecializationChart />);

    await waitFor(() => {
      const barChart = screen.getByTestId('bar-chart');
      const chartData = JSON.parse(barChart.getAttribute('data-chart-data'));
      
      expect(chartData).toHaveLength(3);
      expect(chartData[0]).toEqual({
        specialization: 'Cardiology',
        count: 5,
        color: '#cardiology'
      });
    });

    expect(generateColor).toHaveBeenCalledTimes(3);
    expect(generateColor).toHaveBeenCalledWith('Cardiology');
    expect(generateColor).toHaveBeenCalledWith('Dermatology');
    expect(generateColor).toHaveBeenCalledWith('Surgery');
  });

  it('renders cells with correct colors', async () => {
    aggregateVetBySpecialization.mockResolvedValue(mockVetData);

    render(<VetSpecializationChart />);

    await waitFor(() => {
      const cells = screen.getAllByTestId('cell');
      expect(cells).toHaveLength(3);
      expect(cells[0]).toHaveAttribute('data-fill', '#cardiology');
      expect(cells[1]).toHaveAttribute('data-fill', '#dermatology');
      expect(cells[2]).toHaveAttribute('data-fill', '#surgery');
    });
  });

  it('displays NoDataAvailable when no data is returned', async () => {
    aggregateVetBySpecialization.mockResolvedValue([]);

    render(<VetSpecializationChart />);

    await waitFor(() => {
      expect(screen.getByTestId('no-data-available')).toBeInTheDocument();
      expect(screen.getByText(/No data:.*vet specialization data/)).toBeInTheDocument();
    });

    expect(screen.queryByText('Veterinarians by Specializations')).not.toBeInTheDocument();
  });

  it('displays NoDataAvailable with error message when API call fails', async () => {
    const errorMessage = 'Failed to fetch data';
    aggregateVetBySpecialization.mockRejectedValue(new Error(errorMessage));

    render(<VetSpecializationChart />);

    await waitFor(() => {
      expect(screen.getByTestId('no-data-available')).toBeInTheDocument();
      expect(screen.getByText(/No data:.*vet specialization data.*Failed to fetch data/)).toBeInTheDocument();
    });

    expect(screen.queryByText('Veterinarians by Specializations')).not.toBeInTheDocument();
  });

  it('calls aggregateVetBySpecialization on component mount', async () => {
    aggregateVetBySpecialization.mockResolvedValue(mockVetData);

    render(<VetSpecializationChart />);

    expect(aggregateVetBySpecialization).toHaveBeenCalledTimes(1);
  });

  it('handles single veterinarian specialization', async () => {
    const singleVetData = [{ specialization: 'Emergency', count: 1 }];
    aggregateVetBySpecialization.mockResolvedValue(singleVetData);

    render(<VetSpecializationChart />);

    await waitFor(() => {
      expect(screen.getByText('Veterinarians by Specializations')).toBeInTheDocument();
      const cells = screen.getAllByTestId('cell');
      expect(cells).toHaveLength(1);
    });
  });

  it('handles empty specialization name', async () => {
    const emptySpecData = [{ specialization: '', count: 2 }];
    aggregateVetBySpecialization.mockResolvedValue(emptySpecData);

    render(<VetSpecializationChart />);

    await waitFor(() => {
      expect(screen.getByText('Veterinarians by Specializations')).toBeInTheDocument();
    });

    expect(generateColor).toHaveBeenCalledWith('');
  });

  it('handles zero count specializations', async () => {
    const zeroCountData = [{ specialization: 'Oncology', count: 0 }];
    aggregateVetBySpecialization.mockResolvedValue(zeroCountData);

    render(<VetSpecializationChart />);

    await waitFor(() => {
      expect(screen.getByText('Veterinarians by Specializations')).toBeInTheDocument();
      const barChart = screen.getByTestId('bar-chart');
      const chartData = JSON.parse(barChart.getAttribute('data-chart-data'));
      expect(chartData[0].count).toBe(0);
    });
  });
});