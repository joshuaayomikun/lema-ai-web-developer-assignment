import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postsApi } from '../api';
import { Post } from '../types';

export function useUserPosts(userId: string) {
  return useQuery<Post[]>({
    queryKey: ['posts', userId],
    queryFn: () => postsApi.getByUserId(userId),
    enabled: !!userId,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { title: string; body: string; userId: string }) =>
      postsApi.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['posts', variables.userId] });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => postsApi.delete(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}
