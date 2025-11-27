import { useQuery } from '@tanstack/react-query';
import { usersApi } from '../api';
import { User } from '../types';

interface UseUsersOptions {
  pageNumber: number;
  pageSize: number;
}

export function useUsers({ pageNumber, pageSize }: UseUsersOptions) {
  return useQuery<User[]>({
    queryKey: ['users', pageNumber, pageSize],
    queryFn: () => usersApi.getAll(pageNumber, pageSize),
  });
}

export function useUsersCount() {
  return useQuery<{ count: number }>({
    queryKey: ['users', 'count'],
    queryFn: () => usersApi.getCount(),
  });
}

export function useUser(userId: string) {
  return useQuery<User>({
    queryKey: ['user', userId],
    queryFn: () => usersApi.getById(userId),
    enabled: !!userId,
  });
}
