import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RootLayout from '../../../components/layout/RootLayout';

// Mock the child components
jest.mock('../../../components/common/BackgroundImageSlider', () => {
  return function MockBackgroundImageSlider() {
    return <div data-testid="background-image-slider">Background Image Slider</div>;
  };
});

jest.mock('../../../components/layout/NavBar', () => {
  return function MockNavBar() {
    return <nav data-testid="navbar">Navigation Bar</nav>;
  };
});

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('RootLayout', () => {
  test('should render main element', () => {
    renderWithRouter(<RootLayout />);
    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();
  });

  test('should render NavBar component', () => {
    renderWithRouter(<RootLayout />);
    const navbar = screen.getByTestId('navbar');
    expect(navbar).toBeInTheDocument();
  });

  test('should render BackgroundImageSlider component', () => {
    renderWithRouter(<RootLayout />);
    const backgroundSlider = screen.getByTestId('background-image-slider');
    expect(backgroundSlider).toBeInTheDocument();
  });

  test('should render Outlet for nested routes', () => {
    renderWithRouter(<RootLayout />);
    // Outlet is rendered as a div container
    const outletContainer = screen.getByRole('main').querySelector('div:last-child');
    expect(outletContainer).toBeInTheDocument();
  });

  test('should render components in correct order', () => {
    renderWithRouter(<RootLayout />);
    const mainElement = screen.getByRole('main');
    const children = Array.from(mainElement.children);
    
    expect(children[0]).toHaveAttribute('data-testid', 'navbar');
    expect(children[1]).toHaveAttribute('data-testid', 'background-image-slider');
    expect(children[2]).toBeInstanceOf(HTMLDivElement);
  });

  test('should have correct structure', () => {
    renderWithRouter(<RootLayout />);
    const mainElement = screen.getByRole('main');
    
    expect(mainElement).toContainElement(screen.getByTestId('navbar'));
    expect(mainElement).toContainElement(screen.getByTestId('background-image-slider'));
    expect(mainElement.children).toHaveLength(3);
  });
});