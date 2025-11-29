import { jest } from '@jest/globals';
import NotesController from '../../controllers/Notes.controller.js';
import * as NotesServiceModule from '../../services/Notes.service.js';

const NotesService = NotesServiceModule.default;

// Spy on all NotesService methods
jest.spyOn(NotesService, 'createNote');
jest.spyOn(NotesService, 'getNotesByUserId');
jest.spyOn(NotesService, 'getNoteById');
jest.spyOn(NotesService, 'updateNote');
jest.spyOn(NotesService, 'deleteNote');

describe('NotesController', () => {
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

  describe('createNote', () => {
    it('should create a note successfully', async () => {
      const noteData = {
        user_id: 1,
        content: 'This is a test note'
      };
      const createdNote = { id: '123', ...noteData, createdAt: new Date() };

      req.body = noteData;
      NotesService.createNote.mockResolvedValue(createdNote);

      await NotesController.createNote(req, res);

      expect(NotesService.createNote).toHaveBeenCalledWith(noteData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Note created successfully',
        note: createdNote
      });
    });

    it('should return 400 when user_id is missing', async () => {
      req.body = {
        content: 'This is a test note'
      };

      await NotesController.createNote(req, res);

      expect(NotesService.createNote).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Missing required fields'
      });
    });

    it('should return 400 when content is missing', async () => {
      req.body = {
        user_id: 1
      };

      await NotesController.createNote(req, res);

      expect(NotesService.createNote).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Missing required fields'
      });
    });

    it('should return 500 when service throws an error', async () => {
      req.body = {
        user_id: 1,
        content: 'This is a test note'
      };

      const error = new Error('Database error');
      NotesService.createNote.mockRejectedValue(error);

      await NotesController.createNote(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error creating note',
        error: 'Database error'
      });
    });

    it('should return 400 when content is empty string', async () => {
      req.body = {
        user_id: 1,
        content: ''
      };

      await NotesController.createNote(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should create note with special characters in content', async () => {
      const noteData = {
        user_id: 1,
        content: 'Test <script>alert("XSS")</script> & special chars!'
      };
      const createdNote = { id: '123', ...noteData, createdAt: new Date() };

      req.body = noteData;
      NotesService.createNote.mockResolvedValue(createdNote);

      await NotesController.createNote(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should create note with very long content', async () => {
      const longContent = 'A'.repeat(10000);
      const noteData = {
        user_id: 1,
        content: longContent
      };
      const createdNote = { id: '123', ...noteData, createdAt: new Date() };

      req.body = noteData;
      NotesService.createNote.mockResolvedValue(createdNote);

      await NotesController.createNote(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should return 400 when user_id is 0', async () => {
      req.body = {
        user_id: 0,
        content: 'Test note'
      };

      await NotesController.createNote(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('getNotesByUserId', () => {
    it('should return notes for a user successfully', async () => {
      const notes = [
        { id: '1', user_id: 1, content: 'Note 1', createdAt: new Date() },
        { id: '2', user_id: 1, content: 'Note 2', createdAt: new Date() }
      ];

      req.params.user_id = '1';
      NotesService.getNotesByUserId.mockResolvedValue(notes);

      await NotesController.getNotesByUserId(req, res);

      expect(NotesService.getNotesByUserId).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(notes);
    });

    it('should return empty array when user has no notes', async () => {
      req.params.user_id = '1';
      NotesService.getNotesByUserId.mockResolvedValue([]);

      await NotesController.getNotesByUserId(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([]);
    });

    it('should return 400 when user_id is missing', async () => {
      req.params.user_id = undefined;

      await NotesController.getNotesByUserId(req, res);

      expect(NotesService.getNotesByUserId).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User ID is required'
      });
    });

    it('should return 400 when user_id is not a number', async () => {
      req.params.user_id = 'abc';

      await NotesController.getNotesByUserId(req, res);

      expect(NotesService.getNotesByUserId).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User ID must be a number'
      });
    });

    it('should return 500 when service throws an error', async () => {
      req.params.user_id = '1';
      const error = new Error('Database error');
      NotesService.getNotesByUserId.mockRejectedValue(error);

      await NotesController.getNotesByUserId(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error fetching notes',
        error: 'Database error'
      });
    });

    it('should return 400 when user_id is empty string', async () => {
      req.params.user_id = '';

      await NotesController.getNotesByUserId(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should handle negative user_id', async () => {
      req.params.user_id = '-5';
      NotesService.getNotesByUserId.mockResolvedValue([]);

      await NotesController.getNotesByUserId(req, res);

      expect(NotesService.getNotesByUserId).toHaveBeenCalledWith('-5');
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 400 when user_id contains letters', async () => {
      req.params.user_id = 'abc123';

      await NotesController.getNotesByUserId(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('getNoteById', () => {
    it('should return a note by ID successfully', async () => {
      const note = {
        id: '123',
        user_id: 1,
        content: 'Test note',
        createdAt: new Date()
      };

      req.params.note_id = '123';
      NotesService.getNoteById.mockResolvedValue(note);

      await NotesController.getNoteById(req, res);

      expect(NotesService.getNoteById).toHaveBeenCalledWith('123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(note);
    });

    it('should return 400 when note_id is missing', async () => {
      req.params.note_id = undefined;

      await NotesController.getNoteById(req, res);

      expect(NotesService.getNoteById).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Note ID is required'
      });
    });

    it('should return 404 when note is not found', async () => {
      req.params.note_id = '999';
      NotesService.getNoteById.mockResolvedValue(null);

      await NotesController.getNoteById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Note not found'
      });
    });

    it('should return 500 when service throws an error', async () => {
      req.params.note_id = '123';
      const error = new Error('Database error');
      NotesService.getNoteById.mockRejectedValue(error);

      await NotesController.getNoteById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error fetching note',
        error: 'Database error'
      });
    });

    it('should return 400 when note_id is empty string', async () => {
      req.params.note_id = '';

      await NotesController.getNoteById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should handle note_id with special characters', async () => {
      req.params.note_id = 'abc-123-def';
      const mockNote = {
        id: 'abc-123-def',
        user_id: 1,
        content: 'Test note',
        createdAt: new Date()
      };

      NotesService.getNoteById.mockResolvedValue(mockNote);

      await NotesController.getNoteById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
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

      req.params.note_id = '123';
      req.body = updateData;
      NotesService.updateNote.mockResolvedValue(updatedNote);

      await NotesController.updateNote(req, res);

      expect(NotesService.updateNote).toHaveBeenCalledWith('123', updateData);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Note updated successfully',
        note: updatedNote
      });
    });

    it('should return 404 when note is not found', async () => {
      req.params.note_id = '999';
      req.body = { content: 'Updated note content' };
      NotesService.updateNote.mockResolvedValue(null);

      await NotesController.updateNote(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Note not found'
      });
    });

    it('should return 500 when service throws an error', async () => {
      req.params.note_id = '123';
      req.body = { content: 'Updated note content' };
      const error = new Error('Database error');
      NotesService.updateNote.mockRejectedValue(error);

      await NotesController.updateNote(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error updating note',
        error: 'Database error'
      });
    });

    it('should update note with empty body object', async () => {
      req.params.note_id = '123';
      req.body = {};
      const updatedNote = {
        id: '123',
        user_id: 1,
        content: 'Original content',
        createdAt: new Date()
      };

      NotesService.updateNote.mockResolvedValue(updatedNote);

      await NotesController.updateNote(req, res);

      expect(NotesService.updateNote).toHaveBeenCalledWith('123', {});
      expect(res.status).toHaveBeenCalledWith(200);
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

      req.params.note_id = '123';
      NotesService.deleteNote.mockResolvedValue(deletedNote);

      await NotesController.deleteNote(req, res);

      expect(NotesService.deleteNote).toHaveBeenCalledWith('123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Note deleted successfully'
      });
    });

    it('should return 400 when note_id is missing', async () => {
      req.params.note_id = undefined;

      await NotesController.deleteNote(req, res);

      expect(NotesService.deleteNote).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Note ID is required'
      });
    });

    it('should return 404 when note is not found', async () => {
      req.params.note_id = '999';
      NotesService.deleteNote.mockResolvedValue(null);

      await NotesController.deleteNote(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Note not found'
      });
    });

    it('should return 500 when service throws an error', async () => {
      req.params.note_id = '123';
      const error = new Error('Database error');
      NotesService.deleteNote.mockRejectedValue(error);

      await NotesController.deleteNote(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error deleting note',
        error: 'Database error'
      });
    });

    it('should return 400 when note_id is empty string', async () => {
      req.params.note_id = '';

      await NotesController.deleteNote(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});
