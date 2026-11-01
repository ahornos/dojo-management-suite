/**
 * @file useStudents.ts
 * @description Centralized React query hook for managing student profile state.
 * Orchestrates fetch queries for students, dependency datasets (users, disciplines),
 * and exposes transactional mutations for creating, updating, and deleting records.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { toIban, type BankingDetails } from './banking';
import { studentPayerUserId } from './studentIdentity';
import {
  BankMandate,
  StudentProfileResponse,
  CreateStudentPayload,
  CreateTrialStudentPayload,
  StudentMutationResult,
  UpdateStudentPayload,
} from './types';

/**
 * Registers a SEPA mandate under the payer User, then points the student profile at it.
 * Failures are swallowed so the academic write remains committed.
 *
 * @param {StudentProfileResponse} student - Academic profile just written.
 * @param {BankingDetails | undefined} banking - Normalized holder name, DNI and IBAN, if collected.
 * @param {string | undefined} explicitPayerUserId - Guardian User id when known from the form.
 * @returns {Promise<{ failed: boolean; mandate: BankMandate | null }>} Attach outcome and created mandate.
 */
async function attachMandate(
  student: StudentProfileResponse,
  banking?: BankingDetails,
  explicitPayerUserId?: string,
): Promise<{ failed: boolean; mandate: BankMandate | null }> {
  if (!banking) return { failed: false, mandate: null };
  const payerUserId = explicitPayerUserId || studentPayerUserId(student);
  if (!payerUserId) return { failed: true, mandate: null };
  try {
    const response = await apiClient.post('/financial/mandates', {
      payerUserId,
      iban: toIban(banking.iban),
      accountHolderName: banking.accountHolderName,
      accountHolderDni: banking.accountHolderDni,
    });
    const mandate = response.data as BankMandate;
    await apiClient.patch(`/academic/students/${student.id}`, { bankMandateId: mandate.id });
    return { failed: false, mandate };
  } catch {
    return { failed: true, mandate: null };
  }
}

/**
 * Loads student profiles plus lookup datasets (users, disciplines) and exposes CRUD mutations.
 *
 * @returns {{ students: StudentProfileResponse[]; isLoading: boolean; error: unknown; availableUsers: unknown[]; availableDisciplines: unknown[]; isUsersLoading: boolean; createStudent: unknown; createTrialStudent: unknown; updateStudent: unknown; deleteStudent: unknown }} Query state and mutations for the Students module.
 */
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
   * Creates the academic profile, then registers a SEPA mandate when banking details were collected.
   */
  const createStudentMutation = useMutation({
    mutationFn: async (payload: CreateStudentPayload): Promise<StudentMutationResult> => {
      const { banking, ...academicPayload } = payload;
      const response = await apiClient.post('/academic/students', academicPayload);
      const student = response.data as StudentProfileResponse;
      const payerFromForm = academicPayload.isMinor
        ? academicPayload.guardians?.find((guardian) => guardian.userId)?.userId ?? undefined
        : student.userId ?? student.user?.id ?? undefined;
      const attached = await attachMandate(student, banking, payerFromForm);
      return { student, mandateFailed: attached.failed, mandate: attached.mandate };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['users', 'available-for-student'] });
    },
  });

  /**
   * Registers a TRIAL prospect and refreshes the student list.
   */
  const createTrialStudentMutation = useMutation({
    mutationFn: async (payload: CreateTrialStudentPayload) => {
      const response = await apiClient.post('/academic/students/trial', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['users', 'available-for-student'] });
    },
  });

  /**
   * Updates the academic profile, then optionally registers a SEPA mandate.
   */
  const updateStudentMutation = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateStudentPayload;
    }): Promise<StudentMutationResult> => {
      const { banking, ...academicPayload } = payload;
      const response = await apiClient.patch(`/academic/students/${id}`, academicPayload);
      const student = response.data as StudentProfileResponse;
      const attached = await attachMandate(student, banking);
      return { student, mandateFailed: attached.failed, mandate: attached.mandate };
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
    createTrialStudent: createTrialStudentMutation,
    updateStudent: updateStudentMutation,
    deleteStudent: deleteStudentMutation,
  };
}

/**
 * Loads one student profile for the dedicated edit route.
 *
 * @param {string | undefined} id - Student profile UUID.
 * @returns {UseQueryResult<StudentProfileResponse>} Profile query.
 */
export function useStudent(id: string | undefined) {
  return useQuery<StudentProfileResponse>({
    queryKey: ['students', id],
    enabled: Boolean(id),
    queryFn: async () => {
      const response = await apiClient.get(`/academic/students/${id}`);
      return response.data as StudentProfileResponse;
    },
  });
}
