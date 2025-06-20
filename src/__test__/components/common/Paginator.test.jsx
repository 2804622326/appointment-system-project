import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Paginator from '../../../components/common/Paginator.jsx';

test('renders pagination items and handles click', () => {
  const onPaginate = jest.fn();
  const { asFragment } = render(
    <Paginator itemsPerPage={2} totalItems={5} currentPage={1} paginate={onPaginate} />
  );
  const page3 = screen.getByText('3');
  fireEvent.click(page3);
  expect(onPaginate).toHaveBeenCalledWith(3);
  expect(asFragment()).toMatchSnapshot();
});
