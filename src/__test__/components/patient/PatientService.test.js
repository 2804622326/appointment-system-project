import { getPatients } from '../../../components/patient/PatientService';
import { api } from '../../../utils/api';

jest.mock('../../../utils/api');

describe('PatientService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPatients', () => {
    it('should return patients data when API call is successful', async () => {
      const mockPatientsData = [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
      ];
      
      api.get.mockResolvedValue({ data: mockPatientsData });

      const result = await getPatients();

      expect(api.get).toHaveBeenCalledWith('/patients/get-all-patients');
      expect(result).toEqual(mockPatientsData);
    });

    it('should throw error when API call fails', async () => {
      const mockError = new Error('Network error');
      api.get.mockRejectedValue(mockError);

      await expect(getPatients()).rejects.toThrow('Network error');
      expect(api.get).toHaveBeenCalledWith('/patients/get-all-patients');
    });

    it('should call API with correct endpoint', async () => {
      api.get.mockResolvedValue({ data: [] });

      await getPatients();

      expect(api.get).toHaveBeenCalledTimes(1);
      expect(api.get).toHaveBeenCalledWith('/patients/get-all-patients');
    });
  });
});