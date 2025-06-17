import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Paginator from '../../../components/common/Paginator';

// Mock react-bootstrap Pagination components
jest.mock('react-bootstrap', () => ({
  Pagination: ({ children }) => <div data-testid="pagination">{children}</div>,
  Pagination: {
    Item: ({ children, active, onClick, ...props }) => (
      <button
        data-testid="pagination-item"
        className={active ? 'active' : ''}
        onClick={onClick}
        {...props}
      >
        {children}
      </button>
    )
  }
}));

describe('Paginator', () => {
  const mockPaginate = jest.fn();

  beforeEach(() => {
    mockPaginate.mockClear();
  });

  test('renders pagination items correctly', () => {
    render(
      <Paginator
        itemsPerPage={10}
        totalItems={25}
        currentPage={1}
        paginate={mockPaginate}
      />
    );

    const paginationItems = screen.getAllByTestId('pagination-item');
    expect(paginationItems).toHaveLength(3); // Math.ceil(25/10) = 3
    expect(paginationItems[0]).toHaveTextContent('1');
    expect(paginationItems[1]).toHaveTextContent('2');
    expect(paginationItems[2]).toHaveTextContent('3');
  });

  test('marks current page as active', () => {
    render(
      <Paginator
        itemsPerPage={10}
        totalItems={25}
        currentPage={2}
        paginate={mockPaginate}
      />
    );

    const paginationItems = screen.getAllByTestId('pagination-item');
    expect(paginationItems[1]).toHaveClass('active');
    expect(paginationItems[0]).not.toHaveClass('active');
    expect(paginationItems[2]).not.toHaveClass('active');
  });

  test('calls paginate function when item is clicked', () => {
    render(
      <Paginator
        itemsPerPage={10}
        totalItems={25}
        currentPage={1}
        paginate={mockPaginate}
      />
    );

    const paginationItems = screen.getAllByTestId('pagination-item');
    fireEvent.click(paginationItems[1]); // Click on page 2

    expect(mockPaginate).toHaveBeenCalledWith(2);
    expect(mockPaginate).toHaveBeenCalledTimes(1);
  });

  test('renders single page when totalItems is less than itemsPerPage', () => {
    render(
      <Paginator
        itemsPerPage={10}
        totalItems={5}
        currentPage={1}
        paginate={mockPaginate}
      />
    );

    const paginationItems = screen.getAllByTestId('pagination-item');
    expect(paginationItems).toHaveLength(1);
    expect(paginationItems[0]).toHaveTextContent('1');
  });

  test('handles exact division of totalItems by itemsPerPage', () => {
    render(
      <Paginator
        itemsPerPage={10}
        totalItems={30}
        currentPage={1}
        paginate={mockPaginate}
      />
    );

    const paginationItems = screen.getAllByTestId('pagination-item');
    expect(paginationItems).toHaveLength(3); // 30/10 = 3
  });

  test('renders correct number of pages with zero items', () => {
    render(
      <Paginator
        itemsPerPage={10}
        totalItems={0}
        currentPage={1}
        paginate={mockPaginate}
      />
    );

    const paginationItems = screen.queryAllByTestId('pagination-item');
    expect(paginationItems).toHaveLength(0);
  });

  test('renders wrapper div with correct classes', () => {
    render(
      <Paginator
        itemsPerPage={10}
        totalItems={25}
        currentPage={1}
        paginate={mockPaginate}
      />
    );

    const wrapper = screen.getByTestId('pagination').parentElement;
    expect(wrapper).toHaveClass('d-flex', 'justify-content-end');
  });
});