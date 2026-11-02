/**
 * @file resolve-entity.ts
 * @description Live, name-based lookups with lazy placeholder upserts for missing parents.
 */

import { Role, StudentStatus } from '../../client';
import { normalizeDni } from '../student-import/map-row';
import { cell, splitFullName } from './parse';
import type { PipelineOptions, PipelinePrisma } from './types';

/** Email domain used so a later master CSV can recognise and enrich the row. */
const PLACEHOLDER_EMAIL_DOMAIN = 'import.placeholder';

/**
 * Accent-insensitive person / catalog key.
 *
 * @param {string} value - Raw name.
 * @returns {string} Compact lowercase token.
 */
export function normalizePersonKey(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');
}

/**
 * @param {string} email - Candidate address.
 * @returns {boolean} Whether this login was created as a lazy placeholder.
 */
export function isPlaceholderEmail(email: string): boolean {
  return email.toLowerCase().endsWith(`@${PLACEHOLDER_EMAIL_DOMAIN}`);
}

/**
 * Deterministic placeholder email so reruns upsert the same row.
 *
 * @param {string} kind - Entity family (`user` / `federation`).
 * @param {string} naturalKey - Name or acronym.
 * @returns {string} Unique placeholder address.
 */
export function placeholderEmail(kind: string, naturalKey: string): string {
  const slug = normalizePersonKey(naturalKey) || 'unknown';
  return `${kind}.${slug}@${PLACEHOLDER_EMAIL_DOMAIN}`;
}

/**
 * @param {string} leftFirst - Stored first name.
 * @param {string} leftLast - Stored last name.
 * @param {string} rightFirst - Sheet first name.
 * @param {string} rightLast - Sheet last name.
 * @returns {boolean} Whether both parts match ignoring case and accents.
 */
export function namesMatch(
  leftFirst: string,
  leftLast: string,
  rightFirst: string,
  rightLast: string,
): boolean {
  return (
    normalizePersonKey(leftFirst) === normalizePersonKey(rightFirst) &&
    normalizePersonKey(leftLast) === normalizePersonKey(rightLast)
  );
}

/**
 * Resolves a staff / parent login by email or "First Last".
 * Creates a minimal User when the master sheet has not been imported yet.
 *
 * @param {PipelinePrisma} prisma - Client.
 * @param {string} raw - Email or full name.
 * @param {PipelineOptions} options - Password hashing for placeholders.
 * @param {Role} [role] - Role applied to a newly created placeholder (default INSTRUCTOR).
 * @returns {Promise<string>} User id.
 */
export async function resolveUserId(
  prisma: PipelinePrisma,
  raw: string,
  options: PipelineOptions,
  role: Role = Role.INSTRUCTOR,
): Promise<string> {
  const token = raw.trim();
  if (!token) {
    throw new Error('A user email or full name is required to resolve a foreign key.');
  }
  if (token.includes('@')) {
    const user = await prisma.user.findUnique({ where: { email: token.toLowerCase() } });
    if (user) return user.id;
    const { firstName, lastName } = splitFullName(token.split('@')[0] ?? token);
    return createPlaceholderUser(prisma, options, {
      email: token.toLowerCase(),
      firstName,
      lastName,
      role,
      label: token,
    });
  }
  const { firstName, lastName } = splitFullName(token);
  const candidates = await prisma.user.findMany({
    where: {
      firstName: { contains: firstName, mode: 'insensitive' },
      lastName: { contains: lastName, mode: 'insensitive' },
    },
  });
  const matches = candidates.filter((user) => namesMatch(user.firstName, user.lastName, firstName, lastName));
  if (matches.length === 1) return matches[0]!.id;
  if (matches.length > 1) {
    throw new Error(`Ambiguous user name "${token}" (${matches.length} matches). Use the email instead.`);
  }
  return createPlaceholderUser(prisma, options, {
    email: placeholderEmail('user', token),
    firstName,
    lastName,
    role,
    label: token,
  });
}

/**
 * @param {PipelinePrisma} prisma - Client.
 * @param {PipelineOptions} options - Password hashing.
 * @param {{ email: string; firstName: string; lastName: string; role: Role; label: string }} input - Identity.
 * @returns {Promise<string>} New user id.
 */
async function createPlaceholderUser(
  prisma: PipelinePrisma,
  options: PipelineOptions,
  input: { email: string; firstName: string; lastName: string; role: Role; label: string },
): Promise<string> {
  if (!options.passwordHash) {
    options.passwordHash = await options.hashPassword('');
  }
  if (!options.passwordHash) {
    throw new Error(
      'FATAL: IMPORT_PIPELINE_PASSWORD or IMPORT_STUDENT_PASSWORD is required to hash temporary passwords for imported users.',
    );
  }
  const created = await prisma.user.create({
    data: {
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      passwordHash: options.passwordHash,
      roles: [input.role],
      isActive: true,
    },
  });
  console.warn(`[import-pipeline] placeholder user created for "${input.label}" (${created.email})`);
  return created.id;
}

/**
 * Resolves a student profile by DNI, email, or first + last name.
 * Creates a minimal StudentProfile when 06-students has not been imported yet.
 *
 * @param {PipelinePrisma} prisma - Client.
 * @param {Record<string, string>} row - License / attendance / student sheet row.
 * @returns {Promise<string>} StudentProfile id.
 */
