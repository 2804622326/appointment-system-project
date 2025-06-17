import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import VetEditableRows from '../../../components/veterinarian/VetEditableRows';

// Mock VetSpecializationSelector component
jest.mock('../../../components/veterinarian/VetSpecializationSelector', () => {
  return function MockVetSpecializationSelector({ value, onChange }) {
    return (
      <select 
        data-testid="specialization-selector" 
        value={value} 
        onChange={onChange}
        name="specialization"
      >
        <option value="">Select Specialization</option>
        <option value="Surgery">Surgery</option>
        <option value="Cardiology">Cardiology</option>
      </select>
    );
  };
});

// Mock react-icons
jest.mock('react-icons/bs', () => ({
  BsCheck: () => <span data-testid="check-icon">✓</span>,
  BsX: () => <span data-testid="x-icon">✗</span>
}));

describe('VetEditableRows', () => {
  const mockVet = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phoneNumber: '123-456-7890',
    gender: 'Male',
    specialization: 'Surgery'
  };

  const mockOnSave = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form fields with correct initial values', () => {
    render(
      <table>
        <tbody>
          <VetEditableRows vet={mockVet} onSave={mockOnSave} onCancel={mockOnCancel} />
        </tbody>
      </table>
    );

    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('john.doe@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('123-456-7890')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Male')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Surgery')).toBeInTheDocument();
  });

  it('updates firstName when input changes', () => {
    render(
      <table>
        <tbody>
          <VetEditableRows vet={mockVet} onSave={mockOnSave} onCancel={mockOnCancel} />
        </tbody>
      </table>
    );

    const firstNameInput = screen.getByDisplayValue('John');
    fireEvent.change(firstNameInput, { target: { name: 'firstName', value: 'Jane' } });
    
    expect(screen.getByDisplayValue('Jane')).toBeInTheDocument();
  });

  it('updates lastName when input changes', () => {
    render(
      <table>
        <tbody>
          <VetEditableRows vet={mockVet} onSave={mockOnSave} onCancel={mockOnCancel} />
        </tbody>
      </table>
    );

    const lastNameInput = screen.getByDisplayValue('Doe');
    fireEvent.change(lastNameInput, { target: { name: 'lastName', value: 'Smith' } });
    
    expect(screen.getByDisplayValue('Smith')).toBeInTheDocument();
  });

  it('updates email when input changes', () => {
    render(
      <table>
        <tbody>
          <VetEditableRows vet={mockVet} onSave={mockOnSave} onCancel={mockOnCancel} />
        </tbody>
      </table>
    );

    const emailInput = screen.getByDisplayValue('john.doe@example.com');
    fireEvent.change(emailInput, { target: { name: 'email', value: 'jane.smith@example.com' } });
    
    expect(screen.getByDisplayValue('jane.smith@example.com')).toBeInTheDocument();
  });

  it('updates phoneNumber when input changes', () => {
    render(
      <table>
        <tbody>
          <VetEditableRows vet={mockVet} onSave={mockOnSave} onCancel={mockOnCancel} />
        </tbody>
      </table>
    );

    const phoneInput = screen.getByDisplayValue('123-456-7890');
    fireEvent.change(phoneInput, { target: { name: 'phoneNumber', value: '987-654-3210' } });
    
    expect(screen.getByDisplayValue('987-654-3210')).toBeInTheDocument();
  });

  it('updates gender when select changes', () => {
    render(
      <table>
        <tbody>
          <VetEditableRows vet={mockVet} onSave={mockOnSave} onCancel={mockOnCancel} />
        </tbody>
      </table>
    );

    const genderSelect = screen.getByDisplayValue('Male');
    fireEvent.change(genderSelect, { target: { name: 'gender', value: 'Female' } });
    
    expect(screen.getByDisplayValue('Female')).toBeInTheDocument();
  });

  it('updates specialization when VetSpecializationSelector changes', () => {
    render(
      <table>
        <tbody>
          <VetEditableRows vet={mockVet} onSave={mockOnSave} onCancel={mockOnCancel} />
        </tbody>
      </table>
    );

    const specializationSelect = screen.getByTestId('specialization-selector');
    fireEvent.change(specializationSelect, { target: { name: 'specialization', value: 'Cardiology' } });
    
    expect(screen.getByDisplayValue('Cardiology')).toBeInTheDocument();
  });

  it('calls onSave with correct parameters when save button is clicked', () => {
    render(
      <table>
        <tbody>
          <VetEditableRows vet={mockVet} onSave={mockOnSave} onCancel={mockOnCancel} />
        </tbody>
      </table>
    );

    const saveButton = screen.getByTestId('check-icon').closest('button');
    fireEvent.click(saveButton);
    
    expect(mockOnSave).toHaveBeenCalledWith(mockVet.id, mockVet, mockOnCancel);
  });

  it('calls onSave with updated data when fields are modified and save is clicked', () => {
    render(
      <table>
        <tbody>
          <VetEditableRows vet={mockVet} onSave={mockOnSave} onCancel={mockOnCancel} />
        </tbody>
      </table>
    );

    const firstNameInput = screen.getByDisplayValue('John');
    fireEvent.change(firstNameInput, { target: { name: 'firstName', value: 'Jane' } });
    
    const saveButton = screen.getByTestId('check-icon').closest('button');
    fireEvent.click(saveButton);
    
    expect(mockOnSave).toHaveBeenCalledWith(
      mockVet.id, 
      { ...mockVet, firstName: 'Jane' }, 
      mockOnCancel
    );
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(
      <table>
        <tbody>
          <VetEditableRows vet={mockVet} onSave={mockOnSave} onCancel={mockOnCancel} />
        </tbody>
      </table>
    );

    const cancelButton = screen.getByTestId('x-icon').closest('button');
    fireEvent.click(cancelButton);
    
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('renders gender select with all options', () => {
    render(
      <table>
        <tbody>
          <VetEditableRows vet={mockVet} onSave={mockOnSave} onCancel={mockOnCancel} />
        </tbody>
      </table>
    );

    expect(screen.getByText('Select Gender')).toBeInTheDocument();
    expect(screen.getByText('Male')).toBeInTheDocument();
    expect(screen.getByText('Female')).toBeInTheDocument();
  });

  it('renders correct button variants and sizes', () => {
    render(
      <table>
        <tbody>
          <VetEditableRows vet={mockVet} onSave={mockOnSave} onCancel={mockOnCancel} />
        </tbody>
      </table>
    );

    const saveButton = screen.getByTestId('check-icon').closest('button');
    const cancelButton = screen.getByTestId('x-icon').closest('button');
    
    expect(saveButton).toHaveClass('btn-success', 'btn-sm');
    expect(cancelButton).toHaveClass('btn-secondary', 'btn-sm');
  });

  it('handles empty vet object gracefully', () => {
    const emptyVet = {
      id: null,
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      gender: '',
      specialization: ''
    };

    render(
      <table>
        <tbody>
          <VetEditableRows vet={emptyVet} onSave={mockOnSave} onCancel={mockOnCancel} />
        </tbody>
      </table>
    );

    expect(screen.getByDisplayValue('')).toBeInTheDocument();
  });
});