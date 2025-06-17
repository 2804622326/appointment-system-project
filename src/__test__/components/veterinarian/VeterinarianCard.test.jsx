import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import VeterinarianCard from '../../../components/veterinarian/VeterinarianCard';

// Mock the child components
jest.mock('../../../components/common/UserImage', () => {
  return function UserImage({ userId, userPhoto }) {
    return <div data-testid="user-image" data-user-id={userId} data-user-photo={userPhoto} />;
  };
});

jest.mock('../../../components/rating/RatingStars', () => {
  return function RatingStars({ rating }) {
    return <div data-testid="rating-stars" data-rating={rating} />;
  };
});

const mockVet = {
  id: 1,
  firstName: 'John',
  lastName: 'Smith',
  specialization: 'Cardiology',
  photo: 'vet-photo.jpg',
  averageRating: 4.5,
  totalReviewers: 25
};

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('VeterinarianCard', () => {
  test('renders veterinarian information correctly', () => {
    renderWithRouter(<VeterinarianCard vet={mockVet} />);
    
    expect(screen.getByText('Dr. John Smith')).toBeInTheDocument();
    expect(screen.getByText('Cardiology')).toBeInTheDocument();
    expect(screen.getByText('(25)')).toBeInTheDocument();
  });

  test('renders UserImage component with correct props', () => {
    renderWithRouter(<VeterinarianCard vet={mockVet} />);
    
    const userImage = screen.getByTestId('user-image');
    expect(userImage).toHaveAttribute('data-user-id', '1');
    expect(userImage).toHaveAttribute('data-user-photo', 'vet-photo.jpg');
  });

  test('renders RatingStars component with correct rating', () => {
    renderWithRouter(<VeterinarianCard vet={mockVet} />);
    
    const ratingStars = screen.getByTestId('rating-stars');
    expect(ratingStars).toHaveAttribute('data-rating', '4.5');
  });

  test('renders book appointment link with correct URL', () => {
    renderWithRouter(<VeterinarianCard vet={mockVet} />);
    
    const bookAppointmentLink = screen.getByRole('link', { name: /book appointment/i });
    expect(bookAppointmentLink).toHaveAttribute('href', '/book-appointment/1/new-appointment');
  });

  test('renders see reviews link with correct URL', () => {
    renderWithRouter(<VeterinarianCard vet={mockVet} />);
    
    const seeReviewsLink = screen.getByRole('link', { name: /see what peopple are saying about/i });
    expect(seeReviewsLink).toHaveAttribute('href', '/veterinarian/1/veterinarian');
  });

  test('displays reviews count correctly', () => {
    renderWithRouter(<VeterinarianCard vet={mockVet} />);
    
    expect(screen.getByText(/Reviews:/)).toBeInTheDocument();
    expect(screen.getByText('(25)')).toBeInTheDocument();
  });

  test('renders accordion structure correctly', () => {
    renderWithRouter(<VeterinarianCard vet={mockVet} />);
    
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('handles vet with different data', () => {
    const differentVet = {
      id: 2,
      firstName: 'Jane',
      lastName: 'Doe',
      specialization: 'Surgery',
      photo: 'jane-photo.jpg',
      averageRating: 3.8,
      totalReviewers: 10
    };

    renderWithRouter(<VeterinarianCard vet={differentVet} />);
    
    expect(screen.getByText('Dr. Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('Surgery')).toBeInTheDocument();
    expect(screen.getByText('(10)')).toBeInTheDocument();
  });
});