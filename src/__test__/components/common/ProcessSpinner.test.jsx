import React from 'react';
import { render, screen } from '@testing-library/react';
import ProcessSpinner from '../../../components/common/ProcessSpinner';

describe('ProcessSpinner', () => {
  test('renders with default props', () => {
    render(<ProcessSpinner />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute('aria-hidden', 'true');
  });

  test('renders with custom size prop', () => {
    render(<ProcessSpinner size="lg" />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
  });

  test('renders with custom animation prop', () => {
    render(<ProcessSpinner animation="grow" />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
  });

  test('renders with message', () => {
    const message = 'Loading...';
    render(<ProcessSpinner message={message} />);
    
    const messageElement = screen.getByText(message);
    expect(messageElement).toBeInTheDocument();
    expect(messageElement).toHaveClass('sr-only');
  });

  test('does not render message span when message is empty', () => {
    render(<ProcessSpinner message="" />);
    
    const messageElement = screen.queryByText('');
    expect(messageElement).not.toBeInTheDocument();
  });

  test('renders with all custom props', () => {
    const message = 'Processing...';
    render(<ProcessSpinner size="lg" animation="grow" message={message} />);
    
    const spinner = screen.getByRole('status');
    const messageElement = screen.getByText(message);
    
    expect(spinner).toBeInTheDocument();
    expect(messageElement).toBeInTheDocument();
    expect(messageElement).toHaveClass('sr-only');
  });

  test('has correct CSS classes', () => {
    const { container } = render(<ProcessSpinner />);
    
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('text-center');
  });
});