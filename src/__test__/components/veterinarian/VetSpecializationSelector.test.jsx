import React from 'react';
import { render, waitFor, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import VetSpecializationSelector from '../../../components/veterinarian/VetSpecializationSelector.jsx';

jest.mock('../../../components/veterinarian/VeterinarianService.js', () => ({
  getAllSpecializations: jest.fn(() => Promise.resolve({ data: ['Surg'] }))
}));

test('loads specializations and handles change', async () => {
  const onChange = jest.fn();
  const { asFragment } = render(<VetSpecializationSelector value='' onChange={onChange} />);
  await waitFor(() => screen.getByText('Surg'));
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Surg' } });
  expect(onChange).toHaveBeenCalled();
  expect(asFragment()).toMatchSnapshot();
});
