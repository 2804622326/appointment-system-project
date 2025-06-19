import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ActionButtons from '../../../components/actions/ActionButtons.jsx';

test('renders ActionButtons and handles click', () => {
  const handleClick = jest.fn();
  const { asFragment } = render(
    <ActionButtons title="Test Button" variant="primary" onClick={handleClick} />
  );

  const button = screen.getByRole('button', { name: /test button/i });
  expect(button).toBeInTheDocument();

  fireEvent.click(button);
  expect(handleClick).toHaveBeenCalledTimes(1);

  expect(asFragment()).toMatchSnapshot();
});
