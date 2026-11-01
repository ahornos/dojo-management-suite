/**
 * @file attendance-age.ts
 * @description Age-bracket helpers for the session check-in roster.
 */

import { matchesAgeFilter } from '../licenses/license-filters';
import { DEFAULT_AGE_BRACKETS } from '../academy/default-age-brackets';

/** Inclusive named range used to classify a roster row. */
export interface AgeBracketRange {
  id?: string;
  code: string;
  minAge: number;
  maxAge: number;
}

/** Historical defaults used when a tenant has not loaded custom brackets yet. */
export const FALLBACK_AGE_BRACKETS: AgeBracketRange[] = DEFAULT_AGE_BRACKETS.map((row) => ({
  code: row.code,
  minAge: row.minAge,
  maxAge: row.maxAge,
}));

/**
 * Resolves inclusive age bounds from a named bracket and/or explicit min/max.
 *
 * @param {string | undefined} ageBracket - Named group code.
 * @param {number | undefined} minAge - Explicit lower bound.
 * @param {number | undefined} maxAge - Explicit upper bound.
 * @param {AgeBracketRange[]} [brackets] - Tenant catalog (defaults to product ranges).
 * @returns {{ minAge?: number; maxAge?: number }} Inclusive range, if any.
 */
export function resolveRosterAgeRange(
  ageBracket: string | undefined,
  minAge: number | undefined,
  maxAge: number | undefined,
  brackets: AgeBracketRange[] = FALLBACK_AGE_BRACKETS,
): { minAge?: number; maxAge?: number } {
  const named = ageBracket ? brackets.find((row) => row.code === ageBracket) : undefined;
  const min = minAge ?? named?.minAge;
  const max = maxAge ?? (named && named.maxAge < 999 ? named.maxAge : named ? undefined : undefined);
  return {
    ...(min !== undefined ? { minAge: min } : {}),
    ...(max !== undefined ? { maxAge: max } : {}),
  };
}

/**
 * Names the configured bracket for a completed age.
 *
 * @param {number | null} age - Completed years, or null when unknown.
 * @param {AgeBracketRange[]} [brackets] - Tenant catalog.
 * @returns {string | null} Bracket code, or null when unknown / out of range.
 */
export function ageBracketForAge(
  age: number | null,
  brackets: AgeBracketRange[] = FALLBACK_AGE_BRACKETS,
): string | null {
  if (age === null || age < 0) {
    return null;
  }
  const entry = brackets.find((range) => {
    const max = range.maxAge >= 999 ? Number.POSITIVE_INFINITY : range.maxAge;
    return age >= range.minAge && age <= max;
  });
  return entry?.code ?? null;
}

/**
 * Whether a birth date matches at least one of the selected inclusive ranges.
 *
 * @param {Date | null | undefined} birthDate - Profile date of birth.
 * @param {AgeBracketRange[]} ranges - Selected brackets (empty = no filter).
 * @param {Date} today - Reference date.
 * @returns {boolean} True when no range is set or the age matches any range.
 */
export function matchesAnyAgeBracket(
  birthDate: Date | null | undefined,
  ranges: AgeBracketRange[],
  today: Date,
): boolean {
  if (ranges.length === 0) {
    return true;
  }
  return ranges.some((range) =>
    matchesRosterAge(birthDate, range.minAge, range.maxAge >= 999 ? undefined : range.maxAge, today),
  );
}

/**
 * Whether a birth date matches the resolved roster range.
 *
 * @param {Date | null | undefined} birthDate - Profile date of birth.
 * @param {number | undefined} minAge - Inclusive minimum.
 * @param {number | undefined} maxAge - Inclusive maximum.
 * @param {Date} today - Reference date.
 * @returns {boolean} True when no range is set or the age matches.
 */
export function matchesRosterAge(
  birthDate: Date | null | undefined,
  minAge: number | undefined,
  maxAge: number | undefined,
  today: Date,
): boolean {
  return matchesAgeFilter(birthDate, minAge, maxAge, today);
}
