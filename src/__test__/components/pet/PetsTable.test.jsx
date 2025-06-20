import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import PetsTable from '../../../components/pet/PetsTable.jsx';

jest.mock('../../../components/pet/PetService.js', () => ({
  updatePet: jest.fn(() => Promise.resolve({ message: 'updated' })),
  deletePet: jest.fn(() => Promise.resolve({ message: 'deleted' })),
  addPet: jest.fn(() => Promise.resolve({ message: 'added' }))
}));

test('renders pets and handles add', async () => {
  const pets = [{ id: 1, name: 'A', type: 'Dog', breed: 'B', color: 'C', age: 2 }];
  const { asFragment } = render(
    <MemoryRouter>
      <PetsTable pets={pets} onPetsUpdate={() => {}} isEditable isPatient appointmentId={1} />
    </MemoryRouter>
  );
  fireEvent.click(screen.getAllByRole('link')[0]);
  expect(asFragment()).toMatchSnapshot();
});
