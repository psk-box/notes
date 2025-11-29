import { jest } from '@jest/globals';
import notesRoutes from '../../routes/Notes.routes.js';

describe('Notes Routes', () => {
  it('should export a router', () => {
    expect(notesRoutes).toBeDefined();
    expect(typeof notesRoutes).toBe('function');
  });

  it('should have route stack defined', () => {
    expect(notesRoutes.stack).toBeDefined();
    expect(Array.isArray(notesRoutes.stack)).toBe(true);
  });

  it('should have 5 routes configured', () => {
    // POST /, GET /user/:user_id, GET /:note_id, PUT /:note_id, DELETE /:note_id
    expect(notesRoutes.stack.length).toBeGreaterThanOrEqual(5);
  });

  it('should have POST route for creating note', () => {
    const postRoute = notesRoutes.stack.find(
      layer => layer.route?.path === '/' && layer.route?.methods?.post
    );
    expect(postRoute).toBeDefined();
  });

  it('should have GET route for user notes', () => {
    const getUserNotesRoute = notesRoutes.stack.find(
      layer => layer.route?.path === '/user/:user_id' && layer.route?.methods?.get
    );
    expect(getUserNotesRoute).toBeDefined();
  });

  it('should have GET route with note_id parameter', () => {
    const getByIdRoute = notesRoutes.stack.find(
      layer => layer.route?.path === '/:note_id' && layer.route?.methods?.get
    );
    expect(getByIdRoute).toBeDefined();
  });

  it('should have PUT route with note_id parameter', () => {
    const putRoute = notesRoutes.stack.find(
      layer => layer.route?.path === '/:note_id' && layer.route?.methods?.put
    );
    expect(putRoute).toBeDefined();
  });

  it('should have DELETE route with note_id parameter', () => {
    const deleteRoute = notesRoutes.stack.find(
      layer => layer.route?.path === '/:note_id' && layer.route?.methods?.delete
    );
    expect(deleteRoute).toBeDefined();
  });
});
