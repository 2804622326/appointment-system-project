import { getVeterinarians, findAvailableVeterinarians, getAllSpecializations } from '../../../components/veterinarian/VeterinarianService';
import { api } from '../../../utils/api';

jest.mock('../../../utils/api');

describe('VeterinarianService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getVeterinarians', () => {
    it('should return veterinarians data on successful API call', async () => {
      const mockData = [
        { id: 1, name: 'Dr. Smith', specialization: 'Surgery' },
        { id: 2, name: 'Dr. Johnson', specialization: 'Dentistry' }
      ];
      api.get.mockResolvedValue({ data: mockData });

      const result = await getVeterinarians();

      expect(api.get).toHaveBeenCalledWith('/veterinarians/get-all-veterinarians');
      expect(result).toEqual(mockData);
    });

    it('should throw error when API call fails', async () => {
      const mockError = new Error('Network error');
      api.get.mockRejectedValue(mockError);

      await expect(getVeterinarians()).rejects.toThrow('Network error');
      expect(api.get).toHaveBeenCalledWith('/veterinarians/get-all-veterinarians');
    });
  });

  describe('findAvailableVeterinarians', () => {
    it('should return available veterinarians with search params', async () => {
      const mockData = [{ id: 1, name: 'Dr. Available', available: true }];
      const searchParams = { specialization: 'Surgery', date: '2023-12-01' };
      api.get.mockResolvedValue({ data: mockData });

      const result = await findAvailableVeterinarians(searchParams);

      expect(api.get).toHaveBeenCalledWith('/veterinarians/search-veterinarian?specialization=Surgery&date=2023-12-01');
      expect(result).toEqual(mockData);
    });

    it('should handle empty search params', async () => {
      const mockData = [];
      api.get.mockResolvedValue({ data: mockData });

      const result = await findAvailableVeterinarians({});

      expect(api.get).toHaveBeenCalledWith('/veterinarians/search-veterinarian?');
      expect(result).toEqual(mockData);
    });

    it('should throw error when search API call fails', async () => {
      const mockError = new Error('Search failed');
      api.get.mockRejectedValue(mockError);

      await expect(findAvailableVeterinarians({ date: '2023-12-01' })).rejects.toThrow('Search failed');
    });
  });

  describe('getAllSpecializations', () => {
    it('should return all specializations on successful API call', async () => {
      const mockSpecializations = ['Surgery', 'Dentistry', 'Cardiology'];
      api.get.mockResolvedValue({ data: mockSpecializations });

      const result = await getAllSpecializations();

      expect(api.get).toHaveBeenCalledWith('/veterinarians/vet/get-all-specialization');
      expect(result).toEqual(mockSpecializations);
    });

    it('should throw error when specializations API call fails', async () => {
      const mockError = new Error('Failed to fetch specializations');
      api.get.mockRejectedValue(mockError);

      await expect(getAllSpecializations()).rejects.toThrow('Failed to fetch specializations');
      expect(api.get).toHaveBeenCalledWith('/veterinarians/vet/get-all-specialization');
    });
  });
});