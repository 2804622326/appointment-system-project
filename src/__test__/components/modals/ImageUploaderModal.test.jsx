import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ImageUploaderModal from '../../../components/modals/ImageUploaderModal';
import { updateUserPhoto, uploadUserPhoto } from '../../../components/modals/ImageUploaderService';
import { getUserById } from '../../../components/user/UserService';
import UseMessageAlerts from '../../../components/hooks/UseMessageAlerts';

// Mock dependencies
jest.mock('../../../components/modals/ImageUploaderService');
jest.mock('../../../components/user/UserService');
jest.mock('../../../components/hooks/UseMessageAlerts');
jest.mock('../../../components/common/AlertMessage', () => {
  return function AlertMessage({ type, messsag }) {
    return <div data-testid={`alert-${type}`}>{messsag}</div>;
  };
});

// Mock window.location.reload
delete window.location;
window.location = { reload: jest.fn() };

const mockUseMessageAlerts = {
  successMessage: '',
  setSuccessMessage: jest.fn(),
  errorMessage: '',
  setErrorMessage: jest.fn(),
  showSuccessAlert: false,
  setShowSuccessAlert: jest.fn(),
  showErrorAlert: false,
  setShowErrorAlert: jest.fn(),
};

describe('ImageUploaderModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    UseMessageAlerts.mockReturnValue(mockUseMessageAlerts);
  });

  const defaultProps = {
    userId: '123',
    show: true,
    handleClose: jest.fn(),
  };

  test('renders modal when show is true', () => {
    getUserById.mockResolvedValue({ data: {} });
    
    render(<ImageUploaderModal {...defaultProps} />);
    
    expect(screen.getByText('Upload a Photo')).toBeInTheDocument();
    expect(screen.getByText('Select the photo you would like to display on your profile')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Upload' })).toBeInTheDocument();
  });

  test('does not render modal when show is false', () => {
    getUserById.mockResolvedValue({ data: {} });
    
    render(<ImageUploaderModal {...defaultProps} show={false} />);
    
    expect(screen.queryByText('Upload a Photo')).not.toBeInTheDocument();
  });

  test('calls getUserById on component mount', async () => {
    getUserById.mockResolvedValue({ data: {} });
    
    render(<ImageUploaderModal {...defaultProps} />);
    
    await waitFor(() => {
      expect(getUserById).toHaveBeenCalledWith('123');
    });
  });

  test('handles file selection', () => {
    getUserById.mockResolvedValue({ data: {} });
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    render(<ImageUploaderModal {...defaultProps} />);
    
    const fileInput = screen.getByRole('textbox');
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    expect(fileInput.files[0]).toBe(file);
  });

  test('uploads new photo when user has no existing photo', async () => {
    getUserById.mockResolvedValue({ data: { id: '123' } });
    uploadUserPhoto.mockResolvedValue({ data: 'Upload successful' });
    
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    render(<ImageUploaderModal {...defaultProps} />);
    
    const fileInput = screen.getByRole('textbox');
    const uploadButton = screen.getByRole('button', { name: 'Upload' });
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    fireEvent.click(uploadButton);
    
    await waitFor(() => {
      expect(uploadUserPhoto).toHaveBeenCalledWith('123', file);
      expect(mockUseMessageAlerts.setSuccessMessage).toHaveBeenCalledWith('Upload successful');
      expect(mockUseMessageAlerts.setShowSuccessAlert).toHaveBeenCalledWith(true);
      expect(window.location.reload).toHaveBeenCalled();
    });
  });

  test('updates existing photo when user has photo', async () => {
    getUserById.mockResolvedValue({ 
      data: { id: '123', photo: 'existing-photo', photoId: 'photo-123' } 
    });
    updateUserPhoto.mockResolvedValue({ data: 'Update successful' });
    
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    render(<ImageUploaderModal {...defaultProps} />);
    
    await waitFor(() => {
      expect(getUserById).toHaveBeenCalledWith('123');
    });
    
    const fileInput = screen.getByRole('textbox');
    const uploadButton = screen.getByRole('button', { name: 'Upload' });
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    fireEvent.click(uploadButton);
    
    await waitFor(() => {
      expect(updateUserPhoto).toHaveBeenCalledWith('photo-123', expect.any(Uint8Array));
    });
  });

  test('handles upload error', async () => {
    getUserById.mockResolvedValue({ data: {} });
    uploadUserPhoto.mockRejectedValue(new Error('Upload failed'));
    
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    render(<ImageUploaderModal {...defaultProps} />);
    
    const fileInput = screen.getByRole('textbox');
    const uploadButton = screen.getByRole('button', { name: 'Upload' });
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    fireEvent.click(uploadButton);
    
    await waitFor(() => {
      expect(mockUseMessageAlerts.setErrorMessage).toHaveBeenCalledWith('Upload failed');
      expect(mockUseMessageAlerts.setShowErrorAlert).toHaveBeenCalledWith(true);
    });
  });

  test('handles getUserById error', async () => {
    const error = {
      response: { data: { message: 'User not found' } },
      message: 'Network error'
    };
    getUserById.mockRejectedValue(error);
    
    render(<ImageUploaderModal {...defaultProps} />);
    
    await waitFor(() => {
      expect(mockUseMessageAlerts.setErrorMessage).toHaveBeenCalledWith('User not found');
      expect(mockUseMessageAlerts.setShowErrorAlert).toHaveBeenCalledWith(true);
    });
  });

  test('displays success alert when showSuccessAlert is true', () => {
    UseMessageAlerts.mockReturnValue({
      ...mockUseMessageAlerts,
      showSuccessAlert: true,
      successMessage: 'Success message'
    });
    getUserById.mockResolvedValue({ data: {} });
    
    render(<ImageUploaderModal {...defaultProps} />);
    
    expect(screen.getByTestId('alert-success')).toBeInTheDocument();
    expect(screen.getByText('Success message')).toBeInTheDocument();
  });

  test('displays error alert when showErrorAlert is true', () => {
    UseMessageAlerts.mockReturnValue({
      ...mockUseMessageAlerts,
      showErrorAlert: true,
      errorMessage: 'Error message'
    });
    getUserById.mockResolvedValue({ data: {} });
    
    render(<ImageUploaderModal {...defaultProps} />);
    
    expect(screen.getByTestId('alert-danger')).toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  test('calls handleClose when modal is closed', () => {
    getUserById.mockResolvedValue({ data: {} });
    
    render(<ImageUploaderModal {...defaultProps} />);
    
    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);
    
    expect(defaultProps.handleClose).toHaveBeenCalled();
  });

  test('prevents upload when no file is selected', async () => {
    getUserById.mockResolvedValue({ data: {} });
    
    render(<ImageUploaderModal {...defaultProps} />);
    
    const uploadButton = screen.getByRole('button', { name: 'Upload' });
    fireEvent.click(uploadButton);
    
    await waitFor(() => {
      expect(uploadUserPhoto).not.toHaveBeenCalled();
      expect(updateUserPhoto).not.toHaveBeenCalled();
    });
  });
});