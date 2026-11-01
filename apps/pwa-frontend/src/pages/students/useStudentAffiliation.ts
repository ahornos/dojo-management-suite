/**
 * @file useStudentAffiliation.ts
 * @description Loads current federation status for one student from academic-service.
 * Federation names are resolved server-side over HTTP (no cross-domain Prisma join).
 */

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

export interface StudentAffiliation {
  federationId: string;
  federationName: string | null;
  federationAcronym: string | null;
  season: string;
  validUntil: string;
  status?: string;
}

export interface StudentAffiliationStatus {
  studentProfileId: string;
  federated: boolean;
  affiliations: StudentAffiliation[];
}

/**
 * Fetches affiliation status when a student row is expanded.
 *
 * @param {string | undefined} studentProfileId - Academic profile id.
 * @param {boolean} enabled - Typically the row-expanded flag.
 * @returns Query of current federation membership.
 */
export function useStudentAffiliation(studentProfileId: string | undefined, enabled: boolean) {
  return useQuery<StudentAffiliationStatus>({
    queryKey: ['academic', 'licenses', 'affiliation-status', studentProfileId],
    enabled: enabled && Boolean(studentProfileId),
    queryFn: async () => {
      const response = await apiClient.get('/academic/licenses/affiliation-status', {
        params: { studentProfileId },
      });
      return response.data as StudentAffiliationStatus;
    },
  });
}
