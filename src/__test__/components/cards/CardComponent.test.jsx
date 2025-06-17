import React from 'react';
import { render, screen } from '@testing-library/react';
import CardComponent from '../../../components/cards/CardComponent';

// Mock icon component for testing
const MockIcon = ({ className }) => <div className={className} data-testid="mock-icon">Icon</div>;

describe('CardComponent', () => {
  const defaultProps = {
    label: 'Test Label',
    count: 42,
    IconComponent: MockIcon
  };

  test('renders card component with all props', () => {
    render(<CardComponent {...defaultProps} />);
    
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
  });

  test('applies correct CSS classes', () => {
    const { container } = render(<CardComponent {...defaultProps} />);
    
    expect(container.querySelector('.admin-card')).toBeInTheDocument();
    expect(container.querySelector('.card-inner')).toBeInTheDocument();
    expect(container.querySelector('.card-icon')).toBeInTheDocument();
  });

  test('renders with different label', () => {
    render(<CardComponent {...defaultProps} label="Different Label" />);
    expect(screen.getByText('Different Label')).toBeInTheDocument();
  });

  test('renders with different count', () => {
    render(<CardComponent {...defaultProps} count={100} />);
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  test('renders with zero count', () => {
    render(<CardComponent {...defaultProps} count={0} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  test('passes className prop to IconComponent', () => {
    render(<CardComponent {...defaultProps} />);
    expect(screen.getByTestId('mock-icon')).toHaveClass('card-icon');
  });

  test('renders count in h3 element', () => {
    render(<CardComponent {...defaultProps} />);
    const countElement = screen.getByRole('heading', { level: 3 });
    expect(countElement).toHaveTextContent('42');
  });
});