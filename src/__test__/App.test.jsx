import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App.jsx';

const mockCreateBrowserRouter = jest.fn(() => 'router');
const mockCreateRoutesFromElements = jest.fn((routes) => routes);

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    Route: ({ children }) => <div>{children}</div>,
    RouterProvider: ({ router }) => <div data-testid='router-provider'>{router}</div>,
    createBrowserRouter: (...args) => mockCreateBrowserRouter(...args),
    createRoutesFromElements: (...args) => mockCreateRoutesFromElements(...args),
  };
});

test('renders app with router', () => {
  const { asFragment, getByTestId } = render(<App />);
  expect(mockCreateBrowserRouter).toHaveBeenCalled();
  expect(mockCreateRoutesFromElements).toHaveBeenCalled();
  expect(getByTestId('router-provider').textContent).toContain('router');
  expect(asFragment()).toMatchSnapshot();
});
