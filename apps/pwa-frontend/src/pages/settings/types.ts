/**
 * @file types.ts
 * @description Academy identity, theme, age-bracket, and weekly schedule contracts.
 */

import type { ThemeConfig } from './theme';

export type { ThemeConfig } from './theme';

export interface AcademySettings {
  id: string;
  tenantId: string;
  legalName: string;
  tradeName: string;
  taxId: string;
  officialEmail: string;
  timezone: string;
  defaultCurrency: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  displayName: string;
  brandName: string;
  website: string;
  logoUrl: string;
  isotypeUrl: string;
  pdfLogoUrl: string;
  themeConfig: ThemeConfig;
  activeAppearanceKey: string;
}

export interface SavedAppearance {
  id: string;
  tenantId: string;
  name: string;
  themeConfig: ThemeConfig;
  createdAt: string;
  updatedAt: string;
}

export interface AgeBracket {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  minAge: number;
  maxAge: number;
  sortOrder: number;
}

export interface ScheduleSlot {
  id: string;
  tenantId: string;
  weekday: number;
  startTime: string;
  endTime: string;
  disciplineId: string;
  instructorUserId: string;
  maxCapacity: number | null;
  ageBracketIds: string[];
  label: string | null;
  isActive: boolean;
}

export interface UpsertAcademySettingsPayload {
  legalName?: string;
  tradeName?: string;
  taxId?: string;
  officialEmail?: string;
  timezone?: string;
  defaultCurrency?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  logoUrl?: string;
  isotypeUrl?: string;
  pdfLogoUrl?: string;
  themeConfig?: ThemeConfig;
  activeAppearanceKey?: string;
}

export interface SavedAppearancePayload {
  name: string;
  themeConfig: ThemeConfig;
  activate?: boolean;
}

export interface AgeBracketPayload {
  name: string;
  code?: string;
  minAge: number;
  maxAge: number;
  sortOrder?: number;
}

export interface ScheduleSlotPayload {
  weekday: number;
  startTime: string;
  endTime: string;
  disciplineId: string;
  instructorUserId: string;
  maxCapacity?: number;
  ageBracketIds?: string[];
  label?: string;
  isActive?: boolean;
}

export interface StaffUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles?: string[];
}

export const SETTINGS_TABS = ['general', 'appearance', 'schedule', 'academic', 'billing'] as const;
export type SettingsTab = (typeof SETTINGS_TABS)[number];
