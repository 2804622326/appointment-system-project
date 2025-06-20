import React from 'react';
import { render, waitFor, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PetBreedSelector from '../../../components/pet/PetBreedSelector.jsx';

jest.mock('../../../components/pet/PetService.js', () => ({
  getAllPetBreeds: jest.fn(() => Promise.resolve({ data: ['Bulldog'] }))
}));

test('loads breeds and handles change', async () => {
  const onChange = jest.fn();
  const { asFragment } = render(<PetBreedSelector petType='Dog' value='' onChange={onChange} />);
  await waitFor(() => screen.getByText('Bulldog'));
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Bulldog' } });
  expect(onChange).toHaveBeenCalled();
  expect(asFragment()).toMatchSnapshot();
});
