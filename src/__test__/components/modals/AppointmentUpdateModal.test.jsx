import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AppointmentUpdateModal from '../../../components/modals/AppointmentUpdateModal';

// Mock react-datepicker
jest.mock('react-datepicker', () => {
  return function MockDatePicker({ selected, onChange, dateFormat, showTimeSelect, ...props }) {
    const handleChange = (e) => {
      const value = e.target.value;
      if (showTimeSelect) {
        const [hours, minutes] = value.split(':');
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes));
        onChange(date);
      } else {
        onChange(new Date(value));
      }
    };

    return (
      <input
        data-testid={showTimeSelect ? 'time-picker' : 'date-picker'}
        type={showTimeSelect ? 'time' : 'date'}
        value={showTimeSelect ? 
          selected.toTimeString().split(' ')[0].substring(0, 5) : 
          selected.toISOString().split('T')[0]
        }
        onChange={handleChange}
        {...props}
      />
    );
  };
});

describe('AppointmentUpdateModal', () => {
  const mockAppointment = {
    id: 1,
    appointmentDate: '2024-01-15',
    appointmentTime: '10:30',
    reason: 'Regular checkup'
  };

  const defaultProps = {
    show: true,
    handleClose: jest.fn(),
    appointment: mockAppointment,
    handleUpdate: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders modal when show is true', () => {
    render(<AppointmentUpdateModal {...defaultProps} />);
    
    expect(screen.getByText('Update Appointment')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Time')).toBeInTheDocument();
    expect(screen.getByText('Reason')).toBeInTheDocument();
  });

  test('does not render modal when show is false', () => {
    render(<AppointmentUpdateModal {...defaultProps} show={false} />);
    
    expect(screen.queryByText('Update Appointment')).not.toBeInTheDocument();
  });

  test('initializes form fields with appointment data', () => {
    render(<AppointmentUpdateModal {...defaultProps} />);
    
    expect(screen.getByDisplayValue('2024-01-15')).toBeInTheDocument();
    expect(screen.getByDisplayValue('10:30')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Regular checkup')).toBeInTheDocument();
  });

  test('updates date when date picker changes', () => {
    render(<AppointmentUpdateModal {...defaultProps} />);
    
    const datePicker = screen.getByTestId('date-picker');
    fireEvent.change(datePicker, { target: { value: '2024-02-20' } });
    
    expect(screen.getByDisplayValue('2024-02-20')).toBeInTheDocument();
  });

  test('updates time when time picker changes', () => {
    render(<AppointmentUpdateModal {...defaultProps} />);
    
    const timePicker = screen.getByTestId('time-picker');
    fireEvent.change(timePicker, { target: { value: '14:30' } });
    
    expect(screen.getByDisplayValue('14:30')).toBeInTheDocument();
  });

  test('updates reason when textarea changes', () => {
    render(<AppointmentUpdateModal {...defaultProps} />);
    
    const reasonTextarea = screen.getByPlaceholderText('Enter reason');
    fireEvent.change(reasonTextarea, { target: { value: 'Updated reason' } });
    
    expect(screen.getByDisplayValue('Updated reason')).toBeInTheDocument();
  });

  test('calls handleClose when Close button is clicked', () => {
    render(<AppointmentUpdateModal {...defaultProps} />);
    
    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);
    
    expect(defaultProps.handleClose).toHaveBeenCalledTimes(1);
  });

  test('calls handleUpdate with updated appointment data when Save Update button is clicked', () => {
    render(<AppointmentUpdateModal {...defaultProps} />);
    
    // Update form fields
    const datePicker = screen.getByTestId('date-picker');
    const timePicker = screen.getByTestId('time-picker');
    const reasonTextarea = screen.getByPlaceholderText('Enter reason');
    
    fireEvent.change(datePicker, { target: { value: '2024-02-20' } });
    fireEvent.change(timePicker, { target: { value: '15:45' } });
    fireEvent.change(reasonTextarea, { target: { value: 'Updated appointment reason' } });
    
    // Click Save Update button
    const saveButton = screen.getByText('Save Update');
    fireEvent.click(saveButton);
    
    expect(defaultProps.handleUpdate).toHaveBeenCalledWith({
      ...mockAppointment,
      appointmentDate: '2024-02-20',
      appointmentTime: '15:45',
      reason: 'Updated appointment reason'
    });
  });

  test('handles edge case with empty reason', () => {
    render(<AppointmentUpdateModal {...defaultProps} />);
    
    const reasonTextarea = screen.getByPlaceholderText('Enter reason');
    fireEvent.change(reasonTextarea, { target: { value: '' } });
    
    const saveButton = screen.getByText('Save Update');
    fireEvent.click(saveButton);
    
    expect(defaultProps.handleUpdate).toHaveBeenCalledWith({
      ...mockAppointment,
      appointmentDate: '2024-01-15',
      appointmentTime: '10:30',
      reason: ''
    });
  });

  test('renders all form elements correctly', () => {
    render(<AppointmentUpdateModal {...defaultProps} />);
    
    expect(screen.getByTestId('date-picker')).toBeInTheDocument();
    expect(screen.getByTestId('time-picker')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /reason/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save update/i })).toBeInTheDocument();
  });

  test('preserves other appointment properties when updating', () => {
    const appointmentWithExtraProps = {
      ...mockAppointment,
      patientId: 123,
      doctorId: 456,
      status: 'scheduled'
    };

    render(<AppointmentUpdateModal {...defaultProps} appointment={appointmentWithExtraProps} />);
    
    const saveButton = screen.getByText('Save Update');
    fireEvent.click(saveButton);
    
    expect(defaultProps.handleUpdate).toHaveBeenCalledWith({
      ...appointmentWithExtraProps,
      appointmentDate: '2024-01-15',
      appointmentTime: '10:30',
      reason: 'Regular checkup'
    });
  });
});