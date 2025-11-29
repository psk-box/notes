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

  it('should have exactly 5 routes defined', () => {
    const routes = notesRoutes.stack.filter(layer => layer.route);
    expect(routes.length).toBe(5);
  });

  it('should have routes with correct HTTP methods', () => {
    const routes = notesRoutes.stack.filter(layer => layer.route);
    const methods = routes.map(layer => Object.keys(layer.route.methods)[0]);
    
    expect(methods).toContain('get');
    expect(methods).toContain('post');
    expect(methods).toContain('put');
    expect(methods).toContain('delete');
  });

  it('should have user_id parameter in GET notes by user route', () => {
    const userNotesRoute = notesRoutes.stack.find(
      layer => layer.route?.path === '/user/:user_id'
    );
    expect(userNotesRoute.route.path).toContain(':user_id');
  });

  it('should have note_id parameter in individual note operations', () => {
    const noteIdRoutes = notesRoutes.stack.filter(
      layer => layer.route?.path === '/:note_id'
    );
    expect(noteIdRoutes.length).toBe(3); // GET, PUT, DELETE
  });
});
