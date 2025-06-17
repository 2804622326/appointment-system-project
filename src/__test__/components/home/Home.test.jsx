import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../../../components/home/Home';
import { getVeterinarians } from '../../../components/veterinarian/VeterinarianService';

// Mock the dependencies
jest.mock('../../../components/veterinarian/VeterinarianService');
jest.mock('../../../components/veterinarian/VetSlider', () => {
  return function VetSlider({ vets }) {
    return <div data-testid="vet-slider">VetSlider with {vets.length} vets</div>;
  };
});
jest.mock('../../../components/common/NoDataAvailable', () => {
  return function NoDataAvailable({ dataType, errorMessage }) {
    return <div data-testid="no-data-available">{dataType} - {errorMessage}</div>;
  };
});

// Mock images
jest.mock('../../../assets/images/d5.jpg', () => 'mocked-d5-image');
jest.mock('../../../assets/images/vett.jpg', () => 'mocked-vett-image');

const mockGetVeterinarians = getVeterinarians;

describe('Home Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders home component with static content', () => {
    mockGetVeterinarians.mockResolvedValue({ data: [] });
    
    render(<Home />);
    
    expect(screen.getByText('Who We Are')).toBeInTheDocument();
    expect(screen.getByText('Comprehensive Care for your Furry Friends')).toBeInTheDocument();
    expect(screen.getByText('Our Services')).toBeInTheDocument();
    expect(screen.getByText('What we do')).toBeInTheDocument();
    expect(screen.getByText('What people are saying about')).toBeInTheDocument();
    expect(screen.getByText('Universal Pet Care')).toBeInTheDocument();
  });

  test('renders service list items', () => {
    mockGetVeterinarians.mockResolvedValue({ data: [] });
    
    render(<Home />);
    
    expect(screen.getByText('Veterinary Check-ups')).toBeInTheDocument();
    expect(screen.getByText('Emergency Surgery')).toBeInTheDocument();
    expect(screen.getByText('Pet Vaccinations')).toBeInTheDocument();
    expect(screen.getByText('Dental Care')).toBeInTheDocument();
    expect(screen.getByText('Spaying and Neutering')).toBeInTheDocument();
    expect(screen.getByText('And many more...')).toBeInTheDocument();
  });

  test('renders images with correct alt text', () => {
    mockGetVeterinarians.mockResolvedValue({ data: [] });
    
    render(<Home />);
    
    const images = screen.getAllByAltText('About Us');
    expect(images).toHaveLength(2);
  });

  test('renders buttons', () => {
    mockGetVeterinarians.mockResolvedValue({ data: [] });
    
    render(<Home />);
    
    const buttons = screen.getAllByText('Meet Our veterinarians');
    expect(buttons).toHaveLength(2);
  });

  test('displays VetSlider when vets data is available', async () => {
    const mockVets = [
      { id: 1, name: 'Dr. Smith' },
      { id: 2, name: 'Dr. Johnson' }
    ];
    mockGetVeterinarians.mockResolvedValue({ data: mockVets });
    
    render(<Home />);
    
    await waitFor(() => {
      expect(screen.getByTestId('vet-slider')).toBeInTheDocument();
      expect(screen.getByText('VetSlider with 2 vets')).toBeInTheDocument();
    });
  });

  test('displays NoDataAvailable when no vets data', async () => {
    mockGetVeterinarians.mockResolvedValue({ data: [] });
    
    render(<Home />);
    
    await waitFor(() => {
      expect(screen.getByTestId('no-data-available')).toBeInTheDocument();
      expect(screen.getByText('veterinarians data -')).toBeInTheDocument();
    });
  });

  test('displays NoDataAvailable with error message when API fails', async () => {
    const errorMessage = 'Network error';
    mockGetVeterinarians.mockRejectedValue(new Error(errorMessage));
    
    render(<Home />);
    
    await waitFor(() => {
      expect(screen.getByTestId('no-data-available')).toBeInTheDocument();
      expect(screen.getByText(`veterinarians data - ${errorMessage}`)).toBeInTheDocument();
    });
  });

  test('displays default error message when API fails without message', async () => {
    mockGetVeterinarians.mockRejectedValue(new Error());
    
    render(<Home />);
    
    await waitFor(() => {
      expect(screen.getByTestId('no-data-available')).toBeInTheDocument();
      expect(screen.getByText('veterinarians data - Something went wrong!')).toBeInTheDocument();
    });
  });

  test('calls getVeterinarians on component mount', () => {
    mockGetVeterinarians.mockResolvedValue({ data: [] });
    
    render(<Home />);
    
    expect(mockGetVeterinarians).toHaveBeenCalledTimes(1);
  });

  test('renders container with correct CSS classes', () => {
    mockGetVeterinarians.mockResolvedValue({ data: [] });
    
    render(<Home />);
    
    const container = screen.getByText('Who We Are').closest('.home-container');
    expect(container).toHaveClass('home-container', 'mt-5');
  });

  test('renders cards with correct structure', () => {
    mockGetVeterinarians.mockResolvedValue({ data: [] });
    
    render(<Home />);
    
    const serviceCard = screen.getByText('Our Services').closest('.service-card');
    expect(serviceCard).toBeInTheDocument();
    
    const testimonialCard = screen.getByText('What people are saying about').closest('.card');
    expect(testimonialCard).toHaveClass('card', 'mb-5');
  });
});