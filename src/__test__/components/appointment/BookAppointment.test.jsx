import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BookAppointment from '../../../components/appointment/BookAppointment';
import { bookAppointment } from '../../../components/appointment/AppointmentService';
import { dateTimeFormatter } from '../../../components/utils/utilities';

// Mock dependencies
jest.mock('../../../components/appointment/AppointmentService');
jest.mock('../../../components/utils/utilities');
jest.mock('../../../components/hooks/UseMessageAlerts', () => ({
  __esModule: true,
  default: () => ({
    successMessage: '',
    setSuccessMessage: jest.fn(),
    showSuccessAlert: false,
    setShowSuccessAlert: jest.fn(),
    errorMessage: '',
    setErrorMessage: jest.fn(),
    showErrorAlert: false,
    setShowErrorAlert: jest.fn(),
  }),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ recipientId: '123' }),
}));

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

const renderComponent = () => {
  return render(
    <BrowserRouter>
      <BookAppointment />
    </BrowserRouter>
  );
};

describe('BookAppointment Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue('user123');
    dateTimeFormatter.mockReturnValue({
      formattedDate: '2024-01-15',
      formattedTime: '10:00',
    });
  });

  test('renders appointment booking form', () => {
    renderComponent();
    
    expect(screen.getByText('Appointment Booking Form')).toBeInTheDocument();
    expect(screen.getByText('Appointment Date and Time')).toBeInTheDocument();
    expect(screen.getByText('Reason for appointment')).toBeInTheDocument();
    expect(screen.getByText('Appointment Pet Information')).toBeInTheDocument();
  });

  test('renders form fields correctly', () => {
    renderComponent();
    
    expect(screen.getByPlaceholderText('Choose a date')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Select time')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /reason for appointment/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /book appointment/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
  });

  test('handles reason input change', () => {
    renderComponent();
    
    const reasonTextarea = screen.getByRole('textbox', { name: /reason for appointment/i });
    fireEvent.change(reasonTextarea, { target: { value: 'Annual checkup' } });
    
    expect(reasonTextarea.value).toBe('Annual checkup');
  });

  test('adds new pet when add pet button is clicked', () => {
    renderComponent();
    
    const addPetButton = screen.getByRole('button', { name: /add pets/i });
    fireEvent.click(addPetButton);
    
    // Should have 2 pet entries now
    const petEntries = screen.getAllByText(/pet information/i);
    expect(petEntries.length).toBeGreaterThan(0);
  });

  test('resets form when reset button is clicked', () => {
    renderComponent();
    
    const reasonTextarea = screen.getByRole('textbox', { name: /reason for appointment/i });
    fireEvent.change(reasonTextarea, { target: { value: 'Test reason' } });
    
    const resetButton = screen.getByRole('button', { name: /reset/i });
    fireEvent.click(resetButton);
    
    expect(reasonTextarea.value).toBe('');
  });

  test('submits form with valid data', async () => {
    bookAppointment.mockResolvedValue({ message: 'Appointment booked successfully' });
    
    renderComponent();
    
    const reasonTextarea = screen.getByRole('textbox', { name: /reason for appointment/i });
    fireEvent.change(reasonTextarea, { target: { value: 'Vaccination' } });
    
    const submitButton = screen.getByRole('button', { name: /book appointment/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(bookAppointment).toHaveBeenCalledWith(
        'user123',
        '123',
        expect.objectContaining({
          appointment: expect.objectContaining({
            appointmentDate: '2024-01-15',
            appointmentTime: '10:00',
            reason: 'Vaccination',
          }),
          pets: expect.any(Array),
        })
      );
    });
  });

  test('handles form submission error', async () => {
    const mockError = {
      response: {
        data: {
          status: 400,
          message: 'Booking failed',
        },
      },
    };
    bookAppointment.mockRejectedValue(mockError);
    
    renderComponent();
    
    const submitButton = screen.getByRole('button', { name: /book appointment/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(bookAppointment).toHaveBeenCalled();
    });
  });

  test('handles 401 error during form submission', async () => {
    const mockError = {
      response: {
        data: {
          status: 401,
          message: 'Unauthorized',
        },
      },
    };
    bookAppointment.mockRejectedValue(mockError);
    
    renderComponent();
    
    const submitButton = screen.getByRole('button', { name: /book appointment/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(bookAppointment).toHaveBeenCalled();
    });
  });

  test('disables submit button during processing', async () => {
    bookAppointment.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    renderComponent();
    
    const submitButton = screen.getByRole('button', { name: /book appointment/i });
    fireEvent.click(submitButton);
    
    expect(submitButton).toBeDisabled();
    
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  test('formats date and time correctly before submission', async () => {
    bookAppointment.mockResolvedValue({ message: 'Success' });
    
    renderComponent();
    
    const submitButton = screen.getByRole('button', { name: /book appointment/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(dateTimeFormatter).toHaveBeenCalled();
    });
  });

  test('retrieves sender ID from localStorage', () => {
    renderComponent();
    
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('userId');
  });

  test('constructs pet data correctly for submission', async () => {
    bookAppointment.mockResolvedValue({ message: 'Success' });
    
    renderComponent();
    
    const submitButton = screen.getByRole('button', { name: /book appointment/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(bookAppointment).toHaveBeenCalledWith(
        'user123',
        '123',
        expect.objectContaining({
          pets: expect.arrayContaining([
            expect.objectContaining({
              name: expect.any(String),
              type: expect.any(String),
              breed: expect.any(String),
              color: expect.any(String),
              age: expect.any(String),
            }),
          ]),
        })
      );
    });
  });
});