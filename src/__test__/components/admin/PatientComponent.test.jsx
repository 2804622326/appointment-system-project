import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PatientComponent from '../../../components/admin/PatientComponent.jsx';

jest.mock('../../../components/patient/PatientService.js', () => ({
  getPatients: jest.fn(() => Promise.resolve({ data: [] })),
}));

jest.mock('../../../components/common/Paginator.jsx', () => () => <div data-testid="paginator" />);
jest.mock('../../../components/user/UserFilter.jsx', () => () => <div data-testid="user-filter" />);


test('shows no data message when there are no patients', async () => {
  const { asFragment } = render(<PatientComponent />);
  await waitFor(() => screen.getByText(/no.*patients data.*available at the moment/i));
  expect(screen.getByText(/no.*patients data.*available at the moment/i)).toBeInTheDocument();
  expect(asFragment()).toMatchSnapshot();
});
