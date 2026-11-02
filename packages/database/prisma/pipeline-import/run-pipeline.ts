/**
 * @file run-pipeline.ts
 * @description Sequential, idempotent import of the numbered `import-data/` CSVs.
 * Transactional rows use Postgres UUIDs and natural keys; foreign keys resolve by name.
 */

import * as bcrypt from 'bcrypt';
import {
  AffiliationLicenseStatus,
  Gender,
  LeaveReason,
  LicenseHolderType,
  Role,
  StudentStatus,
} from '../../client';
import { resolveBelt, type CatalogDiscipline } from '../student-import/belt-map';
import { PENDING_HOLDER_DNI } from '../student-import/constants';
import { isValidIban, toIban } from '../student-import/iban';
import { ageInYears, normalizeDni, normalizePhone } from '../student-import/map-row';
import { PIPELINE_DEFAULT_TENANT_ID } from './constants';
import { readCsv } from './csv';
import { collectPipelineGuardians } from './guardians';
import {
  cell,
  defaultValidUntil,
  emptyToNull,
  parseAttendanceStatus,
  parseBoolean,
  parseFlexibleDate,
  parseLegacyPromotionMark,
  parseLicenseStatus,
  parseOptionalInt,
  parseRole,
  parseStudentStatus,
  parseWeekday,
  splitFullName,
} from './parse';
import {
  isPlaceholderEmail,
  namesMatch,
  resolveAgeBracketId,
  resolveDisciplineId,
  resolveFederationId,
  resolveStudentProfileId,
  resolveUserId,
} from './resolve-entity';
import { resolvePipelineFiles, type ResolvedPipelineFile } from './resolve-files';
import type { PipelineOptions, PipelinePrisma, PipelineSummary } from './types';

export type { PipelineOptions, PipelinePrisma, PipelineSummary } from './types';

/**
 * Runs files 01→08 in order, upserting each row on its natural unique key.
 *
 * @param {PipelinePrisma} prisma - Database client.
 * @param {PipelineOptions} options - Tenant and password hashing.
 * @param {ResolvedPipelineFile[]} [files] - Pre-resolved paths (tests).
 * @returns {Promise<PipelineSummary>} Counters.
 */
export async function runImportPipeline(
  prisma: PipelinePrisma,
  options: PipelineOptions,
  files: ResolvedPipelineFile[] = resolvePipelineFiles(),
): Promise<PipelineSummary> {
  const summary = emptySummary();

  if (files.length === 0) {
    console.warn(
      '[import-pipeline] No production .csv files found in import-data/. Mock templates (*.csv.mock) are ignored. Copy a template to <stem>.csv to import real data.',
    );
    return summary;
  }

  for (const file of files) {
    const rows = await readCsv(file.filePath);
    console.log(`[import-pipeline] ${file.stem} (${rows.length} rows)`);
    switch (file.stem) {
      case '01-academy-settings':
        await importAcademy(prisma, options.tenantId, rows, summary);
        break;
      case '02-users':
        await importUsers(prisma, rows, options, summary);
        break;
      case '03-federations':
        await importFederations(prisma, options.tenantId, rows, summary);
        break;
      case '04-disciplines':
        await importDisciplines(prisma, rows, summary);
        break;
      case '05-schedules':
        await importSchedules(prisma, options.tenantId, rows, options, summary);
        break;
      case '06-students':
        await importStudents(prisma, options, rows, summary);
        break;
      case '07-licenses':
        await importLicenses(prisma, options.tenantId, rows, summary);
        break;
      case '08-attendances':
        await importAttendances(prisma, rows, options, summary);
        break;
      default:
        break;
    }
  }

  return summary;
}

/**
 * @returns {PipelineSummary} Zeroed counters.
 */
function emptySummary(): PipelineSummary {
  return {
    academyUpserted: 0,
    ageBracketsUpserted: 0,
    usersUpserted: 0,
    federationsUpserted: 0,
    disciplinesUpserted: 0,
    beltRanksUpserted: 0,
    schedulesUpserted: 0,
    studentsUpserted: 0,
    guardiansLinked: 0,
    licensesUpserted: 0,
    attendancesUpserted: 0,
    promotionsApplied: 0,
  };
}

/**
 * Builds tenant and password hashing for the CLI. Temporary passwords never come from CSVs.
 *
 * @returns {{ tenantId: string; resolvePasswordHash: () => Promise<string> }} Runtime bindings.
 */
