/**
 * @file useLicenses.ts
 * @description React Query hooks for affiliation licenses, expiry alerts, preview, and batch issuance.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import type {
  AffiliationLicense,
  LicenseBatchResult,
  LicensePreviewFilters,
  LicensePreviewHolder,
} from './types';

const LIST_KEY = ['academic', 'licenses'] as const;
const EXPIRING_KEY = ['academic', 'licenses', 'expiring'] as const;

/**
 * Lists tenant affiliation licenses.
 *
 * @returns Query of license rows with holder identity.
 */
export function useLicenses() {
  return useQuery<AffiliationLicense[]>({
    queryKey: LIST_KEY,
    queryFn: async () => {
      const response = await apiClient.get('/academic/licenses');
      return response.data as AffiliationLicense[];
    },
  });
}

/**
 * Active licenses expiring within 30 days (dashboard alert).
 *
 * @param {boolean} enabled - Whether the caller is allowed to see the alert.
 * @returns Query of expiring licenses.
 */
export function useExpiringLicenses(enabled: boolean) {
  return useQuery<AffiliationLicense[]>({
    queryKey: EXPIRING_KEY,
    enabled,
    queryFn: async () => {
      const response = await apiClient.get('/academic/licenses/expiring', { params: { days: 30 } });
      return response.data as AffiliationLicense[];
    },
  });
}

/**
 * Preview + batch issuance mutations. Academic writes licenses; the wizard posts charges separately.
 *
 * @returns Preview and batch mutations plus cache invalidation.
 */
export function useLicenseBatch() {
  const queryClient = useQueryClient();

  const preview = useMutation({
    mutationFn: async (filters: LicensePreviewFilters) => {
      const response = await apiClient.post('/academic/licenses/preview', filters);
      return response.data as { holders: LicensePreviewHolder[] };
    },
  });

  const issueBatch = useMutation({
    mutationFn: async (payload: LicensePreviewFilters & { amountCharged?: string; isPaid?: boolean }) => {
      const response = await apiClient.post('/academic/licenses/batch', payload);
      return response.data as LicenseBatchResult;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: LIST_KEY });
      void queryClient.invalidateQueries({ queryKey: EXPIRING_KEY });
    },
  });

  return { preview, issueBatch };
}
