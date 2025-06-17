import { updateUserPhoto, uploadUserPhoto, deleteUserPhoto } from '../../../components/modals/ImageUploaderService';
import { api } from '../../../utils/api';

jest.mock('../../../utils/api');

describe('ImageUploaderService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('updateUserPhoto', () => {
    it('should update user photo successfully', async () => {
      const mockResponse = { data: { id: '123', url: 'updated-photo.jpg' } };
      api.put.mockResolvedValue(mockResponse);

      const photoId = '123';
      const photoData = new Uint8Array([1, 2, 3]);

      const result = await updateUserPhoto(photoId, photoData);

      expect(api.put).toHaveBeenCalledWith(
        `/photos/photo/${photoId}/update`,
        photoData,
        {
          headers: {
            "Content-Type": "application/octet-stream",
          },
        }
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw error when update fails', async () => {
      const mockError = new Error('Update failed');
      api.put.mockRejectedValue(mockError);

      const photoId = '123';
      const photoData = new Uint8Array([1, 2, 3]);

      await expect(updateUserPhoto(photoId, photoData)).rejects.toThrow('Update failed');
    });
  });

  describe('uploadUserPhoto', () => {
    it('should upload user photo successfully', async () => {
      const mockResponse = { data: { id: '456', url: 'new-photo.jpg' } };
      api.post.mockResolvedValue(mockResponse);

      const userId = 'user123';
      const photoData = new File(['photo'], 'photo.jpg', { type: 'image/jpeg' });

      const result = await uploadUserPhoto(userId, photoData);

      expect(api.post).toHaveBeenCalledWith('/photos/photo/upload', expect.any(FormData));
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw error when upload fails', async () => {
      const mockError = new Error('Upload failed');
      api.post.mockRejectedValue(mockError);

      const userId = 'user123';
      const photoData = new File(['photo'], 'photo.jpg', { type: 'image/jpeg' });

      await expect(uploadUserPhoto(userId, photoData)).rejects.toThrow('Upload failed');
    });
  });

  describe('deleteUserPhoto', () => {
    it('should delete user photo successfully', async () => {
      const mockResponse = { data: { success: true } };
      api.delete.mockResolvedValue(mockResponse);

      const photoId = '123';
      const userId = 'user123';

      const result = await deleteUserPhoto(photoId, userId);

      expect(api.delete).toHaveBeenCalledWith(`/photos/photo/${photoId}/${userId}/delete`);
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw error when delete fails', async () => {
      const mockError = new Error('Delete failed');
      api.delete.mockRejectedValue(mockError);

      const photoId = '123';
      const userId = 'user123';

      await expect(deleteUserPhoto(photoId, userId)).rejects.toThrow('Delete failed');
    });
  });
});