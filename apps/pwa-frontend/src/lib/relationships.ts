/**
 * @file relationships.ts
 * @description Maps persisted Spanish relationship values to localized labels.
 */

const RELATIONSHIP_KEYS: Record<string, string> = {
  Padre: 'relationships.father',
  Madre: 'relationships.mother',
  'Hermano/a': 'relationships.sibling',
  Pareja: 'relationships.partner',
  'Amigo/a': 'relationships.friend',
  'Tutor Legal': 'relationships.legal_guardian',
  Tutor: 'relationships.legal_guardian',
  Familiar: 'relationships.relative',
  Otro: 'relationships.other',
};

export const GUARDIAN_RELATIONSHIP_OPTIONS = [
  { value: 'Padre', labelKey: 'relationships.father' },
  { value: 'Madre', labelKey: 'relationships.mother' },
  { value: 'Tutor Legal', labelKey: 'relationships.legal_guardian' },
  { value: 'Familiar', labelKey: 'relationships.relative' },
  { value: 'Otro', labelKey: 'relationships.other_specify' },
] as const;

export const EMERGENCY_RELATIONSHIP_OPTIONS = [
  { value: 'Padre', labelKey: 'relationships.father' },
  { value: 'Madre', labelKey: 'relationships.mother' },
  { value: 'Hermano/a', labelKey: 'relationships.sibling' },
  { value: 'Pareja', labelKey: 'relationships.partner' },
  { value: 'Amigo/a', labelKey: 'relationships.friend' },
  { value: 'Otro', labelKey: 'relationships.other' },
] as const;

/**
 * Resolves a stored relationship value to a localized label.
 *
 * @param {string | undefined} value - Persisted relationship string (Spanish values stay in the DB).
 * @param {(key: string) => string} t - `i18next` `t` function.
 * @returns {string} Localized label, or the raw value when no mapping exists.
 */
export function getLocalizedRelationship(value: string | undefined, t: (key: string) => string): string {
  if (!value) return t('relationships.legal_guardian');
  const key = RELATIONSHIP_KEYS[value];
  return key ? t(key) : value;
}
