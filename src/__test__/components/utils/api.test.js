import { api } from '../../../components/utils/api.js';

test('api instance has correct baseURL', () => {
  expect(api.defaults.baseURL).toBe('http://localhost:9192/api/v1');
});
