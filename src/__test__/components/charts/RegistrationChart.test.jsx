import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RegistrationChart from '../../../components/charts/RegistrationChart.jsx';

jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  BarChart: ({ children }) => <div data-testid='bar-chart'>{children}</div>,
  XAxis: () => <div />,
  YAxis: () => <div />,
  Tooltip: () => <div />,
  Legend: () => <div />,
  Bar: () => <div />,
}));

jest.mock('../../../components/user/UserService.js', () => ({
  getAggregateUsersByMonthAndType: jest.fn(() => Promise.resolve({ data: { January: { VET: 2, PATIENT: 1 } } })),
}));

jest.mock('../../../components/common/NoDataAvailable.jsx', () => () => <div data-testid='no-data' />);

test('renders registration chart with data', async () => {
  const { asFragment } = render(<RegistrationChart />);
  await waitFor(() => screen.getByText(/users registration overview/i));
  expect(screen.queryByTestId('no-data')).not.toBeInTheDocument();
  expect(asFragment()).toMatchSnapshot();
});
