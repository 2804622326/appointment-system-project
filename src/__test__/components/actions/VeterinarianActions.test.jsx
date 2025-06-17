import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import VeterinarianActions from '../../../components/actions/VeterinarianActions.jsx';

// Mock the child components
jest.mock('../../../components/actions/ActionButtons', () => {
  return function MockActionButtons({ title, onClick, disabled, variant }) {
    return (
      <button 
        onClick={onClick} 
        disabled={disabled}
        data-testid={`action-button-${variant}`}
      >
        {typeof title === 'string' ? title : 'Processing...'}
      </button>
    );
  };
});

jest.mock('../../../components/common/ProcessSpinner', () => {
  return function MockProcessSpinner({ message }) {
    return <div data-testid="process-spinner">{message}</div>;
  };
});

describe('VeterinarianActions', () => {
  const mockProps = {
    onApprove: jest.fn(),
    onDecline: jest.fn(),
    isDisabled: false,
    appointment: { id: 'test-id-123' }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    render(<VeterinarianActions {...mockProps} />);
    expect(screen.getByTestId('action-button-success')).toBeInTheDocument();
    expect(screen.getByTestId('action-button-secondary')).toBeInTheDocument();
  });

  test('renders approve and decline buttons with correct text', () => {
    render(<VeterinarianActions {...mockProps} />);
    expect(screen.getByText('Approve Appointment')).toBeInTheDocument();
    expect(screen.getByText('Decline Appointment')).toBeInTheDocument();
  });

  test('calls onApprove when approve button is clicked', async () => {
    mockProps.onApprove.mockResolvedValue();
    render(<VeterinarianActions {...mockProps} />);
    
    fireEvent.click(screen.getByTestId('action-button-success'));
    
    expect(mockProps.onApprove).toHaveBeenCalledWith('test-id-123');
  });

  test('calls onDecline when decline button is clicked', async () => {
    mockProps.onDecline.mockResolvedValue();
    render(<VeterinarianActions {...mockProps} />);
    
    fireEvent.click(screen.getByTestId('action-button-secondary'));
    
    expect(mockProps.onDecline).toHaveBeenCalledWith('test-id-123');
  });

  test('shows processing spinner when approve action is in progress', async () => {
    mockProps.onApprove.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    render(<VeterinarianActions {...mockProps} />);
    
    fireEvent.click(screen.getByTestId('action-button-success'));
    
    await waitFor(() => {
      expect(screen.getByTestId('process-spinner')).toBeInTheDocument();
      expect(screen.getByText('Approving appointment...')).toBeInTheDocument();
    });
  });

  test('shows processing spinner when decline action is in progress', async () => {
    mockProps.onDecline.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    render(<VeterinarianActions {...mockProps} />);
    
    fireEvent.click(screen.getByTestId('action-button-secondary'));
    
    await waitFor(() => {
      expect(screen.getByTestId('process-spinner')).toBeInTheDocument();
      expect(screen.getByText('Declining appointment...')).toBeInTheDocument();
    });
  });

  test('handles approve action success', async () => {
    mockProps.onApprove.mockResolvedValue();
    render(<VeterinarianActions {...mockProps} />);
    
    fireEvent.click(screen.getByTestId('action-button-success'));
    
    await waitFor(() => {
      expect(screen.getByText('Approve Appointment')).toBeInTheDocument();
    });
  });

  test('handles approve action failure', async () => {
    mockProps.onApprove.mockRejectedValue(new Error('Failed'));
    render(<VeterinarianActions {...mockProps} />);
    
    fireEvent.click(screen.getByTestId('action-button-success'));
    
    await waitFor(() => {
      expect(screen.getByText('Approve Appointment')).toBeInTheDocument();
    });
  });

  test('handles decline action failure', async () => {
    mockProps.onDecline.mockRejectedValue(new Error('Failed'));
    render(<VeterinarianActions {...mockProps} />);
    
    fireEvent.click(screen.getByTestId('action-button-secondary'));
    
    await waitFor(() => {
      expect(screen.getByText('Decline Appointment')).toBeInTheDocument();
    });
  });

  test('renders with disabled state', () => {
    const disabledProps = { ...mockProps, isDisabled: true };
    render(<VeterinarianActions {...disabledProps} />);
    
    expect(screen.getByTestId('action-button-success')).toBeDisabled();
    expect(screen.getByTestId('action-button-secondary')).toBeDisabled();
  });
});

