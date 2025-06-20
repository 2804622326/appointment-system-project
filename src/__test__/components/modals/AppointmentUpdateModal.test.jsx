import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AppointmentUpdateModal from '../../../components/modals/AppointmentUpdateModal.jsx';

jest.mock('react-datepicker', () => (props) => (
  <input data-testid='picker' onChange={(e) => props.onChange(new Date(e.target.value))} />
));

test('updates appointment when submitted', () => {
  const appointment = {
    appointmentDate: '2024-01-01',
    appointmentTime: '10:00',
    reason: 'Check',
  };
  const update = jest.fn();
  const { asFragment } = render(
    <AppointmentUpdateModal show handleClose={() => {}} appointment={appointment} handleUpdate={update} />
  );
  fireEvent.change(screen.getAllByTestId('picker')[0], { target: { value: '2024-01-02' } });
  fireEvent.change(screen.getAllByTestId('picker')[1], { target: { value: '11:00' } });
  fireEvent.change(screen.getByPlaceholderText(/enter reason/i), { target: { value: 'Updated' } });
  fireEvent.click(screen.getByText(/save update/i));
  expect(update).toHaveBeenCalled();
  expect(asFragment()).toMatchSnapshot();
});
