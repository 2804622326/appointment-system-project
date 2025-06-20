import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AccountChart from '../../../components/charts/AccountChart.jsx';

jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  PieChart: ({ children }) => <div data-testid='pie-chart'>{children}</div>,
  Pie: ({ children }) => <div>{children}</div>,
  Cell: () => <div />,
  Tooltip: () => <div />,
  Legend: () => <div />,
}));

jest.mock('../../../components/user/UserService.js', () => ({
  getAggregatedUsersAccountByActiveStatus: jest.fn(() => Promise.resolve({ data: { Enabled: { PATIENT: 1, VET: 2 } } })),
}));

jest.mock('../../../components/common/NoDataAvailable.jsx', () => () => <div data-testid='no-data' />);

test('renders account chart with data', async () => {
  const { asFragment } = render(<AccountChart />);
  await waitFor(() => screen.getByText(/account activity overview/i));
  expect(screen.queryByTestId('no-data')).not.toBeInTheDocument();
  expect(asFragment()).toMatchSnapshot();
});
