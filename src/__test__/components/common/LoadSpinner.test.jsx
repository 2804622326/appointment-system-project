import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoadSpinner from '../../../components/common/LoadSpinner';

describe('LoadSpinner', () => {
  test('renders spinner with default variant', () => {
    render(<LoadSpinner />);
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('spinner-border');
    expect(spinner).toHaveClass('text-success');
  });

  test('renders spinner with custom variant', () => {
    render(<LoadSpinner variant="danger" />);
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('text-danger');
  });

  test('renders with correct CSS classes on container', () => {
    const { container } = render(<LoadSpinner />);
    const containerDiv = container.firstChild;
    expect(containerDiv).toHaveClass('d-flex', 'justify-content-center', 'align-items-center', 'mt-5');
  });

  test('renders with correct inline styles', () => {
    const { container } = render(<LoadSpinner />);
    const containerDiv = container.firstChild;
    expect(containerDiv).toHaveStyle({ height: '100%' });
  });

  test('renders spinner with border animation', () => {
    render(<LoadSpinner />);
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('spinner-border');
  });
});