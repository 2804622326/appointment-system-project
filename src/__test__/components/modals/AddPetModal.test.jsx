import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddPetModal from '../../../components/modals/AddPetModal';

// Mock the child components
jest.mock('../../../components/pet/PetBreedSelector', () => {
  return function MockPetBreedSelector({ name, value, onChange, petType }) {
    return (
      <select
        data-testid="pet-breed-selector"
        name={name}
        value={value}
        onChange={onChange}
      >
        <option value="">Select Breed</option>
        {petType === 'dog' && <option value="labrador">Labrador</option>}
        {petType === 'cat' && <option value="persian">Persian</option>}
      </select>
    );
  };
});

jest.mock('../../../components/pet/PetTypeSelector', () => {
  return function MockPetTypeSelector({ name, value, onChange }) {
    return (
      <select
        data-testid="pet-type-selector"
        name={name}
        value={value}
        onChange={onChange}
      >
        <option value="">Select Type</option>
        <option value="dog">Dog</option>
        <option value="cat">Cat</option>
      </select>
    );
  };
});

jest.mock('../../../components/pet/PetColorSelector', () => {
  return function MockPetColorSelector({ name, value, onChange }) {
    return (
      <select
        data-testid="pet-color-selector"
        name={name}
        value={value}
        onChange={onChange}
      >
        <option value="">Select Color</option>
        <option value="brown">Brown</option>
        <option value="black">Black</option>
      </select>
    );
  };
});

describe('AddPetModal', () => {
  const mockProps = {
    show: true,
    onHide: jest.fn(),
    onAddPet: jest.fn(),
    appointmentId: '123'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders modal when show is true', () => {
    render(<AddPetModal {...mockProps} />);
    expect(screen.getByText('Add New Pet')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Color')).toBeInTheDocument();
    expect(screen.getByLabelText('Type')).toBeInTheDocument();
    expect(screen.getByLabelText('Breed')).toBeInTheDocument();
    expect(screen.getByLabelText('Age')).toBeInTheDocument();
  });

  test('does not render modal when show is false', () => {
    render(<AddPetModal {...mockProps} show={false} />);
    expect(screen.queryByText('Add New Pet')).not.toBeInTheDocument();
  });

  test('calls onHide when close button is clicked', () => {
    render(<AddPetModal {...mockProps} />);
    fireEvent.click(screen.getByText('Close'));
    expect(mockProps.onHide).toHaveBeenCalledTimes(1);
  });

  test('updates pet name when input changes', () => {
    render(<AddPetModal {...mockProps} />);
    const nameInput = screen.getByLabelText('Name');
    fireEvent.change(nameInput, { target: { value: 'Buddy' } });
    expect(nameInput.value).toBe('Buddy');
  });

  test('updates pet age when input changes', () => {
    render(<AddPetModal {...mockProps} />);
    const ageInput = screen.getByLabelText('Age');
    fireEvent.change(ageInput, { target: { value: '3' } });
    expect(ageInput.value).toBe('3');
  });

  test('updates pet type when selector changes', () => {
    render(<AddPetModal {...mockProps} />);
    const typeSelector = screen.getByTestId('pet-type-selector');
    fireEvent.change(typeSelector, { target: { value: 'dog' } });
    expect(typeSelector.value).toBe('dog');
  });

  test('updates pet color when selector changes', () => {
    render(<AddPetModal {...mockProps} />);
    const colorSelector = screen.getByTestId('pet-color-selector');
    fireEvent.change(colorSelector, { target: { value: 'brown' } });
    expect(colorSelector.value).toBe('brown');
  });

  test('calls onAddPet with correct parameters when Add Pet button is clicked', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    render(<AddPetModal {...mockProps} />);
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Buddy' } });
    fireEvent.change(screen.getByLabelText('Age'), { target: { value: '3' } });
    fireEvent.change(screen.getByTestId('pet-type-selector'), { target: { value: 'dog' } });
    fireEvent.change(screen.getByTestId('pet-color-selector'), { target: { value: 'brown' } });
    
    // Click Add Pet button
    fireEvent.click(screen.getByText('Add Pet'));
    
    expect(mockProps.onAddPet).toHaveBeenCalledWith('123', {
      name: 'Buddy',
      age: '3',
      color: 'brown',
      type: 'dog',
      breed: ''
    });
    
    expect(consoleSpy).toHaveBeenCalledWith('New Pet Information: ', {
      name: 'Buddy',
      age: '3',
      color: 'brown',
      type: 'dog',
      breed: ''
    });
    
    consoleSpy.mockRestore();
  });

  test('passes correct props to PetBreedSelector', () => {
    render(<AddPetModal {...mockProps} />);
    
    // Change pet type first
    fireEvent.change(screen.getByTestId('pet-type-selector'), { target: { value: 'dog' } });
    
    const breedSelector = screen.getByTestId('pet-breed-selector');
    expect(breedSelector).toHaveAttribute('name', 'breed');
    expect(screen.getByText('Labrador')).toBeInTheDocument();
  });

  test('handles empty form submission', () => {
    render(<AddPetModal {...mockProps} />);
    
    fireEvent.click(screen.getByText('Add Pet'));
    
    expect(mockProps.onAddPet).toHaveBeenCalledWith('123', {
      name: '',
      age: '',
      color: '',
      type: '',
      breed: ''
    });
  });

  test('displays correct modal title and section headers', () => {
    render(<AddPetModal {...mockProps} />);
    
    expect(screen.getByText('Add New Pet')).toBeInTheDocument();
    expect(screen.getByText('Pet Type and Breed')).toBeInTheDocument();
  });

  test('has correct form structure and attributes', () => {
    render(<AddPetModal {...mockProps} />);
    
    expect(screen.getByLabelText('Name')).toHaveAttribute('type', 'text');
    expect(screen.getByLabelText('Age')).toHaveAttribute('type', 'number');
    expect(screen.getByText('Close')).toHaveClass('btn-secondary');
    expect(screen.getByText('Add Pet')).toHaveClass('btn-info');
  });
});