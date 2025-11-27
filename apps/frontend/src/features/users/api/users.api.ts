import { apiClient } from '@web-developer-assignment/shared';
import { User } from '../types';

export const usersApi = {
  getAll: (pageNumber: number, pageSize: number) =>
    apiClient.get<User[]>(`/users?pageNumber=${pageNumber}&pageSize=${pageSize}`),

  getById: (userId: string) =>
    apiClient.get<User>(`/users/${userId}`),

  getCount: () =>
    apiClient.get<{ count: number }>('/users/count'),
};
