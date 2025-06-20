import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import VeterinarianActions from '../../../components/actions/VeterinarianActions.jsx';

const appointment = { id: 1 };

test('renders VeterinarianActions and handles approve/decline', () => {
  const onApprove = jest.fn(() => Promise.resolve());
  const onDecline = jest.fn(() => Promise.resolve());
  const { asFragment } = render(
    <VeterinarianActions
      onApprove={onApprove}
      onDecline={onDecline}
      isDisabled={false}
      appointment={appointment}
    />
  );

  const approveButton = screen.getByRole('button', { name: /approve appointment/i });
  const declineButton = screen.getByRole('button', { name: /decline appointment/i });

  expect(approveButton).toBeInTheDocument();
  expect(declineButton).toBeInTheDocument();

  fireEvent.click(approveButton);
  expect(onApprove).toHaveBeenCalledWith(1);

  fireEvent.click(declineButton);
  expect(onDecline).toHaveBeenCalledWith(1);

  expect(asFragment()).toMatchSnapshot();
});
