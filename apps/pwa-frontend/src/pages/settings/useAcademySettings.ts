/**
 * @file useAcademySettings.ts
 * @description React Query hooks for academy identity/theme, age brackets, and schedule slots.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import type {
  AcademySettings,
  AgeBracket,
  AgeBracketPayload,
  SavedAppearance,
  SavedAppearancePayload,
  ScheduleSlot,
  ScheduleSlotPayload,
  UpsertAcademySettingsPayload,
} from './types';

export const ACADEMY_SETTINGS_KEY = ['academic', 'academy', 'settings'] as const;
const APPEARANCES_KEY = ['academic', 'academy', 'appearances'] as const;
const BRACKETS_KEY = ['academic', 'academy', 'age-brackets'] as const;
const SLOTS_KEY = ['academic', 'academy', 'schedule-slots'] as const;

/**
 * Loads the tenant operational settings row (identity + theme). Safe for any authenticated user.
 *
 * @returns Query of academy identity and brand.
 */
export function useAcademySettings() {
  const queryClient = useQueryClient();
  const query = useQuery<AcademySettings>({
    queryKey: ACADEMY_SETTINGS_KEY,
    queryFn: async () => {
      const response = await apiClient.get('/academic/academy/settings');
      return response.data as AcademySettings;
    },
  });

  const save = useMutation({
    mutationFn: async (payload: UpsertAcademySettingsPayload) => {
      const response = await apiClient.put('/academic/academy/settings', payload);
      return response.data as AcademySettings;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(ACADEMY_SETTINGS_KEY, data);
    },
  });

  return { ...query, save };
}

/**
 * Lists tenant-owned custom appearances and exposes create/update/delete/activate mutations.
 *
 * @returns Query plus write mutations for saved appearances.
 */
export function useSavedAppearances() {
  const queryClient = useQueryClient();
  const query = useQuery<SavedAppearance[]>({
    queryKey: APPEARANCES_KEY,
    queryFn: async () => {
      const response = await apiClient.get('/academic/academy/appearances');
      return response.data as SavedAppearance[];
    },
  });

  const create = useMutation({
    mutationFn: async (payload: SavedAppearancePayload) => {
      const response = await apiClient.post('/academic/academy/appearances', payload);
      return response.data as SavedAppearance;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: APPEARANCES_KEY });
      await queryClient.invalidateQueries({ queryKey: ACADEMY_SETTINGS_KEY });
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, ...payload }: Partial<SavedAppearancePayload> & { id: string }) => {
      const response = await apiClient.patch(`/academic/academy/appearances/${id}`, payload);
      return response.data as SavedAppearance;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: APPEARANCES_KEY });
      await queryClient.invalidateQueries({ queryKey: ACADEMY_SETTINGS_KEY });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/academic/academy/appearances/${id}`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: APPEARANCES_KEY });
      await queryClient.invalidateQueries({ queryKey: ACADEMY_SETTINGS_KEY });
    },
  });

  const activate = useMutation({
    mutationFn: async (key: string) => {
      const response = await apiClient.put('/academic/academy/appearances/active', { key });
      return response.data as AcademySettings;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(ACADEMY_SETTINGS_KEY, data);
    },
  });

  return { ...query, create, update, remove, activate };
}

/**
 * Lists tenant age brackets (product defaults are seeded server-side on first read).
 *
 * @returns Query of age brackets.
 */
export function useAgeBracketCatalog() {
  return useQuery<AgeBracket[]>({
    queryKey: BRACKETS_KEY,
    queryFn: async () => {
      const response = await apiClient.get('/academic/academy/age-brackets');
      return response.data as AgeBracket[];
    },
  });
}

/**
 * Mutations for creating, updating, and deleting age brackets.
 *
 * @returns Age-bracket write mutations.
 */
export function useAgeBracketMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: async (payload: AgeBracketPayload) => {
      const response = await apiClient.post('/academic/academy/age-brackets', payload);
      return response.data as AgeBracket;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: BRACKETS_KEY });
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, ...payload }: AgeBracketPayload & { id: string }) => {
      const response = await apiClient.patch(`/academic/academy/age-brackets/${id}`, payload);
      return response.data as AgeBracket;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: BRACKETS_KEY });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/academic/academy/age-brackets/${id}`);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: BRACKETS_KEY });
    },
  });

  return { create, update, remove };
}

/**
 * Lists weekly master-calendar slots.
 *
 * @returns Query of schedule slots.
 */
export function useScheduleSlots() {
  return useQuery<ScheduleSlot[]>({
    queryKey: SLOTS_KEY,
    queryFn: async () => {
      const response = await apiClient.get('/academic/academy/schedule-slots');
      return response.data as ScheduleSlot[];
    },
  });
}

/**
 * Mutations for the weekly master calendar.
 *
 * @returns Schedule-slot write mutations.
 */
export function useScheduleSlotMutations() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: async (payload: ScheduleSlotPayload) => {
      const response = await apiClient.post('/academic/academy/schedule-slots', payload);
      return response.data as ScheduleSlot;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: SLOTS_KEY });
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, ...payload }: Partial<ScheduleSlotPayload> & { id: string }) => {
      const response = await apiClient.patch(`/academic/academy/schedule-slots/${id}`, payload);
      return response.data as ScheduleSlot;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: SLOTS_KEY });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/academic/academy/schedule-slots/${id}`);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: SLOTS_KEY });
    },
  });

  return { create, update, remove };
}
