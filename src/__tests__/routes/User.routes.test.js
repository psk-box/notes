import { jest } from '@jest/globals';
import userRoutes from '../../routes/User.routes.js';

describe('User Routes', () => {
  it('should export a router', () => {
    expect(userRoutes).toBeDefined();
    expect(typeof userRoutes).toBe('function');
  });

  it('should have route stack defined', () => {
    expect(userRoutes.stack).toBeDefined();
    expect(Array.isArray(userRoutes.stack)).toBe(true);
  });

  it('should have 5 routes configured', () => {
    // GET /, POST /, GET /:user_id, PUT /:user_id, DELETE /:user_id
    expect(userRoutes.stack.length).toBeGreaterThanOrEqual(5);
  });

  it('should have GET route for listing users', () => {
    const getRoute = userRoutes.stack.find(
      layer => layer.route?.path === '/' && layer.route?.methods?.get
    );
    expect(getRoute).toBeDefined();
  });

  it('should have POST route for creating user', () => {
    const postRoute = userRoutes.stack.find(
      layer => layer.route?.path === '/' && layer.route?.methods?.post
    );
    expect(postRoute).toBeDefined();
  });

  it('should have GET route with user_id parameter', () => {
    const getByIdRoute = userRoutes.stack.find(
      layer => layer.route?.path === '/:user_id' && layer.route?.methods?.get
    );
    expect(getByIdRoute).toBeDefined();
  });

  it('should have PUT route with user_id parameter', () => {
    const putRoute = userRoutes.stack.find(
      layer => layer.route?.path === '/:user_id' && layer.route?.methods?.put
    );
    expect(putRoute).toBeDefined();
  });

  it('should have DELETE route with user_id parameter', () => {
    const deleteRoute = userRoutes.stack.find(
      layer => layer.route?.path === '/:user_id' && layer.route?.methods?.delete
    );
    expect(deleteRoute).toBeDefined();
  });

  it('should have exactly 5 routes defined', () => {
    const routes = userRoutes.stack.filter(layer => layer.route);
    expect(routes.length).toBe(5);
  });

  it('should have routes with correct HTTP methods', () => {
    const routes = userRoutes.stack.filter(layer => layer.route);
    const methods = routes.map(layer => Object.keys(layer.route.methods)[0]);
    
    expect(methods).toContain('get');
    expect(methods).toContain('post');
    expect(methods).toContain('put');
    expect(methods).toContain('delete');
  });

  it('should have parameterized routes for individual user operations', () => {
    const paramRoutes = userRoutes.stack.filter(
      layer => layer.route?.path === '/:user_id'
    );
    expect(paramRoutes.length).toBe(3); // GET, PUT, DELETE
  });

  it('should have root path routes for collection operations', () => {
    const rootRoutes = userRoutes.stack.filter(
      layer => layer.route?.path === '/'
    );
    expect(rootRoutes.length).toBe(2); // GET, POST
  });
});
