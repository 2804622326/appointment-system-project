import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BookAppointment from '../../../components/appointment/BookAppointment.jsx';

jest.mock('react-router-dom', () => ({
  useParams: () => ({ recipientId: '2' }),
}));

jest.mock('react-datepicker', () => (props) => (
  <input data-testid={props['data-testid'] || 'date'} onChange={(e) => props.onChange(e.target.value)} placeholder={props.placeholderText} />
));

jest.mock('../../../components/pet/PetEntry.jsx', () => () => <div data-testid='pet-entry' />);

jest.mock('../../../components/utils/utilities', () => ({
  dateTimeFormatter: jest.fn(() => ({ formattedDate: '2024-01-01', formattedTime: '12:00' })),
}));

jest.mock('../../../components/appointment/AppointmentService.js', () => ({
  bookAppointment: jest.fn(),
}));
import { bookAppointment } from '../../../components/appointment/AppointmentService.js';
bookAppointment.mockResolvedValue({ message: 'Booked' });

jest.mock('../../../components/hooks/UseMessageAlerts', () => ({ __esModule: true, default: jest.fn() }));
import useAlerts from '../../../components/hooks/UseMessageAlerts';
const alerts = {
  setSuccessMessage: jest.fn(),
  setShowSuccessAlert: jest.fn(),
  setErrorMessage: jest.fn(),
  setShowErrorAlert: jest.fn(),
};
useAlerts.mockReturnValue({
  successMessage: '',
  showSuccessAlert: false,
  showErrorAlert: false,
  ...alerts,
});

test('submits form and shows success', async () => {
  localStorage.setItem('userId', '1');
  const { asFragment } = render(<BookAppointment />);

  fireEvent.change(screen.getByPlaceholderText('Choose a date'), { target: { value: '2024-05-10' } });
  fireEvent.change(screen.getByPlaceholderText('Select time'), { target: { value: '10:00' } });
  fireEvent.change(screen.getAllByRole('textbox')[2], { target: { value: 'Checkup' } });

  fireEvent.click(screen.getByRole('button', { name: /book appointment/i }));
  await waitFor(() => expect(bookAppointment).toHaveBeenCalled());
  expect(bookAppointment).toHaveBeenCalledWith('1', '2', expect.any(Object));
  expect(alerts.setSuccessMessage).toHaveBeenCalledWith('Booked');
  expect(alerts.setShowSuccessAlert).toHaveBeenCalledWith(true);
  expect(asFragment()).toMatchSnapshot();
});
