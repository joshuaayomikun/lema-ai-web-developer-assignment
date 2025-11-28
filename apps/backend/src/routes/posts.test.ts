import { describe, it, expect, vi, beforeEach } from 'vitest';
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

// Mock the database functions
vi.mock('../db/posts/posts', () => ({
  getPosts: vi.fn(),
  createPost: vi.fn(),
  deletePost: vi.fn(),
}));

// Mock users database functions to prevent sqlite3 loading
vi.mock('../db/users/users', () => ({
  getUsers: vi.fn(),
  getUsersCount: vi.fn(),
  getUserById: vi.fn(),
}));

import { createApp } from '../app';
import { getPosts, createPost, deletePost } from '../db/posts/posts';

const app = createApp();

describe('Posts Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /posts', () => {
    it('should return posts for a user', async () => {
      const mockPosts = [
        { id: '1', title: 'Post 1', body: 'Body 1', userId: '1' },
        { id: '2', title: 'Post 2', body: 'Body 2', userId: '1' },
      ];

      vi.mocked(getPosts).mockResolvedValue(mockPosts);

      const response = await request(app).get('/posts?userId=1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPosts);
      expect(getPosts).toHaveBeenCalledWith('1');
    });

    it('should return 400 when userId is missing', async () => {
      const response = await request(app).get('/posts');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'userId is required' });
    });
  });

  describe('POST /posts', () => {
    it('should create a new post', async () => {
      vi.mocked(createPost).mockResolvedValue({ id: '10' });

      const newPost = {
        title: 'New Post',
        body: 'New post body content',
        userId: '1',
      };

      const response = await request(app)
        .post('/posts')
        .send(newPost);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ id: '10' });
      expect(createPost).toHaveBeenCalledWith('New Post', 'New post body content', '1');
    });

    it('should return 400 when title is missing', async () => {
      const response = await request(app)
        .post('/posts')
        .send({ body: 'Body', userId: '1' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'title, body, and userId are required' });
    });

    it('should return 400 when body is missing', async () => {
      const response = await request(app)
        .post('/posts')
        .send({ title: 'Title', userId: '1' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'title, body, and userId are required' });
    });

    it('should return 400 when userId is missing', async () => {
      const response = await request(app)
        .post('/posts')
        .send({ title: 'Title', body: 'Body' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'title, body, and userId are required' });
    });

    it('should return 500 when database fails', async () => {
      vi.mocked(createPost).mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/posts')
        .send({ title: 'Title', body: 'Body', userId: '1' });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to create post' });
    });
  });

  describe('DELETE /posts/:id', () => {
    it('should delete a post', async () => {
      vi.mocked(deletePost).mockResolvedValue();

      const response = await request(app).delete('/posts/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Post deleted successfully' });
      expect(deletePost).toHaveBeenCalledWith('1');
    });

    it('should return 500 when delete fails', async () => {
      vi.mocked(deletePost).mockRejectedValue(new Error('Database error'));

      const response = await request(app).delete('/posts/1');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to delete post' });
    });
  });
});
