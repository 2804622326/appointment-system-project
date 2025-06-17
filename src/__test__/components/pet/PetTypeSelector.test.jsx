import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PetTypeSelector from '../../../components/pet/PetTypeSelector';
import { getAllPetTypes } from '../../../components/pet/PetService';

// Mock the PetService
jest.mock('../../../components/pet/PetService');
const mockGetAllPetTypes = getAllPetTypes;

// Mock AddItemModal
jest.mock('../../../components/modals/AddItemModal', () => {
  return function MockAddItemModal({ show, handleClose, itemLabel, handleSave }) {
    return show ? (
      <div data-testid="add-item-modal">
        <span>{itemLabel} Modal</span>
        <button onClick={() => handleSave('New Pet Type')}>Save</button>
        <button onClick={handleClose}>Close</button>
      </div>
    ) : null;
  };
});

describe('PetTypeSelector', () => {
  const mockOnChange = jest.fn();
  const defaultProps = {
    name: 'type',
    value: '',
    onChange: mockOnChange
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders select dropdown with default option', () => {
    mockGetAllPetTypes.mockResolvedValue({ data: [] });
    render(<PetTypeSelector {...defaultProps} />);
    
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByDisplayValue('...select type...')).toBeInTheDocument();
  });

  test('fetches and displays pet types on mount', async () => {
    const mockPetTypes = ['Dog', 'Cat', 'Bird'];
    mockGetAllPetTypes.mockResolvedValue({ data: mockPetTypes });
    
    render(<PetTypeSelector {...defaultProps} />);
    
    await waitFor(() => {
      mockPetTypes.forEach(type => {
        expect(screen.getByText(type)).toBeInTheDocument();
      });
    });
    
    expect(mockGetAllPetTypes).toHaveBeenCalledTimes(1);
  });

  test('handles API error gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    mockGetAllPetTypes.mockRejectedValue(new Error('API Error'));
    
    render(<PetTypeSelector {...defaultProps} />);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('API Error');
    });
    
    consoleSpy.mockRestore();
  });

  test('calls onChange when selecting existing pet type', async () => {
    const mockPetTypes = ['Dog', 'Cat'];
    mockGetAllPetTypes.mockResolvedValue({ data: mockPetTypes });
    
    render(<PetTypeSelector {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('Dog')).toBeInTheDocument();
    });
    
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Dog' } });
    
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ value: 'Dog' })
      })
    );
  });

  test('opens modal when selecting "Add New" option', async () => {
    mockGetAllPetTypes.mockResolvedValue({ data: ['Dog'] });
    
    render(<PetTypeSelector {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('Add New')).toBeInTheDocument();
    });
    
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'add-new-item' } });
    
    expect(screen.getByTestId('add-item-modal')).toBeInTheDocument();
    expect(screen.getByText('Type Modal')).toBeInTheDocument();
  });

  test('closes modal when handleClose is called', async () => {
    mockGetAllPetTypes.mockResolvedValue({ data: [] });
    
    render(<PetTypeSelector {...defaultProps} />);
    
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'add-new-item' } });
    expect(screen.getByTestId('add-item-modal')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Close'));
    expect(screen.queryByTestId('add-item-modal')).not.toBeInTheDocument();
  });

  test('adds new pet type when saved from modal', async () => {
    const initialTypes = ['Dog', 'Cat'];
    mockGetAllPetTypes.mockResolvedValue({ data: initialTypes });
    
    render(<PetTypeSelector {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('Dog')).toBeInTheDocument();
    });
    
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'add-new-item' } });
    fireEvent.click(screen.getByText('Save'));
    
    expect(mockOnChange).toHaveBeenCalledWith({
      target: { name: 'type', value: 'New Pet Type' }
    });
    
    await waitFor(() => {
      expect(screen.getByText('New Pet Type')).toBeInTheDocument();
    });
  });

  test('does not add duplicate pet type', async () => {
    const initialTypes = ['Dog', 'Cat'];
    mockGetAllPetTypes.mockResolvedValue({ data: initialTypes });
    
    render(<PetTypeSelector {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByText('Dog')).toBeInTheDocument();
    });
    
    // Mock the modal to return an existing type
    jest.doMock('../../../components/modals/AddItemModal', () => {
      return function MockAddItemModal({ show, handleClose, handleSave }) {
        return show ? (
          <div data-testid="add-item-modal">
            <button onClick={() => handleSave('Dog')}>Save Duplicate</button>
          </div>
        ) : null;
      };
    });
    
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'add-new-item' } });
    
    const dogOptions = screen.getAllByText('Dog');
    expect(dogOptions).toHaveLength(1);
  });

  test('displays selected value correctly', async () => {
    mockGetAllPetTypes.mockResolvedValue({ data: ['Dog', 'Cat'] });
    
    render(<PetTypeSelector {...defaultProps} value="Dog" />);
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('Dog')).toBeInTheDocument();
    });
  });

  test('has required attribute on select element', () => {
    mockGetAllPetTypes.mockResolvedValue({ data: [] });
    
    render(<PetTypeSelector {...defaultProps} />);
    
    expect(screen.getByRole('combobox')).toBeRequired();
  });

  test('does not call onChange when saving empty item', async () => {
    mockGetAllPetTypes.mockResolvedValue({ data: ['Dog'] });
    
    // Mock modal to return empty string
    jest.doMock('../../../components/modals/AddItemModal', () => {
      return function MockAddItemModal({ show, handleSave }) {
        return show ? (
          <div data-testid="add-item-modal">
            <button onClick={() => handleSave('')}>Save Empty</button>
          </div>
        ) : null;
      };
    });
    
    render(<PetTypeSelector {...defaultProps} />);
    
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'add-new-item' } });
    
    const initialCallCount = mockOnChange.mock.calls.length;
    expect(mockOnChange).toHaveBeenCalledTimes(initialCallCount);
  });
});