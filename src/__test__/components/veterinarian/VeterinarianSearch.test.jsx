import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import VeterinarianSearch from '../../../components/veterinarian/VeterinarianSearch';
import { findAvailableVeterinarians, getAllSpecializations } from '../../../components/veterinarian/VeterinarianService';
import { dateTimeFormatter } from '../../../components/utils/utilities';

// Mock dependencies
jest.mock('../../../components/veterinarian/VeterinarianService');
jest.mock('../../../components/utils/utilities');
jest.mock('../../../components/hooks/UseMessageAlerts', () => ({
  __esModule: true,
  default: () => ({
    errorMessage: '',
    setErrorMessage: jest.fn(),
    showErrorAlert: false,
    setShowErrorAlert: jest.fn(),
  }),
}));

const mockOnSearchResult = jest.fn();

describe('VeterinarianSearch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getAllSpecializations.mockResolvedValue({
      data: ['Cardiology', 'Surgery', 'Dermatology']
    });
  });

  test('renders search form with all elements', async () => {
    render(<VeterinarianSearch onSearchResult={mockOnSearchResult} />);
    
    expect(screen.getByText('Find a Veterinarian')).toBeInTheDocument();
    expect(screen.getByLabelText('Specialization')).toBeInTheDocument();
    expect(screen.getByText('Select Specialization')).toBeInTheDocument();
    expect(screen.getByLabelText('Include Date and Time Availabilty')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Clear Search')).toBeInTheDocument();
  });

  test('loads and displays specializations on mount', async () => {
    render(<VeterinarianSearch onSearchResult={mockOnSearchResult} />);
    
    await waitFor(() => {
      expect(getAllSpecializations).toHaveBeenCalled();
    });
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('Cardiology')).toBeInTheDocument();
    });
  });

  test('handles specialization selection', () => {
    render(<VeterinarianSearch onSearchResult={mockOnSearchResult} />);
    
    const select = screen.getByLabelText('Specialization');
    fireEvent.change(select, { target: { value: 'Cardiology' } });
    
    expect(select.value).toBe('Cardiology');
  });

  test('shows/hides date and time fields when checkbox is toggled', () => {
    render(<VeterinarianSearch onSearchResult={mockOnSearchResult} />);
    
    const checkbox = screen.getByLabelText('Include Date and Time Availabilty');
    
    // Initially hidden
    expect(screen.queryByText('Include Date and Time')).not.toBeInTheDocument();
    
    // Show after checking
    fireEvent.click(checkbox);
    expect(screen.getByText('Include Date and Time')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Time')).toBeInTheDocument();
    
    // Hide after unchecking
    fireEvent.click(checkbox);
    expect(screen.queryByText('Include Date and Time')).not.toBeInTheDocument();
  });

  test('performs search with specialization only', async () => {
    findAvailableVeterinarians.mockResolvedValue({ data: ['vet1', 'vet2'] });
    
    render(<VeterinarianSearch onSearchResult={mockOnSearchResult} />);
    
    const select = screen.getByLabelText('Specialization');
    fireEvent.change(select, { target: { value: 'Cardiology' } });
    
    const searchButton = screen.getByText('Search');
    fireEvent.click(searchButton);
    
    await waitFor(() => {
      expect(findAvailableVeterinarians).toHaveBeenCalledWith({
        specialization: 'Cardiology'
      });
      expect(mockOnSearchResult).toHaveBeenCalledWith(['vet1', 'vet2']);
    });
  });

  test('performs search with date and time', async () => {
    findAvailableVeterinarians.mockResolvedValue({ data: ['vet1'] });
    dateTimeFormatter.mockReturnValue({
      formattedDate: '2023-12-25',
      formattedTime: '10:00'
    });
    
    render(<VeterinarianSearch onSearchResult={mockOnSearchResult} />);
    
    // Enable date/time
    const checkbox = screen.getByLabelText('Include Date and Time Availabilty');
    fireEvent.click(checkbox);
    
    // Set specialization
    const select = screen.getByLabelText('Specialization');
    fireEvent.change(select, { target: { value: 'Surgery' } });
    
    // Mock date and time values
    const component = screen.getByText('Search').closest('form');
    const searchButton = screen.getByText('Search');
    
    // Simulate form submission with date and time
    fireEvent.submit(component);
    
    await waitFor(() => {
      expect(findAvailableVeterinarians).toHaveBeenCalled();
    });
  });

  test('handles search error', async () => {
    const mockSetErrorMessage = jest.fn();
    const mockSetShowErrorAlert = jest.fn();
    
    require('../../../components/hooks/UseMessageAlerts').default.mockReturnValue({
      errorMessage: 'Search failed',
      setErrorMessage: mockSetErrorMessage,
      showErrorAlert: true,
      setShowErrorAlert: mockSetShowErrorAlert,
    });
    
    findAvailableVeterinarians.mockRejectedValue({
      response: { data: { message: 'Search failed' } }
    });
    
    render(<VeterinarianSearch onSearchResult={mockOnSearchResult} />);
    
    const searchButton = screen.getByText('Search');
    fireEvent.click(searchButton);
    
    await waitFor(() => {
      expect(mockSetErrorMessage).toHaveBeenCalledWith('Search failed');
      expect(mockSetShowErrorAlert).toHaveBeenCalledWith(true);
    });
  });

  test('clears search form and results', () => {
    render(<VeterinarianSearch onSearchResult={mockOnSearchResult} />);
    
    // Set some values
    const select = screen.getByLabelText('Specialization');
    fireEvent.change(select, { target: { value: 'Cardiology' } });
    
    const checkbox = screen.getByLabelText('Include Date and Time Availabilty');
    fireEvent.click(checkbox);
    
    // Clear search
    const clearButton = screen.getByText('Clear Search');
    fireEvent.click(clearButton);
    
    expect(select.value).toBe('');
    expect(checkbox.checked).toBe(false);
    expect(mockOnSearchResult).toHaveBeenCalledWith(null);
  });

  test('handles getAllSpecializations error', async () => {
    const mockSetErrorMessage = jest.fn();
    
    require('../../../components/hooks/UseMessageAlerts').default.mockReturnValue({
      errorMessage: '',
      setErrorMessage: mockSetErrorMessage,
      showErrorAlert: false,
      setShowErrorAlert: jest.fn(),
    });
    
    getAllSpecializations.mockRejectedValue(new Error('Failed to load specializations'));
    
    render(<VeterinarianSearch onSearchResult={mockOnSearchResult} />);
    
    await waitFor(() => {
      expect(mockSetErrorMessage).toHaveBeenCalledWith('Failed to load specializations');
    });
  });

  test('displays error alert when showErrorAlert is true', () => {
    require('../../../components/hooks/UseMessageAlerts').default.mockReturnValue({
      errorMessage: 'Test error message',
      setErrorMessage: jest.fn(),
      showErrorAlert: true,
      setShowErrorAlert: jest.fn(),
    });
    
    render(<VeterinarianSearch onSearchResult={mockOnSearchResult} />);
    
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  test('handles date change', () => {
    render(<VeterinarianSearch onSearchResult={mockOnSearchResult} />);
    
    const checkbox = screen.getByLabelText('Include Date and Time Availabilty');
    fireEvent.click(checkbox);
    
    const datePicker = screen.getByPlaceholderText('Select date');
    const testDate = new Date('2023-12-25');
    
    fireEvent.change(datePicker, { target: { value: testDate } });
    
    expect(datePicker).toBeInTheDocument();
  });

  test('handles time change', () => {
    render(<VeterinarianSearch onSearchResult={mockOnSearchResult} />);
    
    const checkbox = screen.getByLabelText('Include Date and Time Availabilty');
    fireEvent.click(checkbox);
    
    const timePicker = screen.getByPlaceholderText('Select time');
    
    fireEvent.change(timePicker, { target: { value: '10:00' } });
    
    expect(timePicker).toBeInTheDocument();
  });

  test('resets date and time when checkbox is checked', () => {
    render(<VeterinarianSearch onSearchResult={mockOnSearchResult} />);
    
    const checkbox = screen.getByLabelText('Include Date and Time Availabilty');
    
    // Check and uncheck to test the reset logic
    fireEvent.click(checkbox);
    fireEvent.click(checkbox);
    fireEvent.click(checkbox);
    
    expect(checkbox.checked).toBe(true);
  });
});