export function createPipelineContext(): {
  tenantId: string;
  resolvePasswordHash: () => Promise<string>;
} {
  const tenantId =
    process.env.DEFAULT_TENANT_ID?.trim() ||
    process.env.VITE_DEFAULT_TENANT_ID?.trim() ||
    PIPELINE_DEFAULT_TENANT_ID;
  let cached: string | null = null;
  return {
    tenantId,
    resolvePasswordHash: async () => {
      if (cached) return cached;
      const plain =
        process.env.IMPORT_PIPELINE_PASSWORD?.trim() || process.env.IMPORT_STUDENT_PASSWORD?.trim();
      if (!plain) {
        throw new Error(
          'FATAL: IMPORT_PIPELINE_PASSWORD or IMPORT_STUDENT_PASSWORD is required to hash temporary passwords for imported users.',
        );
      }
      cached = await bcrypt.hash(plain, 10);
      return cached;
    },
  };
}

/**
 * Formats end-of-run counters.
 *
 * @param {PipelineSummary} summary - Batch result.
 * @returns {string} Multi-line report.
 */
export function formatPipelineSummary(summary: PipelineSummary): string {
  return [
    '',
    '========== Import pipeline audit ==========',
    `Academy / financial : ${summary.academyUpserted}`,
    `Age brackets        : ${summary.ageBracketsUpserted}`,
    `Users               : ${summary.usersUpserted}`,
    `Federations         : ${summary.federationsUpserted}`,
    `Disciplines         : ${summary.disciplinesUpserted}`,
    `Belt ranks          : ${summary.beltRanksUpserted}`,
    `Schedules           : ${summary.schedulesUpserted}`,
    `Students            : ${summary.studentsUpserted}`,
    `Guardians linked    : ${summary.guardiansLinked}`,
    `Licenses            : ${summary.licensesUpserted}`,
    `Attendances         : ${summary.attendancesUpserted}`,
    `C/G promotions      : ${summary.promotionsApplied}`,
    '===========================================',
    '',
  ].join('\n');
}

/**
 * @param {PipelinePrisma} prisma - Client.
 * @param {string} tenantId - Academy key.
 * @param {Record<string, string>[]} rows - Academy sheet.
 * @param {PipelineSummary} summary - Counters.
 * @returns {Promise<void>}
 */
async function importAcademy(
  prisma: PipelinePrisma,
  tenantId: string,
  rows: Record<string, string>[],
  summary: PipelineSummary,
): Promise<void> {
  const row = rows[0];
  if (!row) {
    throw new Error('01-academy-settings is empty.');
  }

  const legalName = cell(row, 'legalName', 'legal_name');
  const tradeName = cell(row, 'tradeName', 'trade_name', 'brandName', 'displayName');
  const taxId = cell(row, 'cif', 'taxId', 'tax_id');
  const officialEmail = cell(row, 'email', 'officialEmail');
  const timezone = cell(row, 'timezone') || 'Europe/Madrid';
  const currency = cell(row, 'currency', 'defaultCurrency') || 'EUR';
  const ibanRaw = cell(row, 'iban');
  const iban = ibanRaw ? toIban(ibanRaw) : '';
  const creditorId = cell(row, 'creditorId', 'creditor_id');

  await prisma.academySettings.upsert({
    where: { tenantId },
    create: {
      tenantId,
      legalName,
      tradeName,
      taxId,
      officialEmail,
      timezone,
      defaultCurrency: currency,
      displayName: tradeName,
      brandName: tradeName,
    },
    update: {
      legalName,
      tradeName,
      taxId,
      officialEmail,
      timezone,
      defaultCurrency: currency,
      displayName: tradeName,
      brandName: tradeName,
    },
  });

  await prisma.tenantFinancialConfig.upsert({
    where: { tenantId },
    create: { tenantId, legalName, taxId, iban, creditorId },
    update: { legalName, taxId, iban, creditorId },
  });
  summary.academyUpserted += 1;

  summary.ageBracketsUpserted += await upsertAgeBracket(prisma, tenantId, {
    code: cell(row, 'kidsCode', 'kids_code') || 'kids',
    name: cell(row, 'kidsName', 'kids_name') || 'Kids',
    minAge: parseOptionalInt(cell(row, 'kidsMinAge', 'kids_min_age')) ?? 4,
    maxAge: parseOptionalInt(cell(row, 'kidsMaxAge', 'kids_max_age')) ?? 15,
    sortOrder: 10,
  });
  summary.ageBracketsUpserted += await upsertAgeBracket(prisma, tenantId, {
    code: cell(row, 'adultsCode', 'adults_code') || 'adults',
    name: cell(row, 'adultsName', 'adults_name') || 'Adults',
    minAge: parseOptionalInt(cell(row, 'adultsMinAge', 'adults_min_age')) ?? 16,
    maxAge: parseOptionalInt(cell(row, 'adultsMaxAge', 'adults_max_age')) ?? 99,
    sortOrder: 40,
  });
}

