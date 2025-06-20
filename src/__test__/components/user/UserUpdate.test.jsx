import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import UserUpdate from '../../../components/user/UserUpdate.jsx';

jest.mock('../../../components/user/UserService.js', () => ({
  getUserById: jest.fn(() => Promise.resolve({ data: { firstName: 'A', lastName: 'B', userType: 'PATIENT' } })),
  updateUser: jest.fn(() => Promise.resolve({ message: 'updated' })),
}));

test('loads user and submits update', async () => {
  const { updateUser } = require('../../../components/user/UserService.js');
  const { asFragment } = render(
    <MemoryRouter initialEntries={['/update-user/1/update']}>
      <Routes>
        <Route path='/update-user/:userId/update' element={<UserUpdate />} />
      </Routes>
    </MemoryRouter>
  );
  await waitFor(() => screen.getByRole('button', { name: /update/i }));
  fireEvent.click(screen.getByRole('button', { name: /update/i }));
  await waitFor(() => expect(updateUser).toHaveBeenCalled());
  expect(asFragment()).toMatchSnapshot();
});
