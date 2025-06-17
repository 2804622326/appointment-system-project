import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditablePetRow from '../../../components/pet/EditablePetRow';

const mockPet = {
  id: 1,
  name: 'Buddy',
  type: 'Dog',
  breed: 'Golden Retriever',
  color: 'Golden',
  age: 3
};

const mockProps = {
  pet: mockPet,
  index: 0,
  onSave: jest.fn(),
  onCancel: jest.fn()
};

describe('EditablePetRow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders all form fields with initial pet data', () => {
    render(
      <table>
        <tbody>
          <EditablePetRow {...mockProps} />
        </tbody>
      </table>
    );

    expect(screen.getByDisplayValue('Buddy')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Dog')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Golden Retriever')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Golden')).toBeInTheDocument();
    expect(screen.getByDisplayValue('3')).toBeInTheDocument();
  });

  test('updates pet name when input changes', () => {
    render(
      <table>
        <tbody>
          <EditablePetRow {...mockProps} />
        </tbody>
      </table>
    );

    const nameInput = screen.getByDisplayValue('Buddy');
    fireEvent.change(nameInput, { target: { name: 'name', value: 'Max' } });
    
    expect(screen.getByDisplayValue('Max')).toBeInTheDocument();
  });

  test('updates pet type when input changes', () => {
    render(
      <table>
        <tbody>
          <EditablePetRow {...mockProps} />
        </tbody>
      </table>
    );

    const typeInput = screen.getByDisplayValue('Dog');
    fireEvent.change(typeInput, { target: { name: 'type', value: 'Cat' } });
    
    expect(screen.getByDisplayValue('Cat')).toBeInTheDocument();
  });

  test('updates pet breed when input changes', () => {
    render(
      <table>
        <tbody>
          <EditablePetRow {...mockProps} />
        </tbody>
      </table>
    );

    const breedInput = screen.getByDisplayValue('Golden Retriever');
    fireEvent.change(breedInput, { target: { name: 'breed', value: 'Labrador' } });
    
    expect(screen.getByDisplayValue('Labrador')).toBeInTheDocument();
  });

  test('updates pet color when input changes', () => {
    render(
      <table>
        <tbody>
          <EditablePetRow {...mockProps} />
        </tbody>
      </table>
    );

    const colorInput = screen.getByDisplayValue('Golden');
    fireEvent.change(colorInput, { target: { name: 'color', value: 'Brown' } });
    
    expect(screen.getByDisplayValue('Brown')).toBeInTheDocument();
  });

  test('updates pet age when input changes', () => {
    render(
      <table>
        <tbody>
          <EditablePetRow {...mockProps} />
        </tbody>
      </table>
    );

    const ageInput = screen.getByDisplayValue('3');
    fireEvent.change(ageInput, { target: { name: 'age', value: '5' } });
    
    expect(screen.getByDisplayValue('5')).toBeInTheDocument();
  });

  test('calls onSave with correct parameters when save button is clicked', () => {
    render(
      <table>
        <tbody>
          <EditablePetRow {...mockProps} />
        </tbody>
      </table>
    );

    const nameInput = screen.getByDisplayValue('Buddy');
    fireEvent.change(nameInput, { target: { name: 'name', value: 'Updated Name' } });

    const saveButton = screen.getByRole('button', { name: /check/i });
    fireEvent.click(saveButton);

    expect(mockProps.onSave).toHaveBeenCalledWith(1, {
      ...mockPet,
      name: 'Updated Name'
    });
  });

  test('calls onCancel when cancel button is clicked', () => {
    render(
      <table>
        <tbody>
          <EditablePetRow {...mockProps} />
        </tbody>
      </table>
    );

    const cancelButton = screen.getByRole('button', { name: /x/i });
    fireEvent.click(cancelButton);

    expect(mockProps.onCancel).toHaveBeenCalledTimes(1);
  });

  test('renders save button with correct styling', () => {
    render(
      <table>
        <tbody>
          <EditablePetRow {...mockProps} />
        </tbody>
      </table>
    );

    const saveButton = screen.getByRole('button', { name: /check/i });
    expect(saveButton).toHaveClass('btn-success', 'btn-sm', 'me-2');
  });

  test('renders cancel button with correct styling', () => {
    render(
      <table>
        <tbody>
          <EditablePetRow {...mockProps} />
        </tbody>
      </table>
    );

    const cancelButton = screen.getByRole('button', { name: /x/i });
    expect(cancelButton).toHaveClass('btn-secondary', 'btn-sm');
  });

  test('handles multiple field changes correctly', () => {
    render(
      <table>
        <tbody>
          <EditablePetRow {...mockProps} />
        </tbody>
      </table>
    );

    const nameInput = screen.getByDisplayValue('Buddy');
    const ageInput = screen.getByDisplayValue('3');

    fireEvent.change(nameInput, { target: { name: 'name', value: 'Charlie' } });
    fireEvent.change(ageInput, { target: { name: 'age', value: '7' } });

    expect(screen.getByDisplayValue('Charlie')).toBeInTheDocument();
    expect(screen.getByDisplayValue('7')).toBeInTheDocument();

    const saveButton = screen.getByRole('button', { name: /check/i });
    fireEvent.click(saveButton);

    expect(mockProps.onSave).toHaveBeenCalledWith(1, {
      ...mockPet,
      name: 'Charlie',
      age: '7'
    });
  });
});