import React from 'react';
import { render } from '@testing-library/react';
import Component from '../../components/auth/EmailVerification.jsx';

test('renders without crashing', () => {
  render(<Component />);
});
