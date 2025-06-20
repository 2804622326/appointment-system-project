import { api } from '../../../components/utils/api.js';
import { updateUserPhoto, uploadUserPhoto, deleteUserPhoto } from '../../../components/modals/ImageUploaderService.jsx';

jest.mock('../../../components/utils/api.js', () => ({
  api: { put: jest.fn(), post: jest.fn(), delete: jest.fn() },
}));

test('update user photo', async () => {
  api.put.mockResolvedValue({ data: 'u' });
  await expect(updateUserPhoto(1, 'd')).resolves.toBe('u');
});

test('upload user photo', async () => {
  api.post.mockResolvedValue({ data: 'p' });
  await expect(uploadUserPhoto(2, 'f')).resolves.toBe('p');
});

test('delete user photo', async () => {
  api.delete.mockResolvedValue({ data: 'd' });
  await expect(deleteUserPhoto(1, 2)).resolves.toBe('d');
});
