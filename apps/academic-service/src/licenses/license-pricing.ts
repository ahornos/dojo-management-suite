/**
 * @file license-pricing.ts
 * @description Season-aware license pricing using `Prisma.Decimal` only (no JS floats).
 */

import { Prisma } from '@dms/database/client';

/**
 * One pricing-matrix row from the financial catalog.
 */
export interface LicensePriceRowCatalog {
  id: string;
  kind: 'INSTRUCTOR' | 'ADULT' | 'CUSTOM';
  label: string;
  birthYearFrom: number | null;
  cost: string;
  reduction: string;
  chargePrice: string;
  sortOrder: number;
}

/**
 * One license product from a federation season.
 */
export interface LicenseTypeCatalog {
  id: string;
  name: string;
  isActive: boolean;
  priceRows: LicensePriceRowCatalog[];
}

/**
 * One pricing season from the financial catalog.
 */
export interface FederationSeasonCatalog {
  id: string;
  seasonName: string;
  currency: string;
  clubCost: string;
  isActive: boolean;
  licenseTypes: LicenseTypeCatalog[];
}

/**
 * Cost (academy → federation) and sale (academy → member) after reductions.
 */
export interface StudentSeasonalAmounts {
  costAmount: Prisma.Decimal;
  saleAmount: Prisma.Decimal;
  seasonalDiscountApplied: boolean;
}

const ZERO = new Prisma.Decimal(0);

/**
 * Subtracts `reduction` from `base`, floored at zero.
 *
 * @param {Prisma.Decimal} base - Starting amount.
 * @param {string | null | undefined} reduction - Optional reduction string.
 * @returns {Prisma.Decimal} Non-negative result.
 */
export function subtractFloorZero(base: Prisma.Decimal, reduction: string | null | undefined): Prisma.Decimal {
  if (!reduction) {
    return base;
  }
  const next = base.minus(new Prisma.Decimal(reduction));
  return next.isNegative() ? ZERO : next;
}

/**
 * Picks the season matching `seasonName`, otherwise the first active season.
 *
 * @param {FederationSeasonCatalog[] | undefined} seasons - Catalog seasons.
 * @param {string} seasonName - Label from the license request.
 * @returns {FederationSeasonCatalog | undefined} Matching season.
 */
export function resolveSeasonCatalog(
  seasons: FederationSeasonCatalog[] | undefined,
  seasonName: string,
): FederationSeasonCatalog | undefined {
  const rows = seasons ?? [];
  return (
    rows.find((row) => row.seasonName === seasonName && row.isActive) ??
    rows.find((row) => row.seasonName === seasonName) ??
    rows.find((row) => row.isActive) ??
    rows[0]
  );
}

/**
 * Picks an explicit type, otherwise the first active type.
 *
 * @param {LicenseTypeCatalog[]} types - Season license products.
 * @param {string} [preferredId] - Explicit catalog id from the request.
 * @returns {LicenseTypeCatalog | undefined} Matching type.
 */
export function pickLicenseType(types: LicenseTypeCatalog[], preferredId?: string): LicenseTypeCatalog | undefined {
  if (preferredId) {
    const preferred = types.find((row) => row.id === preferredId && row.isActive);
    if (preferred) {
      return preferred;
    }
  }
  return types.find((row) => row.isActive) ?? types[0];
}

/**
 * Instructor/TD use the instructor row. Students use the highest CUSTOM threshold they meet, else adult.
 *
 * @param {LicensePriceRowCatalog[]} rows - Matrix rows.
 * @param {string} holderType - Student / instructor / director.
 * @param {number | null} [birthYear] - UTC birth year when known.
 * @returns {LicensePriceRowCatalog | undefined} Matching row.
 */
export function pickPriceRow(
  rows: LicensePriceRowCatalog[],
  holderType: string,
  birthYear?: number | null,
): LicensePriceRowCatalog | undefined {
  if (holderType === 'INSTRUCTOR' || holderType === 'TECHNICAL_DIRECTOR') {
    return rows.find((row) => row.kind === 'INSTRUCTOR') ?? rows.find((row) => row.kind === 'ADULT');
  }
  const matchingCustom = rows
    .filter(
      (row) =>
        row.kind === 'CUSTOM' &&
        row.birthYearFrom !== null &&
        birthYear !== null &&
        birthYear !== undefined &&
        birthYear >= row.birthYearFrom,
    )
    .sort((left, right) => (right.birthYearFrom ?? 0) - (left.birthYearFrom ?? 0));
  return matchingCustom[0] ?? rows.find((row) => row.kind === 'ADULT');
}

/**
 * Computes cost (`cost - reduction`) and sale (`chargePrice`) for one matrix row.
 *
 * @param {LicensePriceRowCatalog} row - Pricing row.
 * @returns {StudentSeasonalAmounts} Decimal amounts.
 */
export function priceRowAmounts(row: LicensePriceRowCatalog): StudentSeasonalAmounts {
  const cost = new Prisma.Decimal(row.cost || '0');
  const reduction = row.reduction || '0';
  return {
    costAmount: subtractFloorZero(cost, reduction),
    saleAmount: new Prisma.Decimal(row.chargePrice || '0'),
    seasonalDiscountApplied: !new Prisma.Decimal(reduction).isZero(),
  };
}
