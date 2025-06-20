import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import BackgroundImageSlider from '../../../components/common/BackgroundImageSlider.jsx';

test('renders background slider and matches snapshot', () => {
  const { asFragment } = render(<BackgroundImageSlider />);
  expect(asFragment()).toMatchSnapshot();
});
