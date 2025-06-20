import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import UserProfile from '../../../components/user/UserProfile.jsx';

const user = {
  id: 1,
  firstName: 'A',
  lastName: 'B',
  gender: 'M',
  email: 'a@b.com',
  phoneNumber: '1',
  userType: 'PATIENT',
  photo: 'p.jpg',
  roles: ['ROLE_USER'],
  enabled: true,
};

test('shows user info and handles delete modal', () => {
  localStorage.setItem('userId', '1');
  const handleDelete = jest.fn();
  const { asFragment } = render(
    <MemoryRouter>
      <UserProfile user={user} handleRemovePhoto={() => {}} handleDeleteAccount={handleDelete} />
    </MemoryRouter>
  );
  fireEvent.click(screen.getByText(/close account/i));
  fireEvent.click(screen.getByText('Delete'));
  expect(handleDelete).toHaveBeenCalled();
  expect(asFragment()).toMatchSnapshot();
});
