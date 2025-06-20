import { getVeterinarians, findAvailableVeterinarians, getAllSpecializations } from '../../../components/veterinarian/VeterinarianService.js';
import { api } from '../../../components/utils/api.js';

jest.mock('../../../components/utils/api.js', () => ({
  api: {
    get: jest.fn(() => Promise.resolve({ data: [] })),
  }
}));

describe('VeterinarianService', () => {
  beforeEach(() => jest.clearAllMocks());

  test('getVeterinarians fetches vets', async () => {
    await getVeterinarians();
    expect(api.get).toHaveBeenCalledWith('/veterinarians/get-all-veterinarians');
  });

  test('findAvailableVeterinarians creates query', async () => {
    await findAvailableVeterinarians({ specialization: 'Surg' });
    expect(api.get).toHaveBeenCalledWith('/veterinarians/search-veterinarian?specialization=Surg');
  });

  test('getAllSpecializations fetches data', async () => {
    await getAllSpecializations();
    expect(api.get).toHaveBeenCalledWith('/veterinarians/vet/get-all-specialization');
  });
});
