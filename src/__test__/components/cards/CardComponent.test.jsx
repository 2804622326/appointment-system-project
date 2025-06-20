import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CardComponent from '../../../components/cards/CardComponent.jsx';

const TestIcon = () => <svg data-testid='icon' />;

test('renders label and count with icon', () => {
  const { asFragment } = render(
    <CardComponent label='Patients' count={5} IconComponent={TestIcon} />
  );
  expect(screen.getByText('Patients')).toBeInTheDocument();
  expect(screen.getByText('5')).toBeInTheDocument();
  expect(screen.getByTestId('icon')).toBeInTheDocument();
  expect(asFragment()).toMatchSnapshot();
});
