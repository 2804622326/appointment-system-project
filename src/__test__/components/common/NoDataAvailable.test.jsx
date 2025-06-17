import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import NoDataAvailable from '../../../components/common/NoDataAvailable';

describe('NoDataAvailable', () => {
  test('renders with dataType prop', () => {
    render(<NoDataAvailable dataType="appointments" />);
    
    expect(screen.getByText('No appointments available at the moment')).toBeInTheDocument();
  });

  test('renders without errorMessage when not provided', () => {
    render(<NoDataAvailable dataType="patients" />);
    
    expect(screen.getByText('No patients available at the moment')).toBeInTheDocument();
    expect(screen.queryByText(/text-danger/)).not.toBeInTheDocument();
  });

  test('renders with errorMessage when provided', () => {
    const errorMessage = 'Failed to load data';
    render(<NoDataAvailable dataType="doctors" errorMessage={errorMessage} />);
    
    expect(screen.getByText('No doctors available at the moment')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  test('applies correct CSS classes', () => {
    const { container } = render(<NoDataAvailable dataType="data" />);
    
    const mainDiv = container.firstChild;
    expect(mainDiv).toHaveClass('text-center', 'mt-5');
  });

  test('error message has correct CSS class', () => {
    render(<NoDataAvailable dataType="data" errorMessage="Error occurred" />);
    
    const errorElement = screen.getByText('Error occurred');
    expect(errorElement).toHaveClass('text-danger');
  });

  test('handles empty dataType prop', () => {
    render(<NoDataAvailable dataType="" />);
    
    expect(screen.getByText('No  available at the moment')).toBeInTheDocument();
  });

  test('handles undefined dataType prop', () => {
    render(<NoDataAvailable />);
    
    expect(screen.getByText('No undefined available at the moment')).toBeInTheDocument();
  });
});