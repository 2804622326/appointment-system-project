import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import UserDashboard from '../../../components/user/UserDashboard';
import { getUserById, deleteUser } from '../../../components/user/UserService';
import { deleteUserPhoto } from '../../../components/modals/ImageUploaderService';
import { logout } from '../../../components/auth/AuthService';
import { formatAppointmentStatus } from '../../../components/utils/utilities';

// Mock all external dependencies
jest.mock('../../../components/user/UserService');
jest.mock('../../../components/modals/ImageUploaderService');
jest.mock('../../../components/auth/AuthService');
jest.mock('../../../components/utils/utilities');
jest.mock('../../../components/user/UserProfile', () => ({ user, handleRemovePhoto, handleDeleteAccount }) => (
  <div data-testid="user-profile">
    <button onClick={handleRemovePhoto}>Remove Photo</button>
    <button onClick={handleDeleteAccount}>Delete Account</button>
  </div>
));
jest.mock('../../../components/review/Review', () => ({ review, userType }) => (
  <div data-testid="review">{review.content}</div>
));
jest.mock('../../../components/appointment/UserAppointments', () => ({ user, appointments }) => (
  <div data-testid="user-appointments">Appointments: {appointments.length}</div>
));
jest.mock('../../../components/charts/CustomPieChart', () => ({ data }) => (
  <div data-testid="pie-chart">Chart with {data.length} items</div>
));
jest.mock('../../../components/common/NoDataAvailable', () => ({ dataType }) => (
  <div data-testid="no-data">No {dataType} available</div>
));
jest.mock('../../../components/common/AlertMessage', () => ({ type, message }) => (
  <div data-testid={`alert-${type}`}>{message}</div>
));
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

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ userId: '123' }),
}));

const mockUser = {
  id: '123',
  name: 'John Doe',
  email: 'john@example.com',
  userType: 'PATIENT',
  photoId: 'photo123',
  appointments: [
    { id: '1', status: 'CONFIRMED', date: '2023-01-01' },
    { id: '2', status: 'PENDING', date: '2023-01-02' },
    { id: '3', status: 'CONFIRMED', date: '2023-01-03' },
  ],
  reviews: [
    { id: '1', content: 'Great service', rating: 5 },
    { id: '2', content: 'Good experience', rating: 4 },
  ],
};

const renderUserDashboard = () => {
  return render(
    <BrowserRouter>
      <UserDashboard />
    </BrowserRouter>
  );
};

