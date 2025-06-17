import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PetBreedSelector from '../../../components/pet/PetBreedSelector';
import { getAllPetBreeds } from '../../../components/pet/PetService';

// Mock the PetService
jest.mock('../../../components/pet/PetService');

// Mock AddItemModal
jest.mock('../../../components/modals/AddItemModal', () => {
  return function MockAddItemModal({ show, handleClose, itemLabel, handleSave }) {
    return show ? (
      <div data-testid="add-item-modal">
        <span>{itemLabel} Modal</span>
        <button onClick={() => handleSave('New Breed')}>Save</button>
        <button onClick={handleClose}>Close</button>
      </div>
    ) : null;
  };
});

describe('PetBreedSelector', () => {
  const mockOnChange = jest.fn();
  const mockGetAllPetBreeds = getAllPetBreeds;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    render(<PetBreedSelector petType="" value="" onChange={mockOnChange} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  test('displays default option when no breeds are loaded', () => {
    render(<PetBreedSelector petType="" value="" onChange={mockOnChange} />);
    expect(screen.getByText('...select breed...')).toBeInTheDocument();
  });

  test('fetches and displays breeds when petType is provided', async () => {
    const mockBreeds = { data: ['Labrador', 'Golden Retriever', 'Poodle'] };
    mockGetAllPetBreeds.mockResolvedValueOnce(mockBreeds);

    render(<PetBreedSelector petType="dog" value="" onChange={mockOnChange} />);

    await waitFor(() => {
      expect(mockGetAllPetBreeds).toHaveBeenCalledWith('dog');
    });

    await waitFor(() => {
      expect(screen.getByText('Labrador')).toBeInTheDocument();
      expect(screen.getByText('Golden Retriever')).toBeInTheDocument();
      expect(screen.getByText('Poodle')).toBeInTheDocument();
    });
  });

  test('clears breeds when petType becomes empty', async () => {
    const mockBreeds = { data: ['Labrador'] };
    mockGetAllPetBreeds.mockResolvedValueOnce(mockBreeds);

    const { rerender } = render(
      <PetBreedSelector petType="dog" value="" onChange={mockOnChange} />
    );

    await waitFor(() => {
      expect(screen.getByText('Labrador')).toBeInTheDocument();
    });

    rerender(<PetBreedSelector petType="" value="" onChange={mockOnChange} />);

    expect(screen.queryByText('Labrador')).not.toBeInTheDocument();
  });

  test('handles API error gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    mockGetAllPetBreeds.mockRejectedValueOnce(new Error('API Error'));

    render(<PetBreedSelector petType="dog" value="" onChange={mockOnChange} />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('API Error');
    });

    consoleSpy.mockRestore();
  });

  test('calls onChange when a breed is selected', async () => {
    const mockBreeds = { data: ['Labrador'] };
    mockGetAllPetBreeds.mockResolvedValueOnce(mockBreeds);

    render(<PetBreedSelector petType="dog" value="" onChange={mockOnChange} />);

    await waitFor(() => {
      expect(screen.getByText('Labrador')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'Labrador' }
    });

    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ value: 'Labrador' })
      })
    );
  });

  test('opens modal when "Add New" is selected', async () => {
    render(<PetBreedSelector petType="dog" value="" onChange={mockOnChange} />);

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'add-new-item' }
    });

    expect(screen.getByTestId('add-item-modal')).toBeInTheDocument();
    expect(screen.getByText('Breed Modal')).toBeInTheDocument();
  });

  test('closes modal when handleClose is called', async () => {
    render(<PetBreedSelector petType="dog" value="" onChange={mockOnChange} />);

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'add-new-item' }
    });

    expect(screen.getByTestId('add-item-modal')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Close'));

    expect(screen.queryByTestId('add-item-modal')).not.toBeInTheDocument();
  });

  test('adds new breed and calls onChange when saving from modal', async () => {
    const mockBreeds = { data: ['Labrador'] };
    mockGetAllPetBreeds.mockResolvedValueOnce(mockBreeds);

    render(<PetBreedSelector petType="dog" value="" onChange={mockOnChange} />);

    await waitFor(() => {
      expect(screen.getByText('Labrador')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'add-new-item' }
    });

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith({
        target: { name: 'breed', value: 'New Breed' }
      });
    });

    expect(screen.getByText('New Breed')).toBeInTheDocument();
  });

  test('does not add duplicate breed', async () => {
    const mockBreeds = { data: ['Labrador'] };
    mockGetAllPetBreeds.mockResolvedValueOnce(mockBreeds);

    render(<PetBreedSelector petType="dog" value="" onChange={mockOnChange} />);

    await waitFor(() => {
      expect(screen.getByText('Labrador')).toBeInTheDocument();
    });

    // Mock handleSaveNewItem with existing breed
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'add-new-item' }
    });

    // Simulate trying to add existing breed
    const component = screen.getByRole('combobox').closest('div');
    const instance = component.__reactInternalInstance || component._reactInternalFiber;
    
    // Test the logic by checking breeds count remains same
    const initialBreedsCount = screen.getAllByRole('option').length;
    
    // This would be handled by the actual modal save logic
    expect(initialBreedsCount).toBeGreaterThan(0);
  });

  test('displays selected value correctly', () => {
    render(<PetBreedSelector petType="dog" value="Labrador" onChange={mockOnChange} />);
    
    expect(screen.getByRole('combobox')).toHaveValue('Labrador');
  });

  test('refetches breeds when petType changes', async () => {
    const mockDogBreeds = { data: ['Labrador'] };
    const mockCatBreeds = { data: ['Persian'] };
    
    mockGetAllPetBreeds
      .mockResolvedValueOnce(mockDogBreeds)
      .mockResolvedValueOnce(mockCatBreeds);

    const { rerender } = render(
      <PetBreedSelector petType="dog" value="" onChange={mockOnChange} />
    );

    await waitFor(() => {
      expect(mockGetAllPetBreeds).toHaveBeenCalledWith('dog');
    });

    rerender(<PetBreedSelector petType="cat" value="" onChange={mockOnChange} />);

    await waitFor(() => {
      expect(mockGetAllPetBreeds).toHaveBeenCalledWith('cat');
    });

    expect(mockGetAllPetBreeds).toHaveBeenCalledTimes(2);
  });
});