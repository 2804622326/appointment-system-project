import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import VeterinarianSearch from '../../../components/veterinarian/VeterinarianSearch.jsx';

jest.mock('../../../components/veterinarian/VeterinarianService.js', () => ({
  getAllSpecializations: jest.fn(() => Promise.resolve({ data: ['Surg'] })),
  findAvailableVeterinarians: jest.fn(() => Promise.resolve({ data: [] }))
}));

test('searches veterinarians', async () => {
  const onSearchResult = jest.fn();
  const { asFragment } = render(<VeterinarianSearch onSearchResult={onSearchResult} />);
  await waitFor(() => screen.getByText('Surg'));
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Surg' } });
  fireEvent.click(screen.getAllByRole('button', { name: /search/i })[0]);
  await waitFor(() => expect(onSearchResult).toHaveBeenCalled());
  expect(asFragment()).toMatchSnapshot();
});
