import React from 'react';
import { render } from '@testing-library/react';
import Component from '../../components/user/UserDashboard.jsx';

test('renders without crashing', () => {
  render(<Component />);
});
