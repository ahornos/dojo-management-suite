/**
 * @file ageGroups.ts
 * @description Centralized configuration for student age ranges.
 * Used for categorizing students into natural classes for filtering.
 * Future iteration: Fetch these values from an API configuration endpoint.
 */

export interface AgeGroupConfig {
  id: string;
  labelKey: string; // Translation key for i18n
  minAge: number;
  maxAge: number;
}

export const AGE_GROUPS: AgeGroupConfig[] = [
  { id: 'kids', labelKey: 'students.age_groups.kids', minAge: 3, maxAge: 6 },
  { id: 'infantil', labelKey: 'students.age_groups.infantil', minAge: 7, maxAge: 12 },
  { id: 'juvenil', labelKey: 'students.age_groups.juvenil', minAge: 13, maxAge: 15 },
  { id: 'adults', labelKey: 'students.age_groups.adults', minAge: 16, maxAge: 999 },
];