import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import UserProfile from '../../../components/user/UserProfile';

// Mock the child components
jest.mock('../../../components/common/UserImage', () => {
  return function UserImage({ userId, userPhoto }) {
    return <div data-testid="user-image">{`User ${userId} - ${userPhoto}`}</div>;
  };
});

jest.mock('../../../components/modals/ImageUploaderModal', () => {
  return function ImageUploaderModal({ show, handleClose, userId }) {
    return show ? (
      <div data-testid="image-uploader-modal">
        <button onClick={handleClose}>Close Modal</button>
        <span>User ID: {userId}</span>
      </div>
    ) : null;
  };
});

jest.mock('../../../components/modals/ChangePasswordModal', () => {
  return function ChangePasswordModal({ show, handleClose, userId }) {
    return show ? (
      <div data-testid="change-password-modal">
        <button onClick={handleClose}>Close Modal</button>
        <span>User ID: {userId}</span>
      </div>
    ) : null;
  };
});

jest.mock('../../../components/modals/DeleteConfirmationModal', () => {
  return function DeleteConfirmationModal({ show, onHide, onConfirm, itemToDelete }) {
    return show ? (
      <div data-testid="delete-confirmation-modal">
        <button onClick={onHide}>Cancel</button>
        <button onClick={onConfirm} data-testid="confirm-delete">Confirm Delete</button>
        <span>Delete: {itemToDelete}</span>
      </div>
    ) : null;
  };
});

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

const mockUser = {
  id: '123',
  firstName: 'John',
  lastName: 'Doe',
  gender: 'Male',
  email: 'john@example.com',
  phoneNumber: '123-456-7890',
  userType: 'USER',
  photo: 'profile.jpg',
  enabled: true,
  roles: ['ROLE_USER', 'ROLE_ADMIN']
};

const mockVetUser = {
  ...mockUser,
  userType: 'VET',
  specialization: 'Small Animals'
};