/**
 * @param {PipelinePrisma} prisma - Client.
 * @param {string} tenantId - Academy key.
 * @param {{ code: string; name: string; minAge: number; maxAge: number; sortOrder: number }} bracket - Sheet values.
 * @returns {Promise<number>} 1 when upserted.
 */
async function upsertAgeBracket(
  prisma: PipelinePrisma,
  tenantId: string,
  bracket: { code: string; name: string; minAge: number; maxAge: number; sortOrder: number },
): Promise<number> {
  const existing = await prisma.ageBracket.findUnique({
    where: { tenantId_code: { tenantId, code: bracket.code } },
  });
  if (existing) {
    await prisma.ageBracket.update({
      where: { id: existing.id },
      data: { name: bracket.name, minAge: bracket.minAge, maxAge: bracket.maxAge, sortOrder: bracket.sortOrder },
    });
    return 1;
  }
  await prisma.ageBracket.create({
    data: {
      tenantId,
      code: bracket.code,
      name: bracket.name,
      minAge: bracket.minAge,
      maxAge: bracket.maxAge,
      sortOrder: bracket.sortOrder,
    },
  });
  return 1;
}

/**
 * @param {PipelinePrisma} prisma - Client.
 * @param {Record<string, string>[]} rows - Staff sheet.
 * @param {PipelineOptions} options - Password hashing.
 * @param {PipelineSummary} summary - Counters.
 * @returns {Promise<void>}
 */
async function importUsers(
  prisma: PipelinePrisma,
  rows: Record<string, string>[],
  options: PipelineOptions,
  summary: PipelineSummary,
): Promise<void> {
  for (const row of rows) {
    const email = cell(row, 'email').toLowerCase();
    if (!email) continue;
    const names = splitFullName(
      cell(row, 'fullName', 'full_name', 'name') || `${cell(row, 'firstName')} ${cell(row, 'lastName')}`,
    );
    await upsertUser(prisma, {
      email,
      firstName: names.firstName,
      lastName: names.lastName,
      role: parseRole(cell(row, 'role')),
      options,
    });
    summary.usersUpserted += 1;
  }
}

/**
 * Creates a login with a hashed temporary password, or updates name/roles when the email exists.
 *
 * @param {PipelinePrisma} prisma - Client.
 * @param {{ email: string; firstName: string; lastName: string; role: Role; options: PipelineOptions }} input - Identity.
 * @returns {Promise<{ id: string }>} Persisted user.
 */
export async function upsertUser(
  prisma: PipelinePrisma,
  input: {
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
    options: PipelineOptions;
  },
): Promise<{ id: string }> {
  const byEmail = await prisma.user.findUnique({ where: { email: input.email } });
  if (byEmail) {
    const roles = Array.from(new Set([...(byEmail.roles ?? []), input.role]));
    return prisma.user.update({
      where: { id: byEmail.id },
      data: { firstName: input.firstName, lastName: input.lastName, roles },
    });
  }
  const named = (
    await prisma.user.findMany({
      where: {
        firstName: { contains: input.firstName, mode: 'insensitive' },
        lastName: { contains: input.lastName, mode: 'insensitive' },
      },
    })
  ).filter(
    (user) =>
      namesMatch(user.firstName, user.lastName, input.firstName, input.lastName) &&
      isPlaceholderEmail(user.email),
  );
  if (named.length === 1) {
    const roles = Array.from(new Set([...(named[0]!.roles ?? []), input.role]));
    return prisma.user.update({
      where: { id: named[0]!.id },
      data: {
        email: input.email,
        firstName: input.firstName,
        lastName: input.lastName,
        roles,
      },
    });
  }
  if (!input.options.passwordHash) {
    input.options.passwordHash = await input.options.hashPassword('');
  }
  if (!input.options.passwordHash) {
    throw new Error(
      'FATAL: IMPORT_PIPELINE_PASSWORD or IMPORT_STUDENT_PASSWORD is required to hash temporary passwords for imported users.',
    );
  }
  return prisma.user.create({
    data: {
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      passwordHash: input.options.passwordHash,
      roles: [input.role],
      isActive: true,
    },
  });
}

/**
 * @param {PipelinePrisma} prisma - Client.
 * @param {string} tenantId - Academy key.
 * @param {Record<string, string>[]} rows - Federation sheet.
 * @param {PipelineSummary} summary - Counters.
 * @returns {Promise<void>}
 */
