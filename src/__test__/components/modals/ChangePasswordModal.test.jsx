import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChangePasswordModal from '../../../components/modals/ChangePasswordModal.jsx';

jest.mock('../../../components/user/UserService', () => ({
  changeUserPassword: jest.fn().mockResolvedValue({ message: 'ok' }),
}));

test('submits password change', async () => {
  const { changeUserPassword } = require('../../../components/user/UserService');
  const { asFragment } = render(
    <ChangePasswordModal userId={1} show handleClose={() => {}} />
  );
  fireEvent.change(screen.getByLabelText(/current password/i), { target: { value: 'a' } });
  fireEvent.change(screen.getByLabelText(/^new password/i), { target: { value: 'b' } });
  fireEvent.change(screen.getByLabelText(/confirm new password/i), { target: { value: 'b' } });
  fireEvent.click(screen.getByRole('button', { name: /change password/i }));
  await waitFor(() => expect(changeUserPassword).toHaveBeenCalled());
  expect(asFragment()).toMatchSnapshot();
});
