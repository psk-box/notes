import { jest } from '@jest/globals';
import * as NotesModelModule from '../../models/Notes.model.js';

const Notes = NotesModelModule.default;

describe('Notes Model', () => {
  describe('Schema validation', () => {
    it('should have correct schema structure', () => {
      const schema = Notes.schema.obj;
      
      expect(schema).toHaveProperty('id');
      expect(schema).toHaveProperty('user_id');
      expect(schema).toHaveProperty('content');
      expect(schema).toHaveProperty('createdAt');
    });

    it('should have user_id field of type Number', () => {
      const userIdField = Notes.schema.obj.user_id;
      
      expect(userIdField).toBeDefined();
      expect(userIdField.type).toBe(Number);
    });

    it('should have content field of type String', () => {
      const contentField = Notes.schema.obj.content;
      
      expect(contentField).toBeDefined();
      expect(contentField.type).toBe(String);
    });

    it('should have id field as ObjectId', () => {
      const idField = Notes.schema.obj.id;
      
      expect(idField).toBeDefined();
      expect(idField.auto).toBe(true);
    });

    it('should have required fields', () => {
      const schema = Notes.schema.obj;
      
      expect(schema.user_id.required).toBe(true);
      expect(schema.content.required).toBe(true);
    });

    it('should have default timestamp for createdAt', () => {
      const createdAtField = Notes.schema.obj.createdAt;
      
      expect(createdAtField).toBeDefined();
      expect(createdAtField.default).toBe(Date.now);
    });
  });

  describe('Model name and collection', () => {
    it('should have correct model name', () => {
      expect(Notes.modelName).toBe('Notes');
    });

    it('should have correct collection name', () => {
      expect(Notes.collection.name).toBe('notes');
    });
  });
});
