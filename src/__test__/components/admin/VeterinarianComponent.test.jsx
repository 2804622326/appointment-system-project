import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import VeterinarianComponent from '../../../components/admin/VeterinarianComponent.jsx';

jest.mock('../../../components/veterinarian/VeterinarianService.js', () => ({
  getVeterinarians: jest.fn(() => Promise.resolve({ data: [] })),
}));

jest.mock('../../../components/common/Paginator.jsx', () => () => <div data-testid="paginator" />);
jest.mock('../../../components/user/UserFilter.jsx', () => () => <div data-testid="user-filter" />);
jest.mock('../../../components/modals/DeleteConfirmationModal.jsx', () => () => <div data-testid="delete-modal" />);
jest.mock('../../../components/veterinarian/VetEditableRows.jsx', () => () => <tr data-testid="edit-row" />);

test('shows no data message when there are no veterinarians', async () => {
  const { asFragment } = render(<VeterinarianComponent />);
  await waitFor(() => screen.getByText(/no.*veterinarian data.*available at the moment/i));
  expect(screen.getByText(/no.*veterinarian data.*available at the moment/i)).toBeInTheDocument();
  expect(asFragment()).toMatchSnapshot();
});
