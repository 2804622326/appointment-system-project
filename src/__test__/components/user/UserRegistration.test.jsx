import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import UserRegistration from '../../../components/user/UserRegistration';
import { registerUser } from '../../../components/user/UserService';

// Mock dependencies
jest.mock('../../../components/user/UserService');
jest.mock('../../../components/hooks/UseMessageAlerts');
jest.mock('../../../components/common/AlertMessage');
jest.mock('../../../components/common/ProcessSpinner');
jest.mock('../../../components/veterinarian/VetSpecializationSelector');

const mockUseMessageAlerts = require('../../../components/hooks/UseMessageAlerts').default;
const mockAlertMessage = require('../../../components/common/AlertMessage').default;
const mockProcessSpinner = require('../../../components/common/ProcessSpinner').default;
const mockVetSpecializationSelector = require('../../../components/veterinarian/VetSpecializationSelector').default;

// Setup mocks
mockUseMessageAlerts.mockReturnValue({
  successMessage: '',
  setSuccessMessage: jest.fn(),
  errorMessage: '',
  setErrorMessage: jest.fn(),
  showSuccessAlert: false,
  setShowSuccessAlert: jest.fn(),
  showErrorAlert: false,
  setShowErrorAlert: jest.fn(),
});

mockAlertMessage.mockImplementation(({ type, message }) => (
  <div data-testid={`alert-${type}`}>{message}</div>
));

mockProcessSpinner.mockImplementation(({ message }) => (
  <div data-testid="process-spinner">{message}</div>
));

