import { jest } from '@jest/globals';
import UserController from '../../controllers/User.controller.js';
import * as UserServiceModule from '../../services/User.service.js';

const UserService = UserServiceModule.default;

// Spy on all UserService methods
jest.spyOn(UserService, 'createUser');
jest.spyOn(UserService, 'getUsers');
jest.spyOn(UserService, 'getUserById');
jest.spyOn(UserService, 'updateUser');
jest.spyOn(UserService, 'deleteUser');

describe('UserController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const userData = {
        user_name: 'John Doe',
        age: 25,
        email: 'john@example.com',
        password: 'password123'
      };
      const createdUser = { user_id: 1, ...userData };

      req.body = userData;
      UserService.createUser.mockResolvedValue(createdUser);

      await UserController.createUser(req, res);

      expect(UserService.createUser).toHaveBeenCalledWith(userData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User created successfully',
        user: createdUser
      });
    });

    it('should return 400 when user_name is missing', async () => {
      req.body = {
        age: 25,
        email: 'john@example.com',
        password: 'password123'
      };

      await UserController.createUser(req, res);

      expect(UserService.createUser).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Missing required fields'
      });
    });

    it('should return 400 when age is missing', async () => {
      req.body = {
        user_name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      };

      await UserController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Missing required fields'
      });
    });

    it('should return 400 when email is missing', async () => {
      req.body = {
        user_name: 'John Doe',
        age: 25,
        password: 'password123'
      };

      await UserController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Missing required fields'
      });
    });

    it('should return 400 when password is missing', async () => {
      req.body = {
        user_name: 'John Doe',
        age: 25,
        email: 'john@example.com'
      };

      await UserController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Missing required fields'
      });
    });

    it('should return 500 when service throws an error', async () => {
      req.body = {
        user_name: 'John Doe',
        age: 25,
        email: 'john@example.com',
        password: 'password123'
      };

      const error = new Error('Database error');
      UserService.createUser.mockRejectedValue(error);

      await UserController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error creating user',
        error: 'Database error'
      });
    });
  });

  describe('getUsers', () => {
    it('should return all users successfully', async () => {
      const users = [
        { user_id: 1, user_name: 'John Doe', age: 25, email: 'john@example.com' },
        { user_id: 2, user_name: 'Jane Doe', age: 30, email: 'jane@example.com' }
      ];

      UserService.getUsers.mockResolvedValue(users);

      await UserController.getUsers(req, res);

      expect(UserService.getUsers).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(users);
    });

    it('should return empty array when no users exist', async () => {
      UserService.getUsers.mockResolvedValue([]);

      await UserController.getUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([]);
    });

    it('should return 500 when service throws an error', async () => {
      const error = new Error('Database error');
      UserService.getUsers.mockRejectedValue(error);

      await UserController.getUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error fetching users',
        error: 'Database error'
      });
    });
  });

  describe('getUserById', () => {
    it('should return a user by ID successfully', async () => {
      const user = {
        user_id: 1,
        user_name: 'John Doe',
        age: 25,
        email: 'john@example.com'
      };

      req.params.user_id = '1';
      UserService.getUserById.mockResolvedValue(user);

      await UserController.getUserById(req, res);

      expect(UserService.getUserById).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(user);
    });

    it('should return 400 when user_id is missing', async () => {
      req.params.user_id = undefined;

      await UserController.getUserById(req, res);

      expect(UserService.getUserById).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User ID is required'
      });
    });

    it('should return 400 when user_id is not a number', async () => {
      req.params.user_id = 'abc';

      await UserController.getUserById(req, res);

      expect(UserService.getUserById).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User ID must be a number'
      });
    });

    it('should return 404 when user is not found', async () => {
      req.params.user_id = '999';
      UserService.getUserById.mockResolvedValue(null);

      await UserController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User not found'
      });
    });

    it('should return 500 when service throws an error', async () => {
      req.params.user_id = '1';
      const error = new Error('Database error');
      UserService.getUserById.mockRejectedValue(error);

      await UserController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error fetching user',
        error: 'Database error'
      });
    });
  });

  describe('updateUser', () => {
    it('should update a user successfully', async () => {
      const updateData = { user_name: 'John Updated' };
      const updatedUser = {
        user_id: 1,
        user_name: 'John Updated',
        age: 25,
        email: 'john@example.com'
      };

      req.params.user_id = '1';
      req.body = updateData;
      UserService.updateUser.mockResolvedValue(updatedUser);

      await UserController.updateUser(req, res);

      expect(UserService.updateUser).toHaveBeenCalledWith('1', updateData);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User updated successfully',
        user: updatedUser
      });
    });

    it('should return 404 when user is not found', async () => {
      req.params.user_id = '999';
      req.body = { user_name: 'John Updated' };
      UserService.updateUser.mockResolvedValue(null);

      await UserController.updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User not found'
      });
    });

    it('should return 500 when service throws an error', async () => {
      req.params.user_id = '1';
      req.body = { user_name: 'John Updated' };
      const error = new Error('Database error');
      UserService.updateUser.mockRejectedValue(error);

      await UserController.updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error updating user',
        error: 'Database error'
      });
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

      req.params.user_id = '1';
      UserService.deleteUser.mockResolvedValue(deletedUser);

      await UserController.deleteUser(req, res);

      expect(UserService.deleteUser).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User deleted successfully'
      });
    });

    it('should return 404 when user is not found', async () => {
      req.params.user_id = '999';
      UserService.deleteUser.mockResolvedValue(null);

      await UserController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User not found'
      });
    });

    it('should return 500 when service throws an error', async () => {
      req.params.user_id = '1';
      const error = new Error('Database error');
      UserService.deleteUser.mockRejectedValue(error);

      await UserController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error deleting user',
        error: 'Database error'
      });
    });
  });
});
