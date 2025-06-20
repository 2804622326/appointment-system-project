import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditablePetRow from '../../../components/pet/EditablePetRow.jsx';

test('edits and saves pet', () => {
  const onSave = jest.fn();
  const onCancel = jest.fn();
  const pet = { id: 1, name: 'a', type: 'dog', breed: 'b', color: 'c', age: 2 };
  const { asFragment } = render(
    <table><tbody><EditablePetRow pet={pet} index={0} onSave={onSave} onCancel={onCancel} /></tbody></table>
  );
  fireEvent.change(screen.getByDisplayValue('a'), { target: { value: 'x' } });
  fireEvent.click(screen.getAllByRole('button')[0]);
  expect(onSave).toHaveBeenCalled();
  fireEvent.click(screen.getAllByRole('button')[1]);
  expect(onCancel).toHaveBeenCalled();
  expect(asFragment()).toMatchSnapshot();
});
