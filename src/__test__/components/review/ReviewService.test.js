import { addReview } from '../../../components/review/ReviewService';
import { api } from '../../../components/utils/api';

// Mock the api module
jest.mock('../../../components/utils/api', () => ({
  api: {
    post: jest.fn()
  }
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock;

describe('ReviewService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addReview', () => {
    const mockVetId = 'vet123';
    const mockReviewerId = 'reviewer456';
    const mockReviewData = {
      rating: 5,
      comment: 'Great service!'
    };
    const mockToken = 'mock-auth-token';
    const mockResponse = {
      data: {
        id: 'review789',
        vetId: mockVetId,
        reviewerId: mockReviewerId,
        rating: 5,
        comment: 'Great service!'
      }
    };

    it('should successfully add a review with valid data', async () => {
      localStorageMock.getItem.mockReturnValue(mockToken);
      api.post.mockResolvedValue(mockResponse);

      const result = await addReview(mockVetId, mockReviewerId, mockReviewData);

      expect(localStorage.getItem).toHaveBeenCalledWith('authToken');
      expect(api.post).toHaveBeenCalledWith(
        `reviews/submit-review?vetId=${mockVetId}&reviewerId=${mockReviewerId}`,
        mockReviewData,
        {
          headers: {
            Authorization: `Bearer ${mockToken}`
          }
        }
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle missing auth token', async () => {
      localStorageMock.getItem.mockReturnValue(null);
      api.post.mockResolvedValue(mockResponse);

      const result = await addReview(mockVetId, mockReviewerId, mockReviewData);

      expect(api.post).toHaveBeenCalledWith(
        `reviews/submit-review?vetId=${mockVetId}&reviewerId=${mockReviewerId}`,
        mockReviewData,
        {
          headers: {
            Authorization: 'Bearer null'
          }
        }
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw error when API call fails', async () => {
      const mockError = new Error('Network error');
      localStorageMock.getItem.mockReturnValue(mockToken);
      api.post.mockRejectedValue(mockError);

      await expect(addReview(mockVetId, mockReviewerId, mockReviewData))
        .rejects.toThrow('Network error');

      expect(api.post).toHaveBeenCalledWith(
        `reviews/submit-review?vetId=${mockVetId}&reviewerId=${mockReviewerId}`,
        mockReviewData,
        {
          headers: {
            Authorization: `Bearer ${mockToken}`
          }
        }
      );
    });

    it('should handle API error response', async () => {
      const mockApiError = {
        response: {
          status: 400,
          data: { message: 'Invalid review data' }
        }
      };
      localStorageMock.getItem.mockReturnValue(mockToken);
      api.post.mockRejectedValue(mockApiError);

      await expect(addReview(mockVetId, mockReviewerId, mockReviewData))
        .rejects.toEqual(mockApiError);
    });

    it('should handle empty review data', async () => {
      localStorageMock.getItem.mockReturnValue(mockToken);
      api.post.mockResolvedValue(mockResponse);
      const emptyReviewData = {};

      const result = await addReview(mockVetId, mockReviewerId, emptyReviewData);

      expect(api.post).toHaveBeenCalledWith(
        `reviews/submit-review?vetId=${mockVetId}&reviewerId=${mockReviewerId}`,
        emptyReviewData,
        {
          headers: {
            Authorization: `Bearer ${mockToken}`
          }
        }
      );
      expect(result).toEqual(mockResponse.data);
    });
  });
});