describe('UserDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    localStorage.setItem('userId', '123');
    formatAppointmentStatus.mockImplementation((status) => status.toLowerCase());
  });

  describe('Component Rendering', () => {
    test('renders tabs correctly', async () => {
      getUserById.mockResolvedValue({ data: mockUser });
      renderUserDashboard();

      await waitFor(() => {
        expect(screen.getByText('Profile')).toBeInTheDocument();
        expect(screen.getByText('Appointments Overview')).toBeInTheDocument();
        expect(screen.getByText('Appointment Details')).toBeInTheDocument();
        expect(screen.getByText('Reviws')).toBeInTheDocument();
      });
    });

    test('renders profile tab content when user is loaded', async () => {
      getUserById.mockResolvedValue({ data: mockUser });
      renderUserDashboard();

      await waitFor(() => {
        expect(screen.getByTestId('user-profile')).toBeInTheDocument();
      });
    });

    test('renders appointments overview with pie chart when data exists', async () => {
      getUserById.mockResolvedValue({ data: mockUser });
      renderUserDashboard();

      fireEvent.click(screen.getByText('Appointments Overview'));

      await waitFor(() => {
        expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
      });
    });

    test('renders no data message when no appointments exist', async () => {
      const userWithoutAppointments = { ...mockUser, appointments: [] };
      getUserById.mockResolvedValue({ data: userWithoutAppointments });
      renderUserDashboard();

      fireEvent.click(screen.getByText('Appointments Overview'));

      await waitFor(() => {
        expect(screen.getByTestId('no-data')).toBeInTheDocument();
      });
    });
  });

  describe('User Data Loading', () => {
    test('loads user data on mount', async () => {
      getUserById.mockResolvedValue({ data: mockUser });
      renderUserDashboard();

      await waitFor(() => {
        expect(getUserById).toHaveBeenCalledWith('123');
      });
    });

    test('handles error when loading user data fails', async () => {
      const mockError = {
        response: { data: { message: 'User not found' } },
        message: 'Network error',
      };
      getUserById.mockRejectedValue(mockError);

      const mockSetErrorMessage = jest.fn();
      const mockSetShowErrorAlert = jest.fn();
      
      const useMessageAlerts = require('../../../components/hooks/UseMessageAlerts');
      useMessageAlerts.mockReturnValue({
        successMessage: '',
        setSuccessMessage: jest.fn(),
        errorMessage: 'User not found',
        setErrorMessage: mockSetErrorMessage,
        showSuccessAlert: false,
        setShowSuccessAlert: jest.fn(),
        showErrorAlert: true,
        setShowErrorAlert: mockSetShowErrorAlert,
      });

      renderUserDashboard();

      await waitFor(() => {
        expect(screen.getByTestId('alert-danger')).toBeInTheDocument();
      });
    });
  });

  describe('Tab Navigation', () => {
    test('switches to appointments overview tab', async () => {
      getUserById.mockResolvedValue({ data: mockUser });
      renderUserDashboard();

      fireEvent.click(screen.getByText('Appointments Overview'));

      await waitFor(() => {
        expect(screen.getByText('Appointment Overview')).toBeInTheDocument();
      });
    });

    test('switches to reviews tab', async () => {
      getUserById.mockResolvedValue({ data: mockUser });
      renderUserDashboard();

      fireEvent.click(screen.getByText('Reviws'));

      await waitFor(() => {
        expect(screen.getByText('Your Reviews')).toBeInTheDocument();
      });
    });

    test('saves active tab to localStorage', async () => {
      getUserById.mockResolvedValue({ data: mockUser });
      renderUserDashboard();

      fireEvent.click(screen.getByText('Appointments Overview'));

      expect(localStorage.getItem('activeKey')).toBe('status');
    });

    test('loads active tab from localStorage', async () => {
      localStorage.setItem('activeKey', 'reviews');
      getUserById.mockResolvedValue({ data: mockUser });
      renderUserDashboard();

      await waitFor(() => {
        expect(screen.getByText('Your Reviews')).toBeInTheDocument();
      });
    });
  });

  describe('Appointment Details Tab', () => {
    test('shows appointment details tab for current user', async () => {
      getUserById.mockResolvedValue({ data: mockUser });
      renderUserDashboard();

      expect(screen.getByText('Appointment Details')).toBeInTheDocument();
    });

    test('hides appointment details tab for other users', async () => {
      localStorage.setItem('userId', '456');
      getUserById.mockResolvedValue({ data: mockUser });
      renderUserDashboard();

      await waitFor(() => {
        expect(screen.queryByText('Appointment Details')).not.toBeInTheDocument();
      });
    });

    test('renders user appointments when appointments exist', async () => {
      getUserById.mockResolvedValue({ data: mockUser });
      renderUserDashboard();

      fireEvent.click(screen.getByText('Appointment Details'));

      await waitFor(() => {
        expect(screen.getByTestId('user-appointments')).toBeInTheDocument();
      });
    });
  });

  describe('Reviews Tab', () => {
    test('renders reviews when user has reviews', async () => {
      getUserById.mockResolvedValue({ data: mockUser });
      renderUserDashboard();

      fireEvent.click(screen.getByText('Reviws'));

      await waitFor(() => {
        expect(screen.getAllByTestId('review')).toHaveLength(2);
      });
    });

    test('shows no data message when user has no reviews', async () => {
      const userWithoutReviews = { ...mockUser, reviews: [] };
      getUserById.mockResolvedValue({ data: userWithoutReviews });
      renderUserDashboard();

      fireEvent.click(screen.getByText('Reviws'));

      await waitFor(() => {
        expect(screen.getByTestId('no-data')).toBeInTheDocument();
      });
    });
  });

  describe('Photo Removal', () => {
    test('removes photo successfully', async () => {
      deleteUserPhoto.mockResolvedValue({ message: 'Photo removed successfully' });
      getUserById.mockResolvedValue({ data: mockUser });
      
      const mockSetSuccessMessage = jest.fn();
      const mockSetShowSuccessAlert = jest.fn();
      
      const useMessageAlerts = require('../../../components/hooks/UseMessageAlerts');
      useMessageAlerts.mockReturnValue({
        successMessage: 'Photo removed successfully',
        setSuccessMessage: mockSetSuccessMessage,
        errorMessage: '',
        setErrorMessage: jest.fn(),
        showSuccessAlert: true,
        setShowSuccessAlert: mockSetShowSuccessAlert,
        showErrorAlert: false,
        setShowErrorAlert: jest.fn(),
      });

      delete window.location;
      window.location = { reload: jest.fn() };

      renderUserDashboard();

      await waitFor(() => {
        fireEvent.click(screen.getByText('Remove Photo'));
      });

      await waitFor(() => {
        expect(deleteUserPhoto).toHaveBeenCalledWith('photo123', '123');
        expect(window.location.reload).toHaveBeenCalled();
      });
    });

    test('handles photo removal error', async () => {
      deleteUserPhoto.mockRejectedValue(new Error('Failed to remove photo'));
      getUserById.mockResolvedValue({ data: mockUser });
      
      const mockSetErrorMessage = jest.fn();
      const mockSetShowErrorAlert = jest.fn();
      
      const useMessageAlerts = require('../../../components/hooks/UseMessageAlerts');
      useMessageAlerts.mockReturnValue({
        successMessage: '',
        setSuccessMessage: jest.fn(),
        errorMessage: 'Failed to remove photo',
        setErrorMessage: mockSetErrorMessage,
        showSuccessAlert: false,
        setShowSuccessAlert: jest.fn(),
        showErrorAlert: true,
        setShowErrorAlert: mockSetShowErrorAlert,
      });

      renderUserDashboard();

      await waitFor(() => {
        fireEvent.click(screen.getByText('Remove Photo'));
      });

      await waitFor(() => {
        expect(screen.getByTestId('alert-danger')).toBeInTheDocument();
      });
    });
  });

  describe('Account Deletion', () => {
    test('deletes account successfully', async () => {
      deleteUser.mockResolvedValue({ message: 'Account deleted successfully' });
      getUserById.mockResolvedValue({ data: mockUser });
      
      const mockSetSuccessMessage = jest.fn();
      const mockSetShowSuccessAlert = jest.fn();
      
      const useMessageAlerts = require('../../../components/hooks/UseMessageAlerts');
      useMessageAlerts.mockReturnValue({
        successMessage: 'Account deleted successfully',
        setSuccessMessage: mockSetSuccessMessage,
        errorMessage: '',
        setErrorMessage: jest.fn(),
        showSuccessAlert: true,
        setShowSuccessAlert: mockSetShowSuccessAlert,
        showErrorAlert: false,
        setShowErrorAlert: jest.fn(),
      });

      jest.useFakeTimers();
      renderUserDashboard();

      await waitFor(() => {
        fireEvent.click(screen.getByText('Delete Account'));
      });

      await waitFor(() => {
        expect(deleteUser).toHaveBeenCalledWith('123');
      });

      jest.advanceTimersByTime(10000);
      expect(logout).toHaveBeenCalled();
      jest.useRealTimers();
    });

    test('handles account deletion error', async () => {
      deleteUser.mockRejectedValue(new Error('Failed to delete account'));
      getUserById.mockResolvedValue({ data: mockUser });
      
      const mockSetErrorMessage = jest.fn();
      const mockSetShowErrorAlert = jest.fn();
      
      const useMessageAlerts = require('../../../components/hooks/UseMessageAlerts');
      useMessageAlerts.mockReturnValue({
        successMessage: '',
        setSuccessMessage: jest.fn(),
        errorMessage: 'Failed to delete account',
        setErrorMessage: mockSetErrorMessage,
        showSuccessAlert: false,
        setShowSuccessAlert: jest.fn(),
        showErrorAlert: true,
        setShowErrorAlert: mockSetShowErrorAlert,
      });

      renderUserDashboard();

      await waitFor(() => {
        fireEvent.click(screen.getByText('Delete Account'));
      });

      await waitFor(() => {
        expect(screen.getByTestId('alert-danger')).toBeInTheDocument();
      });
    });
  });

  describe('Data Processing', () => {
    test('processes appointment data correctly', async () => {
      formatAppointmentStatus.mockImplementation((status) => status.toLowerCase());
      getUserById.mockResolvedValue({ data: mockUser });
      renderUserDashboard();

      await waitFor(() => {
        expect(formatAppointmentStatus).toHaveBeenCalledWith('CONFIRMED');
        expect(formatAppointmentStatus).toHaveBeenCalledWith('PENDING');
      });
    });

    test('handles empty appointment data', async () => {
      const userWithoutAppointments = { ...mockUser, appointments: [] };
      getUserById.mockResolvedValue({ data: userWithoutAppointments });
      renderUserDashboard();

      fireEvent.click(screen.getByText('Appointments Overview'));

      await waitFor(() => {
        expect(screen.getByTestId('no-data')).toBeInTheDocument();
      });
    });
  });
});