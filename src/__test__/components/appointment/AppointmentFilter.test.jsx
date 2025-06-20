import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AppointmentFilter from '../../../components/appointment/AppointmentFilter.jsx';

test('invokes callbacks and matches snapshot', () => {
  const onSelectStatus = jest.fn();
  const onClearFilters = jest.fn();
  const { asFragment } = render(
    <AppointmentFilter
      statuses={['pending', 'approved']}
      selectedStatus='pending'
      onSelectStatus={onSelectStatus}
      onClearFilters={onClearFilters}
    />
  );

  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'approved' } });
  expect(onSelectStatus).toHaveBeenCalledWith('approved');

  fireEvent.click(screen.getByRole('button', { name: /clear filter/i }));
  expect(onClearFilters).toHaveBeenCalled();

  expect(asFragment()).toMatchSnapshot();
});
