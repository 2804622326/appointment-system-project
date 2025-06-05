import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from '@testing-library/react';
import AlertMessage from './AlertMessage';

it('renders nothing when message is empty', () => {
  const { container } = render(<AlertMessage type="success" message="" />);
  expect(container.firstChild).toBeNull();
});

it('shows alert with provided message', () => {
  render(<AlertMessage type="danger" message="Error occurred" />);
  const alert = screen.getByRole('alert');
  expect(alert).toHaveTextContent('Error occurred');
  expect(alert.className).toContain('alert-danger');
});
