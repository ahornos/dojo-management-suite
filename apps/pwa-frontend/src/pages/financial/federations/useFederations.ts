/**
 * @file useFederations.ts
 * @description React Query hooks for federation catalog CRUD, status toggles, and seasonal budgets.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import type { FederationFormValues } from './schema';
import type {
  Federation,
  FederationChargeHolder,
  FederationListStatus,
  FederationPayload,
} from './types';

const QUERY_KEY = ['financial', 'federations'] as const;

export interface FederationListFilters {
  q?: string;
  status?: FederationListStatus;
}

/**
 * Compact optional money: blank becomes omitted so the API stores `0.00`.
 *
 * @param {string} value - Form field.
 * @returns {string | undefined} Trimmed amount.
 */
function compactMoney(value: string | undefined): string | undefined {
  const trimmed = value?.trim() ?? '';
  return trimmed === '' ? undefined : trimmed;
}

/**
 * @param {string} value - Optional integer as a string.
 * @returns {number | undefined} Parsed integer.
 */
function compactInt(value: string | undefined): number | undefined {
  const trimmed = value?.trim() ?? '';
  if (!trimmed) return undefined;
  const parsed = Number.parseInt(trimmed, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

/**
 * Loads tenant federations and exposes create/update/activate/deactivate/delete plus budget/charge writes.
 *
 * @param {boolean} [enabled=true] - Skip the list query (e.g. non-staff dashboard).
 * @param {FederationListFilters} [filters] - Search and lifecycle status forwarded to the API.
 * @returns Catalog query and mutations.
 */
export function useFederations(enabled = true, filters: FederationListFilters = {}) {
  const queryClient = useQueryClient();
  const q = filters.q?.trim() ?? '';
  const status = filters.status ?? '';

  const listQuery = useQuery<Federation[]>({
    queryKey: [...QUERY_KEY, q, status],
    enabled,
    queryFn: async () => {
      const response = await apiClient.get('/financial/federations', {
        params: {
          ...(q ? { q } : {}),
          ...(status ? { status } : {}),
        },
      });
      return response.data as Federation[];
    },
  });

  const invalidate = (): void => {
    void queryClient.invalidateQueries({ queryKey: QUERY_KEY });
  };

  const createMutation = useMutation({
    mutationFn: async (payload: FederationPayload) => {
      const response = await apiClient.post('/financial/federations', payload);
      return response.data as Federation;
    },
    onSuccess: invalidate,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...payload }: FederationPayload & { id: string }) => {
      const response = await apiClient.patch(`/financial/federations/${id}`, payload);
      return response.data as Federation;
    },
    onSuccess: invalidate,
  });

  const activateMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.patch(`/financial/federations/${id}/activate`);
      return response.data as Federation;
    },
    onSuccess: invalidate,
  });

  const deactivateMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.patch(`/financial/federations/${id}/deactivate`);
      return response.data as Federation;
    },
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: async ({ id, mode }: { id: string; mode: 'soft' | 'hard' }) => {
      const response = await apiClient.delete(`/financial/federations/${id}`, { params: { mode } });
      return response.data as Federation | { deleted: true; id: string };
    },
    onSuccess: invalidate,
  });

  return {
    federations: listQuery.data ?? [],
    isLoading: listQuery.isLoading,
    error: listQuery.error,
    createFederation: createMutation,
    updateFederation: updateMutation,
    activateFederation: activateMutation,
    deactivateFederation: deactivateMutation,
    deleteFederation: deleteMutation,
  };
}

/**
 * Persists seasonal federation charges after academic licenses are issued.
 *
 * @returns Mutation posting `/financial/federations/:id/charges`.
 */
export function useCreateFederationCharges() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      federationId: string;
      season: string;
      includeClubFee: boolean;
      holders: FederationChargeHolder[];
    }) => {
      const response = await apiClient.post(`/financial/federations/${input.federationId}/charges`, {
        season: input.season,
        includeClubFee: input.includeClubFee,
        holders: input.holders,
      });
      return response.data as { created: number; skipped: number };
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['financial', 'federations'] });
    },
  });
}

/**
 * Maps form values onto the API payload (blank money omitted).
 *
 * @param {FederationFormValues} values - Form values.
 * @returns {FederationPayload} Compact payload.
 */
export function toFederationPayload(values: FederationFormValues): FederationPayload {
  return {
    name: values.name.trim(),
    acronym: values.acronym.trim() || undefined,
    country: values.country.trim().toUpperCase(),
    email: values.email.trim(),
    contacts: values.contacts
      .filter((contact) => contact.value.trim() !== '')
      .map((contact) => ({
        medium: contact.medium,
        tag: contact.tag.trim(),
        value: contact.value.trim(),
      })),
    seasons: values.seasons
      .filter((season) => season.seasonName.trim() !== '')
      .map((season) => ({
        ...(season.id ? { id: season.id } : {}),
        seasonName: season.seasonName.trim(),
        currency: season.currency,
        clubCost: compactMoney(season.clubCost),
        isActive: true,
        licenseTypes: season.licenseTypes
          .filter((type) => type.name.trim() !== '')
          .map((type) => ({
            ...(type.id ? { id: type.id } : {}),
            name: type.name.trim(),
            isActive: true,
            priceRows: type.priceRows.map((row) => ({
              ...(row.id ? { id: row.id } : {}),
              kind: row.kind,
              label: row.kind === 'CUSTOM' ? row.label.trim() : undefined,
              birthYearFrom: row.kind === 'CUSTOM' ? (compactInt(row.birthYearFrom) ?? null) : null,
              cost: compactMoney(row.cost),
              reduction: compactMoney(row.reduction) ?? '0.00',
              chargePrice: compactMoney(row.chargePrice),
            })),
          })),
      })),
  };
}
