import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PatientActions from '../../../components/actions/PatientActions.jsx';

const appointment = {
  id: 1,
  appointmentDate: '2024-01-01',
  appointmentTime: '10:00',
  reason: 'Checkup',
};

test('renders PatientActions and handles interactions', () => {
  const onCancel = jest.fn();
  const onUpdate = jest.fn();
  const { asFragment } = render(
    <PatientActions
      onCancel={onCancel}
      onUpdate={onUpdate}
      isDisabled={false}
      appointment={appointment}
    />
  );

  const updateButton = screen.getByRole('button', { name: /update appointment/i });
  const cancelButton = screen.getByRole('button', { name: /cancel appointment/i });

  expect(updateButton).toBeInTheDocument();
  expect(cancelButton).toBeInTheDocument();

  fireEvent.click(cancelButton);
  expect(onCancel).toHaveBeenCalledWith(1);

  fireEvent.click(updateButton);
  expect(screen.getByText(/save update/i)).toBeInTheDocument();

  expect(asFragment()).toMatchSnapshot();
});
