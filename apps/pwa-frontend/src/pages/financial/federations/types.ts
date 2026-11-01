/**
 * @file types.ts
 * @description Federation catalog, tagged contacts, seasons, and pricing-matrix payloads.
 */

import type { FederationContactMedium, FederationCurrency, LicensePriceRowKind } from '@/lib/domain-enums';

export interface FederationContact {
  id?: string;
  medium: FederationContactMedium;
  value: string;
  tag: string;
}

export interface FederationLicensePriceRow {
  id?: string;
  kind: LicensePriceRowKind;
  label: string;
  birthYearFrom: number | null;
  cost: string;
  reduction: string;
  chargePrice: string;
  netTotal?: string;
  sortOrder?: number;
}

export interface FederationLicenseType {
  id?: string;
  name: string;
  isActive: boolean;
  priceRows: FederationLicensePriceRow[];
}

export interface FederationSeason {
  id?: string;
  seasonName: string;
  currency: FederationCurrency | string;
  clubCost: string;
  isActive: boolean;
  licenseTypes: FederationLicenseType[];
}

export type FederationListStatus = '' | 'ACTIVE' | 'INACTIVE' | 'DELETED';

export interface Federation {
  id: string;
  tenantId: string;
  name: string;
  acronym?: string;
  country: string;
  email: string;
  isActive: boolean;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  contacts?: FederationContact[];
  seasons?: FederationSeason[];
}

export interface FederationPayload {
  name: string;
  acronym?: string;
  country: string;
  email: string;
  contacts?: FederationContact[];
  seasons?: Array<{
    id?: string;
    seasonName: string;
    currency?: string;
    clubCost?: string;
    isActive?: boolean;
    licenseTypes: Array<{
      id?: string;
      name: string;
      isActive?: boolean;
      priceRows: Array<{
        id?: string;
        kind: LicensePriceRowKind;
        label?: string;
        birthYearFrom?: number | null;
        cost?: string;
        reduction?: string;
        chargePrice?: string;
      }>;
    }>;
  }>;
}

export interface FederationBudget {
  federationId: string;
  season: string;
  clubFee: string;
  studentCount: number;
  studentCost: string;
  studentSale: string;
  instructorCount: number;
  instructorCost: string;
  instructorSale: string;
  technicalDirectorCount: number;
  technicalDirectorCost: string;
  totalCost: string;
  totalSale: string;
}

export interface FederationChargeHolder {
  holderType: 'STUDENT' | 'INSTRUCTOR' | 'TECHNICAL_DIRECTOR';
  holderUserId?: string | null;
  studentProfileId?: string;
  licenseId?: string;
}
