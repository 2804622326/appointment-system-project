import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddItemModal from '../../../components/modals/AddItemModal.jsx';

test('adds item and closes modal', () => {
  const save = jest.fn();
  const close = jest.fn();
  const { asFragment } = render(
    <AddItemModal show handleClose={close} handleSave={save} itemLabel="Category" />
  );
  fireEvent.change(screen.getByPlaceholderText(/enter category name/i), {
    target: { value: 'Cat' },
  });
  fireEvent.click(screen.getByText('Add'));
  expect(save).toHaveBeenCalledWith('Cat');
  expect(close).toHaveBeenCalled();
  expect(asFragment()).toMatchSnapshot();
});
