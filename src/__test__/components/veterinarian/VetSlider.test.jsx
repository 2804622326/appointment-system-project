import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import VetSlider from '../../../components/veterinarian/VetSlider';

// Mock the RatingStars component
jest.mock('../../../components/rating/RatingStars', () => {
  return function MockRatingStars({ rating }) {
    return <div data-testid="rating-stars">Rating: {rating}</div>;
  };
});

// Mock the placeholder image
jest.mock('../../../assets/images/placeholder.jpg', () => 'placeholder.jpg');

const mockVets = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    specialization: 'Small Animal Veterinarian',
    averageRating: 4.5,
    photo: 'base64photostring'
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    specialization: 'Exotic Animal Veterinarian',
    averageRating: 4.8,
    photo: null
  }
];

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('VetSlider', () => {
  test('renders without crashing', () => {
    renderWithRouter(<VetSlider vets={[]} />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  test('renders carousel with vet information', () => {
    renderWithRouter(<VetSlider vets={mockVets} />);
    
    expect(screen.getByText('Dr. John Doe')).toBeInTheDocument();
    expect(screen.getByText('Small Animal Veterinarian')).toBeInTheDocument();
    expect(screen.getByTestId('rating-stars')).toBeInTheDocument();
  });

  test('displays vet photo when photo exists', () => {
    renderWithRouter(<VetSlider vets={mockVets} />);
    
    const vetImage = screen.getAllByAltText('photo')[0];
    expect(vetImage).toHaveAttribute('src', 'data:image/png;base64,base64photostring');
  });

  test('displays placeholder image when photo is null', () => {
    const vetWithoutPhoto = [mockVets[1]];
    renderWithRouter(<VetSlider vets={vetWithoutPhoto} />);
    
    const vetImage = screen.getByAltText('photo');
    expect(vetImage).toHaveAttribute('src', 'placeholder.jpg');
  });

  test('renders rating stars component with correct rating', () => {
    renderWithRouter(<VetSlider vets={mockVets} />);
    
    expect(screen.getByText('Rating: 4.5')).toBeInTheDocument();
  });

  test('renders vet review link with correct path', () => {
    renderWithRouter(<VetSlider vets={mockVets} />);
    
    const reviewLink = screen.getByText('What are people saying about');
    expect(reviewLink.closest('a')).toHaveAttribute('href', '/vet-reviews/1/veterinarian');
  });

  test('renders meet all veterinarians link', () => {
    renderWithRouter(<VetSlider vets={mockVets} />);
    
    const allVetsLink = screen.getByText('Meet all Veterinarians');
    expect(allVetsLink).toHaveAttribute('href', '/doctors');
  });

  test('renders vet specialization description', () => {
    renderWithRouter(<VetSlider vets={mockVets} />);
    
    expect(screen.getByText(/Dr. John Doe is a Small Animal Veterinarian/)).toBeInTheDocument();
  });

  test('renders lorem ipsum text', () => {
    renderWithRouter(<VetSlider vets={mockVets} />);
    
    expect(screen.getByText(/Lorem ipsum dolor sit amet/)).toBeInTheDocument();
  });

  test('does not render carousel items when vets array is empty', () => {
    renderWithRouter(<VetSlider vets={[]} />);
    
    expect(screen.queryByText(/Dr\./)).not.toBeInTheDocument();
  });

  test('does not render carousel items when vets is null', () => {
    renderWithRouter(<VetSlider vets={null} />);
    
    expect(screen.queryByText(/Dr\./)).not.toBeInTheDocument();
  });

  test('renders multiple vets in carousel', () => {
    renderWithRouter(<VetSlider vets={mockVets} />);
    
    // Check if carousel indicators are present (indicating multiple items)
    const carousel = screen.getByRole('main').querySelector('.carousel');
    expect(carousel).toBeInTheDocument();
  });

  test('applies correct CSS classes to elements', () => {
    renderWithRouter(<VetSlider vets={mockVets} />);
    
    const vetName = screen.getByText('Dr. John Doe');
    expect(vetName).toHaveClass('text-success');
    
    const reviewLink = screen.getByText('What are people saying about');
    expect(reviewLink).toHaveClass('me-3', 'link-2');
  });

  test('renders image with correct styling', () => {
    renderWithRouter(<VetSlider vets={mockVets} />);
    
    const vetImage = screen.getAllByAltText('photo')[0];
    expect(vetImage).toHaveStyle({
      maxWidth: '400px',
      maxHeight: '400px',
      objectFit: 'contain'
    });
  });
});