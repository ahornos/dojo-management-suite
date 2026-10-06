/**
 * @file useStudents.ts
 * @description Custom hook for managing student profiles via TanStack Query[cite: 25].
 * Handles fetching student records, fetching available system users for enrollment, 
 * and executing creation mutations.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { StudentProfileResponse, CreateStudentPayload } from './types';

export function useStudents() {
  const queryClient = useQueryClient();

  /**
   * Query to fetch all registered student profiles from the academic microservice.
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
   * Query to fetch system users to populate the "Select User" dropdown in the student form.
   * Utilizes the general /auth/users endpoint to avoid 404 errors.
   */
  const availableUsersQuery = useQuery({
    queryKey: ['users', 'available-for-student'],
    queryFn: async () => {
      const response = await apiClient.get('/auth/users'); 
      return response.data;
    },
  });

  /**
   * Mutation to create a new student profile and trigger transactional user/guardian binding.
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

  return {
    students: studentsQuery.data || [],
    isLoading: studentsQuery.isLoading,
    error: studentsQuery.error,
    availableUsers: availableUsersQuery.data || [],
    isUsersLoading: availableUsersQuery.isLoading,
    createStudent: createStudentMutation,
  };
}