async function importFederations(
  prisma: PipelinePrisma,
  tenantId: string,
  rows: Record<string, string>[],
  summary: PipelineSummary,
): Promise<void> {
  for (const row of rows) {
    const name = cell(row, 'name');
    const email = cell(row, 'email');
    if (!name) continue;
    if (!email) {
      throw new Error(`Federation "${name}" is missing the mandatory official email.`);
    }
    const acronym = cell(row, 'acronym');
    const isActive = parseBoolean(cell(row, 'active', 'isActive'));
    const country = cell(row, 'country') || 'ES';
    const existing =
      (await prisma.federation.findFirst({
        where: { tenantId, name, deletedAt: null },
      })) ??
      (acronym
        ? await prisma.federation.findFirst({
            where: { tenantId, acronym, deletedAt: null },
          })
        : null);
    if (existing) {
      await prisma.federation.update({
        where: { id: existing.id },
        data: { name, acronym, email, isActive, country, deletedAt: null },
      });
    } else {
      await prisma.federation.create({
        data: { tenantId, name, acronym, email, isActive, country },
      });
    }
    summary.federationsUpserted += 1;
  }
}

/**
 * Upserts each discipline plus its program / belt-rank hierarchy (one CSV row per belt).
 *
 * @param {PipelinePrisma} prisma - Client.
 * @param {Record<string, string>[]} rows - Discipline + belt sheet.
 * @param {PipelineSummary} summary - Counters.
 * @returns {Promise<void>}
 */
export async function importDisciplines(
  prisma: PipelinePrisma,
  rows: Record<string, string>[],
  summary: PipelineSummary,
): Promise<void> {
  const seenDisciplines = new Set<string>();
  for (const row of rows) {
    const name = cell(row, 'disciplineName', 'name');
    if (!name) continue;
    const description = emptyToNull(cell(row, 'description'));
    const acronym = emptyToNull(cell(row, 'acronym'));
    const existing = await prisma.discipline.findUnique({ where: { name } });
    const discipline = existing
      ? await prisma.discipline.update({
          where: { id: existing.id },
          data: { description: description ?? existing.description, acronym: acronym ?? existing.acronym },
        })
      : await prisma.discipline.create({ data: { name, description, acronym } });
    if (!seenDisciplines.has(discipline.id)) {
      seenDisciplines.add(discipline.id);
      summary.disciplinesUpserted += 1;
    }

    const programName = cell(row, 'programName', 'program');
    const beltName = cell(row, 'beltName', 'belt');
    if (!programName || !beltName) continue;

    const minAge = parseOptionalInt(cell(row, 'minAge', 'min_age')) ?? 0;
    const maxAge = parseOptionalInt(cell(row, 'maxAge', 'max_age')) ?? 99;
    const existingProgram = await prisma.disciplineProgram.findFirst({
      where: { disciplineId: discipline.id, name: programName },
    });
    const program = existingProgram
      ? await prisma.disciplineProgram.update({
          where: { id: existingProgram.id },
          data: { minAge, maxAge },
        })
      : await prisma.disciplineProgram.create({
          data: { disciplineId: discipline.id, name: programName, minAge, maxAge },
        });

    const order = parseOptionalInt(cell(row, 'order')) ?? 1;
    const maxStripes = parseOptionalInt(cell(row, 'maxStripes', 'max_stripes')) ?? 4;
    const minMonthsRequired = parseOptionalInt(cell(row, 'minMonthsRequired', 'min_months')) ?? 0;
    const minHoursRequired = parseOptionalInt(cell(row, 'minHoursRequired', 'min_hours')) ?? 0;
    const existingBelt =
      (await prisma.beltRank.findFirst({
        where: { disciplineProgramId: program.id, name: beltName },
      })) ??
      (await prisma.beltRank.findFirst({
        where: { disciplineProgramId: program.id, order },
      }));
    if (existingBelt) {
      await prisma.beltRank.update({
        where: { id: existingBelt.id },
        data: { name: beltName, order, maxStripes, minMonthsRequired, minHoursRequired },
      });
    } else {
      await prisma.beltRank.create({
        data: {
          disciplineProgramId: program.id,
          name: beltName,
          order,
          maxStripes,
          minMonthsRequired,
          minHoursRequired,
        },
      });
    }
    summary.beltRanksUpserted += 1;
  }
}

/**
 * @param {PipelinePrisma} prisma - Client.
 * @param {string} tenantId - Academy key.
 * @param {Record<string, string>[]} rows - Timetable sheet.
 * @param {PipelineOptions} options - Password hashing for placeholder instructors.
 * @param {PipelineSummary} summary - Counters.
 * @returns {Promise<void>}
 */
