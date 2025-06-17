import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserFilter from '../../../components/user/UserFilter';

describe('UserFilter', () => {
  const mockOnSelectedValue = jest.fn();
  const mockOnClearFilters = jest.fn();
  const defaultProps = {
    label: 'Department',
    values: ['IT', 'HR', 'Finance'],
    selectedValue: '',
    onSelectedValue: mockOnSelectedValue,
    onClearFilters: mockOnClearFilters,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders with correct label', () => {
    render(<UserFilter {...defaultProps} />);
    expect(screen.getByText('Filter by Department')).toBeInTheDocument();
  });

  test('renders select with default option', () => {
    render(<UserFilter {...defaultProps} />);
    expect(screen.getByText('...Select department...')).toBeInTheDocument();
  });

  test('renders all provided values as options', () => {
    render(<UserFilter {...defaultProps} />);
    expect(screen.getByText('IT')).toBeInTheDocument();
    expect(screen.getByText('HR')).toBeInTheDocument();
    expect(screen.getByText('Finance')).toBeInTheDocument();
  });

  test('displays selected value', () => {
    render(<UserFilter {...defaultProps} selectedValue="IT" />);
    expect(screen.getByDisplayValue('IT')).toBeInTheDocument();
  });

  test('calls onSelectedValue when option is selected', () => {
    render(<UserFilter {...defaultProps} />);
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'HR' } });
    expect(mockOnSelectedValue).toHaveBeenCalledWith('HR');
  });

  test('calls onClearFilters when clear button is clicked', () => {
    render(<UserFilter {...defaultProps} />);
    const clearButton = screen.getByText('Clear Filter');
    fireEvent.click(clearButton);
    expect(mockOnClearFilters).toHaveBeenCalled();
  });

  test('renders with empty values array', () => {
    render(<UserFilter {...defaultProps} values={[]} />);
    expect(screen.getByText('...Select department...')).toBeInTheDocument();
    expect(screen.queryByText('IT')).not.toBeInTheDocument();
  });

  test('handles undefined values prop', () => {
    const { values, ...propsWithoutValues } = defaultProps;
    render(<UserFilter {...propsWithoutValues} />);
    expect(screen.getByText('...Select department...')).toBeInTheDocument();
  });

  test('renders clear filter button', () => {
    render(<UserFilter {...defaultProps} />);
    const clearButton = screen.getByRole('button', { name: 'Clear Filter' });
    expect(clearButton).toBeInTheDocument();
    expect(clearButton).toHaveClass('btn-secondary');
  });

  test('select has correct CSS classes', () => {
    render(<UserFilter {...defaultProps} />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('form-control');
  });

  test('input group has correct CSS class', () => {
    const { container } = render(<UserFilter {...defaultProps} />);
    const inputGroup = container.querySelector('.input-group');
    expect(inputGroup).toHaveClass('mb-2');
  });
});