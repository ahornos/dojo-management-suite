/**
 * @file mapUserForm.ts
 * @description Maps a directory user record onto {@link UserFormPayload}.
 */

import type { UserFormPayload } from './types';

/** Subset of the auth-service user summary used by the Users module. */
export interface UserDirectoryRecord {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  gender?: string | null;
  roles?: string[];
  role?: string;
  isActive?: boolean;
}

/**
 * Builds form state from a directory row.
 *
 * @param {UserDirectoryRecord} user - Auth-service user summary.
 * @returns {UserFormPayload} Form payload (empty password).
 */
export function toUserFormPayload(user: UserDirectoryRecord): UserFormPayload {
  return {
    id: user.id,
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    gender: user.gender || '',
    roles: Array.isArray(user.roles) ? user.roles : [user.role || 'STUDENT'],
    isActive: user.isActive ?? true,
    password: '',
  };
}

/**
 * Display name for edit-page titles.
 *
 * @param {UserDirectoryRecord} user - Directory row.
 * @returns {string} `firstName lastName`.
 */
export function userDisplayName(user: UserDirectoryRecord): string {
  const name = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();
  return name || user.email || user.id;
}
