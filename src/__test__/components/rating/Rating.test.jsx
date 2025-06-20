import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Rating from '../../../components/rating/Rating.jsx';

jest.mock('../../../components/review/ReviewService.js', () => ({
  addReview: jest.fn(() => Promise.resolve({ message: 'ok' }))
}));

describe('Rating component', () => {
  test('submits review when logged in', async () => {
    localStorage.setItem('userId', '1');
    const { addReview } = require('../../../components/review/ReviewService.js');
    const { asFragment } = render(<Rating veterinarianId={5} />);
    fireEvent.click(screen.getAllByRole('radio')[2]);
    fireEvent.change(screen.getByPlaceholderText(/leave a feedback/i), { target: { value: 'hi' } });
    fireEvent.click(screen.getByRole('button', { name: /submit review/i }));
    await waitFor(() => expect(addReview).toHaveBeenCalled());
    expect(asFragment()).toMatchSnapshot();
  });
});
