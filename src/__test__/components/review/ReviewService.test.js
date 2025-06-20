import { addReview } from '../../../components/review/ReviewService.js';
import { api } from '../../../components/utils/api.js';

jest.mock('../../../components/utils/api.js', () => ({
  api: { post: jest.fn(() => Promise.resolve({ data: {} })) }
}));

beforeEach(() => jest.clearAllMocks());

test('addReview posts with auth token', async () => {
  localStorage.setItem('authToken', 't');
  await addReview(1, 2, { a: 1 });
  expect(api.post).toHaveBeenCalledWith(
    'reviews/submit-review?vetId=1&reviewerId=2',
    { a: 1 },
    { headers: { Authorization: 'Bearer t' } }
  );
});
