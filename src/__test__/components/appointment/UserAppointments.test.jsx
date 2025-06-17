import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import UserAppointments from '../../../components/appointment/UserAppointments';
import * as AppointmentService from '../../../components/appointment/AppointmentService';

// Mock dependencies
jest.mock('../../../components/pet/PetsTable', () => {
  return function MockPetsTable({ onPetsUpdate, isEditable, appointmentId }) {
    return (
      <div data-testid="pets-table">
        PetsTable
        <button onClick={() => onPetsUpdate(appointmentId)}>Update Pets</button>
      </div>
    );
  };
});

jest.mock('../../../components/hooks/ColorMapping', () => {
  return function useColorMapping() {
    return {
      'waiting-for-approval': '#ffc107',
      'cancelled': '#dc3545',
      'approved': '#28a745',
      default: '#6c757d'
    };
  };
});

jest.mock('../../../components/hooks/UseMessageAlerts', () => {
  return function UseMessageAlerts() {
    return {
      successMessage: '',
      setSuccessMessage: jest.fn(),
      errorMessage: '',
      setErrorMessage: jest.fn(),
      showSuccessAlert: false,
      setShowSuccessAlert: jest.fn(),
      showErrorAlert: false,
      setShowErrorAlert: jest.fn(),
    };
  };
});

jest.mock('../../../components/actions/PatientActions', () => {
  return function MockPatientActions({ onCancel, onUpdate, appointment, isDisabled }) {
    return (
      <div data-testid="patient-actions">
        <button onClick={() => onCancel(appointment.id)} disabled={isDisabled}>
          Cancel
        </button>
        <button onClick={() => onUpdate(appointment)} disabled={isDisabled}>
          Update
        </button>
      </div>
    );
  };
});

jest.mock('../../../components/actions/VeterinarianActions', () => {
  return function MockVeterinarianActions({ onApprove, onDecline, appointment, isDisabled }) {
    return (
      <div data-testid="veterinarian-actions">
        <button onClick={() => onApprove(appointment.id)} disabled={isDisabled}>
          Approve
        </button>
        <button onClick={() => onDecline(appointment.id)} disabled={isDisabled}>
          Decline
        </button>
      </div>
    );
  };
});

