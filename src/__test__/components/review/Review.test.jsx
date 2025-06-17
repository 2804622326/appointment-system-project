import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Review from '../../../components/review/Review';
import { UserType } from '../../../components/utils/utilities';

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

describe('Review Component', () => {
  const mockReview = {
    stars: 4,
    feedback: 'Great service!',
    veterinarianName: 'Smith',
    patientName: 'John Doe',
    patientId: 'patient123',
    patientImage: 'patient.jpg',
    veterinarianId: 'vet456',
    veterinarianImage: 'vet.jpg'
  };

  it('renders review for patient user type', () => {
    render(<Review review={mockReview} userType={UserType.PATIENT} />);
    
    expect(screen.getByText('You rated Dr. Smith')).toBeInTheDocument();
    expect(screen.getByText('Great service!')).toBeInTheDocument();
    expect(screen.getByTestId('rating-stars')).toHaveAttribute('data-rating', '4');
    expect(screen.getByTestId('user-image')).toHaveAttribute('data-user-id', 'vet456');
    expect(screen.getByTestId('user-image')).toHaveAttribute('data-user-photo', 'vet.jpg');
  });

  it('renders review for vet user type', () => {
    render(<Review review={mockReview} userType={UserType.VET} />);
    
    expect(screen.getByText('Reviewed by: John Doe')).toBeInTheDocument();
    expect(screen.getByText('Great service!')).toBeInTheDocument();
    expect(screen.getByTestId('rating-stars')).toHaveAttribute('data-rating', '4');
    expect(screen.getByTestId('user-image')).toHaveAttribute('data-user-id', 'patient123');
    expect(screen.getByTestId('user-image')).toHaveAttribute('data-user-photo', 'patient.jpg');
  });

  it('renders correct structure and classes', () => {
    const { container } = render(<Review review={mockReview} userType={UserType.PATIENT} />);
    
    expect(container.querySelector('.mb-4')).toBeInTheDocument();
    expect(container.querySelector('.d-flex.align-item-center.me-5')).toBeInTheDocument();
    expect(container.querySelector('h5.title.ms-3')).toBeInTheDocument();
    expect(container.querySelector('p.review-text.ms-4')).toBeInTheDocument();
    expect(container.querySelector('hr')).toBeInTheDocument();
  });

  it('handles empty or missing review data gracefully', () => {
    const emptyReview = {
      stars: 0,
      feedback: '',
      veterinarianName: '',
      patientName: '',
      patientId: '',
      patientImage: '',
      veterinarianId: '',
      veterinarianImage: ''
    };

    render(<Review review={emptyReview} userType={UserType.PATIENT} />);
    
    expect(screen.getByText('You rated Dr. ')).toBeInTheDocument();
    expect(screen.getByTestId('rating-stars')).toHaveAttribute('data-rating', '0');
  });

  it('renders with different rating values', () => {
    const highRatingReview = { ...mockReview, stars: 5 };
    render(<Review review={highRatingReview} userType={UserType.PATIENT} />);
    
    expect(screen.getByTestId('rating-stars')).toHaveAttribute('data-rating', '5');
  });
});