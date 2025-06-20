import React from 'react';
import { render, waitFor, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PetTypeSelector from '../../../components/pet/PetTypeSelector.jsx';

jest.mock('../../../components/pet/PetService.js', () => ({
  getAllPetTypes: jest.fn(() => Promise.resolve({ data: ['Dog'] }))
}));

test('loads types and handles change', async () => {
  const onChange = jest.fn();
  const { asFragment } = render(<PetTypeSelector value='' onChange={onChange} />);
  await waitFor(() => screen.getByText('Dog'));
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Dog' } });
  expect(onChange).toHaveBeenCalled();
  expect(asFragment()).toMatchSnapshot();
});