jest.mock('../../../components/appointment/AppointmentFilter', () => {
  return function MockAppointmentFilter({ onClearFilters, onSelectStatus, statuses }) {
    return (
      <div data-testid="appointment-filter">
        <button onClick={onClearFilters}>Clear Filters</button>
        <select onChange={(e) => onSelectStatus(e.target.value)}>
          <option value="all">All</option>
          {statuses.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>
    );
  };
});

jest.mock('../../../components/common/Paginator', () => {
  return function MockPaginator({ paginate, currentPage }) {
    return (
      <div data-testid="paginator">
        <button onClick={() => paginate(1)}>Page 1</button>
        <button onClick={() => paginate(2)}>Page 2</button>
        <span>Current: {currentPage}</span>
      </div>
    );
  };
});

jest.mock('../../../components/appointment/AppointmentService');

const mockAppointments = [
  {
    id: 1,
    appointmentNo: 'APT001',
    appointmentDate: '2023-12-01',
    appointmentTime: '10:00',
    status: 'WAITING_FOR_APPROVAL',
    reason: 'Checkup',
    pets: [{ id: 1, name: 'Buddy' }],
    veterinarian: { veterinarianId: 1, name: 'Dr. Smith' }
  },
  {
    id: 2,
    appointmentNo: 'APT002',
    appointmentDate: '2023-12-02',
    appointmentTime: '14:00',
    status: 'APPROVED',
    reason: 'Vaccination',
    pets: [{ id: 2, name: 'Max' }],
    veterinarian: { veterinarianId: 2, name: 'Dr. Johnson' }
  },
  {
    id: 3,
    appointmentNo: 'APT003',
    appointmentDate: '2023-12-03',
    appointmentTime: '09:00',
    status: 'CANCELLED',
    reason: 'Emergency',
    pets: [{ id: 3, name: 'Luna' }],
    veterinarian: { veterinarianId: 1, name: 'Dr. Smith' }
  }
];

const mockPatientUser = {
  userType: 'PATIENT',
  id: 1,
  name: 'John Doe'
};

const mockVetUser = {
  userType: 'VET',
  id: 1,
  name: 'Dr. Smith'
};

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('UserAppointments Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders appointments list correctly', () => {
    renderWithRouter(
      <UserAppointments user={mockPatientUser} appointments={mockAppointments} />
    );

    expect(screen.getByText('APT001')).toBeInTheDocument();
    expect(screen.getByText('APT002')).toBeInTheDocument();
    expect(screen.getByText('APT003')).toBeInTheDocument();
    expect(screen.getByText('Date: 2023-12-01')).toBeInTheDocument();
    expect(screen.getByText('Date: 2023-12-02')).toBeInTheDocument();
  });

  test('displays appointment filter component', () => {
    renderWithRouter(
      <UserAppointments user={mockPatientUser} appointments={mockAppointments} />
    );

    expect(screen.getByTestId('appointment-filter')).toBeInTheDocument();
  });

  test('displays paginator component', () => {
    renderWithRouter(
      <UserAppointments user={mockPatientUser} appointments={mockAppointments} />
    );

    expect(screen.getByTestId('paginator')).toBeInTheDocument();
  });

  test('shows patient actions for patient user', () => {
    renderWithRouter(
      <UserAppointments user={mockPatientUser} appointments={mockAppointments} />
    );

    expect(screen.getAllByTestId('patient-actions')).toHaveLength(3);
  });

  test('shows veterinarian actions for vet user', () => {
    renderWithRouter(
      <UserAppointments user={mockVetUser} appointments={mockAppointments} />
    );

    expect(screen.getAllByTestId('veterinarian-actions')).toHaveLength(3);
  });

  test('filters appointments by status', async () => {
    renderWithRouter(
      <UserAppointments user={mockPatientUser} appointments={mockAppointments} />
    );

    const statusSelect = screen.getByRole('combobox');
    fireEvent.change(statusSelect, { target: { value: 'APPROVED' } });

    // Should only show approved appointments
    await waitFor(() => {
      expect(screen.getByText('APT002')).toBeInTheDocument();
    });
  });

  test('clears filters when clear button is clicked', async () => {
    renderWithRouter(
      <UserAppointments user={mockPatientUser} appointments={mockAppointments} />
    );

    const clearButton = screen.getByText('Clear Filters');
    fireEvent.click(clearButton);

    await waitFor(() => {
      expect(screen.getByText('APT001')).toBeInTheDocument();
      expect(screen.getByText('APT002')).toBeInTheDocument();
      expect(screen.getByText('APT003')).toBeInTheDocument();
    });
  });

  test('handles appointment cancellation', async () => {
    AppointmentService.cancelAppointment.mockResolvedValue({
      message: 'Appointment cancelled successfully'
    });

    renderWithRouter(
      <UserAppointments user={mockPatientUser} appointments={mockAppointments} />
    );

    const cancelButtons = screen.getAllByText('Cancel');
    fireEvent.click(cancelButtons[0]);

    await waitFor(() => {
      expect(AppointmentService.cancelAppointment).toHaveBeenCalledWith(1);
    });
  });

  test('handles appointment approval', async () => {
    AppointmentService.approveAppointment.mockResolvedValue({
      message: 'Appointment approved successfully'
    });

    renderWithRouter(
      <UserAppointments user={mockVetUser} appointments={mockAppointments} />
    );

    const approveButtons = screen.getAllByText('Approve');
    fireEvent.click(approveButtons[0]);

    await waitFor(() => {
      expect(AppointmentService.approveAppointment).toHaveBeenCalledWith(1);
    });
  });

  test('handles appointment decline', async () => {
    AppointmentService.declineAppointment.mockResolvedValue({
      message: 'Appointment declined successfully'
    });

    renderWithRouter(
      <UserAppointments user={mockVetUser} appointments={mockAppointments} />
    );

    const declineButtons = screen.getAllByText('Decline');
    fireEvent.click(declineButtons[0]);

    await waitFor(() => {
      expect(AppointmentService.declineAppointment).toHaveBeenCalledWith(1);
    });
  });

  test('handles appointment update', async () => {
    const updatedAppointment = { ...mockAppointments[0], reason: 'Updated reason' };
    AppointmentService.updateAppointment.mockResolvedValue({
      data: { message: 'Appointment updated successfully' }
    });

    renderWithRouter(
      <UserAppointments user={mockPatientUser} appointments={mockAppointments} />
    );

    const updateButtons = screen.getAllByText('Update');
    fireEvent.click(updateButtons[0]);

    await waitFor(() => {
      expect(AppointmentService.updateAppointment).toHaveBeenCalledWith(1, mockAppointments[0]);
    });
  });

  test('handles pets update', async () => {
    AppointmentService.getAppointmentById.mockResolvedValue({
      data: mockAppointments[0]
    });

    renderWithRouter(
      <UserAppointments user={mockPatientUser} appointments={mockAppointments} />
    );

    const updatePetsButtons = screen.getAllByText('Update Pets');
    fireEvent.click(updatePetsButtons[0]);

    await waitFor(() => {
      expect(AppointmentService.getAppointmentById).toHaveBeenCalledWith(1);
    });
  });

  test('displays book new appointment link for patients', () => {
    renderWithRouter(
      <UserAppointments user={mockPatientUser} appointments={mockAppointments} />
    );

    const bookLinks = screen.getAllByText('Book New Apppointment');
    expect(bookLinks).toHaveLength(3);
    expect(bookLinks[0].closest('a')).toHaveAttribute('href', '/book-appointment/1/new-appointment');
  });

  test('does not display book new appointment link for vets', () => {
    renderWithRouter(
      <UserAppointments user={mockVetUser} appointments={mockAppointments} />
    );

    expect(screen.queryByText('Book New Apppointment')).not.toBeInTheDocument();
  });

  test('displays appointment details correctly', () => {
    renderWithRouter(
      <UserAppointments user={mockPatientUser} appointments={mockAppointments} />
    );

    expect(screen.getByText('Time : 10:00')).toBeInTheDocument();
    expect(screen.getByText('Reason: Checkup')).toBeInTheDocument();
    expect(screen.getByText('Time : 14:00')).toBeInTheDocument();
    expect(screen.getByText('Reason: Vaccination')).toBeInTheDocument();
  });

  test('pagination works correctly', async () => {
    renderWithRouter(
      <UserAppointments user={mockPatientUser} appointments={mockAppointments} />
    );

    const page2Button = screen.getByText('Page 2');
    fireEvent.click(page2Button);

    await waitFor(() => {
      expect(screen.getByText('Current: 2')).toBeInTheDocument();
    });
  });

  test('handles service errors gracefully', async () => {
    AppointmentService.cancelAppointment.mockRejectedValue({
      response: { data: { message: 'Error cancelling appointment' } }
    });

    renderWithRouter(
      <UserAppointments user={mockPatientUser} appointments={mockAppointments} />
    );

    const cancelButtons = screen.getAllByText('Cancel');
    fireEvent.click(cancelButtons[0]);

    await waitFor(() => {
      expect(AppointmentService.cancelAppointment).toHaveBeenCalledWith(1);
    });
  });

  test('displays correct status colors', () => {
    renderWithRouter(
      <UserAppointments user={mockPatientUser} appointments={mockAppointments} />
    );

    const statusElements = screen.getAllByText(/Status:/);
    expect(statusElements[0]).toHaveStyle('color: #ffc107'); // waiting-for-approval
    expect(statusElements[1]).toHaveStyle('color: #28a745'); // approved
    expect(statusElements[2]).toHaveStyle('color: #dc3545'); // cancelled
  });

  test('disables actions for non-waiting appointments', () => {
    renderWithRouter(
      <UserAppointments user={mockPatientUser} appointments={mockAppointments} />
    );

    const cancelButtons = screen.getAllByText('Cancel');
    const updateButtons = screen.getAllByText('Update');

    // First appointment is waiting for approval - should be enabled
    expect(cancelButtons[0]).not.toBeDisabled();
    expect(updateButtons[0]).not.toBeDisabled();

    // Second appointment is approved - should be disabled
    expect(cancelButtons[1]).toBeDisabled();
    expect(updateButtons[1]).toBeDisabled();
  });
});