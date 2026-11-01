/**
 * @file useDisciplines.ts
 * @description Custom hook for managing academic disciplines, programs, and belt ranks via TanStack Query.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { DisciplinePayload, BeltRankPayload, DisciplineProgramPayload } from './types';

/**
 * Loads martial disciplines and exposes mutations for disciplines, programs, and belt ranks.
 *
 * @returns Query state and catalog mutations keyed on `['disciplines']`.
 */
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

  const createProgramMutation = useMutation({
    mutationFn: async ({ disciplineId, ...payload }: Pick<DisciplineProgramPayload, 'disciplineId' | 'name' | 'minAge' | 'maxAge'>) => {
      const response = await apiClient.post(`/academic/disciplines/${disciplineId}/programs`, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['disciplines'] });
    },
  });

  const deleteProgramMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/academic/disciplines/programs/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['disciplines'] });
    },
  });

  const saveBeltRankMutation = useMutation({
    mutationFn: async (payload: BeltRankPayload) => {
      const { id, disciplineProgramId, ...data } = payload;
      if (id) {
        const response = await apiClient.patch(`/academic/disciplines/belts/${id}`, data);
        return response.data;
      }
      const response = await apiClient.post(`/academic/disciplines/programs/${disciplineProgramId}/belts`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['disciplines'] });
    },
  });

  const deleteBeltRankMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/academic/disciplines/belts/${id}`);
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
    createProgram: createProgramMutation,
    deleteProgram: deleteProgramMutation,
    saveBeltRank: saveBeltRankMutation,
    deleteBeltRank: deleteBeltRankMutation,
  };
}
