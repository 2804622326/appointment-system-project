import { getAllPetTypes, getAllPetColors, getAllPetBreeds, updatePet, deletePet, addPet } from '../../../components/pet/PetService';
import { api } from '../../../utils/api';

jest.mock('../../../utils/api');

describe('PetService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllPetTypes', () => {
    it('should return pet types data on successful API call', async () => {
      const mockData = ['Dog', 'Cat', 'Bird'];
      api.get.mockResolvedValue({ data: mockData });

      const result = await getAllPetTypes();

      expect(api.get).toHaveBeenCalledWith('/pets/get-types');
      expect(result).toEqual(mockData);
    });

    it('should throw error when API call fails', async () => {
      const mockError = new Error('API Error');
      api.get.mockRejectedValue(mockError);

      await expect(getAllPetTypes()).rejects.toThrow('API Error');
      expect(api.get).toHaveBeenCalledWith('/pets/get-types');
    });
  });

  describe('getAllPetColors', () => {
    it('should return pet colors data on successful API call', async () => {
      const mockData = ['Black', 'White', 'Brown'];
      api.get.mockResolvedValue({ data: mockData });

      const result = await getAllPetColors();

      expect(api.get).toHaveBeenCalledWith('/pets/get-pet-colors');
      expect(result).toEqual(mockData);
    });

    it('should throw error when API call fails', async () => {
      const mockError = new Error('API Error');
      api.get.mockRejectedValue(mockError);

      await expect(getAllPetColors()).rejects.toThrow('API Error');
      expect(api.get).toHaveBeenCalledWith('/pets/get-pet-colors');
    });
  });

  describe('getAllPetBreeds', () => {
    it('should return pet breeds data for given pet type', async () => {
      const mockData = ['Labrador', 'Golden Retriever'];
      const petType = 'Dog';
      api.get.mockResolvedValue({ data: mockData });

      const result = await getAllPetBreeds(petType);

      expect(api.get).toHaveBeenCalledWith(`/pets/get-pet-breeds?petType=${petType}`);
      expect(result).toEqual(mockData);
    });

    it('should throw error when API call fails', async () => {
      const mockError = new Error('API Error');
      api.get.mockRejectedValue(mockError);

      await expect(getAllPetBreeds('Dog')).rejects.toThrow('API Error');
    });
  });

  describe('updatePet', () => {
    it('should update pet and return response data', async () => {
      const petId = 123;
      const updatedPet = { name: 'Buddy', type: 'Dog' };
      const mockResponse = { data: { id: petId, ...updatedPet } };
      api.put.mockResolvedValue(mockResponse);

      const result = await updatePet(petId, updatedPet);

      expect(api.put).toHaveBeenCalledWith(`/pets/pet/${petId}/update`, updatedPet);
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw error when update fails', async () => {
      const mockError = new Error('Update failed');
      api.put.mockRejectedValue(mockError);

      await expect(updatePet(123, {})).rejects.toThrow('Update failed');
    });
  });

  describe('deletePet', () => {
    it('should delete pet and return response data', async () => {
      const petId = 123;
      const mockResponse = { data: { message: 'Pet deleted successfully' } };
      api.delete.mockResolvedValue(mockResponse);

      const result = await deletePet(petId);

      expect(api.delete).toHaveBeenCalledWith(`/pets/pet/${petId}/delete`);
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw error when delete fails', async () => {
      const mockError = new Error('Delete failed');
      api.delete.mockRejectedValue(mockError);

      await expect(deletePet(123)).rejects.toThrow('Delete failed');
    });
  });

  describe('addPet', () => {
    it('should add single pet with correct headers', async () => {
      const appointmentId = 456;
      const petData = { name: 'Max', type: 'Dog' };
      const mockResponse = { data: { success: true } };
      api.put.mockResolvedValue(mockResponse);

      const result = await addPet(appointmentId, petData);

      expect(api.put).toHaveBeenCalledWith(
        `/pets/save-pets?appointmentId=${appointmentId}`,
        [petData],
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should add multiple pets when array is provided', async () => {
      const appointmentId = 456;
      const petsArray = [
        { name: 'Max', type: 'Dog' },
        { name: 'Whiskers', type: 'Cat' }
      ];
      const mockResponse = { data: { success: true } };
      api.put.mockResolvedValue(mockResponse);

      const result = await addPet(appointmentId, petsArray);

      expect(api.put).toHaveBeenCalledWith(
        `/pets/save-pets?appointmentId=${appointmentId}`,
        petsArray,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw error when add pet fails', async () => {
      const mockError = new Error('Add pet failed');
      api.put.mockRejectedValue(mockError);

      await expect(addPet(456, {})).rejects.toThrow('Add pet failed');
    });
  });
});