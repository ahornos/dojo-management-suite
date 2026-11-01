/**
 * @file federation-catalog.ts
 * @description Mapping helpers for federation contacts, seasons, and pricing-matrix rows.
 */

import { LicenseHolderType, LicensePriceRowKind, Prisma } from '@dms/database/client';
import { FederationContactDto } from './dto/federation-contact.dto';
import {
  FederationLicensePriceRowDto,
  FederationSeasonDto,
  FederationSeasonLicenseTypeDto,
} from './dto/federation-season.dto';
import { decimalToString, toDecimal } from './money';

export const CATALOG_INCLUDE = {
  contacts: { orderBy: [{ medium: 'asc' as const }, { createdAt: 'asc' as const }] },
  seasons: {
    orderBy: [{ seasonName: 'desc' as const }],
    include: {
      licenseTypes: {
        orderBy: [{ name: 'asc' as const }],
        include: {
          priceRows: { orderBy: [{ sortOrder: 'asc' as const }, { kind: 'asc' as const }] },
        },
      },
    },
  },
} satisfies Prisma.FederationInclude;

export type FederationCatalogRow = Prisma.FederationGetPayload<{ include: typeof CATALOG_INCLUDE }>;
export type FederationSeasonRow = FederationCatalogRow['seasons'][number];
export type FederationLicenseTypeRow = FederationSeasonRow['licenseTypes'][number];
export type FederationPriceRow = FederationLicenseTypeRow['priceRows'][number];

export interface FederationContactResponse {
  id: string;
  medium: string;
  value: string;
  tag: string;
}

export interface FederationLicensePriceRowResponse {
  id: string;
  kind: LicensePriceRowKind;
  label: string;
  birthYearFrom: number | null;
  cost: string;
  reduction: string;
  chargePrice: string;
  netTotal: string;
  sortOrder: number;
}

export interface FederationLicenseTypeResponse {
  id: string;
  name: string;
  isActive: boolean;
  priceRows: FederationLicensePriceRowResponse[];
}

export interface FederationSeasonResponse {
  id: string;
  seasonName: string;
  currency: string;
  clubCost: string;
  isActive: boolean;
  licenseTypes: FederationLicenseTypeResponse[];
}

const ZERO = new Prisma.Decimal(0);

/**
 * @param {Prisma.Decimal} cost - Catalog cost.
 * @param {Prisma.Decimal} reduction - Catalog reduction.
 * @returns {Prisma.Decimal} Non-negative `cost - reduction`.
 */
export function netTotal(cost: Prisma.Decimal, reduction: Prisma.Decimal): Prisma.Decimal {
  const next = cost.minus(reduction);
  return next.isNegative() ? ZERO : next;
}

/**
 * @param {FederationContactDto} dto - Validated contact.
 * @returns {{ medium: FederationContactDto['medium']; value: string; tag: string }} Persistable fields.
 */
export function contactCreateData(dto: FederationContactDto) {
  return {
    medium: dto.medium,
    value: dto.value,
    tag: dto.tag?.trim() ?? '',
  };
}

/**
 * @param {FederationLicensePriceRowDto} dto - Matrix row.
 * @param {number} sortOrder - Display order.
 * @returns {Prisma.FederationLicensePriceRowUncheckedCreateWithoutLicenseTypeInput} Persistable row.
 */
export function priceRowCreateData(
  dto: FederationLicensePriceRowDto,
  sortOrder: number,
): Prisma.FederationLicensePriceRowUncheckedCreateWithoutLicenseTypeInput {
  const kind = dto.kind as LicensePriceRowKind;
  return {
    kind,
    label: kind === LicensePriceRowKind.CUSTOM ? (dto.label?.trim() ?? '') : '',
    birthYearFrom: kind === LicensePriceRowKind.CUSTOM ? (dto.birthYearFrom ?? null) : null,
    cost: toDecimal(dto.cost ?? '0.00'),
    reduction: toDecimal(dto.reduction ?? '0.00'),
    chargePrice: toDecimal(dto.chargePrice ?? '0.00'),
    sortOrder,
  };
}

/**
 * Ensures instructor and adult rows exist (zeros) before persist.
 *
 * @param {FederationLicensePriceRowDto[] | undefined} rows - Incoming matrix.
 * @returns {FederationLicensePriceRowDto[]} Rows ready to persist.
 */
export function ensurePriceRows(rows: FederationLicensePriceRowDto[] | undefined): FederationLicensePriceRowDto[] {
  const incoming = rows ?? [];
  const hasInstructor = incoming.some((row) => row.kind === 'INSTRUCTOR');
  const hasAdult = incoming.some((row) => row.kind === 'ADULT');
  return [
    ...(hasInstructor ? [] : [{ kind: 'INSTRUCTOR' as const, cost: '0.00', reduction: '0.00', chargePrice: '0.00' }]),
    ...(hasAdult ? [] : [{ kind: 'ADULT' as const, cost: '0.00', reduction: '0.00', chargePrice: '0.00' }]),
    ...incoming,
  ];
}

/**
 * @param {FederationSeasonLicenseTypeDto} dto - License product.
 * @returns {{ name: string; isActive: boolean; priceRows: { create: ReturnType<typeof priceRowCreateData>[] } }} Nested create.
 */