export async function resolveStudentProfileId(
  prisma: PipelinePrisma,
  row: Record<string, string>,
): Promise<string> {
  const dni = normalizeDni(cell(row, 'studentDni', 'dni'));
  if (dni) {
    const byDni = await prisma.studentProfile.findFirst({ where: { dni } });
    if (byDni) return byDni.id;
  }

  const email = cell(row, 'studentEmail', 'email').toLowerCase();
  if (email) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      const byUser = await prisma.studentProfile.findUnique({ where: { userId: user.id } });
      if (byUser) return byUser.id;
    }
  }

  const firstName = cell(row, 'studentFirstName', 'firstName', 'nombre');
  const lastName = cell(row, 'studentLastName', 'lastName', 'apellidos');
  if (firstName && lastName) {
    const candidates = await prisma.studentProfile.findMany({
      where: {
        firstName: { contains: firstName, mode: 'insensitive' },
        lastName: { contains: lastName, mode: 'insensitive' },
      },
    });
    const matches = candidates.filter((profile) =>
      namesMatch(profile.firstName, profile.lastName, firstName, lastName),
    );
    if (matches.length === 1) return matches[0]!.id;
    if (matches.length > 1) {
      throw new Error(
        `Ambiguous student "${firstName} ${lastName}" (${matches.length} matches). Add studentDni or studentEmail.`,
      );
    }
    const created = await prisma.studentProfile.create({
      data: { firstName, lastName, dni, status: StudentStatus.ACTIVE },
    });
    console.warn(`[import-pipeline] placeholder student created for "${firstName} ${lastName}"`);
    return created.id;
  }

  throw new Error(
    `Cannot resolve or create a student without DNI, email, or firstName+lastName.`,
  );
}

/**
 * @param {PipelinePrisma} prisma - Client.
 * @param {string} raw - Discipline name or acronym.
 * @returns {Promise<string>} Discipline id.
 */
export async function resolveDisciplineId(prisma: PipelinePrisma, raw: string): Promise<string> {
  const token = raw.trim();
  if (!token) {
    throw new Error('A discipline name is required to resolve a foreign key.');
  }
  const byName = await prisma.discipline.findUnique({ where: { name: token } });
  if (byName) return byName.id;
  const all = await prisma.discipline.findMany();
  const key = normalizePersonKey(token);
  const matches = all.filter(
    (item) => normalizePersonKey(item.name) === key || normalizePersonKey(item.acronym ?? '') === key,
  );
  if (matches.length === 1) return matches[0]!.id;
  if (matches.length > 1) {
    throw new Error(`Ambiguous discipline "${token}".`);
  }
  const created = await prisma.discipline.create({
    data: {
      name: token,
      acronym: token.length <= 6 ? token.toUpperCase() : null,
      description: 'Placeholder created by import-pipeline pending 04-disciplines.',
    },
  });
  console.warn(`[import-pipeline] placeholder discipline created for "${token}"`);
  return created.id;
}

/**
 * @param {PipelinePrisma} prisma - Client.
 * @param {string} tenantId - Academy key.
 * @param {string} raw - Federation official name or acronym.
 * @returns {Promise<string>} Federation id.
 */
export async function resolveFederationId(
  prisma: PipelinePrisma,
  tenantId: string,
  raw: string,
): Promise<string> {
  const token = raw.trim();
  if (!token) {
    throw new Error('A federation name is required to resolve a foreign key.');
  }
  const byName = await prisma.federation.findFirst({
    where: { tenantId, name: token, deletedAt: null },
  });
  if (byName) return byName.id;
  const all = await prisma.federation.findMany({ where: { tenantId, deletedAt: null } });
  const key = normalizePersonKey(token);
  const matches = all.filter(
    (item) => normalizePersonKey(item.name) === key || normalizePersonKey(item.acronym) === key,
  );
  if (matches.length === 1) return matches[0]!.id;
  if (matches.length > 1) {
    throw new Error(`Ambiguous federation "${token}".`);
  }
  const created = await prisma.federation.create({
    data: {
      tenantId,
      name: token,
      acronym: token.length <= 8 ? token.toUpperCase() : '',
      email: placeholderEmail('federation', token),
      isActive: true,
      country: 'ES',
    },
  });
  console.warn(`[import-pipeline] placeholder federation created for "${token}"`);
  return created.id;
}

/**
 * @param {PipelinePrisma} prisma - Client.
 * @param {string} tenantId - Academy key.
 * @param {string} raw - Age-bracket code (`kids`) or display name (`Kids`).
 * @returns {Promise<string>} AgeBracket id.
 */
export async function resolveAgeBracketId(
  prisma: PipelinePrisma,
  tenantId: string,
  raw: string,
): Promise<string> {
  const token = raw.trim();
  if (!token) {
    throw new Error('An age-bracket code is required.');
  }
  const byCode = await prisma.ageBracket.findUnique({
    where: { tenantId_code: { tenantId, code: token.toLowerCase() } },
  });
  if (byCode) return byCode.id;
  const all = await prisma.ageBracket.findMany({ where: { tenantId } });
  const key = normalizePersonKey(token);
  const matches = all.filter(
    (item) => normalizePersonKey(item.code) === key || normalizePersonKey(item.name) === key,
  );
  if (matches.length === 1) return matches[0]!.id;
  const code = token.toLowerCase().replace(/[^a-z0-9]+/g, '') || 'unknown';
  const created = await prisma.ageBracket.create({
    data: {
      tenantId,
      code,
      name: token,
      minAge: 0,
      maxAge: 99,
      sortOrder: 99,
    },
  });
  console.warn(`[import-pipeline] placeholder age bracket created for "${token}"`);
  return created.id;
}
