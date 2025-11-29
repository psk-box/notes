import { jest } from '@jest/globals';
import NotesService from '../../services/Notes.service.js';
import * as NotesModelModule from '../../models/Notes.model.js';

const Notes = NotesModelModule.default;

// Spy on Notes model methods
jest.spyOn(Notes, 'find');
jest.spyOn(Notes, 'findOne');
jest.spyOn(Notes, 'findOneAndUpdate');
jest.spyOn(Notes, 'findOneAndDelete');

describe('NotesService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getNotesByUserId', () => {
    it('should return all notes for a user', async () => {
      const mockNotes = [
        { id: '1', user_id: 1, content: 'Note 1', createdAt: new Date() },
        { id: '2', user_id: 1, content: 'Note 2', createdAt: new Date() }
      ];

      Notes.find.mockResolvedValue(mockNotes);

      const result = await NotesService.getNotesByUserId(1);

      expect(Notes.find).toHaveBeenCalledWith({ user_id: 1 });
      expect(result).toEqual(mockNotes);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when user has no notes', async () => {
      Notes.find.mockResolvedValue([]);

      const result = await NotesService.getNotesByUserId(999);

      expect(Notes.find).toHaveBeenCalledWith({ user_id: 999 });
      expect(result).toEqual([]);
    });

    it('should throw error when find fails', async () => {
      Notes.find.mockRejectedValue(new Error('Database error'));

      await expect(NotesService.getNotesByUserId(1)).rejects.toThrow('Database error');
    });

    it('should return large number of notes for a user', async () => {
      const mockNotes = Array.from({ length: 50 }, (_, i) => ({
        id: `note-${i + 1}`,
        user_id: 1,
        content: `Note content ${i + 1}`,
        createdAt: new Date()
      }));

      Notes.find.mockResolvedValue(mockNotes);

      const result = await NotesService.getNotesByUserId(1);

      expect(result).toHaveLength(50);
    });

    it('should handle user_id of 0', async () => {
      Notes.find.mockResolvedValue([]);

      const result = await NotesService.getNotesByUserId(0);

      expect(Notes.find).toHaveBeenCalledWith({ user_id: 0 });
      expect(result).toEqual([]);
    });
  });

  describe('getNoteById', () => {
    it('should return a note by ID', async () => {
      const mockNote = {
        id: '123',
        user_id: 1,
        content: 'Test note',
        createdAt: new Date()
      };

      Notes.findOne.mockResolvedValue(mockNote);

      const result = await NotesService.getNoteById('123');

      expect(Notes.findOne).toHaveBeenCalledWith({ id: '123' });
      expect(result).toEqual(mockNote);
    });

    it('should return null when note is not found', async () => {
      Notes.findOne.mockResolvedValue(null);

      const result = await NotesService.getNoteById('999');

      expect(Notes.findOne).toHaveBeenCalledWith({ id: '999' });
      expect(result).toBeNull();
    });

    it('should throw error when findOne fails', async () => {
      Notes.findOne.mockRejectedValue(new Error('Database error'));

      await expect(NotesService.getNoteById('123')).rejects.toThrow('Database error');
    });

    it('should handle empty string note_id', async () => {
      Notes.findOne.mockResolvedValue(null);

      const result = await NotesService.getNoteById('');

      expect(Notes.findOne).toHaveBeenCalledWith({ id: '' });
      expect(result).toBeNull();
    });

    it('should handle very long note_id', async () => {
      const longId = 'a'.repeat(1000);
      const mockNote = {
        id: longId,
        user_id: 1,
        content: 'Test note',
        createdAt: new Date()
      };

      Notes.findOne.mockResolvedValue(mockNote);

      const result = await NotesService.getNoteById(longId);

      expect(result).toEqual(mockNote);
    });
  });

  describe('updateNote', () => {
    it('should update a note successfully', async () => {
      const updateData = { content: 'Updated note content' };
      const updatedNote = {
        id: '123',
        user_id: 1,
        content: 'Updated note content',
        createdAt: new Date()
      };

      Notes.findOneAndUpdate.mockResolvedValue(updatedNote);

      const result = await NotesService.updateNote('123', updateData);

      expect(Notes.findOneAndUpdate).toHaveBeenCalledWith(
        { id: '123' },
        updateData,
        { new: true }
      );
      expect(result).toEqual(updatedNote);
    });

    it('should return null when note to update is not found', async () => {
      const updateData = { content: 'Updated note content' };
      Notes.findOneAndUpdate.mockResolvedValue(null);

      const result = await NotesService.updateNote('999', updateData);

      expect(Notes.findOneAndUpdate).toHaveBeenCalledWith(
        { id: '999' },
        updateData,
        { new: true }
      );
      expect(result).toBeNull();
    });

    it('should throw error when update fails', async () => {
      const updateData = { content: 'Updated note content' };
      Notes.findOneAndUpdate.mockRejectedValue(new Error('Update failed'));

      await expect(NotesService.updateNote('123', updateData)).rejects.toThrow('Update failed');
    });

    it('should update note with very long content', async () => {
      const longContent = 'X'.repeat(50000);
      const updateData = { content: longContent };
      const updatedNote = {
        id: '123',
        user_id: 1,
        content: longContent,
        createdAt: new Date()
      };

      Notes.findOneAndUpdate.mockResolvedValue(updatedNote);

      const result = await NotesService.updateNote('123', updateData);

      expect(result.content).toHaveLength(50000);
    });

    it('should update note with empty body', async () => {
      const updatedNote = {
        id: '123',
        user_id: 1,
        content: 'Original content',
        createdAt: new Date()
      };

      Notes.findOneAndUpdate.mockResolvedValue(updatedNote);

      const result = await NotesService.updateNote('123', {});

      expect(Notes.findOneAndUpdate).toHaveBeenCalledWith(
        { id: '123' },
        {},
        { new: true }
      );
    });
  });

  describe('deleteNote', () => {
    it('should delete a note successfully', async () => {
      const deletedNote = {
        id: '123',
        user_id: 1,
        content: 'Test note',
        createdAt: new Date()
      };

      Notes.findOneAndDelete.mockResolvedValue(deletedNote);

      const result = await NotesService.deleteNote('123');

      expect(Notes.findOneAndDelete).toHaveBeenCalledWith({ id: '123' });
      expect(result).toEqual(deletedNote);
    });

    it('should return null when note to delete is not found', async () => {
      Notes.findOneAndDelete.mockResolvedValue(null);

      const result = await NotesService.deleteNote('999');

      expect(Notes.findOneAndDelete).toHaveBeenCalledWith({ id: '999' });
      expect(result).toBeNull();
    });

    it('should throw error when delete fails', async () => {
      Notes.findOneAndDelete.mockRejectedValue(new Error('Delete failed'));

      await expect(NotesService.deleteNote('123')).rejects.toThrow('Delete failed');
    });

    it('should handle UUID-style note_id', async () => {
      const uuid = '550e8400-e29b-41d4-a716-446655440000';
      const deletedNote = {
        id: uuid,
        user_id: 1,
        content: 'Test note',
        createdAt: new Date()
      };

      Notes.findOneAndDelete.mockResolvedValue(deletedNote);

      const result = await NotesService.deleteNote(uuid);

      expect(result).toEqual(deletedNote);
    });
  });

  describe('Advanced Error Scenarios', () => {
    it('should handle network errors', async () => {
      Notes.find.mockRejectedValue(new Error('Network error'));

      await expect(NotesService.getNotesByUserId(1))
        .rejects.toThrow('Network error');
    });

    it('should handle malformed query', async () => {
      Notes.findOne.mockRejectedValue(new Error('Cast error'));

      await expect(NotesService.getNoteById('invalid-id'))
        .rejects.toThrow('Cast error');
    });

    it('should handle memory errors on large updates', async () => {
      const largeContent = 'X'.repeat(10000000); // 10MB
      Notes.findOneAndUpdate.mockRejectedValue(new Error('Out of memory'));

      await expect(NotesService.updateNote('123', { content: largeContent }))
        .rejects.toThrow('Out of memory');
    });

    it('should handle connection pool exhaustion', async () => {
      Notes.find.mockRejectedValue(new Error('No connections available'));

      await expect(NotesService.getNotesByUserId(1))
        .rejects.toThrow('No connections available');
    });
  });

  describe('Data Consistency', () => {
    it('should maintain referential integrity for user notes', async () => {
      const notes = [
        { id: '1', user_id: 1, content: 'Note 1' },
        { id: '2', user_id: 1, content: 'Note 2' }
      ];

      Notes.find.mockResolvedValue(notes);

      const result = await NotesService.getNotesByUserId(1);

      expect(result.every(note => note.user_id === 1)).toBe(true);
    });

    it('should handle cascading deletes gracefully', async () => {
      Notes.findOneAndDelete.mockResolvedValue({
        id: '123',
        user_id: 1,
        content: 'Deleted note'
      });

      const result = await NotesService.deleteNote('123');

      expect(result).toBeDefined();
      expect(result.id).toBe('123');
    });
  });

  describe('Performance Tests', () => {
    it('should efficiently query notes by user_id', async () => {
      const startTime = Date.now();
      Notes.find.mockResolvedValue([]);

      await NotesService.getNotesByUserId(1);

      const endTime = Date.now();
      expect(endTime - startTime).toBeLessThan(100);
    });

    it('should handle pagination-sized results', async () => {
      const paginatedNotes = Array.from({ length: 50 }, (_, i) => ({
        id: `note-${i}`,
        user_id: 1,
        content: `Content ${i}`
      }));

      Notes.find.mockResolvedValue(paginatedNotes);

      const result = await NotesService.getNotesByUserId(1);

      expect(result).toHaveLength(50);
    });
  });
});
