/**
 * @file useUsers.ts
 * @description Custom hook encapsulating all TanStack Query logic for the Users module[cite: 38].
 * Manages fetching, creating, updating, and deleting users with multi-role support.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { UserFormPayload } from './types';

export function useUsers() {
  const queryClient = useQueryClient();

  const fetchUsers = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await apiClient.get('/auth/users');
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: UserFormPayload) => {
      const response = await apiClient.post('/auth/users', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: UserFormPayload) => {
      const { id, ...data } = payload;
      if (!data.password || data.password.trim() === '') delete data.password;
      
      const response = await apiClient.patch(`/auth/users/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/auth/users/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return {
    users: fetchUsers.data || [],
    isLoading: fetchUsers.isLoading,
    error: fetchUsers.error,
    createMutation,
    updateMutation,
    deleteMutation,
  };
}