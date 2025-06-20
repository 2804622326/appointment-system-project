import {
  getUserById,
  registerUser,
  changeUserPassword,
  updateUser,
  deleteUser,
  countUsers
} from '../../../components/user/UserService.js';
import { api } from '../../../components/utils/api.js';

jest.mock('../../../components/utils/api.js', () => ({
  api: {
    get: jest.fn(() => Promise.resolve({ data: {} })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
    put: jest.fn(() => Promise.resolve({ data: {} })),
    delete: jest.fn(() => Promise.resolve({ data: {} })),
  },
}));

describe('UserService', () => {
  beforeEach(() => jest.clearAllMocks());

  test('getUserById calls api.get', async () => {
    await getUserById(1);
    expect(api.get).toHaveBeenCalledWith('/users/user/1');
  });

  test('registerUser posts to register endpoint', async () => {
    await registerUser({});
    expect(api.post).toHaveBeenCalledWith('/users/register', {});
  });

  test('changeUserPassword sends put', async () => {
    await changeUserPassword(1, 'a', 'b', 'b');
    expect(api.put).toHaveBeenCalledWith(
      '/users/user/1/change-password',
      { currentPassword: 'a', newPassword: 'b', confirmNewPassword: 'b' }
    );
  });

  test('updateUser calls api.put', async () => {
    await updateUser({ n: 1 }, 2);
    expect(api.put).toHaveBeenCalledWith('/users/user/2/update', { n: 1 });
  });

  test('deleteUser calls api.delete', async () => {
    await deleteUser(5);
    expect(api.delete).toHaveBeenCalledWith('/users/user/5/delete');
  });

  test('countUsers fetches count', async () => {
    await countUsers();
    expect(api.get).toHaveBeenCalledWith('/users/count/users');
  });
});
