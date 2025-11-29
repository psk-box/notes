import { jest } from '@jest/globals';
import UserService from '../../services/User.service.js';
import * as UserModelModule from '../../models/User.model.js';

const User = UserModelModule.default;

// Spy on User model methods
jest.spyOn(User, 'find');
jest.spyOn(User, 'findOne');
jest.spyOn(User, 'findOneAndUpdate');
jest.spyOn(User, 'findOneAndDelete');

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { user_id: 1, user_name: 'John Doe', age: 25, email: 'john@example.com' },
        { user_id: 2, user_name: 'Jane Doe', age: 30, email: 'jane@example.com' }
      ];

      User.find.mockResolvedValue(mockUsers);

      const result = await UserService.getUsers();

      expect(User.find).toHaveBeenCalledWith({});
      expect(result).toEqual(mockUsers);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no users exist', async () => {
      User.find.mockResolvedValue([]);

      const result = await UserService.getUsers();

      expect(User.find).toHaveBeenCalledWith({});
      expect(result).toEqual([]);
    });

    it('should throw error when find fails', async () => {
      User.find.mockRejectedValue(new Error('Database error'));

      await expect(UserService.getUsers()).rejects.toThrow('Database error');
    });
  });

  describe('getUserById', () => {
    it('should return a user by ID', async () => {
      const mockUser = {
        user_id: 1,
        user_name: 'John Doe',
        age: 25,
        email: 'john@example.com'
      };

      User.findOne.mockResolvedValue(mockUser);

      const result = await UserService.getUserById(1);

      expect(User.findOne).toHaveBeenCalledWith({ user_id: 1 });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user is not found', async () => {
      User.findOne.mockResolvedValue(null);

      const result = await UserService.getUserById(999);

      expect(User.findOne).toHaveBeenCalledWith({ user_id: 999 });
      expect(result).toBeNull();
    });

    it('should throw error when findOne fails', async () => {
      User.findOne.mockRejectedValue(new Error('Database error'));

      await expect(UserService.getUserById(1)).rejects.toThrow('Database error');
    });
  });

  describe('updateUser', () => {
    it('should update a user successfully', async () => {
      const updateData = { user_name: 'John Updated', age: 26 };
      const updatedUser = {
        user_id: 1,
        user_name: 'John Updated',
        age: 26,
        email: 'john@example.com'
      };

      User.findOneAndUpdate.mockResolvedValue(updatedUser);

      const result = await UserService.updateUser(1, updateData);

      expect(User.findOneAndUpdate).toHaveBeenCalledWith(
        { user_id: 1 },
        updateData,
        { new: true }
      );
      expect(result).toEqual(updatedUser);
    });

    it('should return null when user to update is not found', async () => {
      const updateData = { user_name: 'John Updated' };
      User.findOneAndUpdate.mockResolvedValue(null);

      const result = await UserService.updateUser(999, updateData);

      expect(User.findOneAndUpdate).toHaveBeenCalledWith(
        { user_id: 999 },
        updateData,
        { new: true }
      );
      expect(result).toBeNull();
    });

    it('should throw error when update fails', async () => {
      const updateData = { user_name: 'John Updated' };
      User.findOneAndUpdate.mockRejectedValue(new Error('Update failed'));

      await expect(UserService.updateUser(1, updateData)).rejects.toThrow('Update failed');
    });
  });

  describe('deleteUser', () => {
    it('should delete a user successfully', async () => {
      const deletedUser = {
        user_id: 1,
        user_name: 'John Doe',
        age: 25,
        email: 'john@example.com'
      };

      User.findOneAndDelete.mockResolvedValue(deletedUser);

      const result = await UserService.deleteUser(1);

      expect(User.findOneAndDelete).toHaveBeenCalledWith({ user_id: 1 });
      expect(result).toEqual(deletedUser);
    });

    it('should return null when user to delete is not found', async () => {
      User.findOneAndDelete.mockResolvedValue(null);

      const result = await UserService.deleteUser(999);

      expect(User.findOneAndDelete).toHaveBeenCalledWith({ user_id: 999 });
      expect(result).toBeNull();
    });

    it('should throw error when delete fails', async () => {
      User.findOneAndDelete.mockRejectedValue(new Error('Delete failed'));

      await expect(UserService.deleteUser(1)).rejects.toThrow('Delete failed');
    });
  });
});
