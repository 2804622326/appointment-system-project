import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import UserRegistration from '../../../components/user/UserRegistration.jsx';

jest.mock('../../../components/user/UserService.js', () => ({
  registerUser: jest.fn(() => Promise.resolve({ message: 'done' }))
}));

test('fills form and submits', async () => {
  const { registerUser } = require('../../../components/user/UserService.js');
  const { asFragment } = render(
    <MemoryRouter>
      <UserRegistration />
    </MemoryRouter>
  );
  fireEvent.change(screen.getByPlaceholderText(/first name/i), { target: { value: 'John' } });
  fireEvent.change(screen.getByPlaceholderText(/last name/i), { target: { value: 'Doe' } });
  fireEvent.change(screen.getByPlaceholderText(/email address/i), { target: { value: 'j@d.com' } });
  fireEvent.change(screen.getByPlaceholderText(/mobile phone number/i), { target: { value: '1' } });
  fireEvent.change(screen.getByPlaceholderText(/set your password/i), { target: { value: 'pass' } });
  fireEvent.change(screen.getByRole('combobox', { name: /gender/i }), { target: { value: 'Male' } });
  fireEvent.change(screen.getByRole('combobox', { name: /account type/i }), { target: { value: 'PATIENT' } });
  fireEvent.click(screen.getByRole('button', { name: /register/i }));
  await waitFor(() => expect(registerUser).toHaveBeenCalled());
  expect(asFragment()).toMatchSnapshot();
});
