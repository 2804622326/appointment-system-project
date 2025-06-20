import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import VetSlider from '../../../components/veterinarian/VetSlider.jsx';

test('renders slider snapshot', () => {
  const { asFragment } = render(<VetSlider veterinarians={[]} />);
  expect(asFragment()).toMatchSnapshot();
});
