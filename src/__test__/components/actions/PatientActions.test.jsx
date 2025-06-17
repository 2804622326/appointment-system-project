import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Component from '../../../components/actions/PatientActions.jsx';

// Mock the child components
jest.mock('../../../components/actions/ActionButtons', () => {
  return function MockActionButtons({ title, onClick, disabled }) {
    return (
      <button onClick={onClick} disabled={disabled} data-testid={`action-${title}`}>
        {title}
      </button>
    );
  };
});

jest.mock('../../../components/modals/AppointmentUpdateModal', () => {
  return function MockAppointmentUpdateModal({ show, handleClose, handleUpdate, appointment }) {
    return show ? (
      <div data-testid="update-modal">
        <button onClick={handleClose} data-testid="close-modal">Close</button>
        <button onClick={() => handleUpdate(appointment)} data-testid="update-appointment">Update</button>
      </div>
    ) : null;
  };
});

const mockProps = {
  onCancel: jest.fn(),
  onUpdate: jest.fn(),
  isDisabled: false,
  appointment: { id: '123', date: '2024-01-01', time: '10:00' }
};

describe('PatientActions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    expect(Component).toBeDefined();
  });

  test('renders action buttons correctly', () => {
    render(<Component {...mockProps} />);
    
    expect(screen.getByTestId('action-Update Appointment')).toBeInTheDocument();
    expect(screen.getByTestId('action-Cancel Appointment')).toBeInTheDocument();
  });

  test('opens update modal when update button is clicked', () => {
    render(<Component {...mockProps} />);
    
    fireEvent.click(screen.getByTestId('action-Update Appointment'));
    
    expect(screen.getByTestId('update-modal')).toBeInTheDocument();
  });

  test('calls onCancel when cancel button is clicked', () => {
    render(<Component {...mockProps} />);
    
    fireEvent.click(screen.getByTestId('action-Cancel Appointment'));
    
    expect(mockProps.onCancel).toHaveBeenCalledWith('123');
  });

  test('closes modal when handleClose is called', () => {
    render(<Component {...mockProps} />);
    
    fireEvent.click(screen.getByTestId('action-Update Appointment'));
    expect(screen.getByTestId('update-modal')).toBeInTheDocument();
    
    fireEvent.click(screen.getByTestId('close-modal'));
    expect(screen.queryByTestId('update-modal')).not.toBeInTheDocument();
  });

  test('calls onUpdate and closes modal when appointment is updated', async () => {
    mockProps.onUpdate.mockResolvedValue();
    render(<Component {...mockProps} />);
    
    fireEvent.click(screen.getByTestId('action-Update Appointment'));
    fireEvent.click(screen.getByTestId('update-appointment'));
    
    await waitFor(() => {
      expect(mockProps.onUpdate).toHaveBeenCalledWith(mockProps.appointment);
      expect(screen.queryByTestId('update-modal')).not.toBeInTheDocument();
    });
  });

  test('disables buttons when isDisabled is true', () => {
    render(<Component {...mockProps} isDisabled={true} />);
    
    expect(screen.getByTestId('action-Update Appointment')).toBeDisabled();
    expect(screen.getByTestId('action-Cancel Appointment')).toBeDisabled();
  });

  test('handles error in handleUpdateAppointment', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockProps.onUpdate.mockRejectedValue(new Error('Update failed'));
    
    render(<Component {...mockProps} />);
    
    fireEvent.click(screen.getByTestId('action-Update Appointment'));
    fireEvent.click(screen.getByTestId('update-appointment'));
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
    });
    
    consoleSpy.mockRestore();
  });
});

