import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AlertMessage from '../../../components/common/AlertMessage';

describe('AlertMessage', () => {
  test('renders alert with message and type', () => {
    render(<AlertMessage type="success" message="Test message" />);
    
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent('Test message');
    expect(alert).toHaveClass('alert-success');
  });

  test('renders different alert types correctly', () => {
    const { rerender } = render(<AlertMessage type="danger" message="Error message" />);
    expect(screen.getByRole('alert')).toHaveClass('alert-danger');

    rerender(<AlertMessage type="warning" message="Warning message" />);
    expect(screen.getByRole('alert')).toHaveClass('alert-warning');

    rerender(<AlertMessage type="info" message="Info message" />);
    expect(screen.getByRole('alert')).toHaveClass('alert-info');
  });

  test('returns null when message is empty', () => {
    const { container } = render(<AlertMessage type="success" message="" />);
    expect(container.firstChild).toBeNull();
  });

  test('returns null when message is null', () => {
    const { container } = render(<AlertMessage type="success" message={null} />);
    expect(container.firstChild).toBeNull();
  });

  test('returns null when message is undefined', () => {
    const { container } = render(<AlertMessage type="success" />);
    expect(container.firstChild).toBeNull();
  });

  test('alert is dismissible', () => {
    render(<AlertMessage type="info" message="Dismissible alert" />);
    
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('alert-dismissible');
  });

  test('renders with long message content', () => {
    const longMessage = 'This is a very long message that should still render correctly in the alert component';
    render(<AlertMessage type="primary" message={longMessage} />);
    
    expect(screen.getByText(longMessage)).toBeInTheDocument();
  });
});