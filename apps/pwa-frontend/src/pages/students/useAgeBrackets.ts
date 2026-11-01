/**
 * @file useAgeBrackets.ts
 * @description Loads tenant age brackets for directory, licenses, and attendance filters.
 */

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { AGE_GROUPS, ageBracketToGroup, type AgeGroupConfig } from './config/ageGroups';
import type { AgeBracket } from '@/pages/settings/types';

/**
 * Tenant age brackets with a fallback to the historical product ranges.
 *
 * @returns {{ ageGroups: AgeGroupConfig[]; isLoading: boolean }} Catalog for filters.
 */
export function useAgeBrackets(): { ageGroups: AgeGroupConfig[]; isLoading: boolean } {
  const query = useQuery<AgeGroupConfig[]>({
    queryKey: ['academic', 'academy', 'age-brackets', 'as-groups'],
    queryFn: async () => {
      const response = await apiClient.get('/academic/academy/age-brackets');
      const rows = response.data as AgeBracket[];
      return rows.map(ageBracketToGroup);
    },
  });

  return {
    ageGroups: query.data && query.data.length > 0 ? query.data : AGE_GROUPS,
    isLoading: query.isLoading,
  };
}
