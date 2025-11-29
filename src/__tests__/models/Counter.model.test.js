import { jest } from '@jest/globals';
import * as CounterModelModule from '../../models/Counter.model.js';

const Counter = CounterModelModule.default;

describe('Counter Model', () => {
  describe('Schema validation', () => {
    it('should have correct schema structure', () => {
      const schema = Counter.schema.obj;
      
      expect(schema).toHaveProperty('seq');
    });

    it('should have seq field of type Number', () => {
      const seqField = Counter.schema.obj.seq;
      
      expect(seqField).toBeDefined();
      expect(seqField.type).toBe(Number);
    });

    it('should have seq field with default value of 0', () => {
      const seqField = Counter.schema.obj.seq;
      
      expect(seqField.default).toBe(0);
    });
  });

  describe('Model name and collection', () => {
    it('should have correct model name', () => {
      expect(Counter.modelName).toBe('Counter');
    });

    it('should have correct collection name', () => {
      expect(Counter.collection.name).toBe('counters');
    });
  });

  describe('Counter functionality', () => {
    it('should be used for auto-incrementing user IDs', () => {
      // Counter model is typically used with findOneAndUpdate
      // to increment sequence numbers for user_id
      const schema = Counter.schema.obj;
      
      expect(schema.seq).toBeDefined();
      expect(schema.seq.type).toBe(Number);
    });
  });
});
