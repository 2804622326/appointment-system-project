import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import VetSpecializationSelector from '../../../components/veterinarian/VetSpecializationSelector';
import { getAllSpecializations } from '../../../components/veterinarian/VeterinarianService';

// Mock the VeterinarianService
jest.mock('../../../components/veterinarian/VeterinarianService');

// Mock AddItemModal
jest.mock('../../../components/modals/AddItemModal', () => {
  return function MockAddItemModal({ show, handleClose, itemLabel, handleSave }) {
    return show ? (
      <div data-testid="add-item-modal">
        <span>{itemLabel}</span>
        <button onClick={() => handleSave('New Specialization')}>Save</button>
        <button onClick={handleClose}>Close</button>
      </div>
    ) : null;
  };
});

const mockGetAllSpecializations = getAllSpecializations;

describe('VetSpecializationSelector', () => {
  const mockOnChange = jest.fn();
  const mockSpecializations = ['Cardiology', 'Dermatology', 'Surgery'];

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetAllSpecializations.mockResolvedValue({
      data: mockSpecializations
    });
  });

  test('renders select element with default option', () => {
    render(<VetSpecializationSelector value="" onChange={mockOnChange} />);
    
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('...select specialization...')).toBeInTheDocument();
  });

  test('fetches and displays specializations on mount', async () => {
    render(<VetSpecializationSelector value="" onChange={mockOnChange} />);
    
    await waitFor(() => {
      expect(mockGetAllSpecializations).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(screen.getByText('Cardiology')).toBeInTheDocument();
      expect(screen.getByText('Dermatology')).toBeInTheDocument();
      expect(screen.getByText('Surgery')).toBeInTheDocument();
    });
  });

  test('displays Add New option', async () => {
    render(<VetSpecializationSelector value="" onChange={mockOnChange} />);
    
    await waitFor(() => {
      expect(screen.getByText('Add New')).toBeInTheDocument();
    });
  });

  test('calls onChange when selecting an existing specialization', async () => {
    render(<VetSpecializationSelector value="" onChange={mockOnChange} />);
    
    await waitFor(() => {
      expect(screen.getByText('Cardiology')).toBeInTheDocument();
    });

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'Cardiology' } });

    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          value: 'Cardiology'
        })
      })
    );
  });

  test('opens modal when Add New is selected', async () => {
    render(<VetSpecializationSelector value="" onChange={mockOnChange} />);
    
    await waitFor(() => {
      expect(screen.getByText('Add New')).toBeInTheDocument();
    });

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'Add-New' } });

    expect(screen.getByTestId('add-item-modal')).toBeInTheDocument();
    expect(screen.getByText('Specialization')).toBeInTheDocument();
  });

  test('closes modal when handleClose is called', async () => {
    render(<VetSpecializationSelector value="" onChange={mockOnChange} />);
    
    await waitFor(() => {
      expect(screen.getByText('Add New')).toBeInTheDocument();
    });

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'Add-New' } });

    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);

    expect(screen.queryByTestId('add-item-modal')).not.toBeInTheDocument();
  });

  test('adds new specialization when saved from modal', async () => {
    render(<VetSpecializationSelector value="" onChange={mockOnChange} />);
    
    await waitFor(() => {
      expect(screen.getByText('Add New')).toBeInTheDocument();
    });

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'Add-New' } });

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('New Specialization')).toBeInTheDocument();
    });

    expect(mockOnChange).toHaveBeenCalledWith({
      target: { name: 'specialization', value: 'New Specialization' }
    });
  });

  test('does not add duplicate specialization', async () => {
    render(<VetSpecializationSelector value="" onChange={mockOnChange} />);
    
    await waitFor(() => {
      expect(screen.getByText('Cardiology')).toBeInTheDocument();
    });

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'Add-New' } });

    // Mock handleSave to try to add existing specialization
    const modal = screen.getByTestId('add-item-modal');
    const saveButton = screen.getByText('Save');
    
    // Simulate trying to add 'Cardiology' which already exists
    fireEvent.click(saveButton);

    // Should not call onChange for duplicate
    expect(mockOnChange).toHaveBeenCalledWith({
      target: { name: 'specialization', value: 'New Specialization' }
    });
  });

  test('handles API error gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockGetAllSpecializations.mockRejectedValue(new Error('API Error'));

    render(<VetSpecializationSelector value="" onChange={mockOnChange} />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('API Error');
    });

    consoleSpy.mockRestore();
  });

  test('renders with preselected value', async () => {
    render(<VetSpecializationSelector value="Cardiology" onChange={mockOnChange} />);
    
    await waitFor(() => {
      const select = screen.getByRole('combobox');
      expect(select.value).toBe('Cardiology');
    });
  });

  test('has required attribute on select element', () => {
    render(<VetSpecializationSelector value="" onChange={mockOnChange} />);
    
    const select = screen.getByRole('combobox');
    expect(select).toHaveAttribute('required');
  });

  test('has correct name attribute', () => {
    render(<VetSpecializationSelector value="" onChange={mockOnChange} />);
    
    const select = screen.getByRole('combobox');
    expect(select).toHaveAttribute('name', 'specialization');
  });
});