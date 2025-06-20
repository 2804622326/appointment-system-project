import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminOverview from '../../../components/admin/AdminOverview.jsx';

jest.mock('../../../components/charts/RegistrationChart.jsx', () => () => <div data-testid="reg-chart" />);
jest.mock('../../../components/charts/AppointmentChart.jsx', () => () => <div data-testid="app-chart" />);
jest.mock('../../../components/charts/AccountChart.jsx', () => () => <div data-testid="acct-chart" />);
jest.mock('../../../components/charts/VetSpecializationChart.jsx', () => () => <div data-testid="spec-chart" />);

jest.mock('../../../components/user/UserService.js', () => ({
  countPatients: jest.fn(() => Promise.resolve(5)),
  countUsers: jest.fn(() => Promise.resolve(20)),
  countVeterinarians: jest.fn(() => Promise.resolve(3)),
}));

jest.mock('../../../components/appointment/AppointmentService.js', () => ({
  countAppointments: jest.fn(() => Promise.resolve(7)),
}));

test('displays fetched counts with snapshot', async () => {
  const { asFragment } = render(<AdminOverview />);
  await waitFor(() => screen.getByText('20'));
  expect(screen.getByText('20')).toBeInTheDocument();
  expect(screen.getByText('7')).toBeInTheDocument();
  expect(screen.getByText('3')).toBeInTheDocument();
  expect(screen.getByText('5')).toBeInTheDocument();
  expect(asFragment()).toMatchSnapshot();
});
