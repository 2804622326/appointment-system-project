import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import '@testing-library/jest-dom';
import RootLayout from '../../../components/layout/RootLayout.jsx';

test('renders layout with outlet', () => {
  const { asFragment } = render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route element={<RootLayout />}> <Route index element={<div>Home</div>} /></Route>
      </Routes>
    </MemoryRouter>
  );
  expect(asFragment()).toMatchSnapshot();
});
