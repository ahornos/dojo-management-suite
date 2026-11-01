/**
 * @file useFinancialConfig.ts
 * @description React Query hook for the academy (tenant) financial configuration.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { toIban } from '@/lib/iban';
import type { FinancialConfig, UpdateFinancialConfigPayload } from './types';

const QUERY_KEY = ['financial', 'config'] as const;

/**
 * Loads and updates the tenant financial configuration via `/financial/config`.
 * Tenant isolation is the `x-school-id` header already injected by `apiClient`.
 *
 * @returns Query state and the save mutation.
 */
export function useFinancialConfig() {
  const queryClient = useQueryClient();

  const configQuery = useQuery<FinancialConfig>({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      const response = await apiClient.get('/financial/config');
      return response.data as FinancialConfig;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (payload: UpdateFinancialConfigPayload) => {
      const response = await apiClient.put('/financial/config', {
        ...payload,
        iban: toIban(payload.iban),
        bic: payload.bic.trim() === '' ? '' : payload.bic.trim(),
      });
      return response.data as FinancialConfig;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEY, data);
    },
  });

  return {
    config: configQuery.data,
    isLoading: configQuery.isLoading,
    error: configQuery.error,
    save: saveMutation,
  };
}
