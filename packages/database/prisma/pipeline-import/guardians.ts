/**
 * @file guardians.ts
 * @description Collects multiple legal guardians from a student CSV row.
 */

import { normalizeDni, normalizePhone } from '../student-import/map-row';
import { cell, emptyToNull, splitFullName } from './parse';

/**
 * One parent / tutor extracted from mother, father, or numbered guardian columns.
 */
export interface PipelineGuardian {
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  dni: string | null;
  relationship: string;
}

/**
 * Reads mother, father, guardian1/2, and legacy legalGuardian columns.
 * Guardians without an email are omitted (User.email is the login unique key).
 *
 * @param {Record<string, string>} row - Student sheet row.
 * @returns {PipelineGuardian[]} Deduplicated guardians.
 */
export function collectPipelineGuardians(row: Record<string, string>): PipelineGuardian[] {
  const collected = [
    mapGuardian(
      row,
      'Madre',
      ['motherName', 'nombreMadre', 'Nombre Madre'],
      ['motherEmail', 'emailMadre', 'Email Madre'],
      ['motherPhone', 'telefonoMadre', 'TELEFONO MADRE'],
      ['motherDni', 'dniMadre'],
    ),
    mapGuardian(
      row,
      'Padre',
      ['fatherName', 'nombrePadre', 'Nombre Padre'],
      ['fatherEmail', 'emailPadre', 'Email Padre'],
      ['fatherPhone', 'telefonoPadre', 'TELEFONO PADRE'],
      ['fatherDni', 'dniPadre'],
    ),
    mapGuardian(
      row,
      emptyToNull(cell(row, 'guardian1Relationship', 'legalGuardianRelationship')) ?? 'Tutor Legal',
      ['guardian1Name', 'legalGuardianName', 'parentFirstName'],
      ['guardian1Email', 'legalGuardianEmail', 'parentEmail'],
      ['guardian1Phone', 'legalGuardianPhone', 'parentPhone'],
      ['guardian1Dni', 'legalGuardianDni', 'parentDni'],
    ),
    mapGuardian(
      row,
      emptyToNull(cell(row, 'guardian2Relationship')) ?? 'Tutor Legal',
      ['guardian2Name'],
      ['guardian2Email'],
      ['guardian2Phone'],
      ['guardian2Dni'],
    ),
  ].filter((item): item is PipelineGuardian => item !== null);

  const unique: PipelineGuardian[] = [];
  const seen = new Set<string>();
  for (const guardian of collected) {
    if (seen.has(guardian.email)) continue;
    seen.add(guardian.email);
    unique.push(guardian);
  }
  return unique;
}

/**
 * @param {Record<string, string>} row - Student sheet row.
 * @param {string} relationship - Domain relationship label.
 * @param {string[]} nameAliases - Full-name headers.
 * @param {string[]} emailAliases - Email headers.
 * @param {string[]} phoneAliases - Phone headers.
 * @param {string[]} dniAliases - DNI headers.
 * @returns {PipelineGuardian | null} Guardian when an email is present.
 */
function mapGuardian(
  row: Record<string, string>,
  relationship: string,
  nameAliases: string[],
  emailAliases: string[],
  phoneAliases: string[],
  dniAliases: string[],
): PipelineGuardian | null {
  const email = cell(row, ...emailAliases).toLowerCase();
  if (!email) return null;
  const names = splitFullName(cell(row, ...nameAliases));
  return {
    firstName: names.firstName,
    lastName: names.lastName,
    email,
    phone: normalizePhone(cell(row, ...phoneAliases)),
    dni: normalizeDni(cell(row, ...dniAliases)),
    relationship,
  };
}
