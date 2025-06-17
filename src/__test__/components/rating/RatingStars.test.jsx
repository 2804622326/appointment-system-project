import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RatingStars from '../../../components/rating/RatingStars';

// Mock react-icons
jest.mock('react-icons/fa', () => ({
  FaStar: ({ color }) => <span data-testid="full-star" style={{ color }}>★</span>,
  FaStarHalfAlt: ({ color }) => <span data-testid="half-star" style={{ color }}>☆</span>,
  FaRegStar: ({ color }) => <span data-testid="empty-star" style={{ color }}>☆</span>,
}));

describe('RatingStars', () => {
  test('renders 5 full stars for rating 5', () => {
    render(<RatingStars rating={5} />);
    expect(screen.getAllByTestId('full-star')).toHaveLength(5);
    expect(screen.queryByTestId('half-star')).not.toBeInTheDocument();
    expect(screen.queryByTestId('empty-star')).not.toBeInTheDocument();
  });

  test('renders 3 full stars and 2 empty stars for rating 3', () => {
    render(<RatingStars rating={3} />);
    expect(screen.getAllByTestId('full-star')).toHaveLength(3);
    expect(screen.getAllByTestId('empty-star')).toHaveLength(2);
    expect(screen.queryByTestId('half-star')).not.toBeInTheDocument();
  });

  test('renders 3 full stars, 1 half star, and 1 empty star for rating 3.5', () => {
    render(<RatingStars rating={3.5} />);
    expect(screen.getAllByTestId('full-star')).toHaveLength(3);
    expect(screen.getByTestId('half-star')).toBeInTheDocument();
    expect(screen.getByTestId('empty-star')).toBeInTheDocument();
  });

  test('renders 1 half star and 4 empty stars for rating 0.5', () => {
    render(<RatingStars rating={0.5} />);
    expect(screen.queryByTestId('full-star')).not.toBeInTheDocument();
    expect(screen.getByTestId('half-star')).toBeInTheDocument();
    expect(screen.getAllByTestId('empty-star')).toHaveLength(4);
  });

  test('renders 5 empty stars for rating 0', () => {
    render(<RatingStars rating={0} />);
    expect(screen.queryByTestId('full-star')).not.toBeInTheDocument();
    expect(screen.queryByTestId('half-star')).not.toBeInTheDocument();
    expect(screen.getAllByTestId('empty-star')).toHaveLength(5);
  });

  test('renders correct CSS classes', () => {
    const { container } = render(<RatingStars rating={3} />);
    const spanElement = container.querySelector('span');
    expect(spanElement).toHaveClass('me-2', 'ms-2');
  });

  test('renders stars with correct color', () => {
    render(<RatingStars rating={2.5} />);
    const fullStars = screen.getAllByTestId('full-star');
    const halfStar = screen.getByTestId('half-star');
    const emptyStars = screen.getAllByTestId('empty-star');
    
    fullStars.forEach(star => {
      expect(star).toHaveStyle('color: #ffc107');
    });
    expect(halfStar).toHaveStyle('color: #ffc107');
    emptyStars.forEach(star => {
      expect(star).toHaveStyle('color: #ffc107');
    });
  });

  test('handles decimal ratings correctly', () => {
    render(<RatingStars rating={4.7} />);
    expect(screen.getAllByTestId('full-star')).toHaveLength(4);
    expect(screen.getByTestId('half-star')).toBeInTheDocument();
    expect(screen.queryByTestId('empty-star')).not.toBeInTheDocument();
  });
});