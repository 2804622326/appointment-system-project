import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminDashboardSidebar from '../../../components/admin/AdminDashboardSidebar.jsx';

test('handles navigation clicks and matches snapshot', () => {
  const onNavigate = jest.fn();
  const { asFragment } = render(
    <AdminDashboardSidebar
      openSidebarToggle={false}
      OpenSidebar={() => {}}
      onNavigate={onNavigate}
      activeTab="overview"
    />
  );

  fireEvent.click(screen.getByText(/dashboard overview/i));
  fireEvent.click(screen.getByText(/veterinarians/i));
  fireEvent.click(screen.getByText(/patients/i));

  expect(onNavigate).toHaveBeenNthCalledWith(1, 'overview');
  expect(onNavigate).toHaveBeenNthCalledWith(2, 'veterinarians');
  expect(onNavigate).toHaveBeenNthCalledWith(3, 'patients');
  const overviewItem = screen.getByText(/dashboard overview/i).closest('li');
  expect(overviewItem).toHaveClass('active');
  expect(asFragment()).toMatchSnapshot();
});
