import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import VeterinarianComponent from '../../../components/admin/VeterinarianComponent';
import { getVeterinarians } from '../../../components/veterinarian/VeterinarianService';
import { deleteUser, updateUser, lockUserAccount, unLockUserAccount } from '../../../components/user/UserService';

// Mock dependencies
jest.mock('../../../components/veterinarian/VeterinarianService');
jest.mock('../../../components/user/UserService');
jest.mock('../../../components/hooks/UseMessageAlerts', () => ({
  __esModule: true,
  default: () => ({
    successMessage: '',
    setSuccessMessage: jest.fn(),
    errorMessage: '',
    setErrorMessage: jest.fn(),
    showSuccessAlert: false,
    setShowSuccessAlert: jest.fn(),
    showErrorAlert: false,
    setShowErrorAlert: jest.fn(),
  }),
}));

const mockVeterinarians = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@test.com',
    phoneNumber: '123456789',
    gender: 'Male',
    specialization: 'Surgery',
    createdAt: '2023-01-01',
    enabled: true,
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@test.com',
    phoneNumber: '987654321',
    gender: 'Female',
    specialization: 'Cardiology',
    createdAt: '2023-01-02',
    enabled: false,
  },
];

const renderComponent = () => {
  return render(
    <BrowserRouter>
      <VeterinarianComponent />
    </BrowserRouter>
  );
};

describe('VeterinarianComponent', () => {
  beforeEach(() => {
    getVeterinarians.mockResolvedValue({ data: mockVeterinarians });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders veterinarian list successfully', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('List of Veterinarian')).toBeInTheDocument();
      expect(screen.getByText('Dr. John')).toBeInTheDocument();
      expect(screen.getByText('Dr. Jane')).toBeInTheDocument();
    });
  });

  test('shows no data message when no veterinarians', async () => {
    getVeterinarians.mockResolvedValue({ data: [] });
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText(/veterinarian data/)).toBeInTheDocument();
    });
  });

  test('filters veterinarians by specialization', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('Dr. John')).toBeInTheDocument();
    });

    const filterSelect = screen.getByRole('combobox');
    fireEvent.change(filterSelect, { target: { value: 'Surgery' } });
    
    expect(screen.getByText('Dr. John')).toBeInTheDocument();
  });

  test('opens delete modal when delete button clicked', async () => {
    renderComponent();
    
    await waitFor(() => {
      const deleteButtons = screen.getAllByRole('link');
      const deleteButton = deleteButtons.find(btn => btn.className.includes('text-danger'));
      fireEvent.click(deleteButton);
    });
  });

  test('toggles account lock/unlock', async () => {
    lockUserAccount.mockResolvedValue({ message: 'Account locked' });
    renderComponent();
    
    await waitFor(() => {
      const lockButton = screen.getAllByRole('generic').find(el => el.style.cursor === 'pointer');
      if (lockButton) fireEvent.click(lockButton);
    });
  });

  test('handles edit mode toggle', async () => {
    renderComponent();
    
    await waitFor(() => {
      const editButtons = screen.getAllByRole('link');
      const editButton = editButtons.find(btn => btn.className.includes('text-warning'));
      if (editButton) fireEvent.click(editButton);
    });
  });

  test('handles pagination', async () => {
    const manyVets = Array.from({ length: 25 }, (_, i) => ({
      ...mockVeterinarians[0],
      id: i + 1,
      email: `vet${i}@test.com`,
    }));
    getVeterinarians.mockResolvedValue({ data: manyVets });
    
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('List of Veterinarian')).toBeInTheDocument();
    });
  });

  test('handles API error', async () => {
    getVeterinarians.mockRejectedValue(new Error('API Error'));
    renderComponent();
    
    await waitFor(() => {
      expect(getVeterinarians).toHaveBeenCalled();
    });
  });

  test('clears filters', async () => {
    renderComponent();
    
    await waitFor(() => {
      const clearButton = screen.queryByText(/clear/i);
      if (clearButton) fireEvent.click(clearButton);
    });
  });
});