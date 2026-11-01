/**
 * @file default-age-brackets.ts
 * @description Product-default age ranges seeded on first academy-settings read.
 * Matches the historical student-directory / license-wizard brackets.
 */

/** Inclusive age range seeded when a tenant has no custom brackets yet. */
export interface DefaultAgeBracket {
  code: string;
  name: string;
  minAge: number;
  maxAge: number;
  sortOrder: number;
}

/**
 * Historical Kids / Infantil / Juvenil / Adults ranges used before tenant-owned config.
 */
export const DEFAULT_AGE_BRACKETS: readonly DefaultAgeBracket[] = [
  { code: 'kids', name: 'Kids', minAge: 3, maxAge: 6, sortOrder: 10 },
  { code: 'infantil', name: 'Child', minAge: 7, maxAge: 12, sortOrder: 20 },
  { code: 'juvenil', name: 'Juvenile', minAge: 13, maxAge: 15, sortOrder: 30 },
  { code: 'adults', name: 'Adults', minAge: 16, maxAge: 999, sortOrder: 40 },
] as const;
