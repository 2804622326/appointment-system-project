import { getPatients } from '../../../components/patient/PatientService.js';
import { api } from '../../../components/utils/api.js';

jest.mock('../../../components/utils/api.js', () => ({
  api: { get: jest.fn(() => Promise.resolve({ data: [] })) }
}));

describe('PatientService', () => {
  beforeEach(() => jest.clearAllMocks());

  test('getPatients fetches patient list', async () => {
    await getPatients();
    expect(api.get).toHaveBeenCalledWith('/patients/get-all-patients');
  });
});
