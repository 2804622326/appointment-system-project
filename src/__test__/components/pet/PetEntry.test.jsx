import React from 'react';
import { render } from '@testing-library/react';
import Component from '../../components/pet/PetEntry.jsx';

test('renders without crashing', () => {
  render(<Component />);
});
