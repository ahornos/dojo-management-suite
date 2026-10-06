/**
 * @file types.ts
 * @description Shared TypeScript interfaces for the user management module.
 * Supports multi-role user configurations.
 */

export interface UserFormPayload {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  dni: string;
  birthDate: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  roles: string[];
  isActive: boolean;
}