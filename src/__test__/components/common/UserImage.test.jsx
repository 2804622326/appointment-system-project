import React from 'react';
import { render, screen } from '@testing-library/react';
import UserImage from '../../../components/common/UserImage';

// Mock the placeholder image
jest.mock('../../../assets/images/placeholder.jpg', () => 'placeholder.jpg');

describe('UserImage', () => {
  const defaultProps = {
    userId: '123',
    userPhoto: null,
    altText: 'User photo'
  };

  test('renders placeholder image when userPhoto is not provided', () => {
    render(<UserImage {...defaultProps} />);
    
    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'placeholder.jpg');
    expect(image).toHaveAttribute('alt', 'User photo');
    expect(image).toHaveClass('user-image');
  });

  test('renders base64 image when userPhoto is provided', () => {
    const base64Photo = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
    
    render(<UserImage {...defaultProps} userPhoto={base64Photo} />);
    
    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', `data:image/png;base64,${base64Photo}`);
    expect(image).toHaveAttribute('alt', 'User photo');
    expect(image).toHaveClass('user-image');
  });

  test('renders with custom alt text', () => {
    const customAltText = 'Profile picture';
    
    render(<UserImage {...defaultProps} altText={customAltText} />);
    
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('alt', customAltText);
  });

  test('renders with default alt text when not provided', () => {
    const { altText, ...propsWithoutAlt } = defaultProps;
    
    render(<UserImage {...propsWithoutAlt} />);
    
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('alt', 'User photo');
  });

  test('renders placeholder when userPhoto is empty string', () => {
    render(<UserImage {...defaultProps} userPhoto="" />);
    
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'placeholder.jpg');
  });

  test('renders placeholder when userPhoto is null', () => {
    render(<UserImage {...defaultProps} userPhoto={null} />);
    
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'placeholder.jpg');
  });

  test('renders placeholder when userPhoto is undefined', () => {
    render(<UserImage {...defaultProps} userPhoto={undefined} />);
    
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', 'placeholder.jpg');
  });
});