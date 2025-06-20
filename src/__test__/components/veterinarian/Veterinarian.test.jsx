import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Veterinarian from '../../../components/veterinarian/Veterinarian.jsx';

test('renders veterinarian snapshot', () => {
  const { asFragment } = render(<Veterinarian vet={{ firstName: 'A', lastName: 'B', specialization: 'Surg' }} />);
  expect(asFragment()).toMatchSnapshot();
});
