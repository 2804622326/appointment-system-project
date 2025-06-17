import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PetsTable from '../../../components/pet/PetsTable';
import * as PetService from '../../../components/pet/PetService';

// Mock dependencies
jest.mock('../../../components/modals/DeleteConfirmationModal', () => {
  return function MockDeleteConfirmationModal({ show, onHide, onConfirm, itemToDelete }) {
    return show ? (
      <div data-testid="delete-modal">
        <p>Delete {itemToDelete}?</p>
        <button onClick={onHide}>Cancel</button>
        <button onClick={onConfirm}>Confirm</button>
      </div>
    ) : null;
  };
});

jest.mock('../../../components/common/AlertMessage', () => {
  return function MockAlertMessage({ type, message }) {
    return <div data-testid={`alert-${type}`}>{message}</div>;
  };
});

jest.mock('../../../components/modals/AddPetModal', () => {
  return function MockAddPetModal({ show, onHide, onAddPet, appointmentId }) {
    return show ? (
      <div data-testid="add-pet-modal">
        <button onClick={() => onAddPet(appointmentId, { name: 'New Pet' })}>Add Pet</button>
        <button onClick={onHide}>Close</button>
      </div>
    ) : null;
  };
});

jest.mock('../../../components/hooks/UseMessageAlerts', () => {
  return function MockUseMessageAlerts() {
    return {
      successMessage: '',
      setSuccessMessage: jest.fn(),
      errorMessage: '',
      setErrorMessage: jest.fn(),
      showSuccessAlert: false,
      setShowSuccessAlert: jest.fn(),
      showErrorAlert: false,
      setShowErrorAlert: jest.fn(),
    };
  };
});

jest.mock('../../../components/pet/EditablePetRow', () => {
  return function MockEditablePetRow({ pet, onSave, onCancel }) {
    return (
      <tr data-testid={`editable-row-${pet.id}`}>
        <td>Editing {pet.name}</td>
        <td colSpan="4">
          <button onClick={() => onSave(pet.id, { ...pet, name: 'Updated Pet' })}>Save</button>
          <button onClick={onCancel}>Cancel</button>
        </td>
      </tr>
    );
  };
});

jest.mock('../../../components/pet/PetService');

const mockPets = [
  {
    id: 1,
    name: 'Fluffy',
    type: 'Cat',
    breed: 'Persian',
    color: 'White',
    age: 3
  },
  {
    id: 2,
    name: 'Buddy',
    type: 'Dog',
    breed: 'Golden Retriever',
    color: 'Golden',
    age: 5
  }
];

const defaultProps = {
  pets: mockPets,
  onPetsUpdate: jest.fn(),
  isEditable: true,
  isPatient: true,
  appointmentId: 123
};

const renderComponent = (props = {}) => {
  return render(
    <BrowserRouter>
      <PetsTable {...defaultProps} {...props} />
    </BrowserRouter>
  );
};

