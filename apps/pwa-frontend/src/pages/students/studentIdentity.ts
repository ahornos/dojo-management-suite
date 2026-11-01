/**
 * @file studentIdentity.ts
 * @description Display helpers for academic identity. Minors have no login User; demographics live on the profile.
 */

import type { StudentGuardianLink, StudentProfileResponse } from './types';

/**
 * Resolves the name shown in lists and headings.
 *
 * @param {StudentProfileResponse} student - Academic profile, possibly without a login User.
 * @returns {{ firstName: string; lastName: string }} Display names.
 */
export function studentDisplayName(student: StudentProfileResponse): { firstName: string; lastName: string } {
  return {
    firstName: student.firstName || student.user?.firstName || '',
    lastName: student.lastName || student.user?.lastName || '',
  };
}

/**
 * Resolves gender from the academic profile, falling back to a linked login User.
 *
 * @param {StudentProfileResponse} student - Academic profile.
 * @returns {string | null | undefined} Gender enum value when present.
 */
export function studentGender(student: StudentProfileResponse): string | null | undefined {
  return student.gender ?? student.user?.gender;
}

/**
 * Payer User id used to own a SEPA mandate: the student's login (adults) or the first guardian.
 *
 * @param {StudentProfileResponse} student - Academic profile with optional guardians.
 * @returns {string | undefined} Auth-service user id, or undefined when none exists.
 */
export function studentPayerUserId(student: StudentProfileResponse): string | undefined {
  if (student.userId) return student.userId;
  if (student.user?.id) return student.user.id;
  return firstGuardianUserId(student.guardians);
}

/**
 * @param {StudentGuardianLink[] | undefined} guardians - Linked parents.
 * @returns {string | undefined} First guardian User id.
 */
export function firstGuardianUserId(guardians: StudentGuardianLink[] | undefined): string | undefined {
  for (const link of guardians ?? []) {
    const id = link.guardian?.user?.id || link.guardian?.userId;
    if (id) return id;
  }
  return undefined;
}
