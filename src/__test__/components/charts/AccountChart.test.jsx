import React from 'react';
import { render } from '@testing-library/react';
import Component from '../../components/charts/AccountChart.jsx';

test('renders without crashing', () => {
  render(<Component />);
});
