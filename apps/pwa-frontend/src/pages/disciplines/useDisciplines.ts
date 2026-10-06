/**
 * @file useDisciplines.ts
 * @description Custom hook for managing academic disciplines, programs, and belt ranks via TanStack Query.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { DisciplinePayload, BeltRankPayload } from './types';

export function useDisciplines() {
  const queryClient = useQueryClient();

  const disciplinesQuery = useQuery({
    queryKey: ['disciplines'],
    queryFn: async () => {
      const response = await apiClient.get('/academic/disciplines');
      return response.data;
    },
  });

  const createDisciplineMutation = useMutation({
    mutationFn: async (payload: DisciplinePayload) => {
      const response = await apiClient.post('/academic/disciplines', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['disciplines'] });
    },
  });

  const updateDisciplineMutation = useMutation({
    mutationFn: async ({ id, ...payload }: DisciplinePayload) => {
      const response = await apiClient.patch(`/academic/disciplines/${id}`, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['disciplines'] });
    },
  });

  const deleteDisciplineMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/academic/disciplines/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['disciplines'] });
    },
  });

  const saveBeltRankMutation = useMutation({
    mutationFn: async (payload: BeltRankPayload) => {
      const { id, ...data } = payload;
      if (id) {
        const response = await apiClient.patch(`/academic/belt-ranks/${id}`, data);
        return response.data;
      } else {
        const response = await apiClient.post('/academic/belt-ranks', payload);
        return response.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['disciplines'] });
    },
  });

  const deleteBeltRankMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/academic/belt-ranks/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['disciplines'] });
    },
  });

  return {
    disciplines: disciplinesQuery.data || [],
    isLoading: disciplinesQuery.isLoading,
    error: disciplinesQuery.error,
    createDiscipline: createDisciplineMutation,
    updateDiscipline: updateDisciplineMutation,
    deleteDiscipline: deleteDisciplineMutation,
    saveBeltRank: saveBeltRankMutation,
    deleteBeltRank: deleteBeltRankMutation,
  };
}