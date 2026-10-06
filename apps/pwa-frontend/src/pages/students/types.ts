/**
 * @file types.ts
 * @description Shared TypeScript interfaces for Student Profiles, Guardians, and Belts.
 */

export interface GuardianPayload {
  id?: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone: string;
  relationship: string;
}

export interface StudentRankPayload {
  id: string;
  beltRankId: string;
  beltName: string; // E.g., 'Blue Belt'
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
  };
  birthDate?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  emergencyContactName?: string; // Derived from Guardian for minors, or direct contact for adults
  emergencyContactPhone?: string;
  activeRank?: StudentRankPayload;
  federationLicense?: string;
}

export interface CreateStudentPayload {
  userId: string; // The selected base user
  birthDate?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  guardians?: GuardianPayload[]; // Required if under 18
  emergencyContactName?: string; // For adults
  emergencyContactPhone?: string; // For adults
}