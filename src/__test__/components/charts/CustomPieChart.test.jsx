import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CustomPieChart from '../../../components/charts/CustomPieChart.jsx';

jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  PieChart: ({ children }) => <div data-testid='pie-chart'>{children}</div>,
  Pie: ({ children }) => <div>{children}</div>,
  Cell: () => <div data-testid='cell' />,
  Tooltip: () => <div />,
  Legend: () => <div />,
}));

jest.mock('../../../components/hooks/ColorMapping', () => () => ({ A: '#111' }));

test('renders custom pie chart with cells', () => {
  const { asFragment } = render(<CustomPieChart data={[{ name: 'A', value: 10 }]} />);
  expect(screen.getAllByTestId('cell')).toHaveLength(1);
  expect(asFragment()).toMatchSnapshot();
});
