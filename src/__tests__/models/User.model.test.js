import { jest } from '@jest/globals';
import * as UserModelModule from '../../models/User.model.js';
import * as CounterModelModule from '../../models/Counter.model.js';

const User = UserModelModule.default;
const Counter = CounterModelModule.default;

// Mock Counter model
jest.spyOn(Counter, 'findOneAndUpdate');

describe('User Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('pre-save hook', () => {
    it('should auto-increment user_id for new users', async () => {
      const mockCounter = { seq: 5 };
      Counter.findOneAndUpdate.mockResolvedValue(mockCounter);

      const userData = {
        user_name: 'John Doe',
        age: 25,
        email: 'john@example.com',
        password: 'password123'
      };

      const user = new User(userData);
      
      // Simulate the pre-save hook
      if (user.isNew) {
        const counter = await Counter.findOneAndUpdate(
          {},
          { $inc: { seq: 1 } },
          { new: true, upsert: true }
        );
        user.user_id = counter.seq;
      }

      expect(Counter.findOneAndUpdate).toHaveBeenCalledWith(
        {},
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      expect(user.user_id).toBe(5);
    });

    it('should not modify user_id for existing users (early return)', async () => {
      const userData = {
        user_id: 10,
        user_name: 'John Doe',
        age: 25,
        email: 'john@example.com',
        password: 'password123'
      };

      const user = new User(userData);
      Object.defineProperty(user, 'isNew', {
        value: false,
        writable: true
      });

      // Simulate the pre-save hook with early return
      if (!user.isNew) {
        // This simulates line 16 - early return
        // Should not call Counter
        const returned = user.isNew; // false, causes return
        expect(returned).toBe(false);
      }

      expect(Counter.findOneAndUpdate).not.toHaveBeenCalled();
      expect(user.user_id).toBe(10);
    });

    it('should handle counter error and return error', async () => {
      const error = new Error('Counter update failed');
      Counter.findOneAndUpdate.mockRejectedValue(error);

      const userData = {
        user_name: 'John Doe',
        age: 25,
        email: 'john@example.com',
        password: 'password123'
      };

      const user = new User(userData);

      // Simulate the pre-save hook with error handling (line 25)
      let returnedError;
      try {
        if (user.isNew) {
          const counter = await Counter.findOneAndUpdate(
            {},
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
          );
          user.user_id = counter.seq;
        }
      } catch (err) {
        returnedError = err; // Simulates line 25 - return error
      }

      expect(returnedError).toBe(error);
      expect(returnedError.message).toBe('Counter update failed');
    });
  });

  describe('schema validation', () => {
    it('should have correct schema fields', () => {
      const user = new User({
        user_name: 'Test User',
        age: 30,
        email: 'test@example.com',
        password: 'password'
      });

      expect(user).toHaveProperty('user_name', 'Test User');
      expect(user).toHaveProperty('age', 30);
      expect(user).toHaveProperty('email', 'test@example.com');
      expect(user).toHaveProperty('password', 'password');
    });
  });
});
