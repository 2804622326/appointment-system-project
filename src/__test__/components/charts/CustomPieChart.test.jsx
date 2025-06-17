import React from 'react';
import { render, screen } from '@testing-library/react';
import CustomPieChart from '../../../components/charts/CustomPieChart';
import useColorMapping from '../../../components/hooks/ColorMapping';

// Mock the useColorMapping hook
jest.mock('../../../components/hooks/ColorMapping');

// Mock recharts components
jest.mock('recharts', () => ({
  PieChart: ({ children, className }) => <div data-testid="pie-chart" className={className}>{children}</div>,
  Pie: ({ children, dataKey, data, label }) => (
    <div data-testid="pie" data-datakey={dataKey} data-label={label?.toString()}>
      {children}
    </div>
  ),
  Cell: ({ fill }) => <div data-testid="cell" data-fill={fill} />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: ({ layout }) => <div data-testid="legend" data-layout={layout} />,
  ResponsiveContainer: ({ children, width, height }) => (
    <div data-testid="responsive-container" data-width={width} data-height={height}>
      {children}
    </div>
  ),
}));

const mockColorMapping = {
  'Category A': '#FF6384',
  'Category B': '#36A2EB',
  'Category C': '#FFCE56',
};

const mockData = [
  { name: 'Category A', value: 30 },
  { name: 'Category B', value: 45 },
  { name: 'Category C', value: 25 },
];

describe('CustomPieChart', () => {
  beforeEach(() => {
    useColorMapping.mockReturnValue(mockColorMapping);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders CustomPieChart component', () => {
    render(<CustomPieChart data={mockData} />);
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    expect(screen.getByTestId('pie')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    expect(screen.getByTestId('legend')).toBeInTheDocument();
  });

  test('applies default props correctly', () => {
    render(<CustomPieChart data={mockData} />);
    
    const container = screen.getByTestId('responsive-container');
    expect(container).toHaveAttribute('data-width', '80%');
    expect(container).toHaveAttribute('data-height', '400');
    
    const pie = screen.getByTestId('pie');
    expect(pie).toHaveAttribute('data-datakey', 'value');
  });

  test('applies custom props correctly', () => {
    render(
      <CustomPieChart 
        data={mockData} 
        dataKey="customValue"
        nameKey="customName"
        width="100%"
        height={500}
      />
    );
    
    const container = screen.getByTestId('responsive-container');
    expect(container).toHaveAttribute('data-width', '100%');
    expect(container).toHaveAttribute('data-height', '500');
    
    const pie = screen.getByTestId('pie');
    expect(pie).toHaveAttribute('data-datakey', 'customValue');
  });

  test('renders correct number of cells based on data', () => {
    render(<CustomPieChart data={mockData} />);
    
    const cells = screen.getAllByTestId('cell');
    expect(cells).toHaveLength(mockData.length);
  });

  test('applies correct colors to cells', () => {
    render(<CustomPieChart data={mockData} />);
    
    const cells = screen.getAllByTestId('cell');
    expect(cells[0]).toHaveAttribute('data-fill', '#FF6384');
    expect(cells[1]).toHaveAttribute('data-fill', '#36A2EB');
    expect(cells[2]).toHaveAttribute('data-fill', '#FFCE56');
  });

  test('renders with empty data array', () => {
    render(<CustomPieChart data={[]} />);
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    expect(screen.queryAllByTestId('cell')).toHaveLength(0);
  });

  test('renders with null data', () => {
    render(<CustomPieChart data={null} />);
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    expect(screen.queryAllByTestId('cell')).toHaveLength(0);
  });

  test('renders with undefined data', () => {
    render(<CustomPieChart data={undefined} />);
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    expect(screen.queryAllByTestId('cell')).toHaveLength(0);
  });

  test('applies CSS classes correctly', () => {
    render(<CustomPieChart data={mockData} />);
    
    const section = screen.getByTestId('responsive-container').parentElement;
    expect(section).toHaveClass('mb-5', 'mt-5');
    
    const pieChart = screen.getByTestId('pie-chart');
    expect(pieChart).toHaveClass('mt-4');
  });

  test('legend has vertical layout', () => {
    render(<CustomPieChart data={mockData} />);
    
    const legend = screen.getByTestId('legend');
    expect(legend).toHaveAttribute('data-layout', 'vertical');
  });

  test('calls useColorMapping hook', () => {
    render(<CustomPieChart data={mockData} />);
    
    expect(useColorMapping).toHaveBeenCalled();
  });
});