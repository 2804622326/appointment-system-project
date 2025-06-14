import React from 'react';
import { render } from '@testing-library/react';
import Component from '../../components/admin/AdminOverview.jsx';

test('renders without crashing', () => {
  render(<Component />);
});
