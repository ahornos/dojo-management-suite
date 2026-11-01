/**
 * @file types.ts
 * @description Affiliation license list, preview, and batch payloads.
 */

import type { LicenseHolderType } from '@/lib/domain-enums';

export interface LicenseHolderIdentity {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface LicenseStudentIdentity {
  id: string;
  firstName: string;
  lastName: string;
}

export interface AffiliationLicense {
  id: string;
  tenantId: string;
  studentProfileId: string | null;
  holderUserId: string | null;
  holderType: LicenseHolderType;
  federationId: string;
  licenseTypeId?: string | null;
  licenseNumber?: string | null;
  season: string;
  validUntil: string;
  isActive: boolean;
  isPaid: boolean;
  amountCharged?: string;
  status?: 'PENDING' | 'PAID' | 'EXEMPT' | 'FAILED';
  payerUserId?: string | null;
  isExempt?: boolean;
  holder: LicenseHolderIdentity | null;
  student?: LicenseStudentIdentity | null;
  expiringSoon: boolean;
}

export interface LicensePreviewHolder {
  holderUserId: string | null;
  studentProfileId: string | null;
  holderType: LicenseHolderType;
  firstName: string;
  lastName: string;
  email: string;
  age: number | null;
  birthYear?: number | null;
  alreadyLicensed: boolean;
  payerUserId?: string | null;
  suggestedLicenseTypeId?: string | null;
  suggestedLicenseTypeName?: string | null;
}

export interface LicensePreviewFilters {
  federationId: string;
  season: string;
  holderType: LicenseHolderType;
  age?: number;
  minAge?: number;
  maxAge?: number;
  birthYearFrom?: number;
  birthYearTo?: number;
  statuses?: Array<'ACTIVE' | 'TRIAL' | 'PAUSED' | 'DROPPED'>;
  disciplineId?: string;
  enrollmentDateBefore?: string;
  licenseTypeId?: string;
}

export interface LicenseBatchResult {
  created: number;
  skipped: number;
  charged?: number;
  warnings?: Array<{ code: string; studentProfileId: string | null; holderUserId: string | null }>;
  licenses: AffiliationLicense[];
}

/**
 * Explicit-id payload for `POST /academic/licenses/batch` (selected-student engine).
 */
export interface SelectedLicenseBatchPayload {
  federationId: string;
  seasonId?: string;
  seasonName?: string;
  licenseTypeId: string;
  studentProfileIds: string[];
}

/**
 * One student skipped by the selected-student batch engine.
 */
export interface SelectedLicenseSkip {
  studentId: string;
  reason: string;
}

/**
 * Summary returned by the selected-student batch engine.
 */
export interface SelectedLicenseBatchResult {
  totalProcessed: number;
  successCount: number;
  skippedCount: number;
  skippedDetails: SelectedLicenseSkip[];
}
