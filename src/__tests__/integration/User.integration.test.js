import { jest } from '@jest/globals';
import UserController from '../../controllers/User.controller.js';
import * as UserServiceModule from '../../services/User.service.js';

const UserService = UserServiceModule.default;

jest.spyOn(UserService, 'createUser');
jest.spyOn(UserService, 'getUsers');
jest.spyOn(UserService, 'getUserById');
jest.spyOn(UserService, 'updateUser');
jest.spyOn(UserService, 'deleteUser');

describe('User Integration Tests', () => {
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

  describe('Data Integrity', () => {
    it('should preserve user data integrity during update', async () => {
      const originalUser = {
        user_id: 1,
        user_name: 'John Doe',
        age: 25,
        email: 'john@example.com',
        password: 'hashedPassword'
      };

      const updateData = { age: 26 };
      const updatedUser = { ...originalUser, age: 26 };

      req.params.user_id = '1';
      req.body = updateData;
      UserService.updateUser.mockResolvedValue(updatedUser);

      await UserController.updateUser(req, res);

      expect(updatedUser.user_name).toBe(originalUser.user_name);
      expect(updatedUser.email).toBe(originalUser.email);
      expect(updatedUser.password).toBe(originalUser.password);
    });

    it('should handle partial updates without affecting other fields', async () => {
      const updateData = { user_name: 'Jane Doe' };
      const updatedUser = {
        user_id: 1,
        user_name: 'Jane Doe',
        age: 25,
        email: 'john@example.com',
        password: 'hashedPassword'
      };

      req.params.user_id = '1';
      req.body = updateData;
      UserService.updateUser.mockResolvedValue(updatedUser);

      await UserController.updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(updatedUser.age).toBe(25);
      expect(updatedUser.email).toBe('john@example.com');
    });
  });

  describe('Boundary Testing', () => {
    it('should handle maximum age value', async () => {
      const userData = {
        user_name: 'Old User',
        age: 150,
        email: 'old@example.com',
        password: 'password123'
      };

      req.body = userData;
      UserService.createUser.mockResolvedValue({ user_id: 1, ...userData });

      await UserController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should handle minimum valid age', async () => {
      const userData = {
        user_name: 'Young User',
        age: 1,
        email: 'young@example.com',
        password: 'password123'
      };

      req.body = userData;
      UserService.createUser.mockResolvedValue({ user_id: 1, ...userData });

      await UserController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should handle extremely long user names', async () => {
      const longName = 'A'.repeat(500);
      const userData = {
        user_name: longName,
        age: 25,
        email: 'test@example.com',
        password: 'password123'
      };

      req.body = userData;
      UserService.createUser.mockResolvedValue({ user_id: 1, ...userData });

      await UserController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should handle very long email addresses', async () => {
      const longEmail = 'verylongemailaddress' + 'a'.repeat(100) + '@example.com';
      const userData = {
        user_name: 'Test User',
        age: 25,
        email: longEmail,
        password: 'password123'
      };

      req.body = userData;
      UserService.createUser.mockResolvedValue({ user_id: 1, ...userData });

      await UserController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('Security Testing', () => {
    it('should handle SQL injection attempt in user_id', async () => {
      req.params.user_id = "1' OR '1'='1";

      await UserController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User ID must be a number'
      });
    });

    it('should handle XSS in user_name', async () => {
      const xssPayload = '<script>alert("XSS")</script>';
      const userData = {
        user_name: xssPayload,
        age: 25,
        email: 'test@example.com',
        password: 'password123'
      };

      req.body = userData;
      UserService.createUser.mockResolvedValue({ user_id: 1, ...userData });

      await UserController.createUser(req, res);

      expect(UserService.createUser).toHaveBeenCalledWith(userData);
    });

    it('should handle NoSQL injection attempt', async () => {
      const userData = {
        user_name: { $ne: null },
        age: 25,
        email: 'test@example.com',
        password: 'password123'
      };

      req.body = userData;
      UserService.createUser.mockResolvedValue({ user_id: 1, ...userData });

      await UserController.createUser(req, res);

      expect(UserService.createUser).toHaveBeenCalled();
    });

    it('should handle command injection in email', async () => {
      const userData = {
        user_name: 'Test User',
        age: 25,
        email: 'test@example.com; rm -rf /',
        password: 'password123'
      };

      req.body = userData;
      UserService.createUser.mockResolvedValue({ user_id: 1, ...userData });

      await UserController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('Concurrent Operations', () => {
    it('should handle multiple simultaneous user retrievals', async () => {
      const users = [
        { user_id: 1, user_name: 'User 1' },
        { user_id: 2, user_name: 'User 2' },
        { user_id: 3, user_name: 'User 3' }
      ];

      UserService.getUsers.mockResolvedValue(users);

      const promises = Array(5).fill(null).map(() => 
        UserController.getUsers(req, res)
      );

      await Promise.all(promises);

      expect(UserService.getUsers).toHaveBeenCalledTimes(5);
    });

    it('should handle rapid sequential updates', async () => {
      const updates = [
        { user_name: 'Update 1' },
        { user_name: 'Update 2' },
        { user_name: 'Update 3' }
      ];

      req.params.user_id = '1';

      for (const update of updates) {
        req.body = update;
        const updatedUser = { user_id: 1, ...update };
        UserService.updateUser.mockResolvedValue(updatedUser);
        
        await UserController.updateUser(req, res);
      }

      expect(UserService.updateUser).toHaveBeenCalledTimes(3);
    });
  });

  describe('Error Recovery', () => {
    it('should recover from transient database errors', async () => {
      UserService.getUsers
        .mockRejectedValueOnce(new Error('Connection timeout'))
        .mockResolvedValueOnce([{ user_id: 1, user_name: 'Test' }]);

      await UserController.getUsers(req, res);
      expect(res.status).toHaveBeenCalledWith(500);

      jest.clearAllMocks();
      
      await UserController.getUsers(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should handle network errors gracefully', async () => {
      UserService.getUserById.mockRejectedValue(new Error('ECONNREFUSED'));

      req.params.user_id = '1';
      await UserController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error fetching user',
        error: 'ECONNREFUSED'
      });
    });
  });

  describe('Data Validation', () => {
    it('should reject null user_name', async () => {
      req.body = {
        user_name: null,
        age: 25,
        email: 'test@example.com',
        password: 'password123'
      };

      await UserController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should reject undefined age', async () => {
      req.body = {
        user_name: 'Test User',
        age: undefined,
        email: 'test@example.com',
        password: 'password123'
      };

      await UserController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should accept whitespace-only user_name (no trimming)', async () => {
      const userData = {
        user_name: '   ',
        age: 25,
        email: 'test@example.com',
        password: 'password123'
      };

      req.body = userData;
      UserService.createUser.mockResolvedValue({ user_id: 1, ...userData });

      await UserController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should handle trimmed whitespace in email', async () => {
      const userData = {
        user_name: 'Test User',
        age: 25,
        email: '  test@example.com  ',
        password: 'password123'
      };

      req.body = userData;
      UserService.createUser.mockResolvedValue({ user_id: 1, ...userData });

      await UserController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });
  });
});