const defaultProps = {
  user: mockUser,
  handleRemovePhoto: jest.fn(),
  handleDeleteAccount: jest.fn()
};

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('UserProfile Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue('123');
  });

  test('renders user profile information correctly', () => {
    renderWithRouter(<UserProfile {...defaultProps} />);
    
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Doe')).toBeInTheDocument();
    expect(screen.getByText('Male')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('123-456-7890')).toBeInTheDocument();
    expect(screen.getByText('USER')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  test('renders UserImage component with correct props', () => {
    renderWithRouter(<UserProfile {...defaultProps} />);
    
    expect(screen.getByTestId('user-image')).toHaveTextContent('User 123 - profile.jpg');
  });

  test('displays user roles correctly', () => {
    renderWithRouter(<UserProfile {...defaultProps} />);
    
    expect(screen.getByText('USER')).toBeInTheDocument();
    expect(screen.getByText('ADMIN')).toBeInTheDocument();
  });

  test('shows specialization for VET user type', () => {
    const props = { ...defaultProps, user: mockVetUser };
    renderWithRouter(<UserProfile {...props} />);
    
    expect(screen.getByText('Small Animals')).toBeInTheDocument();
  });

  test('does not show specialization for non-VET user type', () => {
    renderWithRouter(<UserProfile {...defaultProps} />);
    
    expect(screen.queryByText('Specialization :')).not.toBeInTheDocument();
  });

  test('shows current user controls when user is current user', () => {
    renderWithRouter(<UserProfile {...defaultProps} />);
    
    expect(screen.getByText('Update Photo')).toBeInTheDocument();
    expect(screen.getByText('Remove Photo')).toBeInTheDocument();
    expect(screen.getByText('Change Password')).toBeInTheDocument();
    expect(screen.getByText('Edit profile')).toBeInTheDocument();
    expect(screen.getByText('Close account')).toBeInTheDocument();
  });

  test('hides current user controls when user is not current user', () => {
    mockLocalStorage.getItem.mockReturnValue('456');
    renderWithRouter(<UserProfile {...defaultProps} />);
    
    expect(screen.queryByText('Update Photo')).not.toBeInTheDocument();
    expect(screen.queryByText('Remove Photo')).not.toBeInTheDocument();
    expect(screen.queryByText('Change Password')).not.toBeInTheDocument();
    expect(screen.queryByText('Edit profile')).not.toBeInTheDocument();
    expect(screen.queryByText('Close account')).not.toBeInTheDocument();
  });

  test('opens and closes image uploader modal', () => {
    renderWithRouter(<UserProfile {...defaultProps} />);
    
    // Modal should not be visible initially
    expect(screen.queryByTestId('image-uploader-modal')).not.toBeInTheDocument();
    
    // Click to open modal
    fireEvent.click(screen.getByText('Update Photo'));
    expect(screen.getByTestId('image-uploader-modal')).toBeInTheDocument();
    
    // Click to close modal
    fireEvent.click(screen.getByText('Close Modal'));
    expect(screen.queryByTestId('image-uploader-modal')).not.toBeInTheDocument();
  });

  test('opens and closes change password modal', () => {
    renderWithRouter(<UserProfile {...defaultProps} />);
    
    // Modal should not be visible initially
    expect(screen.queryByTestId('change-password-modal')).not.toBeInTheDocument();
    
    // Click to open modal
    fireEvent.click(screen.getByText('Change Password'));
    expect(screen.getByTestId('change-password-modal')).toBeInTheDocument();
    
    // Click to close modal
    fireEvent.click(screen.getByText('Close Modal'));
    expect(screen.queryByTestId('change-password-modal')).not.toBeInTheDocument();
  });

  test('opens and closes delete confirmation modal', () => {
    renderWithRouter(<UserProfile {...defaultProps} />);
    
    // Modal should not be visible initially
    expect(screen.queryByTestId('delete-confirmation-modal')).not.toBeInTheDocument();
    
    // Click to open modal
    fireEvent.click(screen.getByText('Close account'));
    expect(screen.getByTestId('delete-confirmation-modal')).toBeInTheDocument();
    
    // Click to close modal
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByTestId('delete-confirmation-modal')).not.toBeInTheDocument();
  });

  test('calls handleRemovePhoto when Remove Photo is clicked', () => {
    renderWithRouter(<UserProfile {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Remove Photo'));
    expect(defaultProps.handleRemovePhoto).toHaveBeenCalledTimes(1);
  });

  test('calls handleDeleteAccount when delete is confirmed', async () => {
    defaultProps.handleDeleteAccount.mockResolvedValue();
    renderWithRouter(<UserProfile {...defaultProps} />);
    
    // Open delete modal
    fireEvent.click(screen.getByText('Close account'));
    
    // Confirm delete
    fireEvent.click(screen.getByTestId('confirm-delete'));
    
    await waitFor(() => {
      expect(defaultProps.handleDeleteAccount).toHaveBeenCalledTimes(1);
    });
  });

  test('handles delete account error gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    const error = new Error('Delete failed');
    defaultProps.handleDeleteAccount.mockRejectedValue(error);
    
    renderWithRouter(<UserProfile {...defaultProps} />);
    
    // Open delete modal
    fireEvent.click(screen.getByText('Close account'));
    
    // Confirm delete
    fireEvent.click(screen.getByTestId('confirm-delete'));
    
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Delete failed');
    });
    
    consoleErrorSpy.mockRestore();
  });

  test('displays inactive status correctly', () => {
    const inactiveUser = { ...mockUser, enabled: false };
    const props = { ...defaultProps, user: inactiveUser };
    
    renderWithRouter(<UserProfile {...props} />);
    
    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });

  test('handles empty roles array', () => {
    const userWithoutRoles = { ...mockUser, roles: [] };
    const props = { ...defaultProps, user: userWithoutRoles };
    
    renderWithRouter(<UserProfile {...props} />);
    
    expect(screen.getByText('Role(s) :')).toBeInTheDocument();
  });

  test('handles null roles', () => {
    const userWithNullRoles = { ...mockUser, roles: null };
    const props = { ...defaultProps, user: userWithNullRoles };
    
    renderWithRouter(<UserProfile {...props} />);
    
    expect(screen.getByText('Role(s) :')).toBeInTheDocument();
  });

  test('edit profile link has correct href', () => {
    renderWithRouter(<UserProfile {...defaultProps} />);
    
    const editLink = screen.getByText('Edit profile');
    expect(editLink.closest('a')).toHaveAttribute('href', '/update-user/123/update');
  });
});