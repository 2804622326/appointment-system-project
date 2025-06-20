import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import NoDataAvailable from '../../../components/common/NoDataAvailable.jsx';

test('displays error message when provided', () => {
  const { asFragment } = render(
    <NoDataAvailable dataType="items" errorMessage="oops" />
  );
  expect(screen.getByText(/oops/i)).toBeInTheDocument();
  expect(asFragment()).toMatchSnapshot();
});
