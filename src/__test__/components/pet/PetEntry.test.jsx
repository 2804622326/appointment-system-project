import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PetEntry from '../../../components/pet/PetEntry';

// Mock the child components
jest.mock('../../../components/pet/PetColorSelector', () => {
  return function MockPetColorSelector({ value, onChange }) {
    return (
      <select data-testid="pet-color-selector" value={value} onChange={onChange}>
        <option value="">Select Color</option>
        <option value="black">Black</option>
        <option value="white">White</option>
      </select>
    );
  };
});

jest.mock('../../../components/pet/PetBreedSelector', () => {
  return function MockPetBreedSelector({ petType, value, onChange }) {
    return (
      <select data-testid="pet-breed-selector" value={value} onChange={onChange}>
        <option value="">Select Breed</option>
        <option value="labrador">Labrador</option>
        <option value="persian">Persian</option>
      </select>
    );
  };
});

jest.mock('../../../components/pet/PetTypeSelector', () => {
  return function MockPetTypeSelector({ value, onChange }) {
    return (
      <select data-testid="pet-type-selector" value={value} onChange={onChange}>
        <option value="">Select Type</option>
        <option value="dog">Dog</option>
        <option value="cat">Cat</option>
      </select>
    );
  };
});

describe('PetEntry', () => {
  const mockPet = {
    name: 'Buddy',
    age: 3,
    color: 'black',
    type: 'dog',
    breed: 'labrador'
  };

  const defaultProps = {
    pet: mockPet,
    index: 0,
    removePet: jest.fn(),
    canRemove: true,
    handleInputChange: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders pet entry with correct legend', () => {
    render(<PetEntry {...defaultProps} />);
    expect(screen.getByText('Pet #1 details')).toBeInTheDocument();
  });

  test('renders pet name input with correct value', () => {
    render(<PetEntry {...defaultProps} />);
    const nameInput = screen.getByPlaceholderText('Enter pet name');
    expect(nameInput).toBeInTheDocument();
    expect(nameInput).toHaveValue('Buddy');
  });

  test('renders pet age input with correct value', () => {
    render(<PetEntry {...defaultProps} />);
    const ageInput = screen.getByPlaceholderText('Enter pet age');
    expect(ageInput).toBeInTheDocument();
    expect(ageInput).toHaveValue(3);
  });

  test('calls handleInputChange when name input changes', () => {
    render(<PetEntry {...defaultProps} />);
    const nameInput = screen.getByPlaceholderText('Enter pet name');
    fireEvent.change(nameInput, { target: { value: 'Max' } });
    expect(defaultProps.handleInputChange).toHaveBeenCalled();
  });

  test('calls handleInputChange when age input changes', () => {
    render(<PetEntry {...defaultProps} />);
    const ageInput = screen.getByPlaceholderText('Enter pet age');
    fireEvent.change(ageInput, { target: { value: '5' } });
    expect(defaultProps.handleInputChange).toHaveBeenCalled();
  });

  test('renders all selector components', () => {
    render(<PetEntry {...defaultProps} />);
    expect(screen.getByTestId('pet-color-selector')).toBeInTheDocument();
    expect(screen.getByTestId('pet-type-selector')).toBeInTheDocument();
    expect(screen.getByTestId('pet-breed-selector')).toBeInTheDocument();
  });

  test('renders remove button when canRemove is true', () => {
    render(<PetEntry {...defaultProps} />);
    const removeButton = screen.getByRole('button');
    expect(removeButton).toBeInTheDocument();
    expect(removeButton).toHaveClass('btn-danger');
  });

  test('does not render remove button when canRemove is false', () => {
    render(<PetEntry {...defaultProps} canRemove={false} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  test('calls removePet with correct index when remove button is clicked', () => {
    render(<PetEntry {...defaultProps} />);
    const removeButton = screen.getByRole('button');
    fireEvent.click(removeButton);
    expect(defaultProps.removePet).toHaveBeenCalledWith(0);
  });

  test('renders tooltip on remove button hover', () => {
    render(<PetEntry {...defaultProps} />);
    const removeButton = screen.getByRole('button');
    fireEvent.mouseOver(removeButton);
    expect(screen.getByText('remove pets')).toBeInTheDocument();
  });

  test('renders correct pet index in legend', () => {
    render(<PetEntry {...defaultProps} index={2} />);
    expect(screen.getByText('Pet #3 details')).toBeInTheDocument();
  });

  test('renders pet type and breed fieldset', () => {
    render(<PetEntry {...defaultProps} />);
    expect(screen.getByText('Pet type and Breed')).toBeInTheDocument();
  });

  test('passes correct props to PetBreedSelector', () => {
    render(<PetEntry {...defaultProps} />);
    const breedSelector = screen.getByTestId('pet-breed-selector');
    expect(breedSelector).toHaveValue('labrador');
  });

  test('has required attribute on name and age inputs', () => {
    render(<PetEntry {...defaultProps} />);
    const nameInput = screen.getByPlaceholderText('Enter pet name');
    const ageInput = screen.getByPlaceholderText('Enter pet age');
    expect(nameInput).toBeRequired();
    expect(ageInput).toBeRequired();
  });
});