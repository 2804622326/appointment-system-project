import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Rating from '../../../components/rating/Rating';
import { addReview } from '../../../components/review/ReviewService';

// Mock dependencies
jest.mock('../../../components/review/ReviewService');
jest.mock('../../../components/hooks/UseMessageAlerts', () => {
  return jest.fn(() => ({
    successMessage: '',
    errorMessage: '',
    setSuccessMessage: jest.fn(),
    setErrorMessage: jest.fn(),
    showSuccessAlert: false,
    showErrorAlert: false,
    setShowSuccessAlert: jest.fn(),
    setShowErrorAlert: jest.fn(),
  }));
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

describe('Rating Component', () => {
  const mockProps = {
    veterinarianId: '123',
    onReviewSubmit: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue('user123');
  });

  test('renders rating form correctly', () => {
    render(<Rating {...mockProps} />);
    
    expect(screen.getByText('Rate this doctor :')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Leave a feedback message')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit review' })).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(5);
  });

  test('handles star rating selection', () => {
    render(<Rating {...mockProps} />);
    
    const thirdStar = screen.getAllByRole('radio')[2];
    fireEvent.click(thirdStar);
    
    expect(thirdStar).toBeChecked();
    expect(screen.getByText('3 stars')).toBeInTheDocument();
  });

  test('handles feedback input change', () => {
    render(<Rating {...mockProps} />);
    
    const feedbackInput = screen.getByPlaceholderText('Leave a feedback message');
    fireEvent.change(feedbackInput, { target: { value: 'Great doctor!' } });
    
    expect(feedbackInput.value).toBe('Great doctor!');
  });

  test('handles star hover effects', () => {
    render(<Rating {...mockProps} />);
    
    const stars = screen.getAllByRole('radio');
    const thirdStar = stars[2];
    
    fireEvent.mouseEnter(thirdStar.nextElementSibling);
    fireEvent.mouseLeave(thirdStar.nextElementSibling);
    
    // Test passes if no errors occur during hover events
    expect(thirdStar).toBeInTheDocument();
  });

  test('submits review successfully when user is logged in', async () => {
    const mockResponse = { message: 'Review submitted successfully' };
    addReview.mockResolvedValue(mockResponse);
    
    const UseMessageAlerts = require('../../../components/hooks/UseMessageAlerts');
    const mockSetSuccessMessage = jest.fn();
    const mockSetShowSuccessAlert = jest.fn();
    
    UseMessageAlerts.mockReturnValue({
      successMessage: '',
      errorMessage: '',
      setSuccessMessage: mockSetSuccessMessage,
      setErrorMessage: jest.fn(),
      showSuccessAlert: false,
      showErrorAlert: false,
      setShowSuccessAlert: mockSetShowSuccessAlert,
      setShowErrorAlert: jest.fn(),
    });

    render(<Rating {...mockProps} />);
    
    // Select rating
    const thirdStar = screen.getAllByRole('radio')[2];
    fireEvent.click(thirdStar);
    
    // Add feedback
    const feedbackInput = screen.getByPlaceholderText('Leave a feedback message');
    fireEvent.change(feedbackInput, { target: { value: 'Excellent service!' } });
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: 'Submit review' });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(addReview).toHaveBeenCalledWith('123', 'user123', {
        stars: 3,
        feedback: 'Excellent service!'
      });
    });
    
    expect(mockProps.onReviewSubmit).toHaveBeenCalled();
  });

  test('shows error when user is not logged in', async () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    
    const UseMessageAlerts = require('../../../components/hooks/UseMessageAlerts');
    const mockSetErrorMessage = jest.fn();
    const mockSetShowErrorAlert = jest.fn();
    
    UseMessageAlerts.mockReturnValue({
      successMessage: '',
      errorMessage: '',
      setSuccessMessage: jest.fn(),
      setErrorMessage: mockSetErrorMessage,
      showSuccessAlert: false,
      showErrorAlert: false,
      setShowSuccessAlert: jest.fn(),
      setShowErrorAlert: mockSetShowErrorAlert,
    });

    render(<Rating {...mockProps} />);
    
    // Select rating and add feedback
    const thirdStar = screen.getAllByRole('radio')[2];
    fireEvent.click(thirdStar);
    
    const feedbackInput = screen.getByPlaceholderText('Leave a feedback message');
    fireEvent.change(feedbackInput, { target: { value: 'Test feedback' } });
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: 'Submit review' });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockSetErrorMessage).toHaveBeenCalledWith('Please, login to submit a review');
      expect(mockSetShowErrorAlert).toHaveBeenCalledWith(true);
    });
  });

  test('handles API error during review submission', async () => {
    const mockError = {
      response: {
        data: {
          message: 'Failed to submit review'
        }
      }
    };
    addReview.mockRejectedValue(mockError);
    
    const UseMessageAlerts = require('../../../components/hooks/UseMessageAlerts');
    const mockSetErrorMessage = jest.fn();
    const mockSetShowErrorAlert = jest.fn();
    
    UseMessageAlerts.mockReturnValue({
      successMessage: '',
      errorMessage: '',
      setSuccessMessage: jest.fn(),
      setErrorMessage: mockSetErrorMessage,
      showSuccessAlert: false,
      showErrorAlert: false,
      setShowSuccessAlert: jest.fn(),
      setShowErrorAlert: mockSetShowErrorAlert,
    });

    render(<Rating {...mockProps} />);
    
    // Select rating and add feedback
    const thirdStar = screen.getAllByRole('radio')[2];
    fireEvent.click(thirdStar);
    
    const feedbackInput = screen.getByPlaceholderText('Leave a feedback message');
    fireEvent.change(feedbackInput, { target: { value: 'Test feedback' } });
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: 'Submit review' });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockSetErrorMessage).toHaveBeenCalledWith('Failed to submit review');
      expect(mockSetShowErrorAlert).toHaveBeenCalledWith(true);
    });
  });

  test('displays success alert when showSuccessAlert is true', () => {
    const UseMessageAlerts = require('../../../components/hooks/UseMessageAlerts');
    UseMessageAlerts.mockReturnValue({
      successMessage: 'Review submitted successfully',
      errorMessage: '',
      setSuccessMessage: jest.fn(),
      setErrorMessage: jest.fn(),
      showSuccessAlert: true,
      showErrorAlert: false,
      setShowSuccessAlert: jest.fn(),
      setShowErrorAlert: jest.fn(),
    });

    render(<Rating {...mockProps} />);
    
    expect(screen.getByText('Review submitted successfully')).toBeInTheDocument();
  });

  test('displays error alert when showErrorAlert is true', () => {
    const UseMessageAlerts = require('../../../components/hooks/UseMessageAlerts');
    UseMessageAlerts.mockReturnValue({
      successMessage: '',
      errorMessage: 'Please login to continue',
      setSuccessMessage: jest.fn(),
      setErrorMessage: jest.fn(),
      showSuccessAlert: false,
      showErrorAlert: true,
      setShowSuccessAlert: jest.fn(),
      setShowErrorAlert: jest.fn(),
    });

    render(<Rating {...mockProps} />);
    
    expect(screen.getByText('Please login to continue')).toBeInTheDocument();
  });

  test('calls onReviewSubmit callback when provided', async () => {
    const mockResponse = { message: 'Review submitted successfully' };
    addReview.mockResolvedValue(mockResponse);
    
    render(<Rating {...mockProps} />);
    
    // Select rating and submit
    const thirdStar = screen.getAllByRole('radio')[2];
    fireEvent.click(thirdStar);
    
    const feedbackInput = screen.getByPlaceholderText('Leave a feedback message');
    fireEvent.change(feedbackInput, { target: { value: 'Great!' } });
    
    const submitButton = screen.getByRole('button', { name: 'Submit review' });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockProps.onReviewSubmit).toHaveBeenCalled();
    });
  });

  test('works without onReviewSubmit callback', async () => {
    const mockResponse = { message: 'Review submitted successfully' };
    addReview.mockResolvedValue(mockResponse);
    
    render(<Rating veterinarianId="123" />);
    
    // Select rating and submit
    const thirdStar = screen.getAllByRole('radio')[2];
    fireEvent.click(thirdStar);
    
    const feedbackInput = screen.getByPlaceholderText('Leave a feedback message');
    fireEvent.change(feedbackInput, { target: { value: 'Great!' } });
    
    const submitButton = screen.getByRole('button', { name: 'Submit review' });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(addReview).toHaveBeenCalled();
    });
  });
});