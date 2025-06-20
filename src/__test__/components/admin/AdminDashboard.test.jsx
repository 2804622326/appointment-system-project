import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminDashboard from '../../../components/admin/AdminDashboard.jsx';

jest.mock('../../../components/admin/AdminOverview.jsx', () => () => <div data-testid="overview">Overview</div>);
jest.mock('../../../components/admin/VeterinarianComponent.jsx', () => () => <div data-testid="vets">Vets</div>);
jest.mock('../../../components/admin/PatientComponent.jsx', () => () => <div data-testid="patients">Patients</div>);

afterEach(() => {
  localStorage.clear();
  jest.resetAllMocks();
});

test('loads active tab from localStorage and navigates', () => {
  localStorage.setItem('activeContent', 'veterinarians');
  const { asFragment } = render(<AdminDashboard />);

  expect(screen.getByTestId('vets')).toBeInTheDocument();

  fireEvent.click(screen.getByText(/dashboard overview/i));
  expect(screen.getByTestId('overview')).toBeInTheDocument();
  expect(asFragment()).toMatchSnapshot();
});
