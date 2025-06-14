import React from 'react';
import { render } from '@testing-library/react';
import Component from '../../components/admin/AdminDashboard.jsx';

test('renders without crashing', () => {
  render(<Component />);
});
