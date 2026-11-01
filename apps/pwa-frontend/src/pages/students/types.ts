/**
 * @file types.ts
 * @description Shared TypeScript interfaces for Student Profiles, Guardians, and Belts.
 * Introduces EmergencyContactPayload for lightweight non-user contacts.
 */

import type { BankingDetails } from './banking';

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
  disciplineId?: string;
  disciplineName: string;
  disciplineAcronym?: string | null;
  beltName: string;
  currentStripes: number;
  maxStripes: number;
  accumulatedHours: number;
  minHoursRequired: number;
  minMonthsRequired: number;
  promotedAt: string;
}

/** Flash state after a create/edit redirect back to the directory. */
export interface StudentsListLocationState {
  mandateFailed?: boolean;
  mandate?: BankMandate | null;
}

export interface StudentStatusHistoryEntry {
  status?: string;
  newStatus?: string;
  leaveReason?: string | null;
  leaveNoticeMethod?: string | null;
  customReasonDetails?: string | null;
  reason?: string | null;
  createdAt?: string;
}

export interface StudentGuardianUser {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface StudentGuardianLink {
  relationship?: string | null;
  guardian?: {
    userId?: string;
    user?: StudentGuardianUser | null;
  } | null;
}

export interface StudentProfileResponse {
  id: string;
  userId?: string | null;
  bankMandateId?: string | null;
  firstName?: string;
  lastName?: string;
  dni?: string | null;
  gender?: string | null;
  status?: string;
  user?: {
    id?: string | null;
    firstName: string;
    lastName: string;
    email?: string | null;
    gender?: string | null;
  } | null;
  birthDate?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  emergencyContacts?: EmergencyContactPayload[];
  ranks?: StudentRankPayload[];
  guardians?: StudentGuardianLink[];
  statusHistory?: StudentStatusHistoryEntry[];
  createdAt?: string;
}

export interface CreateTrialStudentPayload {
  disciplineId: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  email?: string;
  phone?: string;
  guardianName?: string;
  guardianPhone?: string;
}

export interface CreateStudentPayload {
  isExistingUser: boolean;
  userId?: string | null;
  userData: {
    firstName: string;
    lastName: string;
    email?: string;
    dni?: string;
    phone?: string;
    birthDate?: string;
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    gender?: string;
  };
  isMinor: boolean;
  status?: string;
  guardians?: GuardianPayload[];
  emergencyContacts?: EmergencyContactPayload[];
  disciplines?: any[];
  /** SEPA details posted to financial-service after the academic profile is created. */
  banking?: BankingDetails;
}

/**
 * SEPA bank mandate returned by financial-service (`GET/POST /financial/mandates`, `PATCH .../sign`).
 */
export interface BankMandate {
  id: string;
  payerUserId: string;
  tenantId: string;
  iban: string;
  bic: string | null;
  mandateReference: string;
  signatureDate: string;
  accountHolderName: string;
  accountHolderDni: string;
  isSigned: boolean;
  signedAt: string | null;
  signedByUserId: string | null;
  signatureIp: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Result of a student write that may also attempt a SEPA mandate registration.
 */
export interface StudentMutationResult {
  student: StudentProfileResponse;
  mandateFailed: boolean;
  mandate: BankMandate | null;
}

/**
 * Partial academic update plus optional SEPA banking details for a follow-up mandate POST.
 */
export interface UpdateStudentPayload {
  userData?: CreateStudentPayload['userData'];
  isMinor?: boolean;
  status?: string;
  statusReason?: string;
  leaveReason?: string;
  leaveNoticeMethod?: string;
  customReasonDetails?: string;
  guardians?: GuardianPayload[];
  emergencyContacts?: EmergencyContactPayload[];
  disciplines?: unknown[];
  banking?: BankingDetails;
}
