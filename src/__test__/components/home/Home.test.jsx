import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Home from '../../../components/home/Home.jsx';

jest.mock('../../../components/veterinarian/VeterinarianService.js', () => ({
  getVeterinarians: jest.fn().mockResolvedValue({ data: [{ id: 1, firstName: 'A', lastName: 'B' }] }),
}));

test('renders home and loads vets', async () => {
  const { asFragment } = render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );
  await waitFor(() => screen.getByText(/who we are/i));
  expect(screen.getByText(/our services/i)).toBeInTheDocument();
  expect(asFragment()).toMatchSnapshot();
});
