import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from '@testing-library/react';
import UserImage from './UserImage';

const placeholder = 'placeholder.png';

it('renders placeholder when no user photo provided', () => {
  render(<UserImage placeholder={placeholder} />);
  const img = screen.getByRole('img');
  expect(img).toHaveAttribute('src', placeholder);
});

it('renders user photo when provided', () => {
  const photo = 'abc123';
  render(<UserImage userPhoto={photo} placeholder={placeholder} altText="profile" />);
  const img = screen.getByRole('img');
  expect(img).toHaveAttribute('src', `data:image/png;base64, ${photo}`);
  expect(img).toHaveAttribute('alt', 'profile');
});
