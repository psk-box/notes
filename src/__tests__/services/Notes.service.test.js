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
  });
});
