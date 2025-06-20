import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AlertMessage from '../../../components/common/AlertMessage.jsx';

test('renders alert when message provided', () => {
  const { asFragment } = render(<AlertMessage type="success" message="Saved" />);
  expect(screen.getByText('Saved')).toBeInTheDocument();
  expect(asFragment()).toMatchSnapshot();
});

test('returns null when no message', () => {
  const { container } = render(<AlertMessage type="info" message="" />);
  expect(container.firstChild).toBeNull();
});