async function importSchedules(
  prisma: PipelinePrisma,
  tenantId: string,
  rows: Record<string, string>[],
  options: PipelineOptions,
  summary: PipelineSummary,
): Promise<void> {
  for (const row of rows) {
    const weekday = parseWeekday(cell(row, 'dayOfWeek', 'weekday'));
    const startTime = cell(row, 'startTime', 'start_time');
    const endTime = cell(row, 'endTime', 'end_time');
    const disciplineId = await resolveDisciplineId(prisma, cell(row, 'disciplineName', 'discipline'));
    const instructorUserId = await resolveUserId(
      prisma,
      cell(row, 'instructorName', 'instructor'),
      options,
      Role.INSTRUCTOR,
    );
    if (!startTime || !endTime) {
      throw new Error(`Schedule row is missing startTime or endTime (${startTime || 'unknown'}).`);
    }
    const maxCapacity = parseOptionalInt(cell(row, 'capacity', 'maxCapacity'));
    const ageBracketCode = cell(row, 'ageBracketCode', 'ageBracket', 'age_bracket');
    const ageBracketIds = ageBracketCode
      ? [await resolveAgeBracketId(prisma, tenantId, ageBracketCode)]
      : [];
    const label = emptyToNull(cell(row, 'label'));
    const existing = await prisma.academyScheduleSlot.findFirst({
      where: { tenantId, weekday, startTime, disciplineId, instructorUserId },
    });
    const data = {
      tenantId,
      weekday,
      startTime,
      endTime,
      disciplineId,
      instructorUserId,
      maxCapacity,
      ageBracketIds,
      label,
      isActive: true,
    };
    if (existing) {
      await prisma.academyScheduleSlot.update({ where: { id: existing.id }, data });
    } else {
      await prisma.academyScheduleSlot.create({ data });
    }
    summary.schedulesUpserted += 1;
  }
}

/**
 * @param {PipelinePrisma} prisma - Client.
 * @param {PipelineOptions} options - Tenant and password hashing.
 * @param {Record<string, string>[]} rows - Student sheet.
 * @param {PipelineSummary} summary - Counters.
 * @returns {Promise<void>}
 */
export async function importStudents(
  prisma: PipelinePrisma,
  options: PipelineOptions,
  rows: Record<string, string>[],
  summary: PipelineSummary,
): Promise<void> {
  const catalog = await loadCatalog(prisma);
  const today = new Date();

  for (const row of rows) {
    const firstName = cell(row, 'firstName', 'first_name', 'nombre') || 'Unknown';
    const lastName = cell(row, 'lastName', 'last_name', 'apellidos') || 'Unknown';
    const email = cell(row, 'email').toLowerCase();
    const birthDate = parseFlexibleDate(cell(row, 'birthDate', 'birth_date'));
    const isMinor = birthDate ? ageInYears(birthDate, today) < 18 : false;
    const status = parseStudentStatus(cell(row, 'status', 'estado'));
    const dni = normalizeDni(cell(row, 'dni', 'ID / Passport'));
    const phone = normalizePhone(cell(row, 'phone', 'telefono'));
    const genderRaw = cell(row, 'gender').toUpperCase();
    const gender = (Object.values(Gender) as string[]).includes(genderRaw) ? (genderRaw as Gender) : null;

    let userId: string | null = null;
    if (!isMinor && email) {
      const user = await upsertUser(prisma, {
        email,
        firstName,
        lastName,
        role: Role.STUDENT,
        options,
      });
      userId = user.id;
    }

    const existing =
      (userId ? await prisma.studentProfile.findUnique({ where: { userId } }) : null) ??
      (dni ? await prisma.studentProfile.findFirst({ where: { dni } }) : null) ??
      (birthDate
        ? await prisma.studentProfile.findFirst({ where: { firstName, lastName, birthDate } })
        : await prisma.studentProfile.findFirst({ where: { firstName, lastName } }));

    const emergencyContacts = buildEmergencyContacts(row);
    const profileData = {
      userId,
      firstName,
      lastName,
      dni,
      birthDate,
      phone,
      address: emptyToNull(cell(row, 'address')),
      city: emptyToNull(cell(row, 'city')),
      state: emptyToNull(cell(row, 'state')),
      postalCode: emptyToNull(cell(row, 'postalCode', 'postal_code')),
      country: cell(row, 'country') || 'ES',
      gender,
      status,
      emergencyContacts,
    };

    const profile = existing
      ? await prisma.studentProfile.update({ where: { id: existing.id }, data: profileData })
      : await prisma.studentProfile.create({ data: profileData });

    if (!existing) {
      const startDate = parseFlexibleDate(cell(row, 'startDate', 'start_date')) ?? new Date();
      await prisma.studentStatusHistory.create({
        data: {
          studentProfileId: profile.id,
          previousStatus: null,
          newStatus: status === StudentStatus.TRIAL ? StudentStatus.TRIAL : StudentStatus.ACTIVE,
          reason: 'Pipeline import enrollment',
          createdAt: startDate,
        },
      });
      if (status === StudentStatus.PAUSED || status === StudentStatus.DROPPED) {
        const leaveReasonRaw = cell(row, 'leaveReason', 'leave_reason').toUpperCase();
        const leaveReason = (Object.values(LeaveReason) as string[]).includes(leaveReasonRaw)
          ? (leaveReasonRaw as LeaveReason)
          : LeaveReason.OTHER;
        await prisma.studentStatusHistory.create({
          data: {
            studentProfileId: profile.id,
            previousStatus: StudentStatus.ACTIVE,
            newStatus: status,
            reason: emptyToNull(cell(row, 'notes')) ?? status,
            leaveReason,
            customReasonDetails: emptyToNull(cell(row, 'notes', 'medicalNotes')),
            createdAt: parseFlexibleDate(cell(row, 'endDate', 'end_date')) ?? new Date(),
          },
        });
      }
    }

    summary.guardiansLinked += await linkGuardians(prisma, profile.id, row, options);
    await assignBelt(prisma, profile.id, row, catalog, birthDate);
    const payerUserId = userId ?? (await firstGuardianUserId(prisma, profile.id));
    await maybeCreateMandate(prisma, options.tenantId, profile.id, payerUserId, row);
    summary.studentsUpserted += 1;
  }
}

