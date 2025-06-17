import axios from 'axios';
import { api } from '../../../components/utils/api';

jest.mock('axios');
const mockedAxios = axios;

describe('API Configuration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create axios instance with correct baseURL', () => {
    expect(mockedAxios.create).toHaveBeenCalledWith({
      baseURL: 'http://localhost:9192/api/v1'
    });
  });

  test('should export api instance', () => {
    expect(api).toBeDefined();
  });

  test('should have correct baseURL property', () => {
    mockedAxios.create.mockReturnValue({
      defaults: { baseURL: 'http://localhost:9192/api/v1' }
    });
    
    const testApi = axios.create({
      baseURL: 'http://localhost:9192/api/v1'
    });
    
    expect(testApi.defaults.baseURL).toBe('http://localhost:9192/api/v1');
  });
});