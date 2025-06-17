import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AppointmentChart from '../../../components/charts/AppointmentChart';
import { getAppointmentsSummary } from '../../../components/appointment/AppointmentService';

// Mock the dependencies
jest.mock('../../../components/charts/CustomPieChart', () => {
  return function MockCustomPieChart({ data }) {
    return <div data-testid="custom-pie-chart">Chart with {data.length} items</div>;
  };
});

jest.mock('../../../components/common/NoDataAvailable', () => {
  return function MockNoDataAvailable({ dataType, message }) {
    return (
      <div data-testid="no-data-available">
        <span>No{dataType}available</span>
        {message && <span>{message}</span>}
      </div>
    );
  };
});

jest.mock('../../../components/appointment/AppointmentService', () => ({
  getAppointmentsSummary: jest.fn(),
}));

describe('AppointmentChart', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn();
  });

  test('renders chart with data when appointment data is available', async () => {
    const mockData = [
      { status: 'confirmed', count: 10 },
      { status: 'pending', count: 5 },
    ];
    
    getAppointmentsSummary.mockResolvedValue({ data: mockData });

    render(<AppointmentChart />);

    await waitFor(() => {
      expect(screen.getByText('Appointments Overview')).toBeInTheDocument();
      expect(screen.getByTestId('custom-pie-chart')).toBeInTheDocument();
      expect(screen.getByText('Chart with 2 items')).toBeInTheDocument();
    });

    expect(getAppointmentsSummary).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith('yeeeeeeeeeh', mockData);
  });

  test('renders NoDataAvailable when appointment data is empty', async () => {
    getAppointmentsSummary.mockResolvedValue({ data: [] });

    render(<AppointmentChart />);

    await waitFor(() => {
      expect(screen.getByTestId('no-data-available')).toBeInTheDocument();
      expect(screen.getByText('No appointment data available')).toBeInTheDocument();
    });

    expect(screen.queryByText('Appointments Overview')).not.toBeInTheDocument();
    expect(screen.queryByTestId('custom-pie-chart')).not.toBeInTheDocument();
  });

  test('renders NoDataAvailable when appointment data is null', async () => {
    getAppointmentsSummary.mockResolvedValue({ data: null });

    render(<AppointmentChart />);

    await waitFor(() => {
      expect(screen.getByTestId('no-data-available')).toBeInTheDocument();
    });

    expect(screen.queryByText('Appointments Overview')).not.toBeInTheDocument();
  });

  test('handles API error and displays error message', async () => {
    const errorMessage = 'Failed to fetch appointments';
    getAppointmentsSummary.mockRejectedValue(new Error(errorMessage));

    render(<AppointmentChart />);

    await waitFor(() => {
      expect(screen.getByTestId('no-data-available')).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    expect(screen.queryByText('Appointments Overview')).not.toBeInTheDocument();
    expect(screen.queryByTestId('custom-pie-chart')).not.toBeInTheDocument();
  });

  test('initially renders NoDataAvailable while loading', () => {
    getAppointmentsSummary.mockImplementation(() => new Promise(() => {}));

    render(<AppointmentChart />);

    expect(screen.getByTestId('no-data-available')).toBeInTheDocument();
    expect(screen.queryByText('Appointments Overview')).not.toBeInTheDocument();
  });

  test('renders section element as container', async () => {
    getAppointmentsSummary.mockResolvedValue({ data: [{ status: 'confirmed', count: 1 }] });

    const { container } = render(<AppointmentChart />);

    expect(container.querySelector('section')).toBeInTheDocument();
  });

  test('applies correct CSS classes', async () => {
    getAppointmentsSummary.mockResolvedValue({ data: [{ status: 'confirmed', count: 1 }] });

    render(<AppointmentChart />);

    await waitFor(() => {
      const heading = screen.getByText('Appointments Overview');
      expect(heading).toHaveClass('mb-4', 'chart-title');
    });
  });
});