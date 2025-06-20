import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import VeterinarianCard from '../../../components/veterinarian/VeterinarianCard.jsx';

const vet = { id: 1, firstName: 'A', lastName: 'B', specialization: 'Surg' };

test('renders vet card snapshot', () => {
  const { asFragment } = render(
    <MemoryRouter>
      <VeterinarianCard vet={{ ...vet, averageRating: 0, totalReviewers: 0, photo: '' }} />
    </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});
