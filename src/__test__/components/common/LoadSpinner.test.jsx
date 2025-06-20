import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoadSpinner from '../../../components/common/LoadSpinner.jsx';

test('renders spinner with variant', () => {
  const { asFragment } = render(<LoadSpinner variant="primary" />);
  expect(asFragment()).toMatchSnapshot();
});
