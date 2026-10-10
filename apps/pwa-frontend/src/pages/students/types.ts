/**
 * @file types.ts
 * @description Shared TypeScript interfaces for Student Profiles, Guardians, and Belts.
 * Introduces EmergencyContactPayload for lightweight non-user contacts.
 */

export interface GuardianPayload {
  id?: string;
  isExistingUser?: boolean;
  userId?: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dni: string;
  relationship?: string;
  customRelationship?: string;
}

export interface EmergencyContactPayload {
  name: string;
  phone: string;
  relationship: string;
  customRelationship?: string;
}

export interface StudentRankPayload {
  id: string;
  beltRankId: string;
  disciplineName: string;
  beltName: string;
  currentStripes: number;
  maxStripes: number;
  accumulatedHours: number;
  minHoursRequired: number;
  minMonthsRequired: number;
  promotedAt: string;
}

export interface StudentProfileResponse {
  id: string;
  userId: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    dni?: string;
    phone?: string;
  };
  birthDate?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  emergencyContacts?: EmergencyContactPayload[];
  ranks?: StudentRankPayload[];
  guardians?: any[];
}

export interface CreateStudentPayload {
  isExistingUser: boolean;
  userId?: string | null;
  userData: {
    firstName: string;
    lastName: string;
    email: string;
    dni?: string;
    phone?: string;
    birthDate?: string;
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  isMinor: boolean;
  guardians?: GuardianPayload[];
  emergencyContacts?: EmergencyContactPayload[];
  disciplines?: any[];
}