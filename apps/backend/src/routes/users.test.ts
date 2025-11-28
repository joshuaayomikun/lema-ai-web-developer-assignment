import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';

// Mock the database module
vi.mock('../db/users/users', () => ({
  getUsers: vi.fn(),
  getUsersCount: vi.fn(),
  getUserById: vi.fn(),
}));

import { getUsers, getUsersCount, getUserById } from '../db/users/users';

const app = createApp();

describe('Users Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /users', () => {
    it('should return a list of users with default pagination', async () => {
      const mockUsers = [
        {
          id: '1',
          name: 'John Doe',
          username: 'johndoe',
          email: 'john@example.com',
          phone: '123-456-7890',
          address: { street: '123 Main St', city: 'NYC', state: 'NY', zipcode: '10001' },
        },
        {
          id: '2',
          name: 'Jane Doe',
          username: 'janedoe',
          email: 'jane@example.com',
          phone: '098-765-4321',
          address: { street: '456 Oak Ave', city: 'LA', state: 'CA', zipcode: '90001' },
        },
      ];

      vi.mocked(getUsers).mockResolvedValue(mockUsers);

      const response = await request(app).get('/users');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUsers);
      expect(getUsers).toHaveBeenCalledWith(0, 4); // default pageNumber=0, pageSize=4
    });

    it('should return users with custom pagination', async () => {
      const mockUsers = [
        {
          id: '3',
          name: 'Bob Smith',
          username: 'bobsmith',
          email: 'bob@example.com',
          phone: '555-555-5555',
          address: { street: '789 Pine Rd', city: 'Chicago', state: 'IL', zipcode: '60601' },
        },
      ];

      vi.mocked(getUsers).mockResolvedValue(mockUsers);

      const response = await request(app).get('/users?pageNumber=1&pageSize=10');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUsers);
      expect(getUsers).toHaveBeenCalledWith(1, 10);
    });

    it('should return 400 for invalid page number', async () => {
      const response = await request(app).get('/users?pageNumber=-1');

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'Invalid page number or page size' });
    });

    it('should use default pageSize when pageSize=0 (falsy)', async () => {
      const mockUsers = [
        {
          id: '1',
          name: 'John Doe',
          username: 'johndoe',
          email: 'john@example.com',
          phone: '123-456-7890',
          address: { street: '123 Main St', city: 'NYC', state: 'NY', zipcode: '10001' },
        },
      ];

      vi.mocked(getUsers).mockResolvedValue(mockUsers);

      const response = await request(app).get('/users?pageSize=0');

      expect(response.status).toBe(200);
      // pageSize=0 is falsy, so it defaults to 4
      expect(getUsers).toHaveBeenCalledWith(0, 4);
    });
  });

  describe('GET /users/count', () => {
    it('should return the total count of users', async () => {
      vi.mocked(getUsersCount).mockResolvedValue(42);

      const response = await request(app).get('/users/count');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ count: 42 });
      expect(getUsersCount).toHaveBeenCalled();
    });
  });

  describe('GET /users/:id', () => {
    it('should return a user by ID', async () => {
      const mockUser = {
        id: '1',
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@example.com',
        phone: '123-456-7890',
        address: { street: '123 Main St', city: 'NYC', state: 'NY', zipcode: '10001' },
      };

      vi.mocked(getUserById).mockResolvedValue(mockUser);

      const response = await request(app).get('/users/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
      expect(getUserById).toHaveBeenCalledWith('1');
    });

    it('should return 404 when user is not found', async () => {
      vi.mocked(getUserById).mockResolvedValue(undefined);

      const response = await request(app).get('/users/999');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'User not found' });
    });
  });
});
