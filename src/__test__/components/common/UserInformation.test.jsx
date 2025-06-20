import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserInformation from '../../../components/common/UserInformation.jsx';

const appointment = {
  appointmentNo: 'A1',
  patient: { firstName: 'Jane', lastName: 'D', email: 'j@d.com', phoneNumber: '1' },
  veterinarian: { firstName: 'Sam', lastName: 'Vet', email: 's@v.com', phoneNumber: '2', specialization: 'Surg' },
};

test('shows patient information for vet user', () => {
  const { asFragment } = render(
    <UserInformation userType="VET" appointment={appointment} />
  );
  expect(screen.getByText(/jane/i)).toBeInTheDocument();
  expect(asFragment()).toMatchSnapshot();
});

test('shows vet information for patient user', () => {
  const { asFragment } = render(
    <UserInformation userType="PATIENT" appointment={appointment} />
  );
  expect(screen.getByText(/dr\./i)).toBeInTheDocument();
  expect(asFragment()).toMatchSnapshot();
});
