import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserFilter from '../../../components/user/UserFilter.jsx';

test('selects value and clears filter', () => {
  const onSelect = jest.fn();
  const onClear = jest.fn();
  const { asFragment } = render(
    <UserFilter label='Role' values={['Admin', 'User']} selectedValue='' onSelectedValue={onSelect} onClearFilters={onClear} />
  );
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Admin' } });
  expect(onSelect).toHaveBeenCalledWith('Admin');
  fireEvent.click(screen.getByRole('button'));
  expect(onClear).toHaveBeenCalled();
  expect(asFragment()).toMatchSnapshot();
});
