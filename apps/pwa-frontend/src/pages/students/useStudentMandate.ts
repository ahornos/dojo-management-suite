/**
 * @file useStudentMandate.ts
 * @description Loads a payer's SEPA mandate and records clickwrap digital signature.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { apiClient } from '@/lib/api';
import type { BankMandate } from './types';

/**
 * React Query key for a mandate looked up by id or payer.
 *
 * @param {string} lookupKey - Mandate id or payer user id.
 * @returns {readonly [string, string, string]} Stable query key.
 */
export function studentMandateQueryKey(lookupKey: string) {
  return ['financial', 'mandates', lookupKey] as const;
}

interface UseStudentMandateArgs {
  mandateId?: string | null;
  payerUserId?: string | null;
}

/**
 * Loads a mandate by id (preferred) or the payer's active mandate, and exposes clickwrap signing.
 *
 * @param {UseStudentMandateArgs} args - Academic `bankMandateId` and/or payer User id.
 * @returns Query state and `signMandate` mutation.
 */
export function useStudentMandate({ mandateId, payerUserId }: UseStudentMandateArgs) {
  const queryClient = useQueryClient();
  const lookupKey = mandateId || payerUserId || '';
  const queryKey = studentMandateQueryKey(lookupKey);

  const mandateQuery = useQuery<BankMandate | null>({
    queryKey,
    enabled: Boolean(lookupKey),
    retry: false,
    queryFn: async () => {
      try {
        const response = await apiClient.get('/financial/mandates', {
          params: mandateId ? { id: mandateId } : { payerUserId },
        });
        return response.data as BankMandate;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },
  });

  const signMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.patch(`/financial/mandates/${id}/sign`, {
        accepted: true,
      });
      return response.data as BankMandate;
    },
    onSuccess: (mandate) => {
      queryClient.setQueryData(studentMandateQueryKey(mandate.id), mandate);
      queryClient.setQueryData(studentMandateQueryKey(mandate.payerUserId), mandate);
    },
  });

  return {
    mandate: mandateQuery.data ?? null,
    isLoading: mandateQuery.isLoading,
    error: mandateQuery.error,
    signMandate: signMutation,
  };
}