describe('PetsTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    test('renders pets table with correct data', () => {
      renderComponent();
      
      expect(screen.getByText('Pets:')).toBeInTheDocument();
      expect(screen.getByText('Fluffy')).toBeInTheDocument();
      expect(screen.getByText('Buddy')).toBeInTheDocument();
      expect(screen.getByText('Cat')).toBeInTheDocument();
      expect(screen.getByText('Dog')).toBeInTheDocument();
    });

    test('renders table headers correctly', () => {
      renderComponent();
      
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Type')).toBeInTheDocument();
      expect(screen.getByText('Breed')).toBeInTheDocument();
      expect(screen.getByText('Color')).toBeInTheDocument();
      expect(screen.getByText('Age')).toBeInTheDocument();
    });

    test('renders Actions column when isPatient is true', () => {
      renderComponent({ isPatient: true });
      
      expect(screen.getByText('Actions')).toBeInTheDocument();
    });

    test('does not render Actions column when isPatient is false', () => {
      renderComponent({ isPatient: false });
      
      expect(screen.queryByText('Actions')).not.toBeInTheDocument();
    });

    test('renders add pet button', () => {
      renderComponent();
      
      const addButton = screen.getByRole('link');
      expect(addButton).toBeInTheDocument();
    });

    test('renders edit and delete buttons for each pet when isPatient is true', () => {
      renderComponent({ isPatient: true });
      
      const editButtons = screen.getAllByRole('button').filter(btn => 
        btn.querySelector('.bi-pencil-fill') || btn.classList.contains('btn-warning')
      );
      const deleteButtons = screen.getAllByRole('button').filter(btn => 
        btn.querySelector('.bi-trash-fill') || btn.classList.contains('btn-danger')
      );
      
      expect(editButtons).toHaveLength(2);
      expect(deleteButtons).toHaveLength(2);
    });

    test('does not render edit and delete buttons when isPatient is false', () => {
      renderComponent({ isPatient: false });
      
      const buttons = screen.getAllByRole('button');
      const editButtons = buttons.filter(btn => btn.classList.contains('btn-warning'));
      const deleteButtons = buttons.filter(btn => btn.classList.contains('btn-danger'));
      
      expect(editButtons).toHaveLength(0);
      expect(deleteButtons).toHaveLength(0);
    });

    test('handles empty pets array', () => {
      renderComponent({ pets: [] });
      
      expect(screen.getByText('Pets:')).toBeInTheDocument();
      expect(screen.queryByText('Fluffy')).not.toBeInTheDocument();
    });

    test('handles null pets prop', () => {
      renderComponent({ pets: null });
      
      expect(screen.getByText('Pets:')).toBeInTheDocument();
      expect(screen.queryByText('Fluffy')).not.toBeInTheDocument();
    });
  });

  describe('Edit Functionality', () => {
    test('enters edit mode when edit button is clicked', () => {
      renderComponent();
      
      const editButtons = screen.getAllByRole('button').filter(btn => 
        btn.classList.contains('btn-warning')
      );
      
      fireEvent.click(editButtons[0]);
      
      expect(screen.getByTestId('editable-row-1')).toBeInTheDocument();
    });

    test('exits edit mode when cancel is clicked', () => {
      renderComponent();
      
      const editButtons = screen.getAllByRole('button').filter(btn => 
        btn.classList.contains('btn-warning')
      );
      
      fireEvent.click(editButtons[0]);
      
      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);
      
      expect(screen.queryByTestId('editable-row-1')).not.toBeInTheDocument();
    });

    test('disables edit button when isEditable is false', () => {
      renderComponent({ isEditable: false });
      
      const editButtons = screen.getAllByRole('button').filter(btn => 
        btn.classList.contains('btn-warning')
      );
      
      expect(editButtons[0]).toBeDisabled();
    });

    test('calls updatePet service when save is clicked', async () => {
      const mockResponse = { message: 'Pet updated successfully' };
      PetService.updatePet.mockResolvedValue(mockResponse);
      
      renderComponent();
      
      const editButtons = screen.getAllByRole('button').filter(btn => 
        btn.classList.contains('btn-warning')
      );
      
      fireEvent.click(editButtons[0]);
      
      const saveButton = screen.getByText('Save');
      fireEvent.click(saveButton);
      
      await waitFor(() => {
        expect(PetService.updatePet).toHaveBeenCalledWith(1, { ...mockPets[0], name: 'Updated Pet' });
        expect(defaultProps.onPetsUpdate).toHaveBeenCalledWith(123);
      });
    });
  });

  describe('Delete Functionality', () => {
    test('shows delete modal when delete button is clicked', () => {
      renderComponent();
      
      const deleteButtons = screen.getAllByRole('button').filter(btn => 
        btn.classList.contains('btn-danger')
      );
      
      fireEvent.click(deleteButtons[0]);
      
      expect(screen.getByTestId('delete-modal')).toBeInTheDocument();
    });

    test('hides delete modal when cancel is clicked', () => {
      renderComponent();
      
      const deleteButtons = screen.getAllByRole('button').filter(btn => 
        btn.classList.contains('btn-danger')
      );
      
      fireEvent.click(deleteButtons[0]);
      
      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);
      
      expect(screen.queryByTestId('delete-modal')).not.toBeInTheDocument();
    });

    test('calls deletePet service when delete is confirmed', async () => {
      const mockResponse = { message: 'Pet deleted successfully' };
      PetService.deletePet.mockResolvedValue(mockResponse);
      
      renderComponent();
      
      const deleteButtons = screen.getAllByRole('button').filter(btn => 
        btn.classList.contains('btn-danger')
      );
      
      fireEvent.click(deleteButtons[0]);
      
      const confirmButton = screen.getByText('Confirm');
      fireEvent.click(confirmButton);
      
      await waitFor(() => {
        expect(PetService.deletePet).toHaveBeenCalledWith(1);
        expect(defaultProps.onPetsUpdate).toHaveBeenCalledWith(123);
      });
    });

    test('does not show delete button when only one pet exists', () => {
      renderComponent({ pets: [mockPets[0]] });
      
      const deleteButtons = screen.getAllByRole('button').filter(btn => 
        btn.classList.contains('btn-danger')
      );
      
      expect(deleteButtons).toHaveLength(0);
    });

    test('disables delete button when isEditable is false', () => {
      renderComponent({ isEditable: false });
      
      const deleteButtons = screen.getAllByRole('button').filter(btn => 
        btn.classList.contains('btn-danger')
      );
      
      expect(deleteButtons[0]).toBeDisabled();
    });
  });

  describe('Add Pet Functionality', () => {
    test('shows add pet modal when add button is clicked', () => {
      renderComponent();
      
      const addButton = screen.getByRole('link');
      fireEvent.click(addButton);
      
      expect(screen.getByTestId('add-pet-modal')).toBeInTheDocument();
    });

    test('hides add pet modal when close is clicked', () => {
      renderComponent();
      
      const addButton = screen.getByRole('link');
      fireEvent.click(addButton);
      
      const closeButton = screen.getByText('Close');
      fireEvent.click(closeButton);
      
      expect(screen.queryByTestId('add-pet-modal')).not.toBeInTheDocument();
    });

    test('calls addPet service when pet is added', async () => {
      const mockResponse = { message: 'Pet added successfully' };
      PetService.addPet.mockResolvedValue(mockResponse);
      
      renderComponent();
      
      const addButton = screen.getByRole('link');
      fireEvent.click(addButton);
      
      const addPetButton = screen.getByText('Add Pet');
      fireEvent.click(addPetButton);
      
      await waitFor(() => {
        expect(PetService.addPet).toHaveBeenCalledWith(123, { name: 'New Pet' });
        expect(defaultProps.onPetsUpdate).toHaveBeenCalledWith(123);
      });
    });
  });

  describe('Error Handling', () => {
    test('handles update pet error', async () => {
      const mockError = new Error('Update failed');
      PetService.updatePet.mockRejectedValue(mockError);
      
      renderComponent();
      
      const editButtons = screen.getAllByRole('button').filter(btn => 
        btn.classList.contains('btn-warning')
      );
      
      fireEvent.click(editButtons[0]);
      
      const saveButton = screen.getByText('Save');
      fireEvent.click(saveButton);
      
      await waitFor(() => {
        expect(PetService.updatePet).toHaveBeenCalled();
      });
    });

    test('handles delete pet error', async () => {
      const mockError = new Error('Delete failed');
      PetService.deletePet.mockRejectedValue(mockError);
      
      renderComponent();
      
      const deleteButtons = screen.getAllByRole('button').filter(btn => 
        btn.classList.contains('btn-danger')
      );
      
      fireEvent.click(deleteButtons[0]);
      
      const confirmButton = screen.getByText('Confirm');
      fireEvent.click(confirmButton);
      
      await waitFor(() => {
        expect(PetService.deletePet).toHaveBeenCalled();
      });
    });

    test('handles add pet error', async () => {
      const mockError = new Error('Add failed');
      PetService.addPet.mockRejectedValue(mockError);
      
      renderComponent();
      
      const addButton = screen.getByRole('link');
      fireEvent.click(addButton);
      
      const addPetButton = screen.getByText('Add Pet');
      fireEvent.click(addPetButton);
      
      await waitFor(() => {
        expect(PetService.addPet).toHaveBeenCalled();
      });
    });
  });
});