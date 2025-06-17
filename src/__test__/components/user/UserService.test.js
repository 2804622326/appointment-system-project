import { api } from '../../../components/utils/api';
import {

getUserById,
registerUser,
changeUserPassword,
updateUser,
deleteUser,
countVeterinarians,
countPatients,
countUsers,
getAggregateUsersByMonthAndType,
getAggregatedUsersAccountByActiveStatus,
aggregateVetBySpecialization,
lockUserAccount,
unLockUserAccount
} from '../../../components/user/UserService';

jest.mock('../../../components/utils/api');

describe('UserService', () => {
beforeEach(() => {
  jest.clearAllMocks();
});

describe('getUserById', () => {
  it('should return user data when API call succeeds', async () => {
    const mockUser = { id: 1, name: 'John Doe' };
    api.get.mockResolvedValue({ data: mockUser });

    const result = await getUserById(1);

    expect(api.get).toHaveBeenCalledWith('/users/user/1');
    expect(result).toEqual(mockUser);
  });

  it('should throw error when API call fails', async () => {
    const mockError = new Error('User not found');
    api.get.mockRejectedValue(mockError);

    await expect(getUserById(1)).rejects.toThrow('User not found');
  });
});

describe('registerUser', () => {
  it('should return registered user data when API call succeeds', async () => {
    const mockUser = { name: 'John Doe', email: 'john@example.com' };
    const mockResponse = { id: 1, ...mockUser };
    api.post.mockResolvedValue({ data: mockResponse });

    const result = await registerUser(mockUser);

    expect(api.post).toHaveBeenCalledWith('/users/register', mockUser);
    expect(result).toEqual(mockResponse);
  });

  it('should throw error when registration fails', async () => {
    const mockError = new Error('Registration failed');
    api.post.mockRejectedValue(mockError);

    await expect(registerUser({})).rejects.toThrow('Registration failed');
  });
});

describe('changeUserPassword', () => {
  it('should change password successfully', async () => {
    const mockResponse = { message: 'Password changed successfully' };
    api.put.mockResolvedValue({ data: mockResponse });

    const result = await changeUserPassword(1, 'oldPass', 'newPass', 'newPass');

    expect(api.put).toHaveBeenCalledWith('/users/user/1/change-password', {
      currentPassword: 'oldPass',
      newPassword: 'newPass',
      confirmNewPassword: 'newPass'
    });
    expect(result).toEqual(mockResponse);
  });

  it('should throw error when password change fails', async () => {
    const mockError = new Error('Invalid current password');
    api.put.mockRejectedValue(mockError);

    await expect(changeUserPassword(1, 'wrong', 'new', 'new')).rejects.toThrow('Invalid current password');
  });
});

describe('updateUser', () => {
  it('should update user successfully', async () => {
    const userData = { name: 'Updated Name' };
    const mockResponse = { id: 1, ...userData };
    api.put.mockResolvedValue({ data: mockResponse });

    const result = await updateUser(userData, 1);

    expect(api.put).toHaveBeenCalledWith('/users/user/1/update', userData);
    expect(result).toEqual(mockResponse);
  });

  it('should throw error when update fails', async () => {
    const mockError = new Error('Update failed');
    api.put.mockRejectedValue(mockError);

    await expect(updateUser({}, 1)).rejects.toThrow('Update failed');
  });
});

describe('deleteUser', () => {
  it('should delete user successfully', async () => {
    const mockResponse = { message: 'User deleted successfully' };
    api.delete.mockResolvedValue({ data: mockResponse });

    const result = await deleteUser(1);

    expect(api.delete).toHaveBeenCalledWith('/users/user/1/delete');
    expect(result).toEqual(mockResponse);
  });

  it('should throw error when deletion fails', async () => {
    const mockError = new Error('Deletion failed');
    api.delete.mockRejectedValue(mockError);

    await expect(deleteUser(1)).rejects.toThrow('Deletion failed');
  });
});

describe('countVeterinarians', () => {
  it('should return veterinarian count', async () => {
    const mockCount = { count: 5 };
    api.get.mockResolvedValue({ data: mockCount });

    const result = await countVeterinarians();

    expect(api.get).toHaveBeenCalledWith('/users/count/veterinarians');
    expect(result).toEqual(mockCount);
  });

  it('should throw error when count fails', async () => {
    const mockError = new Error('Count failed');
    api.get.mockRejectedValue(mockError);

    await expect(countVeterinarians()).rejects.toThrow('Count failed');
  });
});

describe('countPatients', () => {
  it('should return patient count', async () => {
    const mockCount = { count: 10 };
    api.get.mockResolvedValue({ data: mockCount });
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    const result = await countPatients();

    expect(api.get).toHaveBeenCalledWith('/users/count/patients');
    expect(consoleSpy).toHaveBeenCalledWith('Patients :', mockCount);
    expect(result).toEqual(mockCount);

    consoleSpy.mockRestore();
  });

  it('should throw error when count fails', async () => {
    const mockError = new Error('Count failed');
    api.get.mockRejectedValue(mockError);

    await expect(countPatients()).rejects.toThrow('Count failed');
  });
});

describe('countUsers', () => {
  it('should return user count', async () => {
    const mockCount = { count: 15 };
    api.get.mockResolvedValue({ data: mockCount });

    const result = await countUsers();

    expect(api.get).toHaveBeenCalledWith('/users/count/users');
    expect(result).toEqual(mockCount);
  });

  it('should throw error when count fails', async () => {
    const mockError = new Error('Count failed');
    api.get.mockRejectedValue(mockError);

    await expect(countUsers()).rejects.toThrow('Count failed');
  });
});

describe('getAggregateUsersByMonthAndType', () => {
  it('should return aggregated users data', async () => {
    const mockData = [{ month: 'January', veterinarians: 5, patients: 10 }];
    api.get.mockResolvedValue({ data: mockData });

    const result = await getAggregateUsersByMonthAndType();

    expect(api.get).toHaveBeenCalledWith('/users/aggregated-users');
    expect(result).toEqual(mockData);
  });

  it('should throw error when aggregation fails', async () => {
    const mockError = new Error('Aggregation failed');
    api.get.mockRejectedValue(mockError);

    await expect(getAggregateUsersByMonthAndType()).rejects.toThrow('Aggregation failed');
  });
});

describe('getAggregatedUsersAccountByActiveStatus', () => {
  it('should return aggregated users by status', async () => {
    const mockData = { active: 10, inactive: 5 };
    api.get.mockResolvedValue({ data: mockData });

    const result = await getAggregatedUsersAccountByActiveStatus();

    expect(api.get).toHaveBeenCalledWith('/users/account/aggregated-by-status');
    expect(result).toEqual(mockData);
  });

  it('should throw error when aggregation fails', async () => {
    const mockError = new Error('Status aggregation failed');
    api.get.mockRejectedValue(mockError);

    await expect(getAggregatedUsersAccountByActiveStatus()).rejects.toThrow('Status aggregation failed');
  });
});

describe('aggregateVetBySpecialization', () => {
  it('should return veterinarians by specialization', async () => {
    const mockData = [{ specialization: 'Surgery', count: 3 }];
    api.get.mockResolvedValue({ data: mockData });

    const result = await aggregateVetBySpecialization();

    expect(api.get).toHaveBeenCalledWith('/veterinarians/vet/get-by-specialization');
    expect(result).toEqual(mockData);
  });

  it('should throw error when specialization aggregation fails', async () => {
    const mockError = new Error('Specialization aggregation failed');
    api.get.mockRejectedValue(mockError);

    await expect(aggregateVetBySpecialization()).rejects.toThrow('Specialization aggregation failed');
  });
});

describe('lockUserAccount', () => {
  it('should lock user account successfully', async () => {
    const mockResponse = { message: 'Account locked successfully' };
    api.put.mockResolvedValue({ data: mockResponse });

    const result = await lockUserAccount(1);

    expect(api.put).toHaveBeenCalledWith('/users/account/1/lock-user-account');
    expect(result).toEqual(mockResponse);
  });

  it('should throw error when locking fails', async () => {
    const mockError = new Error('Lock failed');
    api.put.mockRejectedValue(mockError);

    await expect(lockUserAccount(1)).rejects.toThrow('Lock failed');
  });
});

describe('unLockUserAccount', () => {
  it('should unlock user account successfully', async () => {
    const mockResponse = { message: 'Account unlocked successfully' };
    api.put.mockResolvedValue({ data: mockResponse });

    const result = await unLockUserAccount(1);

    expect(api.put).toHaveBeenCalledWith('/users/account/1/unLock-user-account');
    expect(result).toEqual(mockResponse);
  });

  it('should throw error when unlocking fails', async () => {
    const mockError = new Error('Unlock failed');
    api.put.mockRejectedValue(mockError);

    await expect(unLockUserAccount(1)).rejects.toThrow('Unlock failed');
  });
});
});