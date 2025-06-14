import React from 'react';
import { render } from '@testing-library/react';
import Component from '../../components/admin/AdminDashboardSidebar.jsx';

test('renders without crashing', () => {
  render(<Component />);
});
