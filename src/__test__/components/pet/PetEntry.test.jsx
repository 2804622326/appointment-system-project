import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PetEntry from '../../../components/pet/PetEntry.jsx';

const pet = { name: '', age: '', color: '', type: '', breed: '' };

test('calls removePet when remove button clicked', () => {
  const removePet = jest.fn();
  const { asFragment } = render(
    <PetEntry pet={pet} index={0} canRemove removePet={removePet} handleInputChange={() => {}} />
  );
  fireEvent.click(document.querySelector('button'));
  expect(removePet).toHaveBeenCalledWith(0);
  expect(asFragment()).toMatchSnapshot();
});
