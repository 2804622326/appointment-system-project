import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddPetModal from '../../../components/modals/AddPetModal.jsx';

test('adds pet with filled information', () => {
  const onAddPet = jest.fn();
  const onHide = jest.fn();
  const { asFragment } = render(
    <AddPetModal show onHide={onHide} onAddPet={onAddPet} appointmentId={1} />
  );
  fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Tom' } });
  fireEvent.change(screen.getByLabelText(/age/i), { target: { value: '3' } });
  fireEvent.click(screen.getByText(/add pet/i));
  expect(onAddPet).toHaveBeenCalled();
  expect(asFragment()).toMatchSnapshot();
});
