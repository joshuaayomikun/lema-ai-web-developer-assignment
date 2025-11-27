import { apiClient } from '@web-developer-assignment/shared';
import { Post } from '../types';

export const postsApi = {
  getByUserId: (userId: string) =>
    apiClient.get<Post[]>(`/posts?userId=${userId}`),

  create: (data: { title: string; body: string; userId: string }) =>
    apiClient.post<Post>('/posts', data),

  delete: (postId: string) =>
    apiClient.delete<{ message: string }>(`/posts/${postId}`),
};
