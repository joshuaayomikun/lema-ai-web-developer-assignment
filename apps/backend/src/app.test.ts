import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';

// Mock sqlite3 before any imports that use it
vi.mock('sqlite3', () => ({
  default: {
    Database: vi.fn(() => ({
      get: vi.fn(),
      all: vi.fn(),
      run: vi.fn(),
    })),
  },
}));

// Mock the database functions to prevent sqlite3 loading
vi.mock('./db/users/users', () => ({
  getUsers: vi.fn(),
  getUsersCount: vi.fn(),
  getUserById: vi.fn(),
}));

vi.mock('./db/posts/posts', () => ({
  getPosts: vi.fn(),
  createPost: vi.fn(),
  deletePost: vi.fn(),
}));

import { createApp } from './app';

const app = createApp();

describe('App', () => {
  describe('GET /', () => {
    it('should return health check response', async () => {
      const response = await request(app).get('/');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: 'ok',
        message: 'API is running',
      });
    });
  });

  describe('CORS headers', () => {
    it('should include CORS headers in response', async () => {
      const response = await request(app).get('/');

      expect(response.headers['access-control-allow-origin']).toBe('*');
      expect(response.headers['access-control-allow-methods']).toBe('GET, POST, PUT, DELETE');
    });
  });

  describe('404 handling', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app).get('/unknown-route');

      expect(response.status).toBe(404);
    });
  });
});
