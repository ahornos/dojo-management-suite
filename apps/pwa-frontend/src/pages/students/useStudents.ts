/**
 * @file useStudents.ts
 * @description Centralized React query hook for managing student profile state.
 * Orchestrates fetch queries for students, dependency datasets (users, disciplines),
 * and exposes transactional mutations for creating, updating, and deleting records.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { StudentProfileResponse, CreateStudentPayload } from './types';

export function useStudents() {
  const queryClient = useQueryClient();

  /**
   * Fetches the comprehensive list of student profiles.
   */
  const studentsQuery = useQuery<StudentProfileResponse[]>({
    queryKey: ['students'],
    queryFn: async () => {
      const response = await apiClient.get('/academic/students'); 
      const responseData = response.data;
      if (Array.isArray(responseData)) return responseData;
      if (responseData && Array.isArray(responseData.data)) return responseData.data;
      if (responseData && Array.isArray(responseData.items)) return responseData.items;
      return [];
    },
  });

  /**
   * Fetches registered system users to populate lookup dropdowns in the UI forms.
   */
  const availableUsersQuery = useQuery({
    queryKey: ['users', 'available-for-student'],
    queryFn: async () => {
      const response = await apiClient.get('/auth/users'); 
      return response.data;
    },
  });

  /**
   * Fetches the registered martial disciplines to populate enrollment checkboxes.
   */
  const availableDisciplinesQuery = useQuery({
    queryKey: ['disciplines', 'available-for-student'],
    queryFn: async () => {
      const response = await apiClient.get('/academic/disciplines'); 
      const responseData = response.data;
      if (Array.isArray(responseData)) return responseData;
      if (responseData && Array.isArray(responseData.data)) return responseData.data;
      return [];
    },
  });

  /**
   * Executes the creation payload for a new student profile and invalidates reliant queries.
   */
  const createStudentMutation = useMutation({
    mutationFn: async (payload: CreateStudentPayload) => {
      const response = await apiClient.post('/academic/students', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['users', 'available-for-student'] });
    },
  });

  /**
   * Dispatches a partial update payload for an existing student profile.
   */
  const updateStudentMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
      const response = await apiClient.patch(`/academic/students/${id}`, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });

  /**
   * Dispatches a hard delete command for a student profile UUID.
   */
  const deleteStudentMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/academic/students/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });

  return {
    students: studentsQuery.data || [],
    isLoading: studentsQuery.isLoading,
    error: studentsQuery.error,
    availableUsers: availableUsersQuery.data || [],
    availableDisciplines: availableDisciplinesQuery.data || [],
    isUsersLoading: availableUsersQuery.isLoading,
    createStudent: createStudentMutation,
    updateStudent: updateStudentMutation,
    deleteStudent: deleteStudentMutation,
  };
}