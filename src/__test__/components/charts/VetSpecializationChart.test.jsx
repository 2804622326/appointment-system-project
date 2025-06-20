import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import VetSpecializationChart from '../../../components/charts/VetSpecializationChart.jsx';

jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  BarChart: ({ children }) => <div data-testid='bar-chart'>{children}</div>,
  XAxis: () => <div />,
  YAxis: () => <div />,
  Tooltip: () => <div />,
  Legend: () => <div />,
  Bar: ({ children }) => <div>{children}</div>,
  Cell: () => <div />,
}));

jest.mock('../../../components/utils/utilities', () => ({
  generateColor: jest.fn(() => '#111'),
}));

jest.mock('../../../components/user/UserService.js', () => ({
  aggregateVetBySpecialization: jest.fn(() => Promise.resolve([{ specialization: 'Surgery', count: 2 }])),
}));

jest.mock('../../../components/common/NoDataAvailable.jsx', () => () => <div data-testid='no-data' />);

test('renders vet specialization chart with data', async () => {
  const { asFragment } = render(<VetSpecializationChart />);
  await waitFor(() => screen.getByText(/veterinarians by specializations/i));
  expect(screen.queryByTestId('no-data')).not.toBeInTheDocument();
  expect(asFragment()).toMatchSnapshot();
});
