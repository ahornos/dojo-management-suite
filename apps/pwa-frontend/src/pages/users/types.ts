/**
 * @file types.ts
 * @description Shared TypeScript interfaces for the user management module.
 * Login identity only — demographics live on StudentProfile.
 */

export interface UserFormPayload {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  gender: string;
  roles: string[];
  isActive: boolean;
}