/**
 * @param {Record<string, string>} row - Student sheet row.
 * @returns {Array<{ name: string; phone: string; relationship: string }>} Emergency contacts.
 */
function buildEmergencyContacts(
  row: Record<string, string>,
): Array<{ name: string; phone: string; relationship: string }> {
  const name = cell(row, 'emergencyName', 'emergency_name');
  const phone = cell(row, 'emergencyPhone', 'emergency_phone');
  if (!name && !phone) return [];
  return [
    {
      name,
      phone,
      relationship: cell(row, 'emergencyRelationship', 'emergency_relationship') || 'Other',
    },
  ];
}

/**
 * Creates PARENT logins and `StudentGuardian` links for every distinct guardian on the row.
 *
 * @param {PipelinePrisma} prisma - Client.
 * @param {string} studentProfileId - Academic profile.
 * @param {Record<string, string>} row - Student sheet row.
 * @param {PipelineOptions} options - Password hashing.
 * @returns {Promise<number>} Newly created links.
 */
export async function linkGuardians(
  prisma: PipelinePrisma,
  studentProfileId: string,
  row: Record<string, string>,
  options: PipelineOptions,
): Promise<number> {
  let linked = 0;
  for (const item of collectPipelineGuardians(row)) {
    const guardianUser = await upsertUser(prisma, {
      email: item.email,
      firstName: item.firstName,
      lastName: item.lastName,
      role: Role.PARENT,
      options,
    });
    const guardian =
      (await prisma.guardian.findUnique({ where: { userId: guardianUser.id } })) ??
      (await prisma.guardian.create({ data: { userId: guardianUser.id } }));
    const existingLink = await prisma.studentGuardian.findUnique({
      where: { studentProfileId_guardianId: { studentProfileId, guardianId: guardian.id } },
    });
    if (!existingLink) {
      await prisma.studentGuardian.create({
        data: {
          studentProfileId,
          guardianId: guardian.id,
          relationship: item.relationship,
        },
      });
      linked += 1;
    }
  }
  return linked;
}

/**
 * @param {PipelinePrisma} prisma - Client.
 * @param {string} studentProfileId - Academic profile.
 * @returns {Promise<string | null>} First linked parent user id.
 */
async function firstGuardianUserId(prisma: PipelinePrisma, studentProfileId: string): Promise<string | null> {
  const link = await prisma.studentGuardian.findFirst({ where: { studentProfileId } });
  if (!link) return null;
  const guardian = await prisma.guardian.findUnique({ where: { id: link.guardianId } });
  return guardian?.userId ?? null;
}

/**
 * @param {PipelinePrisma} prisma - Client.
 * @param {string} studentProfileId - Academic profile.
 * @param {Record<string, string>} row - Student sheet row.
 * @param {CatalogDiscipline[]} catalog - Seeded + imported disciplines.
 * @param {Date | null} birthDate - Used to pick kids vs adults program.
 * @returns {Promise<void>}
 */
async function assignBelt(
  prisma: PipelinePrisma,
  studentProfileId: string,
  row: Record<string, string>,
  catalog: CatalogDiscipline[],
  birthDate: Date | null,
): Promise<void> {
  const disciplineName = cell(row, 'discipline');
  const beltName = cell(row, 'belt');
  if (!disciplineName && !beltName) return;
  const resolved = resolveBelt({
    disciplineName: disciplineName || null,
    beltName: beltName || null,
    age: birthDate ? ageInYears(birthDate, new Date()) : null,
    catalog,
  });
  if (!resolved.belt) return;
  const existing = await prisma.studentRank.findFirst({
    where: { studentProfileId, beltRankId: resolved.belt.id },
  });
  if (existing) return;
  await prisma.studentRank.create({
    data: { studentProfileId, beltRankId: resolved.belt.id, currentStripes: 0 },
  });
}