export function licenseTypeNestedCreate(dto: FederationSeasonLicenseTypeDto) {
  return {
    name: dto.name,
    isActive: dto.isActive ?? true,
    priceRows: {
      create: ensurePriceRows(dto.priceRows).map((row, index) => priceRowCreateData(row, index)),
    },
  };
}

/**
 * @param {FederationSeasonDto} dto - Season payload.
 * @returns {object} Nested season create (types + rows).
 */
export function seasonNestedCreate(dto: FederationSeasonDto) {
  return {
    seasonName: dto.seasonName,
    currency: dto.currency?.trim() || 'EUR',
    clubCost: toDecimal(dto.clubCost ?? '0.00'),
    isActive: dto.isActive ?? true,
    licenseTypes: {
      create: (dto.licenseTypes ?? [])
        .filter((type) => type.name.trim() !== '')
        .map((type) => licenseTypeNestedCreate(type)),
    },
  };
}

/**
 * Picks the season matching `seasonName`, otherwise the first active season.
 *
 * @param {FederationCatalogRow} federation - Catalog with seasons.
 * @param {string} seasonName - Label from the request (`2026`, `26/27`, `2026-2027`).
 * @returns {FederationSeasonRow | undefined} Matching season.
 */
export function resolveSeason(federation: FederationCatalogRow, seasonName: string): FederationSeasonRow | undefined {
  const seasons = federation.seasons ?? [];
  return (
    seasons.find((row) => row.seasonName === seasonName && row.isActive) ??
    seasons.find((row) => row.seasonName === seasonName) ??
    seasons.find((row) => row.isActive) ??
    seasons[0]
  );
}

/**
 * Instructor/TD use the instructor row. Students use the highest CUSTOM threshold they meet, else adult.
 *
 * @param {FederationPriceRow[]} rows - Matrix rows.
 * @param {LicenseHolderType} holderType - Person type.
 * @param {number | null} [birthYear] - UTC birth year when known.
 * @returns {FederationPriceRow | undefined} Matching row.
 */
export function pickPriceRow(
  rows: FederationPriceRow[],
  holderType: LicenseHolderType,
  birthYear?: number | null,
): FederationPriceRow | undefined {
  if (holderType === LicenseHolderType.INSTRUCTOR || holderType === LicenseHolderType.TECHNICAL_DIRECTOR) {
    return rows.find((row) => row.kind === LicensePriceRowKind.INSTRUCTOR) ?? rows.find((row) => row.kind === LicensePriceRowKind.ADULT);
  }
  const matchingCustom = rows
    .filter(
      (row) =>
        row.kind === LicensePriceRowKind.CUSTOM &&
        row.birthYearFrom !== null &&
        birthYear !== null &&
        birthYear !== undefined &&
        birthYear >= row.birthYearFrom,
    )
    .sort((left, right) => (right.birthYearFrom ?? 0) - (left.birthYearFrom ?? 0));
  return matchingCustom[0] ?? rows.find((row) => row.kind === LicensePriceRowKind.ADULT);
}

/**
 * @param {FederationSeasonRow | undefined} season - Selected season.
 * @returns {FederationLicenseTypeRow | undefined} First active type.
 */
export function firstActiveLicenseType(season: FederationSeasonRow | undefined): FederationLicenseTypeRow | undefined {
  return season?.licenseTypes.find((row) => row.isActive) ?? season?.licenseTypes[0];
}

/**
 * @param {FederationCatalogRow['contacts'][number]} row - Contact row.
 * @returns {FederationContactResponse} JSON-safe contact.
 */
export function toContactResponse(row: FederationCatalogRow['contacts'][number]): FederationContactResponse {
  return { id: row.id, medium: row.medium, value: row.value, tag: row.tag };
}

/**
 * @param {FederationPriceRow} row - Price row.
 * @returns {FederationLicensePriceRowResponse} JSON-safe row.
 */
export function toPriceRowResponse(row: FederationPriceRow): FederationLicensePriceRowResponse {
  return {
    id: row.id,
    kind: row.kind,
    label: row.label,
    birthYearFrom: row.birthYearFrom,
    cost: decimalToString(row.cost),
    reduction: decimalToString(row.reduction),
    chargePrice: decimalToString(row.chargePrice),
    netTotal: decimalToString(netTotal(row.cost, row.reduction)),
    sortOrder: row.sortOrder,
  };
}

/**
 * @param {FederationLicenseTypeRow} row - License type.
 * @returns {FederationLicenseTypeResponse} JSON-safe type.
 */
export function toLicenseTypeResponse(row: FederationLicenseTypeRow): FederationLicenseTypeResponse {
  return {
    id: row.id,
    name: row.name,
    isActive: row.isActive,
    priceRows: row.priceRows.map(toPriceRowResponse),
  };
}

/**
 * @param {FederationSeasonRow} row - Season.
 * @returns {FederationSeasonResponse} JSON-safe season.
 */
export function toSeasonResponse(row: FederationSeasonRow): FederationSeasonResponse {
  return {
    id: row.id,
    seasonName: row.seasonName,
    currency: row.currency,
    clubCost: decimalToString(row.clubCost),
    isActive: row.isActive,
    licenseTypes: row.licenseTypes.map(toLicenseTypeResponse),
  };
}
