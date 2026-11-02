/**
 * @file parse.ts
 * @description Pure parsers for pipeline CSV cells (dates, enums, weekdays, names).
 */

import {
  AffiliationLicenseStatus,
  AttendanceStatus,
  Role,
  StudentStatus,
} from '../../client';
import { parseFlexibleDate } from '../student-import/map-row';

export { parseFlexibleDate };

/**
 * Reads a cell by alias list (case-insensitive, BOM-safe).
 *
 * @param {Record<string, string>} row - csv-parser object.
 * @param {string[]} aliases - Header names to try.
 * @returns {string} Trimmed value, or empty.
 */
export function cell(row: Record<string, string>, ...aliases: string[]): string {
  const normalized = new Map<string, string>();
  for (const [key, value] of Object.entries(row)) {
    normalized.set(normalizeHeader(key), typeof value === 'string' ? value.trim() : '');
  }
  for (const alias of aliases) {
    const found = normalized.get(normalizeHeader(alias));
    if (found) return found;
  }
  return '';
}

/**
 * @param {string} header - Raw CSV header.
 * @returns {string} Lowercase alphanumeric key.
 */
export function normalizeHeader(header: string): string {
  return header.replace(/^\uFEFF/, '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '');
}

/**
 * @param {string} value - Raw cell.
 * @returns {string | null} Null when blank.
 */
export function emptyToNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
}

/**
 * Splits `fullName` into first and remaining last tokens.
 *
 * @param {string} fullName - Display name from the staff sheet.
 * @returns {{ firstName: string; lastName: string }} Identity parts.
 */
export function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: 'Unknown', lastName: 'Unknown' };
  if (parts.length === 1) return { firstName: parts[0], lastName: 'Unknown' };
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
}

/**
 * Maps a Sheets role label onto the Prisma `Role` enum.
 * `STAFF_ADMIN` is accepted as an alias of domain `ADMIN_STAFF`.
 *
 * @param {string} raw - Role cell.
 * @returns {Role} Enum member.
 * @throws {Error} When the label is empty or unknown.
 */
export function parseRole(raw: string): Role {
  const value = raw.trim().toUpperCase().replace(/\s+/g, '_');
  if (value === 'STAFF_ADMIN') return Role.ADMIN_STAFF;
  if ((Object.values(Role) as string[]).includes(value)) {
    return value as Role;
  }
  throw new Error(`Unknown role "${raw}". Expected a Role enum member (STAFF_ADMIN maps to ADMIN_STAFF).`);
}

/**
 * Maps a student lifecycle cell. Sheets `INACTIVE` becomes `PAUSED`
 * (there is no `INACTIVE` member on `StudentStatus`).
 *
 * @param {string} raw - Status cell.
 * @returns {StudentStatus} Enum member (defaults to ACTIVE).
 */
export function parseStudentStatus(raw: string): StudentStatus {
  const value = raw.trim().toUpperCase().replace(/\s+/g, '_');
  if (!value || value === 'ALTA' || value === 'ACTIVE') return StudentStatus.ACTIVE;
  if (['INACTIVE', 'PAUSED', 'PAUSA', 'BAJA_TEMPORAL'].includes(value)) return StudentStatus.PAUSED;
  if (['DROPPED', 'BAJA', 'CANCELED', 'CANCELLED', 'CANCELADO'].includes(value)) return StudentStatus.DROPPED;
  if (['TRIAL', 'PRUEBA'].includes(value)) return StudentStatus.TRIAL;
  if ((Object.values(StudentStatus) as string[]).includes(value)) {
    return value as StudentStatus;
  }
  return StudentStatus.ACTIVE;
}

/**
 * @param {string} raw - Boolean cell (`true` / `1` / `yes` / `active`).
 * @returns {boolean} Parsed flag.
 */
export function parseBoolean(raw: string): boolean {
  const value = raw.trim().toLowerCase();
  if (!value) return true;
  return ['true', '1', 'yes', 'y', 'si', 'sí', 'active'].includes(value);
}

/**
 * ISO weekday: 1 = Monday … 7 = Sunday. Accepts numbers or English/Spanish names.
 *
 * @param {string} raw - `dayOfWeek` cell.
 * @returns {number} ISO weekday.
 * @throws {Error} When the cell cannot be mapped.
 */
export function parseWeekday(raw: string): number {
  const value = raw.trim().toLowerCase();
  const numeric = Number.parseInt(value, 10);
  if (numeric >= 1 && numeric <= 7) return numeric;
  const names: Record<string, number> = {
    monday: 1,
    lunes: 1,
    tuesday: 2,
    martes: 2,
    wednesday: 3,
    miercoles: 3,
    miércoles: 3,
    thursday: 4,
    jueves: 4,
    friday: 5,
    viernes: 5,
    saturday: 6,
    sabado: 6,
    sábado: 6,
    sunday: 7,
    domingo: 7,
  };
  const mapped = names[value];
  if (!mapped) {
    throw new Error(`Unknown dayOfWeek "${raw}". Use 1-7 or Monday…Sunday.`);
  }
  return mapped;
}

/**
 * @param {string} raw - Attendance status cell.
 * @returns {AttendanceStatus} Enum member (defaults to PRESENT).
 */
export function parseAttendanceStatus(raw: string): AttendanceStatus {
  const value = raw.trim().toUpperCase();
  if (!value) return AttendanceStatus.PRESENT;
  if ((Object.values(AttendanceStatus) as string[]).includes(value)) {
    return value as AttendanceStatus;
  }
  return AttendanceStatus.PRESENT;
}

/**
 * @param {string} raw - Affiliation license status cell.
 * @returns {AffiliationLicenseStatus} Enum member (defaults to PENDING).
 */
export function parseLicenseStatus(raw: string): AffiliationLicenseStatus {
  const value = raw.trim().toUpperCase();
  if ((Object.values(AffiliationLicenseStatus) as string[]).includes(value)) {
    return value as AffiliationLicenseStatus;
  }
  return AffiliationLicenseStatus.PENDING;
}

/**
 * Interprets the legacy attendance-matrix annotation (`C` = belt, `G` = stripe).
 *
 * @param {string} raw - Notes cell.
 * @returns {'BELT' | 'STRIPE' | null} Promotion kind, or null.
 */
export function parseLegacyPromotionMark(raw: string): 'BELT' | 'STRIPE' | null {
  const value = raw.trim().toUpperCase();
  if (!value) return null;
  if (['C', 'CINTURON', 'CINTURÓN', 'BELT'].includes(value)) return 'BELT';
  if (['G', 'GRADO', 'STRIPE', 'DEGREE'].includes(value)) return 'STRIPE';
  return null;
}

/**
 * Default season validity: 31 August of the season end year (`2026-2027` → 2027-08-31).
 *
 * @param {string} season - `YYYY-YYYY` (or a single year).
 * @returns {Date} Validity end (UTC midnight).
 */
export function defaultValidUntil(season: string): Date {
  const parts = season.split('-');
  const endYear = Number.parseInt(parts[1] ?? parts[0] ?? '', 10);
  if (!Number.isFinite(endYear)) {
    throw new Error(`Cannot derive validUntil from season "${season}". Use YYYY-YYYY.`);
  }
  return new Date(Date.UTC(endYear, 7, 31, 0, 0, 0, 0));
}

/**
 * @param {string} raw - Optional integer cell.
 * @returns {number | null} Parsed integer, or null.
 */
export function parseOptionalInt(raw: string): number | null {
  const value = raw.trim();
  if (!value) return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
}
