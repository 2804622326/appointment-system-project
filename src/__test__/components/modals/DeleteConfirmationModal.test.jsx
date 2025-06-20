import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DeleteConfirmationModal from '../../../components/modals/DeleteConfirmationModal.jsx';

test('confirms deletion when button clicked', () => {
  const confirm = jest.fn();
  const { asFragment } = render(
    <DeleteConfirmationModal show onHide={() => {}} onConfirm={confirm} itemToDelete="item" />
  );
  fireEvent.click(screen.getByText('Delete'));
  expect(confirm).toHaveBeenCalled();
  expect(asFragment()).toMatchSnapshot();
});
