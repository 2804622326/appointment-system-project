import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Review from '../../../components/review/Review.jsx';
import { UserType } from '../../../components/utils/utilities.js';

const review = {
  patientName: 'Jane',
  veterinarianName: 'Bob',
  patientImage: 'p.jpg',
  veterinarianImage: 'v.jpg',
  stars: 4,
  feedback: 'nice!',
};

test('displays patient review for vet', () => {
  const { asFragment } = render(<Review review={review} userType={UserType.VET} />);
  expect(asFragment()).toMatchSnapshot();
});

test('displays vet review for patient', () => {
  const { asFragment } = render(<Review review={review} userType={UserType.PATIENT} />);
  expect(asFragment()).toMatchSnapshot();
});
