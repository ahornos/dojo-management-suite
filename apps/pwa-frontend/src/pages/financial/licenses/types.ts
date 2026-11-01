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

export interface AffiliationLicense {
  id: string;
  tenantId: string;
  studentProfileId: string | null;
  holderUserId: string | null;
  holderType: LicenseHolderType;
  federationId: string;
  licenseTypeId?: string | null;
  licenseNumber: string;
  season: string;
  validUntil: string;
  isActive: boolean;
  isPaid: boolean;
  amountCharged?: string;
  status?: 'PENDING' | 'PAID' | 'EXEMPT' | 'FAILED';
  payerUserId?: string | null;
  isExempt?: boolean;
  holder: LicenseHolderIdentity | null;
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
