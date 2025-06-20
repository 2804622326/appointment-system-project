import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import VeterinarianListing from '../../../components/veterinarian/VeterinarianListing.jsx';

const vet = { id: 1, firstName: 'A', lastName: 'B', specialization: 'Surg' };

test('renders listing snapshot', () => {
  const { asFragment } = render(<VeterinarianListing veterinarians={[vet]} />);
  expect(asFragment()).toMatchSnapshot();
});
