import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AppointmentFilter from '../../../components/appointment/AppointmentFilter';
import { formatAppointmentStatus } from '../../../components/utils/utilities';

// Mock the utilities module
jest.mock('../../../components/utils/utilities', () => ({
  formatAppointmentStatus: jest.fn((status) => status.charAt(0).toUpperCase() + status.slice(1))
}));

describe('AppointmentFilter', () => {
  const mockOnSelectStatus = jest.fn();
  const mockOnClearFilters = jest.fn();
  const defaultProps = {
    statuses: ['pending', 'confirmed', 'cancelled'],
    selectedStatus: 'all',
    onSelectStatus: mockOnSelectStatus,
    onClearFilters: mockOnClearFilters,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders filter form with default props', () => {
    render(<AppointmentFilter {...defaultProps} />);
    
    expect(screen.getByText('Filter appointments by status:')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Clear filter' })).toBeInTheDocument();
  });

  test('renders all status options including default "all" option', () => {
    render(<AppointmentFilter {...defaultProps} />);
    
    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('all');
    
    const allOption = screen.getByRole('option', { name: 'all' });
    expect(allOption).toBeInTheDocument();
    expect(allOption).toHaveValue('all');
  });

  test('renders status options from props', () => {
    render(<AppointmentFilter {...defaultProps} />);
    
    defaultProps.statuses.forEach(status => {
      const option = screen.getByRole('option', { name: formatAppointmentStatus(status) });
      expect(option).toBeInTheDocument();
      expect(option).toHaveValue(status);
    });
  });

  test('calls onSelectStatus when status is changed', () => {
    render(<AppointmentFilter {...defaultProps} />);
    
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'pending' } });
    
    expect(mockOnSelectStatus).toHaveBeenCalledWith('pending');
    expect(mockOnSelectStatus).toHaveBeenCalledTimes(1);
  });

  test('calls onClearFilters when clear button is clicked', () => {
    render(<AppointmentFilter {...defaultProps} />);
    
    const clearButton = screen.getByRole('button', { name: 'Clear filter' });
    fireEvent.click(clearButton);
    
    expect(mockOnClearFilters).toHaveBeenCalledTimes(1);
  });

  test('displays selected status correctly', () => {
    const propsWithSelectedStatus = {
      ...defaultProps,
      selectedStatus: 'confirmed'
    };
    
    render(<AppointmentFilter {...propsWithSelectedStatus} />);
    
    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('confirmed');
  });

  test('handles empty statuses array', () => {
    const propsWithEmptyStatuses = {
      ...defaultProps,
      statuses: []
    };
    
    render(<AppointmentFilter {...propsWithEmptyStatuses} />);
    
    const allOption = screen.getByRole('option', { name: 'all' });
    expect(allOption).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(1);
  });

  test('calls formatAppointmentStatus for each status', () => {
    render(<AppointmentFilter {...defaultProps} />);
    
    expect(formatAppointmentStatus).toHaveBeenCalledTimes(defaultProps.statuses.length);
    defaultProps.statuses.forEach(status => {
      expect(formatAppointmentStatus).toHaveBeenCalledWith(status);
    });
  });

  test('renders with correct CSS classes', () => {
    const { container } = render(<AppointmentFilter {...defaultProps} />);
    
    expect(container.querySelector('.mt-5')).toBeInTheDocument();
    expect(container.querySelector('.container')).toBeInTheDocument();
  });

  test('button has correct variant and type attributes', () => {
    render(<AppointmentFilter {...defaultProps} />);
    
    const clearButton = screen.getByRole('button', { name: 'Clear filter' });
    expect(clearButton).toHaveAttribute('type', 'button');
    expect(clearButton).toHaveClass('btn-secondary');
  });
});