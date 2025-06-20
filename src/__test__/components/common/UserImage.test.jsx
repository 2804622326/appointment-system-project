import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserImage from '../../../components/common/UserImage.jsx';

test('renders placeholder when no photo and snapshot', () => {
  const { asFragment } = render(<UserImage userId={1} userPhoto={null} />);
  expect(asFragment()).toMatchSnapshot();
});

test('renders user photo when provided', () => {
  const base64 = btoa('img');
  const { asFragment } = render(<UserImage userId={1} userPhoto={base64} />);
  expect(asFragment()).toMatchSnapshot();
});