mockVetSpecializationSelector.mockImplementation(({ value, onChange }) => (
  <select data-testid="vet-specialization" value={value} onChange={onChange} name="specialization">
    <option value="">Select specialization</option>
    <option value="Surgery">Surgery</option>
    <option value="Dermatology">Dermatology</option>
  </select>
));

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('UserRegistration Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders registration form with all required fields', () => {
    renderWithRouter(<UserRegistration />);

    expect(screen.getByText('User Registration Form')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Last name')).toBeInTheDocument();
    expect(screen.getByLabelText('Gender')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('...email address...')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('mobile phone number')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Account Type')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument();
  });

  test('updates form fields when user types', () => {
    renderWithRouter(<UserRegistration />);

    const firstNameInput = screen.getByPlaceholderText('First Name');
    const lastNameInput = screen.getByPlaceholderText('Last name');
    const emailInput = screen.getByPlaceholderText('...email address...');

    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john.doe@email.com' } });

    expect(firstNameInput.value).toBe('John');
    expect(lastNameInput.value).toBe('Doe');
    expect(emailInput.value).toBe('john.doe@email.com');
  });

  test('shows VetSpecializationSelector when VET user type is selected', () => {
    renderWithRouter(<UserRegistration />);

    const userTypeSelect = screen.getByLabelText('Account Type');
    fireEvent.change(userTypeSelect, { target: { value: 'VET' } });

    expect(screen.getByTestId('vet-specialization')).toBeInTheDocument();
  });

  test('hides VetSpecializationSelector when PATIENT user type is selected', () => {
    renderWithRouter(<UserRegistration />);

    const userTypeSelect = screen.getByLabelText('Account Type');
    fireEvent.change(userTypeSelect, { target: { value: 'PATIENT' } });

    expect(screen.queryByTestId('vet-specialization')).not.toBeInTheDocument();
  });

  test('handles gender selection', () => {
    renderWithRouter(<UserRegistration />);

    const genderSelect = screen.getByLabelText('Gender');
    fireEvent.change(genderSelect, { target: { value: 'Male' } });

    expect(genderSelect.value).toBe('Male');
  });

  test('handles phone number input', () => {
    renderWithRouter(<UserRegistration />);

    const phoneInput = screen.getByPlaceholderText('mobile phone number');
    fireEvent.change(phoneInput, { target: { value: '1234567890' } });

    expect(phoneInput.value).toBe('1234567890');
  });

  test('handles password input', () => {
    renderWithRouter(<UserRegistration />);

    const passwordInput = screen.getByLabelText('Password');
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(passwordInput.value).toBe('password123');
  });

  test('resets form when Reset button is clicked', () => {
    renderWithRouter(<UserRegistration />);

    const firstNameInput = screen.getByPlaceholderText('First Name');
    const resetButton = screen.getByRole('button', { name: 'Reset' });

    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    expect(firstNameInput.value).toBe('John');

    fireEvent.click(resetButton);
    expect(firstNameInput.value).toBe('');
  });

  test('handles successful form submission', async () => {
    const mockResponse = { message: 'Registration successful' };
    registerUser.mockResolvedValue(mockResponse);

    const mockSetSuccessMessage = jest.fn();
    const mockSetShowSuccessAlert = jest.fn();
    
    mockUseMessageAlerts.mockReturnValue({
      successMessage: '',
      setSuccessMessage: mockSetSuccessMessage,
      errorMessage: '',
      setErrorMessage: jest.fn(),
      showSuccessAlert: false,
      setShowSuccessAlert: mockSetShowSuccessAlert,
      showErrorAlert: false,
      setShowErrorAlert: jest.fn(),
    });

    renderWithRouter(<UserRegistration />);

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(registerUser).toHaveBeenCalled();
      expect(mockSetSuccessMessage).toHaveBeenCalledWith('Registration successful');
      expect(mockSetShowSuccessAlert).toHaveBeenCalledWith(true);
    });
  });

  test('handles form submission error', async () => {
    const mockError = {
      response: {
        data: {
          message: 'Registration failed'
        }
      }
    };
    registerUser.mockRejectedValue(mockError);

    const mockSetErrorMessage = jest.fn();
    const mockSetShowErrorAlert = jest.fn();
    
    mockUseMessageAlerts.mockReturnValue({
      successMessage: '',
      setSuccessMessage: jest.fn(),
      errorMessage: '',
      setErrorMessage: mockSetErrorMessage,
      showSuccessAlert: false,
      setShowSuccessAlert: jest.fn(),
      showErrorAlert: false,
      setShowErrorAlert: mockSetShowErrorAlert,
    });

    renderWithRouter(<UserRegistration />);

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(registerUser).toHaveBeenCalled();
      expect(mockSetErrorMessage).toHaveBeenCalledWith('Registration failed');
      expect(mockSetShowErrorAlert).toHaveBeenCalledWith(true);
    });
  });

  test('shows process spinner during form submission', async () => {
    registerUser.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    renderWithRouter(<UserRegistration />);

    const submitButton = screen.getByRole('button', { name: 'Register' });
    fireEvent.click(submitButton);

    expect(screen.getByTestId('process-spinner')).toBeInTheDocument();
    expect(screen.getByText('Processing registration...')).toBeInTheDocument();
  });

  test('disables submit button during processing', async () => {
    registerUser.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    renderWithRouter(<UserRegistration />);

    const submitButton = screen.getByRole('button', { name: 'Register' });
    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
  });

  test('shows error alert when showErrorAlert is true', () => {
    mockUseMessageAlerts.mockReturnValue({
      successMessage: '',
      setSuccessMessage: jest.fn(),
      errorMessage: 'Test error message',
      setErrorMessage: jest.fn(),
      showSuccessAlert: false,
      setShowSuccessAlert: jest.fn(),
      showErrorAlert: true,
      setShowErrorAlert: jest.fn(),
    });

    renderWithRouter(<UserRegistration />);

    expect(screen.getByTestId('alert-danger')).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  test('shows success alert when showSuccessAlert is true', () => {
    mockUseMessageAlerts.mockReturnValue({
      successMessage: 'Test success message',
      setSuccessMessage: jest.fn(),
      errorMessage: '',
      setErrorMessage: jest.fn(),
      showSuccessAlert: true,
      setShowSuccessAlert: jest.fn(),
      showErrorAlert: false,
      setShowErrorAlert: jest.fn(),
    });

    renderWithRouter(<UserRegistration />);

    expect(screen.getByTestId('alert-success')).toBeInTheDocument();
    expect(screen.getByText('Test success message')).toBeInTheDocument();
  });

  test('renders login link', () => {
    renderWithRouter(<UserRegistration />);

    const loginLink = screen.getByRole('link', { name: 'Login here' });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink.getAttribute('href')).toBe('/login');
  });

  test('form submission calls registerUser with correct user data', async () => {
    registerUser.mockResolvedValue({ message: 'Success' });

    renderWithRouter(<UserRegistration />);

    // Fill form
    fireEvent.change(screen.getByPlaceholderText('First Name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('Last name'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText('Gender'), { target: { value: 'Male' } });
    fireEvent.change(screen.getByPlaceholderText('...email address...'), { target: { value: 'john@email.com' } });
    fireEvent.change(screen.getByPlaceholderText('mobile phone number'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText('Account Type'), { target: { value: 'PATIENT' } });

    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(registerUser).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        gender: 'Male',
        phoneNumber: '1234567890',
        email: 'john@email.com',
        password: 'password123',
        userType: 'PATIENT',
        specialization: '',
      });
    });
  });
});