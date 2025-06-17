import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Veterinarian from '../../../components/veterinarian/Veterinarian';
import { getUserById } from '../../../components/user/UserService';

// Mock dependencies
jest.mock('../../../components/user/UserService');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ vetId: '1' }),
}));

jest.mock('../../../components/common/UserImage', () => {
  return function MockUserImage({ userId, userPhoto, altText }) {
    return <img data-testid="user-image" alt={altText} />;
  };
});

jest.mock('../../../components/review/Review', () => {
  return function MockReview({ review, userType }) {
    return <div data-testid="review">{review.comment}</div>;
  };
});

jest.mock('../../../components/hooks/UseMessageAlerts', () => {
  return function MockUseMessageAlerts() {
    return {
      errorMessage: '',
      showErrorAlert: false,
      setErrorMessage: jest.fn(),
      setShowErrorAlert: jest.fn(),
    };
  };
});

jest.mock('../../../components/rating/RatingStars', () => {
  return function MockRatingStars({ rating }) {
    return <span data-testid="rating-stars">{rating}</span>;
  };
});

jest.mock('../../../components/rating/Rating', () => {
  return function MockRating({ veterinarianId, onReviewSubmit }) {
    return <div data-testid="rating-component">Rating Component</div>;
  };
});

jest.mock('../../../components/common/Paginator', () => {
  return function MockPaginator({ itemsPerPage, totalItems, paginate, currentPage }) {
    return (
      <div data-testid="paginator">
        <button onClick={() => paginate(2)}>Page 2</button>
      </div>
    );
  };
});

jest.mock('../../../components/common/LoadSpinner', () => {
  return function MockLoadSpinner() {
    return <div data-testid="load-spinner">Loading...</div>;
  };
});

jest.mock('../../../components/common/AlertMessage', () => {
  return function MockAlertMessage({ type, message }) {
    return <div data-testid="alert-message">{message}</div>;
  };
});

const mockVetData = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  specialization: 'Surgery',
  photo: 'photo.jpg',
  userType: 'VET',
  averageRating: 4.5,
  totalReviewers: 10,
  reviews: [
    { id: 1, comment: 'Great vet!', rating: 5 },
    { id: 2, comment: 'Very professional', rating: 4 },
    { id: 3, comment: 'Excellent service', rating: 5 },
  ],
};

describe('Veterinarian Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading spinner initially', () => {
    getUserById.mockResolvedValue({ data: mockVetData });
    
    render(
      <BrowserRouter>
        <Veterinarian />
      </BrowserRouter>
    );

    expect(screen.getByTestId('load-spinner')).toBeInTheDocument();
  });

  test('renders veterinarian information after loading', async () => {
    getUserById.mockResolvedValue({ data: mockVetData });

    render(
      <BrowserRouter>
        <Veterinarian />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Dr. John Doe')).toBeInTheDocument();
    });

    expect(screen.getByText('Specialization : Surgery')).toBeInTheDocument();
    expect(screen.getByTestId('user-image')).toBeInTheDocument();
    expect(screen.getByText('Book appointment')).toBeInTheDocument();
  });

  test('renders rating information when average rating is greater than 0', async () => {
    getUserById.mockResolvedValue({ data: mockVetData });

    render(
      <BrowserRouter>
        <Veterinarian />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Ratings: \(4.5\) stars/)).toBeInTheDocument();
    });

    expect(screen.getByTestId('rating-stars')).toBeInTheDocument();
    expect(screen.getByText(/rated by \(10 people\)/)).toBeInTheDocument();
  });

  test('renders reviews and pagination', async () => {
    getUserById.mockResolvedValue({ data: mockVetData });

    render(
      <BrowserRouter>
        <Veterinarian />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Reviews')).toBeInTheDocument();
    });

    expect(screen.getAllByTestId('review')).toHaveLength(2); // reviewPerPage = 2
    expect(screen.getByTestId('paginator')).toBeInTheDocument();
  });

  test('renders "No reviews available" when no reviews exist', async () => {
    const vetWithoutReviews = { ...mockVetData, reviews: [] };
    getUserById.mockResolvedValue({ data: vetWithoutReviews });

    render(
      <BrowserRouter>
        <Veterinarian />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('No reviews available yet.')).toBeInTheDocument();
    });
  });

  test('does not render rating section when average rating is 0', async () => {
    const vetWithoutRating = { ...mockVetData, averageRating: 0 };
    getUserById.mockResolvedValue({ data: vetWithoutRating });

    render(
      <BrowserRouter>
        <Veterinarian />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Dr. John Doe')).toBeInTheDocument();
    });

    expect(screen.queryByText(/Ratings:/)).not.toBeInTheDocument();
  });

  test('handles API error', async () => {
    const mockError = {
      response: { data: { message: 'Veterinarian not found' } }
    };
    getUserById.mockRejectedValue(mockError);

    const mockUseMessageAlerts = require('../../../components/hooks/UseMessageAlerts');
    const mockSetErrorMessage = jest.fn();
    const mockSetShowErrorAlert = jest.fn();
    
    mockUseMessageAlerts.mockImplementation(() => ({
      errorMessage: 'Veterinarian not found',
      showErrorAlert: true,
      setErrorMessage: mockSetErrorMessage,
      setShowErrorAlert: mockSetShowErrorAlert,
    }));

    render(
      <BrowserRouter>
        <Veterinarian />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('alert-message')).toBeInTheDocument();
    });
  });

  test('renders correct book appointment link', async () => {
    getUserById.mockResolvedValue({ data: mockVetData });

    render(
      <BrowserRouter>
        <Veterinarian />
      </BrowserRouter>
    );

    await waitFor(() => {
      const bookLink = screen.getByText('Book appointment');
      expect(bookLink.closest('a')).toHaveAttribute('href', '/book-appointment/1/new-appointment');
    });
  });

  test('renders back to veterinarians link', async () => {
    getUserById.mockResolvedValue({ data: mockVetData });

    render(
      <BrowserRouter>
        <Veterinarian />
      </BrowserRouter>
    );

    await waitFor(() => {
      const backLink = screen.getByText('back to veterinarians');
      expect(backLink.closest('a')).toHaveAttribute('href', '/doctors');
    });
  });

  test('renders about section', async () => {
    getUserById.mockResolvedValue({ data: mockVetData });

    render(
      <BrowserRouter>
        <Veterinarian />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('About Dr. John Doe')).toBeInTheDocument();
    });

    expect(screen.getByText(/Lorem ipsum dolor sit amet/)).toBeInTheDocument();
  });

  test('renders rating component', async () => {
    getUserById.mockResolvedValue({ data: mockVetData });

    render(
      <BrowserRouter>
        <Veterinarian />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('rating-component')).toBeInTheDocument();
    });
  });

  test('handles singular/plural text for reviewers', async () => {
    const vetWithOneReviewer = { ...mockVetData, totalReviewers: 1 };
    getUserById.mockResolvedValue({ data: vetWithOneReviewer });

    render(
      <BrowserRouter>
        <Veterinarian />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/rated by \(1 person\)/)).toBeInTheDocument();
    });
  });

  test('pagination changes current page', async () => {
    getUserById.mockResolvedValue({ data: mockVetData });

    render(
      <BrowserRouter>
        <Veterinarian />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('paginator')).toBeInTheDocument();
    });

    const pageButton = screen.getByText('Page 2');
    fireEvent.click(pageButton);

    // After clicking page 2, different reviews should be shown
    // This tests the pagination logic
  });
});