/**
 * @param {PipelinePrisma} prisma - Client.
 * @param {string} tenantId - Academy key.
 * @param {string} studentProfileId - Academic profile.
 * @param {string | null} payerUserId - Adult student or guardian payer.
 * @param {Record<string, string>} row - Student sheet row.
 * @returns {Promise<void>}
 */
async function maybeCreateMandate(
  prisma: PipelinePrisma,
  tenantId: string,
  studentProfileId: string,
  payerUserId: string | null,
  row: Record<string, string>,
): Promise<void> {
  const rawIban = cell(row, 'iban');
  if (!rawIban || !payerUserId) return;
  const iban = toIban(rawIban);
  if (!isValidIban(iban)) return;
  const mandateReference = `PIPE-${studentProfileId.slice(0, 8)}`;
  const existing = await prisma.bankMandate.findUnique({ where: { mandateReference } });
  if (existing) return;
  const holderName = cell(row, 'accountHolderName') || `${cell(row, 'firstName')} ${cell(row, 'lastName')}`.trim();
  const holderDni = normalizeDni(cell(row, 'accountHolderDni')) ?? normalizeDni(cell(row, 'dni')) ?? PENDING_HOLDER_DNI;
  const created = await prisma.bankMandate.create({
    data: {
      payerUserId,
      iban,
      mandateReference,
      signatureDate: new Date(),
      accountHolderName: holderName,
      accountHolderDni: holderDni,
      tenantId,
      isSigned: true,
      signedAt: new Date(),
      isActive: true,
    },
  });
  await prisma.studentProfile.update({
    where: { id: studentProfileId },
    data: { bankMandateId: created.id },
  });
}

/**
 * @param {PipelinePrisma} prisma - Client.
 * @returns {Promise<CatalogDiscipline[]>} Catalog used for belt matching.
 */
async function loadCatalog(prisma: PipelinePrisma): Promise<CatalogDiscipline[]> {
  const disciplines = await prisma.discipline.findMany();
  const catalog: CatalogDiscipline[] = [];
  for (const discipline of disciplines) {
    const programs = await prisma.disciplineProgram.findMany({ where: { disciplineId: discipline.id } });
    const mapped = [];
    for (const program of programs) {
      const beltRanks = await prisma.beltRank.findMany({
        where: { disciplineProgramId: program.id },
        orderBy: { order: 'asc' },
      });
      mapped.push({
        id: program.id,
        name: program.name,
        minAge: program.minAge,
        maxAge: program.maxAge,
        beltRanks: beltRanks.map((belt) => ({ id: belt.id, name: belt.name, order: belt.order })),
      });
    }
    catalog.push({
      id: discipline.id,
      name: discipline.name,
      acronym: discipline.acronym,
      programs: mapped,
    });
  }
  return catalog;
}

/**
 * @param {PipelinePrisma} prisma - Client.
 * @param {string} tenantId - Academy key.
 * @param {Record<string, string>[]} rows - License sheet.
 * @param {PipelineSummary} summary - Counters.
 * @returns {Promise<void>}
 */
async function importLicenses(
  prisma: PipelinePrisma,
  tenantId: string,
  rows: Record<string, string>[],
  summary: PipelineSummary,
): Promise<void> {
  for (const row of rows) {
    const studentProfileId = await resolveStudentProfileId(prisma, row);
    const federationId = await resolveFederationId(prisma, tenantId, cell(row, 'federationName', 'federation'));
    const season = cell(row, 'season');
    if (!season) {
      throw new Error(`License row for student ${studentProfileId} is missing season.`);
    }
    const profile = await prisma.studentProfile.findUnique({ where: { id: studentProfileId } });
    if (!profile) {
      throw new Error(`License student ${studentProfileId} was not imported before 07-licenses.`);
    }
    await prisma.federationSeason.upsert({
      where: { federationId_seasonName: { federationId, seasonName: season } },
      create: { federationId, seasonName: season, currency: 'EUR', isActive: true },
      update: { isActive: true },
    });

    const status = parseLicenseStatus(cell(row, 'status'));
    const issueDate = parseFlexibleDate(cell(row, 'issueDate', 'issue_date'));
    const licenseNumber =
      cell(row, 'licenseNumber', 'license_number') ||
      `LIC-${season.replace('-', '')}-${studentProfileId.slice(0, 8).toUpperCase()}`;
    const validUntil = defaultValidUntil(season);
    const payload = {
      tenantId,
      studentProfileId,
      holderUserId: profile.userId,
      holderType: LicenseHolderType.STUDENT,
      federationId,
      licenseNumber,
      season,
      validUntil,
      isActive: true,
      isPaid: status === AffiliationLicenseStatus.PAID || status === AffiliationLicenseStatus.EXEMPT,
      status,
      isExempt: status === AffiliationLicenseStatus.EXEMPT,
      payerUserId: profile.userId,
    };

    const existing = await prisma.affiliationLicense.findUnique({
      where: {
        tenantId_federationId_studentProfileId_season: { tenantId, federationId, studentProfileId, season },
      },
    });
    if (existing) {
      await prisma.affiliationLicense.update({ where: { id: existing.id }, data: payload });
    } else {
      await prisma.affiliationLicense.create({
        data: { ...payload, createdAt: issueDate ?? undefined },
      });
    }
    summary.licensesUpserted += 1;
  }
}

