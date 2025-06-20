import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AppointmentChart from '../../../components/charts/AppointmentChart.jsx';

jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
}));

jest.mock('../../../components/charts/CustomPieChart.jsx', () => () => <div data-testid='pie' />);

jest.mock('../../../components/appointment/AppointmentService.js', () => ({
  getAppointmentsSummary: jest.fn(() => Promise.resolve({ data: [{ name: 'a', value: 1 }] })),
}));

jest.mock('../../../components/common/NoDataAvailable.jsx', () => () => <div data-testid='no-data' />);

test('shows appointment chart with data', async () => {
  const { asFragment } = render(<AppointmentChart />);
  await waitFor(() => screen.getByText(/appointments overview/i));
  expect(screen.getByTestId('pie')).toBeInTheDocument();
  expect(asFragment()).toMatchSnapshot();
});
