import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import RatingStars from '../../../components/rating/RatingStars.jsx';

test('renders stars based on rating', () => {
  const { asFragment } = render(<RatingStars rating={3.5} />);
  expect(asFragment()).toMatchSnapshot();
});
