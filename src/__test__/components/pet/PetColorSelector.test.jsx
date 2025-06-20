import React from 'react';
import { render, waitFor, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PetColorSelector from '../../../components/pet/PetColorSelector.jsx';

jest.mock('../../../components/pet/PetService.js', () => ({
  getAllPetColors: jest.fn(() => Promise.resolve({ data: ['Black'] }))
}));

test('loads colors and handles change', async () => {
  const onChange = jest.fn();
  const { asFragment } = render(<PetColorSelector value='' onChange={onChange} />);
  await waitFor(() => screen.getByText('Black'));
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Black' } });
  expect(onChange).toHaveBeenCalled();
  expect(asFragment()).toMatchSnapshot();
});
