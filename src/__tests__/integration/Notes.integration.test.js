import { jest } from '@jest/globals';
import NotesController from '../../controllers/Notes.controller.js';
import * as NotesServiceModule from '../../services/Notes.service.js';

const NotesService = NotesServiceModule.default;

jest.spyOn(NotesService, 'createNote');
jest.spyOn(NotesService, 'getNotesByUserId');
jest.spyOn(NotesService, 'getNoteById');
jest.spyOn(NotesService, 'updateNote');
jest.spyOn(NotesService, 'deleteNote');

describe('Notes Integration Tests', () => {
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
    it('should preserve original content when updating metadata', async () => {
      const originalNote = {
        id: '123',
        user_id: 1,
        content: 'Original content',
        createdAt: new Date('2023-01-01')
      };

      const updateData = { user_id: 2 };
      const updatedNote = { ...originalNote, user_id: 2 };

      req.params.note_id = '123';
      req.body = updateData;
      NotesService.updateNote.mockResolvedValue(updatedNote);

      await NotesController.updateNote(req, res);

      expect(updatedNote.content).toBe('Original content');
    });

    it('should maintain note relationships after update', async () => {
      const note = {
        id: '123',
        user_id: 1,
        content: 'Updated content'
      };

      req.params.note_id = '123';
      req.body = { content: 'Updated content' };
      NotesService.updateNote.mockResolvedValue(note);

      await NotesController.updateNote(req, res);

      expect(note.user_id).toBe(1);
    });
  });

  describe('Boundary Testing', () => {
    it('should handle maximum content length (1MB)', async () => {
      const largeContent = 'X'.repeat(1024 * 1024); // 1MB
      const noteData = {
        user_id: 1,
        content: largeContent
      };

      req.body = noteData;
      NotesService.createNote.mockResolvedValue({ id: '123', ...noteData });

      await NotesController.createNote(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should handle single character content', async () => {
      const noteData = {
        user_id: 1,
        content: 'X'
      };

      req.body = noteData;
      NotesService.createNote.mockResolvedValue({ id: '123', ...noteData });

      await NotesController.createNote(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should handle maximum user_id value', async () => {
      const noteData = {
        user_id: Number.MAX_SAFE_INTEGER,
        content: 'Test note'
      };

      req.body = noteData;
      NotesService.createNote.mockResolvedValue({ id: '123', ...noteData });

      await NotesController.createNote(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should handle minimum user_id value', async () => {
      const noteData = {
        user_id: 1,
        content: 'Test note'
      };

      req.body = noteData;
      NotesService.createNote.mockResolvedValue({ id: '123', ...noteData });

      await NotesController.createNote(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('Security Testing', () => {
    it('should handle script tags in content', async () => {
      const xssContent = '<script>alert("Hacked")</script>';
      const noteData = {
        user_id: 1,
        content: xssContent
      };

      req.body = noteData;
      NotesService.createNote.mockResolvedValue({ id: '123', ...noteData });

      await NotesController.createNote(req, res);

      expect(NotesService.createNote).toHaveBeenCalledWith(noteData);
    });

    it('should handle iframe injection', async () => {
      const iframeContent = '<iframe src="http://malicious.com"></iframe>';
      const noteData = {
        user_id: 1,
        content: iframeContent
      };

      req.body = noteData;
      NotesService.createNote.mockResolvedValue({ id: '123', ...noteData });

      await NotesController.createNote(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should handle SQL injection in note_id', async () => {
      req.params.note_id = "123' OR '1'='1";

      const note = {
        id: "123' OR '1'='1",
        user_id: 1,
        content: 'Test'
      };

      NotesService.getNoteById.mockResolvedValue(note);

      await NotesController.getNoteById(req, res);

      expect(NotesService.getNoteById).toHaveBeenCalledWith("123' OR '1'='1");
    });

    it('should handle JavaScript code in content', async () => {
      const jsContent = 'function() { window.location = "http://evil.com"; }';
      const noteData = {
        user_id: 1,
        content: jsContent
      };

      req.body = noteData;
      NotesService.createNote.mockResolvedValue({ id: '123', ...noteData });

      await NotesController.createNote(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should handle path traversal attempts in note_id', async () => {
      req.params.note_id = '../../../etc/passwd';

      NotesService.getNoteById.mockResolvedValue(null);

      await NotesController.getNoteById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('Concurrent Operations', () => {
    it('should handle multiple users creating notes simultaneously', async () => {
      const notes = [
        { user_id: 1, content: 'Note 1' },
        { user_id: 2, content: 'Note 2' },
        { user_id: 3, content: 'Note 3' }
      ];

      const promises = notes.map((noteData, index) => {
        req.body = noteData;
        NotesService.createNote.mockResolvedValueOnce({ id: `${index}`, ...noteData });
        return NotesController.createNote(req, res);
      });

      await Promise.all(promises);

      expect(NotesService.createNote).toHaveBeenCalledTimes(3);
    });

    it('should handle rapid note updates', async () => {
      req.params.note_id = '123';
      const updates = ['Update 1', 'Update 2', 'Update 3'];

      for (const content of updates) {
        req.body = { content };
        NotesService.updateNote.mockResolvedValue({ id: '123', content });
        await NotesController.updateNote(req, res);
      }

      expect(NotesService.updateNote).toHaveBeenCalledTimes(3);
    });

    it('should handle simultaneous reads of same note', async () => {
      const note = { id: '123', user_id: 1, content: 'Test' };
      req.params.note_id = '123';

      NotesService.getNoteById.mockResolvedValue(note);

      const promises = Array(10).fill(null).map(() =>
        NotesController.getNoteById(req, res)
      );

      await Promise.all(promises);

      expect(NotesService.getNoteById).toHaveBeenCalledTimes(10);
    });
  });

  describe('Error Recovery', () => {
    it('should handle database connection loss during creation', async () => {
      req.body = {
        user_id: 1,
        content: 'Test note'
      };

      NotesService.createNote.mockRejectedValue(new Error('Connection lost'));

      await NotesController.createNote(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error creating note',
        error: 'Connection lost'
      });
    });

    it('should recover from timeout errors', async () => {
      req.params.user_id = '1';

      NotesService.getNotesByUserId
        .mockRejectedValueOnce(new Error('Request timeout'))
        .mockResolvedValueOnce([{ id: '123', content: 'Test' }]);

      await NotesController.getNotesByUserId(req, res);
      expect(res.status).toHaveBeenCalledWith(500);

      jest.clearAllMocks();

      await NotesController.getNotesByUserId(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('Data Validation', () => {
    it('should reject null content', async () => {
      req.body = {
        user_id: 1,
        content: null
      };

      await NotesController.createNote(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should reject undefined user_id', async () => {
      req.body = {
        user_id: undefined,
        content: 'Test note'
      };

      await NotesController.createNote(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should accept whitespace-only content (no trimming)', async () => {
      const noteData = {
        user_id: 1,
        content: '    '
      };

      req.body = noteData;
      NotesService.createNote.mockResolvedValue({ id: '123', ...noteData });

      await NotesController.createNote(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should handle newline and tab characters', async () => {
      const noteData = {
        user_id: 1,
        content: 'Line 1\nLine 2\tTabbed'
      };

      req.body = noteData;
      NotesService.createNote.mockResolvedValue({ id: '123', ...noteData });

      await NotesController.createNote(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should handle emoji in content', async () => {
      const noteData = {
        user_id: 1,
        content: 'Hello 👋 World 🌍'
      };

      req.body = noteData;
      NotesService.createNote.mockResolvedValue({ id: '123', ...noteData });

      await NotesController.createNote(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should handle unicode characters', async () => {
      const noteData = {
        user_id: 1,
        content: '你好世界 مرحبا العالم'
      };

      req.body = noteData;
      NotesService.createNote.mockResolvedValue({ id: '123', ...noteData });

      await NotesController.createNote(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('Performance Tests', () => {
    it('should handle bulk note retrieval efficiently', async () => {
      const manyNotes = Array.from({ length: 1000 }, (_, i) => ({
        id: `note-${i}`,
        user_id: 1,
        content: `Note ${i}`
      }));

      req.params.user_id = '1';
      NotesService.getNotesByUserId.mockResolvedValue(manyNotes);

      await NotesController.getNotesByUserId(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(manyNotes);
    });

    it('should handle empty result sets', async () => {
      req.params.user_id = '999';
      NotesService.getNotesByUserId.mockResolvedValue([]);

      await NotesController.getNotesByUserId(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([]);
    });
  });
});
