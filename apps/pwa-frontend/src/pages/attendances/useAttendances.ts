/**
 * @file useAttendances.ts
 * @description React Query hooks for class sessions, check-in saves, and belt-promotion shortcuts.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import type {
  AttendanceSession,
  AttendanceSessionDetail,
  CreateAttendanceSessionPayload,
  UpsertAttendanceRecordsPayload,
} from './types';

const SESSIONS_KEY = ['academic', 'attendances', 'sessions'] as const;

/**
 * Lists class sessions for a calendar day (server generates missing master-calendar sessions).
 *
 * @param {string} date - `YYYY-MM-DD`.
 * @param {string} [disciplineId] - Optional catalog filter.
 * @returns Query of session headers.
 */
export function useAttendanceSessions(date: string, disciplineId?: string) {
  return useQuery<AttendanceSession[]>({
    queryKey: [...SESSIONS_KEY, date, disciplineId ?? ''],
    enabled: Boolean(date),
    queryFn: async () => {
      const response = await apiClient.get('/academic/attendances/sessions', {
        params: { dateFrom: date, dateTo: date, ...(disciplineId ? { disciplineId } : {}) },
      });
      return response.data as AttendanceSession[];
    },
  });
}

/**
 * Loads one session and its roster, optionally narrowed by age-bracket codes.
 *
 * @param {string | undefined} sessionId - Session UUID.
 * @param {string[]} [ageBrackets] - Selected age-group codes.
 * @returns Query of the check-in roster.
 */
export function useAttendanceSession(sessionId: string | undefined, ageBrackets?: string[]) {
  const codes = (ageBrackets ?? []).filter(Boolean).join(',');
  return useQuery<AttendanceSessionDetail>({
    queryKey: [...SESSIONS_KEY, sessionId, codes],
    enabled: Boolean(sessionId),
    queryFn: async () => {
      const response = await apiClient.get(`/academic/attendances/sessions/${sessionId}`, {
        params: codes ? { ageBrackets: codes } : undefined,
      });
      return response.data as AttendanceSessionDetail;
    },
  });
}

/**
 * Creates an exceptional (or reused) class session, then invalidates the day list.
 *
 * @returns Mutation posting session payload.
 */
export function useCreateAttendanceSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateAttendanceSessionPayload) => {
      const response = await apiClient.post('/academic/attendances/sessions', payload);
      return response.data as AttendanceSession;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: SESSIONS_KEY });
    },
  });
}

/**
 * Saves the check-in grid for one session.
 *
 * @returns Mutation posting `{ records: [{ studentProfileId, status }] }`.
 */
export function useSaveAttendanceRecords() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      sessionId,
      payload,
    }: {
      sessionId: string;
      payload: UpsertAttendanceRecordsPayload;
    }) => {
      const response = await apiClient.post(`/academic/attendances/sessions/${sessionId}/records`, payload);
      return response.data as AttendanceSessionDetail;
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: SESSIONS_KEY });
      void queryClient.invalidateQueries({ queryKey: [...SESSIONS_KEY, variables.sessionId] });
    },
  });
}

/**
 * Executes or proposes a belt promotion from the check-in row.
 *
 * @returns Mutation posting `/academic/graduations/graduate/:id`.
 */
export function useGraduateFromAttendance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (studentProfileId: string) => {
      const response = await apiClient.post(`/academic/graduations/graduate/${studentProfileId}`, {});
      return response.data as unknown;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: SESSIONS_KEY });
    },
  });
}
