/**
 * @file license-filters.ts
 * @description Pure helpers for massive license-generation filters (age, enrollment date).
 */

/** Completed years of age at which a student is an adult (has/requires a User login). */
export const ADULT_AGE_YEARS = 18;

/**
 * Age in full years at `today`.
 *
 * @param {Date} birthDate - Date of birth.
 * @param {Date} today - Reference date.
 * @returns {number} Completed years of age.
 */
export function ageInYears(birthDate: Date, today: Date): number {
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDelta = today.getMonth() - birthDate.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }
  return age;
}

/**
 * Whether this student is a minor. Age is always computed from `StudentProfile.birthDate`.
 * A missing birth date is treated as a minor only when there is no login `userId`.
 *
 * @param {Date | null | undefined} birthDate - Profile date of birth.
 * @param {string | null | undefined} userId - Login identity, null for minors.
 * @param {Date} [today] - Reference date.
 * @returns {boolean} `true` when the holder must use a guardian payer.
 */
export function isMinor(
  birthDate: Date | null | undefined,
  userId: string | null | undefined,
  today: Date = new Date(),
): boolean {
  if (birthDate && !Number.isNaN(birthDate.getTime())) {
    return ageInYears(birthDate, today) < ADULT_AGE_YEARS;
  }
  return !userId;
}

/**
 * Whether a birth date falls inside an inclusive age range.
 *
 * @param {Date | null | undefined} birthDate - Identity birth date.
 * @param {number | undefined} minAge - Inclusive minimum age.
 * @param {number | undefined} maxAge - Inclusive maximum age.
 * @param {Date} [today] - Reference date (injectable for tests).
 * @returns {boolean} `true` when no range is set, or the age matches.
 */
export function matchesAgeFilter(
  birthDate: Date | null | undefined,
  minAge: number | undefined,
  maxAge: number | undefined,
  today: Date = new Date(),
): boolean {
  if (minAge === undefined && maxAge === undefined) {
    return true;
  }
  if (!birthDate) {
    return false;
  }
  const age = ageInYears(birthDate, today);
  if (minAge !== undefined && age < minAge) {
    return false;
  }
  if (maxAge !== undefined && age > maxAge) {
    return false;
  }
  return true;
}

/**
 * Whether a birth date falls inside an inclusive UTC birth-year window.
 *
 * @param {Date | null | undefined} birthDate - Identity birth date.
 * @param {number | undefined} birthYearFrom - Inclusive lower year (e.g. 2010).
 * @param {number | undefined} birthYearTo - Inclusive upper year (e.g. 2015).
 * @returns {boolean} `true` when no bound is set, or the year matches.
 */
export function matchesBirthYearFilter(
  birthDate: Date | null | undefined,
  birthYearFrom: number | undefined,
  birthYearTo: number | undefined,
): boolean {
  if (birthYearFrom === undefined && birthYearTo === undefined) {
    return true;
  }
  if (!birthDate || Number.isNaN(birthDate.getTime())) {
    return false;
  }
  const year = birthDate.getUTCFullYear();
  if (birthYearFrom !== undefined && year < birthYearFrom) {
    return false;
  }
  if (birthYearTo !== undefined && year > birthYearTo) {
    return false;
  }
  return true;
}

/**
 * Whether the profile was created strictly before the given date.
 *
 * @param {Date} createdAt - Enrollment / profile creation timestamp.
 * @param {Date | undefined} enrollmentDateBefore - Exclusive upper bound.
 * @returns {boolean} `true` when no bound is set, or `createdAt` is earlier.
 */
export function matchesEnrollmentFilter(createdAt: Date, enrollmentDateBefore: Date | undefined): boolean {
  if (!enrollmentDateBefore) {
    return true;
  }
  return createdAt.getTime() < enrollmentDateBefore.getTime();
}

/**
 * Default season validity: 31 August of the season end year (`2026-2027` → 2027-08-31).
 *
 * @param {string} season - `YYYY-YYYY`.
 * @returns {Date} Validity end (UTC midnight).
 */
export function defaultValidUntil(season: string): Date {
  const endYear = Number.parseInt(season.split('-')[1] ?? '', 10);
  if (!Number.isFinite(endYear)) {
    const fallback = new Date();
    fallback.setUTCFullYear(fallback.getUTCFullYear() + 1, 7, 31);
    fallback.setUTCHours(0, 0, 0, 0);
    return fallback;
  }
  return new Date(Date.UTC(endYear, 7, 31, 0, 0, 0, 0));
}
