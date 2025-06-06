import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ActionButtons from '../src/components/actions/ActionButtons.jsx';
import '@testing-library/jest-dom';

describe('ActionButtons component', () => {
  test('renders with provided title and variant', () => {
    render(<ActionButtons title="Click Me" variant="primary" />);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn-primary');
  });

  test('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<ActionButtons title="Submit" onClick={handleClick} />);
    const button = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('disabled prop prevents clicks', () => {
    const handleClick = jest.fn();
    render(<ActionButtons title="Disabled" disabled onClick={handleClick} />);
    const button = screen.getByRole('button', { name: /disabled/i });
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });
});
