import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import UserAppointments from '../../../components/appointment/UserAppointments.jsx';
import * as service from '../../../components/appointment/AppointmentService.js';

jest.mock('../../../components/appointment/AppointmentService.js', () => ({
  cancelAppointment: jest.fn(() => Promise.resolve({ message: 'Cancelled' })),
  approveAppointment: jest.fn(() => Promise.resolve({ message: 'Approved' })),
  declineAppointment: jest.fn(() => Promise.resolve({ message: 'Declined' })),
  updateAppointment: jest.fn(() => Promise.resolve({ data: { message: 'Updated' } })),
  getAppointmentById: jest.fn(() => Promise.resolve({ data: { id: 1 } })),
}));

jest.mock('../../../components/hooks/UseMessageAlerts', () => () => ({
  successMessage: '',
  setSuccessMessage: jest.fn(),
  errorMessage: '',
  setErrorMessage: jest.fn(),
  showSuccessAlert: false,
  setShowSuccessAlert: jest.fn(),
  showErrorAlert: false,
  setShowErrorAlert: jest.fn(),
}));

jest.mock('../../../components/appointment/AppointmentFilter.jsx', () => ({ onClearFilters, onSelectStatus }) => (
  <div>
    <button onClick={() => onSelectStatus('cancelled')}>select</button>
    <button onClick={onClearFilters}>clear</button>
  </div>
));

jest.mock('../../../components/common/Paginator.jsx', () => () => <div data-testid='paginator'/>);
jest.mock('../../../components/common/UserInformation.jsx', () => () => <div data-testid='user-info'/>);
jest.mock('../../../components/pet/PetsTable.jsx', () => () => <div data-testid='pets-table'/>);
jest.mock('../../../components/actions/PatientActions.jsx', () => ({ onCancel }) => (
  <button onClick={() => onCancel(1)}>cancel</button>
));
jest.mock('../../../components/actions/VeterinarianActions.jsx', () => () => <div data-testid='vet-actions' />);

test('handles cancel flow and snapshot', async () => {
  const appointments = [
    {
      id: 1,
      appointmentDate: '2024-06-01',
      appointmentTime: '09:00',
      reason: 'Check',
      appointmentNo: 'A1',
      status: 'WAITING_FOR_APPROVAL',
      pets: [],
      veterinarian: { veterinarianId: 2 },
    },
  ];
  const user = { userType: 'PATIENT' };
  const { asFragment } = render(
    <MemoryRouter>
      <UserAppointments user={user} appointments={appointments} />
    </MemoryRouter>
  );
  fireEvent.click(screen.getByText('cancel'));
  await waitFor(() => expect(service.cancelAppointment).toHaveBeenCalledWith(1));
  expect(asFragment()).toMatchSnapshot();
});
