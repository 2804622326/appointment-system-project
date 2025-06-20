import { getAllPetTypes, getAllPetColors, getAllPetBreeds, updatePet, deletePet, addPet } from '../../../components/pet/PetService.js';
import { api } from '../../../components/utils/api.js';

jest.mock('../../../components/utils/api.js', () => ({
  api: {
    get: jest.fn(() => Promise.resolve({ data: [] })),
    put: jest.fn(() => Promise.resolve({ data: {} })),
    delete: jest.fn(() => Promise.resolve({ data: {} })),
  }
}));

describe('PetService', () => {
  beforeEach(() => jest.clearAllMocks());

  test('getAllPetTypes calls api', async () => {
    await getAllPetTypes();
    expect(api.get).toHaveBeenCalledWith('/pets/get-types');
  });

  test('getAllPetColors fetches colors', async () => {
    await getAllPetColors();
    expect(api.get).toHaveBeenCalledWith('/pets/get-pet-colors');
  });

  test('getAllPetBreeds fetches breeds', async () => {
    await getAllPetBreeds('Dog');
    expect(api.get).toHaveBeenCalledWith('/pets/get-pet-breeds?petType=Dog');
  });

  test('updatePet sends put', async () => {
    await updatePet(1, { n: 1 });
    expect(api.put).toHaveBeenCalledWith('/pets/pet/1/update', { n: 1 });
  });

  test('deletePet sends delete', async () => {
    await deletePet(2);
    expect(api.delete).toHaveBeenCalledWith('/pets/pet/2/delete');
  });

  test('addPet sends put with array', async () => {
    await addPet(3, { id: 1 });
    expect(api.put).toHaveBeenCalled();
  });
});
