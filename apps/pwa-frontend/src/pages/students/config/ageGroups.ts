/**
 * @file ageGroups.ts
 * @description Age-range catalog used by the student directory, licenses, and attendance.
 * Tenant-owned brackets come from `/academic/academy/age-brackets`; these remain the fallback.
 */

export interface AgeGroupConfig {
  id: string;
  labelKey?: string;
  name?: string;
  minAge: number;
  maxAge: number;
}

const KNOWN_LABEL_KEYS: Record<string, string> = {
  kids: 'students.age_groups.kids',
  infantil: 'students.age_groups.infantil',
  juvenil: 'students.age_groups.juvenil',
  adults: 'students.age_groups.adults',
};

export const AGE_GROUPS: AgeGroupConfig[] = [
  { id: 'kids', labelKey: KNOWN_LABEL_KEYS.kids, name: 'Kids', minAge: 3, maxAge: 6 },
  { id: 'infantil', labelKey: KNOWN_LABEL_KEYS.infantil, name: 'Child', minAge: 7, maxAge: 12 },
  { id: 'juvenil', labelKey: KNOWN_LABEL_KEYS.juvenil, name: 'Juvenile', minAge: 13, maxAge: 15 },
  { id: 'adults', labelKey: KNOWN_LABEL_KEYS.adults, name: 'Adults', minAge: 16, maxAge: 999 },
];

/**
 * Maps a persisted tenant bracket onto the filter catalog used by the PWA.
 *
 * @param {{ code: string; name: string; minAge: number; maxAge: number }} bracket - API row.
 * @returns {AgeGroupConfig} Filter option.
 */
export function ageBracketToGroup(bracket: {
  code: string;
  name: string;
  minAge: number;
  maxAge: number;
}): AgeGroupConfig {
  return {
    id: bracket.code,
    labelKey: KNOWN_LABEL_KEYS[bracket.code],
    name: bracket.name,
    minAge: bracket.minAge,
    maxAge: bracket.maxAge,
  };
}

/**
 * Localized label for a bracket, falling back to the stored name.
 *
 * @param {AgeGroupConfig} group - Catalog row.
 * @param {(key: string) => string} t - i18n translator.
 * @returns {string} Display label.
 */
export function ageGroupLabel(group: AgeGroupConfig, t: (key: string) => string): string {
  if (group.labelKey) {
    const translated = t(group.labelKey);
    if (translated !== group.labelKey) return translated;
  }
  if (group.name) return group.name;
  return group.id;
}
