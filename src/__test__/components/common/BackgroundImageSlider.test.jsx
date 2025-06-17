import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BackgroundImageSlider from '../../../components/common/BackgroundImageSlider';

// Mock the image imports
jest.mock('../../../assets/images/bg1.png', () => 'bg1.png');
jest.mock('../../../assets/images/bg.jpg', () => 'bg.jpg');
jest.mock('../../../assets/images/bg3.png', () => 'bg3.png');

// Mock react-bootstrap Carousel
jest.mock('react-bootstrap', () => ({
  Carousel: ({ children, activeIndex, onSelect, interval }) => (
    <div data-testid="carousel" data-active-index={activeIndex} data-interval={interval}>
      <button onClick={() => onSelect(1)} data-testid="select-slide">Select Slide</button>
      {children}
    </div>
  ),
  'Carousel.Item': ({ children }) => <div data-testid="carousel-item">{children}</div>
}));

describe('BackgroundImageSlider', () => {
  test('renders component with correct structure', () => {
    render(<BackgroundImageSlider />);
    
    expect(screen.getByTestId('carousel')).toBeInTheDocument();
    expect(screen.getByTestId('carousel')).toHaveAttribute('data-interval', '20000');
    expect(screen.getByTestId('carousel')).toHaveAttribute('data-active-index', '0');
  });

  test('renders all background images', () => {
    render(<BackgroundImageSlider />);
    
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(3);
    
    expect(images[0]).toHaveAttribute('src', 'bg1.png');
    expect(images[1]).toHaveAttribute('src', 'bg.jpg');
    expect(images[2]).toHaveAttribute('src', 'bg3.png');
  });

  test('images have correct alt text', () => {
    render(<BackgroundImageSlider />);
    
    expect(screen.getByAltText('Slide 0')).toBeInTheDocument();
    expect(screen.getByAltText('Slide 1')).toBeInTheDocument();
    expect(screen.getByAltText('Slide 2')).toBeInTheDocument();
  });

  test('images have correct CSS classes', () => {
    render(<BackgroundImageSlider />);
    
    const images = screen.getAllByRole('img');
    images.forEach(img => {
      expect(img).toHaveClass('d-block', 'w-100');
    });
  });

  test('handles slide selection', () => {
    render(<BackgroundImageSlider />);
    
    const selectButton = screen.getByTestId('select-slide');
    fireEvent.click(selectButton);
    
    expect(screen.getByTestId('carousel')).toHaveAttribute('data-active-index', '1');
  });

  test('renders correct number of carousel items', () => {
    render(<BackgroundImageSlider />);
    
    const carouselItems = screen.getAllByTestId('carousel-item');
    expect(carouselItems).toHaveLength(3);
  });

  test('has correct wrapper class', () => {
    render(<BackgroundImageSlider />);
    
    const wrapper = screen.getByTestId('carousel').closest('.background-slider');
    expect(wrapper).toBeInTheDocument();
  });
});