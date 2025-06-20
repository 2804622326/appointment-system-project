import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProcessSpinner from '../../../components/common/ProcessSpinner.jsx';

test('renders spinner with message snapshot', () => {
  const { asFragment } = render(
    <ProcessSpinner message="Loading" animation="border" />
  );
  expect(asFragment()).toMatchSnapshot();
});