/**
 * @param {PipelinePrisma} prisma - Client.
 * @param {Record<string, string>[]} rows - Attendance sheet.
 * @param {PipelineOptions} options - Password hashing for placeholder instructors.
 * @param {PipelineSummary} summary - Counters.
 * @returns {Promise<void>}
 */
async function importAttendances(
  prisma: PipelinePrisma,
  rows: Record<string, string>[],
  options: PipelineOptions,
  summary: PipelineSummary,
): Promise<void> {
  for (const row of rows) {
    const studentProfileId = await resolveStudentProfileId(prisma, row);
    const classDate = parseFlexibleDate(cell(row, 'classDate', 'class_date', 'date'));
    if (!classDate) {
      throw new Error('Attendance row is missing classDate.');
    }
    const disciplineId = await resolveDisciplineId(prisma, cell(row, 'disciplineName', 'discipline'));
    const instructorUserId = await resolveUserId(
      prisma,
      cell(row, 'instructorName', 'instructor'),
      options,
      Role.INSTRUCTOR,
    );
    const startTime = emptyToNull(cell(row, 'startTime', 'start_time'));
    const endTime = emptyToNull(cell(row, 'endTime', 'end_time'));
    const status = parseAttendanceStatus(cell(row, 'status'));

    const existingSession = await prisma.attendanceSession.findFirst({
      where: { disciplineId, date: classDate, instructorUserId, startTime: startTime ?? undefined },
    });
    const session =
      existingSession ??
      (await prisma.attendanceSession.create({
        data: { disciplineId, date: classDate, instructorUserId, startTime, endTime },
      }));

    const existingRecord = await prisma.attendanceRecord.findUnique({
      where: { sessionId_studentProfileId: { sessionId: session.id, studentProfileId } },
    });
    await prisma.attendanceRecord.upsert({
      where: { sessionId_studentProfileId: { sessionId: session.id, studentProfileId } },
      create: { sessionId: session.id, studentProfileId, status },
      update: { status },
    });
    summary.attendancesUpserted += 1;

    const mark = parseLegacyPromotionMark(cell(row, 'notes'));
    if (!existingRecord && mark) {
      const applied = await applyLegacyPromotion(prisma, studentProfileId, mark);
      if (applied) summary.promotionsApplied += 1;
    }
  }
}

/**
 * Applies a legacy matrix `C` (next belt) or `G` (next stripe) onto `StudentRank`.
 *
 * @param {PipelinePrisma} prisma - Client.
 * @param {string} studentProfileId - Academic profile.
 * @param {'BELT' | 'STRIPE'} mark - Promotion kind.
 * @returns {Promise<boolean>} Whether a rank row was updated.
 */
async function applyLegacyPromotion(
  prisma: PipelinePrisma,
  studentProfileId: string,
  mark: 'BELT' | 'STRIPE',
): Promise<boolean> {
  const current = await prisma.studentRank.findFirst({
    where: { studentProfileId },
    orderBy: { promotedAt: 'desc' },
  });
  if (!current) return false;
  const belt = await prisma.beltRank.findUnique({ where: { id: current.beltRankId } });
  if (!belt) return false;

  if (mark === 'STRIPE') {
    const next = Math.min(current.currentStripes + 1, belt.maxStripes);
    if (next === current.currentStripes) return false;
    await prisma.studentRank.update({
      where: { id: current.id },
      data: { currentStripes: next, lastStripeAt: new Date() },
    });
    return true;
  }

  const nextBelt = await prisma.beltRank.findFirst({
    where: { disciplineProgramId: belt.disciplineProgramId, order: belt.order + 1 },
  });
  if (!nextBelt) return false;
  const already = await prisma.studentRank.findFirst({
    where: { studentProfileId, beltRankId: nextBelt.id },
  });
  if (already) return false;
  await prisma.studentRank.create({
    data: { studentProfileId, beltRankId: nextBelt.id, currentStripes: 0, promotedAt: new Date() },
  });
  return true;
}
