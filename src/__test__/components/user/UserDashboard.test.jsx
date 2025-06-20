import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import UserDashboard from '../../../components/user/UserDashboard.jsx';

jest.mock('../../../components/user/UserService.js', () => ({
  getUserById: jest.fn(() => Promise.resolve({ data: { id: '1', userType: 'PATIENT', appointments: [], reviews: [] } })),
  deleteUser: jest.fn(() => Promise.resolve({ message: 'deleted' }))
}));

jest.mock('../../../components/modals/ImageUploaderService.jsx', () => ({
  deleteUserPhoto: jest.fn(() => Promise.resolve({ message: 'ok' }))
}));

test('renders dashboard and stores tab key', async () => {
  localStorage.setItem('userId', '1');
  const { asFragment } = render(
    <MemoryRouter initialEntries={['/user-dashboard/1/my-dashboard']}>
      <Routes>
        <Route path='/user-dashboard/:userId/my-dashboard' element={<UserDashboard />} />
      </Routes>
    </MemoryRouter>
  );
  await waitFor(() => screen.getByText(/profile/i));
  expect(asFragment()).toMatchSnapshot();
});
