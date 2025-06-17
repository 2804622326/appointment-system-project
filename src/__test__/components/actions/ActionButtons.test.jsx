import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ActionButtons from '../../../components/actions/ActionButtons.jsx';

test('renders without crashing', () => {
  expect(ActionButtons).toBeDefined();
});

test('renders button with correct title', () => {
  render(<ActionButtons title="Click Me" variant="primary" />);
  const buttonElement = screen.getByText(/Click Me/i);
  expect(buttonElement).toBeInTheDocument();
});

test('applies correct variant and className', () => {
  render(<ActionButtons title="Test" variant="secondary" className="custom-class" />);
  const buttonElement = screen.getByText(/Test/i);
  expect(buttonElement).toHaveClass('btn-secondary custom-class');
});

test('disables button when disabled prop is true', () => {
  render(<ActionButtons title="Disabled Button" disabled={true} />);
  const buttonElement = screen.getByText(/Disabled Button/i);
  expect(buttonElement).toBeDisabled();
});

test('calls onClick handler when button is clicked', () => {
  const handleClick = jest.fn();
  render(<ActionButtons title="Click Me" onClick={handleClick} />);
  const buttonElement = screen.getByText(/Click Me/i);
  fireEvent.click(buttonElement);
  expect(handleClick).toHaveBeenCalledTimes(1);
});

