/**
 * @file run-import.ts
 * @description Sequential student import: identity → profile/history/rank/guardians → SEPA mandate.
 * Rows are independent. Missing phone/DNI/DOB never abort a row; they set REQUIERE_VALIDACION_DATOS.
 */

import { randomBytes } from 'crypto';
import { Gender, LeaveReason, PrismaClient, Role, StudentStatus } from '../../client';
import { resolveBelt, type CatalogDiscipline } from './belt-map';
import {
  DATA_VALIDATION_FLAG,
  DEFAULT_TENANT_ID,
  PENDING_HOLDER_DNI,
  TUTOR_VALIDATION_FLAG,
} from './constants';
import {
  ageInYears,
  buildStatusHistory,
  type MappedFlag,
  type MappedGuardian,
  type MappedStudentRow,
  type SelfReferencingParent,
} from './map-row';

/**
 * One skipped StudentProfile for the audit trail.
 */
export interface SkippedProfileAudit {
  index: number;
  name: string;
  email: string;
  reason: string;
}

/**
 * One flagged row for the audit trail.
 */
export interface FlaggedRecordAudit {
  index: number;
  name: string;
  email: string;
  details: string[];
}

/**
 * One failed row for the audit trail.
 */
export interface ErrorRecordAudit {
  index: number;
  name: string;
  email: string;
  reason: string;
}

/**
 * Minor whose parent columns reused the student's own identity.
 */
export interface SelfReferencingParentAudit {
  index: number;
  name: string;
  email: string;
  matchedField: SelfReferencingParent['matchedField'];
  relationship: string;
  parentValue: string;
}

/**
 * Minor who received a placeholder tutor because no valid parent remained.
 */
export interface MockParentAudit {
  index: number;
  name: string;
  email: string;
  profileId: string;
}

/**
 * Counters and audit lists printed at the end of a batch.
 */
export interface ImportSummary {
  processed: number;
  usersCreated: number;
  usersReused: number;
  profilesCreated: number;
  profilesSkipped: number;
  mandatesCreated: number;
  ranksAssigned: number;
  guardiansLinked: number;
  flagged: number;
  errors: number;
  minorsImported: number;
  skippedProfiles: SkippedProfileAudit[];
  flaggedRecords: FlaggedRecordAudit[];
  errorRecords: ErrorRecordAudit[];
  selfReferencingParentErrors: SelfReferencingParentAudit[];
  duplicateParentSkipped: SelfReferencingParentAudit[];
  minorsAssignedMockParent: MockParentAudit[];
}

/**
 * Prisma delegates the importer touches (no User↔StudentProfile `include`).
 */
export type StudentImportStore = Pick<
  PrismaClient,
  | 'user'
  | 'studentProfile'
  | 'studentStatusHistory'
  | 'guardian'
  | 'studentGuardian'
  | 'bankMandate'
  | 'discipline'
  | 'studentRank'
>;

/**
 * Store plus a per-row interactive transaction. Tests mock this; the CLI casts `PrismaClient`.
 */
export type StudentImportPrisma = StudentImportStore & {
  $transaction: <T>(fn: (tx: StudentImportStore) => Promise<T>) => Promise<T>;
};

/**
 * Runtime options for a batch.
 */
export interface ImportOptions {
  tenantId?: string;
  defaultPasswordHash: string;
  hashPassword: (plain: string) => Promise<string>;
  catalog?: CatalogDiscipline[];
  today?: Date;
}

/**
 * Issues a unique SEPA mandate reference (same shape as financial-service).
 *
 * @returns {string} `DMS-MANDATE-<timestamp>-<hex>`.
 */
export function generateMandateReference(): string {
  return `DMS-MANDATE-${Date.now()}-${randomBytes(4).toString('hex').toUpperCase()}`;
}

/**
 * Imports already-mapped rows. One transaction per student so a mandate/history failure rolls back that row only.
 *
 * @param {StudentImportPrisma} prisma - Shared Prisma client (script context; no User↔profile `include`).
 * @param {MappedStudentRow[]} rows - Mapped CSV rows.
 * @param {ImportOptions} options - Tenant, default password hash, hasher, optional catalog.
 * @returns {Promise<ImportSummary>} Batch counters and audit lists.
 */
export async function importStudentRows(
  prisma: StudentImportPrisma,
  rows: MappedStudentRow[],
  options: ImportOptions,
): Promise<ImportSummary> {
  const tenantId = options.tenantId || DEFAULT_TENANT_ID;
  const catalog = options.catalog ?? (await loadCatalog(prisma));
  const today = options.today ?? new Date();
  const summary = emptySummary();

  for (const row of rows) {
    summary.processed += 1;
    const displayName = `${row.firstName} ${row.lastName}`.trim();
    try {
      const result = await prisma.$transaction((tx) =>
        persistRow(tx, row, { ...options, tenantId, catalog, today }),
      );
      summary.usersCreated += result.userCreated ? 1 : 0;
      summary.usersReused += result.userReused ? 1 : 0;
      summary.profilesCreated += result.profileCreated ? 1 : 0;
      summary.profilesSkipped += result.profileCreated ? 0 : 1;
      summary.mandatesCreated += result.mandateCreated ? 1 : 0;
      summary.ranksAssigned += result.rankAssigned ? 1 : 0;
      summary.guardiansLinked += result.guardiansLinked;
      if (row.isMinor) {
        summary.minorsImported += 1;
      }
      const overlapAudits = [
        ...row.selfReferencingParents.map((overlap) => toOverlapAudit(row, displayName, overlap)),
        ...result.persistOverlaps,
      ];
      summary.selfReferencingParentErrors.push(...overlapAudits);
      summary.duplicateParentSkipped.push(...overlapAudits);
      if (result.mockParent) {
        summary.minorsAssignedMockParent.push(result.mockParent);
      }
      const flags = [...row.flags, ...result.extraFlags];
      if (flags.length > 0) {
        summary.flagged += 1;
        summary.flaggedRecords.push({
          index: row.index,
          name: displayName,
          email: row.email,
          details: flags.map((item) => item.detail),
        });
      }
      if (result.skipReason) {
        summary.skippedProfiles.push({
          index: row.index,
          name: displayName,
          email: row.email,
          reason: result.skipReason,
        });
      }
      console.log(
        `[import-students] #${row.index} ${displayName} — ${result.profileCreated ? 'created' : 'skipped'} profile` +
          `${result.rankAssigned ? `, belt ${result.beltAssigned ?? ''}` : ''}` +
          `${result.guardiansLinked ? `, guardians +${result.guardiansLinked}` : ''}` +
          `${result.mandateCreated ? ', mandate' : ''}` +
          `${flags.length ? `, flagged (${flags.length})` : ''}`,
      );
    } catch (error) {
      summary.errors += 1;
      const reason = error instanceof Error ? error.message : String(error);
      summary.errorRecords.push({ index: row.index, name: displayName, email: row.email, reason });
      console.error(`[import-students] row ${row.index} (${row.email}):`, error);
    }
  }

  return summary;
}

/**
 * Renders the end-of-run audit (skipped profiles + flagged defaults).
 *
 * @param {ImportSummary} summary - Batch result.
 * @returns {string} Multi-line report.
 */
export function formatAuditSummary(summary: ImportSummary): string {
  const lines: string[] = [
    '',
    '========== Student import audit ==========',
    `Processed          : ${summary.processed}`,
    `Users created      : ${summary.usersCreated}`,
    `Users reused       : ${summary.usersReused}`,
    `Profiles created   : ${summary.profilesCreated}`,
    `Profiles skipped   : ${summary.profilesSkipped}`,
    `Guardians linked   : ${summary.guardiansLinked}`,
    `Ranks assigned     : ${summary.ranksAssigned}`,
    `Mandates created   : ${summary.mandatesCreated}`,
    `Flagged for review : ${summary.flagged}`,
    `Minors imported    : ${summary.minorsImported}`,
    `Mock tutors        : ${summary.minorsAssignedMockParent.length}`,
    `Self-parent skips  : ${summary.duplicateParentSkipped.length}`,
    `Errors             : ${summary.errors}`,
  ];

  lines.push('', `--- Skipped profiles (${summary.skippedProfiles.length}) ---`);
  if (summary.skippedProfiles.length === 0) {
    lines.push('  (none)');
  } else {
    for (const item of summary.skippedProfiles) {
      lines.push(`  #${item.index} ${item.name} <${item.email}> — ${item.reason}`);
    }
  }

  lines.push('', `--- Flagged for review (${summary.flaggedRecords.length}) ---`);
  if (summary.flaggedRecords.length === 0) {
    lines.push('  (none)');
  } else {
    for (const item of summary.flaggedRecords) {
      lines.push(`  #${item.index} ${item.name} <${item.email}>`);
      for (const detail of item.details) {
        lines.push(`      • ${detail}`);
      }
    }
  }

  lines.push('', `--- Self-referencing parents skipped (${summary.selfReferencingParentErrors.length}) ---`);
  if (summary.selfReferencingParentErrors.length === 0) {
    lines.push('  (none)');
  } else {
    for (const item of summary.selfReferencingParentErrors) {
      lines.push(
        `  #${item.index} ${item.name} <${item.email}> — ${item.relationship} reused student ${item.matchedField} (${item.parentValue})`,
      );
    }
  }

  lines.push('', `--- Minors assigned mock parent (${summary.minorsAssignedMockParent.length}) ---`);
  if (summary.minorsAssignedMockParent.length === 0) {
    lines.push('  (none)');
  } else {
    for (const item of summary.minorsAssignedMockParent) {
      lines.push(`  #${item.index} ${item.name} <${item.email}> — profile ${item.profileId}`);
    }
  }

  lines.push('', `--- Errors (${summary.errorRecords.length}) ---`);
  if (summary.errorRecords.length === 0) {
    lines.push('  (none)');
  } else {
    for (const item of summary.errorRecords) {
      lines.push(`  #${item.index} ${item.name} <${item.email}> — ${item.reason}`);
    }
  }

  lines.push('==========================================', '');
  return lines.join('\n');
}

interface PersistResult {
  userCreated: boolean;
  userReused: boolean;
  profileCreated: boolean;
  mandateCreated: boolean;
  rankAssigned: boolean;
  beltAssigned: string | null;
  guardiansLinked: number;
  skipReason: string | null;
  extraFlags: MappedFlag[];
  persistOverlaps: SelfReferencingParentAudit[];
  mockParent: MockParentAudit | null;
}

/**
 * Upserts identity, profile, history, guardians, rank, and optional mandate without joining User to StudentProfile.
 *
 * @param {StudentImportStore} tx - Interactive transaction.
 * @param {MappedStudentRow} row - Mapped row.
 * @param {ImportOptions & { tenantId: string; catalog: CatalogDiscipline[]; today: Date }} options - Runtime options.
 * @returns {Promise<PersistResult>} Per-row outcome.
 */
async function persistRow(
  tx: StudentImportStore,
  row: MappedStudentRow,
  options: ImportOptions & { tenantId: string; catalog: CatalogDiscipline[]; today: Date },
): Promise<PersistResult> {
  const extraFlags: MappedFlag[] = [];
  const persistOverlaps: SelfReferencingParentAudit[] = [];
  const displayName = `${row.firstName} ${row.lastName}`.trim();

  let studentUser: UpsertedUser | null = null;
  if (!row.isMinor && row.email) {
    studentUser = await upsertIdentity(tx, identityFromStudent(row), options, Role.STUDENT);
  } else if (!row.isMinor && !row.email) {
    extraFlags.push({ field: 'email', detail: 'adult has no email; StudentProfile stored without a User' });
  }

  const existingProfile = await findExistingProfile(tx, row, studentUser?.id ?? null);
  const profile = existingProfile ?? (await tx.studentProfile.create({
    data: {
      userId: studentUser?.id ?? null,
      firstName: row.firstName,
      lastName: row.lastName,
      dni: row.dni,
      birthDate: row.birthDate,
      phone: row.phone,
      address: row.address,
      city: row.city,
      state: row.state,
      postalCode: row.postalCode,
      country: row.country,
      gender: (row.gender as Gender | null) ?? null,
      status: row.status as StudentStatus,
      emergencyContacts: [],
    },
  }));

  if (!existingProfile) {
    for (const entry of buildStatusHistory(row)) {
      await tx.studentStatusHistory.create({
        data: {
          studentProfileId: profile.id,
          previousStatus: entry.previousStatus as StudentStatus | null,
          newStatus: entry.newStatus as StudentStatus,
          reason: entry.reason,
          leaveReason: entry.leaveReason as LeaveReason | null,
          customReasonDetails: entry.customReasonDetails,
          changedById: null,
          createdAt: entry.createdAt,
        },
      });
    }
  } else {
    await tx.studentProfile.update({
      where: { id: profile.id },
      data: {
        firstName: row.firstName,
        lastName: row.lastName,
        dni: profile.dni ?? row.dni,
        birthDate: profile.birthDate ?? row.birthDate,
        phone: profile.phone ?? row.phone,
      },
    });
  }

  const guardianResult = await linkGuardians(tx, profile.id, studentUser?.id ?? null, row, options, persistOverlaps);
  extraFlags.push(...guardianResult.extraFlags);
  const rank = await assignRank(tx, profile.id, row, options, extraFlags);
  const payerUserId = row.isMinor
    ? guardianResult.payerUserIds[0] ?? null
    : studentUser?.id ?? guardianResult.payerUserIds[0] ?? null;
  const mandateCreated = await maybeCreateMandate(tx, profile.id, row, payerUserId, options.tenantId, extraFlags);

  return {
    userCreated: studentUser?.created === true,
    userReused: studentUser?.created === false,
    profileCreated: !existingProfile,
    mandateCreated,
    rankAssigned: rank.assigned,
    beltAssigned: rank.beltName,
    guardiansLinked: guardianResult.linked,
    skipReason: existingProfile
      ? `StudentProfile already exists for this identity (${row.email || displayName})`
      : null,
    extraFlags,
    persistOverlaps,
    mockParent: null,
  };
}

/**
 * Finds a profile by login identity, then DNI, then name + birth date (minors without a User).
 *
 * @param {StudentImportStore} tx - Transaction.
 * @param {MappedStudentRow} row - Mapped row.
 * @param {string | null} userId - Adult login identity, if any.
 * @returns {Promise<{ id: string; dni: string | null; birthDate: Date | null; phone: string | null } | null>} Existing profile.
 */
async function findExistingProfile(
  tx: StudentImportStore,
  row: MappedStudentRow,
  userId: string | null,
): Promise<{ id: string; dni: string | null; birthDate: Date | null; phone: string | null } | null> {
  if (userId) {
    const byUser = await tx.studentProfile.findUnique({ where: { userId } });
    if (byUser) return byUser;
  }
  if (row.dni) {
    const byDni = await tx.studentProfile.findFirst({ where: { dni: row.dni } });
    if (byDni) return byDni;
  }
  if (row.birthDate) {
    return tx.studentProfile.findFirst({
      where: { firstName: row.firstName, lastName: row.lastName, birthDate: row.birthDate },
    });
  }
  return null;
}

interface UpsertedUser {
  id: string;
  created: boolean;
}

type IdentityInput = Pick<
  MappedStudentRow,
  | 'email'
  | 'dni'
  | 'firstName'
  | 'lastName'
  | 'phone'
  | 'birthDate'
  | 'gender'
  | 'address'
  | 'city'
  | 'state'
  | 'postalCode'
  | 'country'
  | 'password'
>;

/**
 * Finds a user by email. Creates when missing; otherwise merges the role.
 * DNI / phone / address are StudentProfile fields and are never written to User.
 *
 * @param {StudentImportStore} tx - Transaction.
 * @param {IdentityInput} row - Identity fields.
 * @param {ImportOptions} options - Password hashing.
 * @param {Role} role - Role to grant (STUDENT or PARENT).
 * @returns {Promise<UpsertedUser>} Identity id and whether it was inserted.
 */
async function upsertIdentity(
  tx: StudentImportStore,
  row: IdentityInput,
  options: ImportOptions,
  role: Role,
): Promise<UpsertedUser | null> {
  const existing = row.email ? await tx.user.findUnique({ where: { email: row.email } }) : null;

  if (existing) {
    await tx.user.update({
      where: { id: existing.id },
      data: {
        roles: Array.from(new Set([...(existing.roles ?? []), role])),
        gender: existing.gender ?? (row.gender as Gender | null),
      },
    });
    return { id: existing.id, created: false };
  }

  if (!row.email) {
    return null;
  }

  const passwordHash = row.password
    ? await options.hashPassword(row.password)
    : options.defaultPasswordHash;

  const created = await tx.user.create({
    data: {
      email: row.email,
      passwordHash,
      firstName: row.firstName,
      lastName: row.lastName,
      gender: (row.gender as Gender | null) ?? null,
      isActive: true,
      roles: [role],
    },
  });
  return { id: created.id, created: true };
}

/**
 * Creates PARENT users and StudentGuardian rows (`Padre` / `Madre` / `Tutor Legal`).
 * Skips identities that resolve to the student themselves. Minors with zero links get a placeholder tutor.
 *
 * @param {StudentImportStore} tx - Transaction.
 * @param {string} studentProfileId - Academic profile.
 * @param {string | null} studentUserId - Student's auth identity when the student is an adult.
 * @param {MappedStudentRow} row - Mapped row.
 * @param {ImportOptions} options - Password helpers.
 * @param {SelfReferencingParentAudit[]} persistOverlaps - Overlaps detected at persist time.
 * @returns {Promise<{ linked: number; mockParent: boolean; extraFlags: MappedFlag[]; payerUserIds: string[] }>} Link outcome.
 */
async function linkGuardians(
  tx: StudentImportStore,
  studentProfileId: string,
  studentUserId: string | null,
  row: MappedStudentRow,
  options: ImportOptions,
  persistOverlaps: SelfReferencingParentAudit[],
): Promise<{ linked: number; mockParent: boolean; extraFlags: MappedFlag[]; payerUserIds: string[] }> {
  let linked = 0;
  const extraFlags: MappedFlag[] = [];
  const payerUserIds: string[] = [];
  const displayName = `${row.firstName} ${row.lastName}`.trim();

  for (const guardianRow of row.guardians) {
    const parent = await upsertIdentity(tx, identityFromGuardian(guardianRow, row.country), options, Role.PARENT);
    if (!parent) {
      extraFlags.push({
        field: 'parent',
        detail: `${guardianRow.relationship} has no email or existing DNI; parent User not created`,
      });
      continue;
    }
    if (studentUserId && parent.id === studentUserId) {
      persistOverlaps.push({
        index: row.index,
        name: displayName,
        email: row.email,
        matchedField: 'email',
        relationship: guardianRow.relationship,
        parentValue: guardianRow.email,
      });
      extraFlags.push({
        field: 'selfParent',
        detail: `${guardianRow.relationship} resolved to the student's own user id; parent not linked`,
      });
      continue;
    }
    linked += await ensureGuardianLink(tx, studentProfileId, parent.id, guardianRow.relationship);
    payerUserIds.push(parent.id);
  }

  const existingLinks = await tx.studentGuardian.findMany({
    where: { studentProfileId },
    include: { guardian: true },
  });
  for (const link of existingLinks) {
    const guardianUserId = (link as { guardian?: { userId?: string }; guardianId: string }).guardian?.userId;
    if (guardianUserId && studentUserId && guardianUserId === studentUserId) {
      await tx.studentGuardian.delete({
        where: { studentProfileId_guardianId: { studentProfileId, guardianId: link.guardianId } },
      });
    } else if (guardianUserId && !payerUserIds.includes(guardianUserId)) {
      payerUserIds.push(guardianUserId);
    }
  }
  const remaining = await tx.studentGuardian.findMany({ where: { studentProfileId } });
  if (row.isMinor && remaining.length === 0) {
    extraFlags.push({
      field: 'parent',
      detail: `${TUTOR_VALIDATION_FLAG}: minor has no User and no linked guardian`,
    });
    await tx.studentStatusHistory.create({
      data: {
        studentProfileId,
        previousStatus: row.status as StudentStatus,
        newStatus: row.status as StudentStatus,
        reason: TUTOR_VALIDATION_FLAG,
        customReasonDetails: 'Minor imported without a distinct parent User. Attach a guardian before billing.',
        changedById: null,
      },
    });
    return { linked, mockParent: false, extraFlags, payerUserIds };
  }

  return { linked, mockParent: false, extraFlags, payerUserIds };
}

/**
 * Ensures a Guardian row and StudentGuardian link exist for the given identity.
 *
 * @param {StudentImportStore} tx - Transaction.
 * @param {string} studentProfileId - Academic profile.
 * @param {string} parentUserId - PARENT identity.
 * @param {string} relationship - Domain relationship key.
 * @returns {Promise<number>} 1 when a new link was created, otherwise 0.
 */
async function ensureGuardianLink(
  tx: StudentImportStore,
  studentProfileId: string,
  parentUserId: string,
  relationship: string,
): Promise<number> {
  let guardian = await tx.guardian.findUnique({ where: { userId: parentUserId } });
  if (!guardian) {
    guardian = await tx.guardian.create({ data: { userId: parentUserId } });
  }
  const existingLink = await tx.studentGuardian.findUnique({
    where: { studentProfileId_guardianId: { studentProfileId, guardianId: guardian.id } },
  });
  if (existingLink) {
    if (existingLink.relationship !== relationship) {
      await tx.studentGuardian.update({
        where: { studentProfileId_guardianId: { studentProfileId, guardianId: guardian.id } },
        data: { relationship },
      });
    }
    return 0;
  }
  await tx.studentGuardian.create({
    data: { studentProfileId, guardianId: guardian.id, relationship },
  });
  return 1;
}

/**
 * Assigns StudentRank from the catalog. Unmatched belts fall back to the entry-level rank.
 *
 * @param {StudentImportStore} tx - Transaction.
 * @param {string} studentProfileId - Academic profile.
 * @param {MappedStudentRow} row - Mapped row.
 * @param {ImportOptions & { catalog: CatalogDiscipline[]; today: Date }} options - Catalog and today.
 * @param {MappedFlag[]} extraFlags - Mutated with belt/discipline review notes.
 * @returns {Promise<{ assigned: boolean; beltName: string | null }>} Rank outcome.
 */
async function assignRank(
  tx: StudentImportStore,
  studentProfileId: string,
  row: MappedStudentRow,
  options: ImportOptions & { catalog: CatalogDiscipline[]; today: Date },
  extraFlags: MappedFlag[],
): Promise<{ assigned: boolean; beltName: string | null }> {
  if (!row.disciplineName && !row.beltName) {
    return { assigned: false, beltName: null };
  }

  const existing = await tx.studentRank.findFirst({ where: { studentProfileId } });
  if (existing) {
    return { assigned: false, beltName: null };
  }

  const age = row.birthDate ? ageInYears(row.birthDate, options.today) : null;
  const resolved = resolveBelt({
    disciplineName: row.disciplineName,
    beltName: row.beltName,
    age,
    catalog: options.catalog,
  });

  if (resolved.unmatchedDiscipline) {
    extraFlags.push({
      field: 'discipline',
      detail: `discipline "${row.disciplineName}" not found in catalog; rank skipped`,
    });
    return { assigned: false, beltName: null };
  }
  if (!resolved.belt) {
    extraFlags.push({
      field: 'belt',
      detail: `no belt ranks configured for "${row.disciplineName ?? ''}"`,
    });
    return { assigned: false, beltName: null };
  }
  if (resolved.defaultedBelt || resolved.unmatchedBelt) {
    extraFlags.push({
      field: 'belt',
      detail: `belt "${row.beltName ?? '(empty)'}" not matched; defaulted to ${resolved.belt.name}`,
    });
  }

  await tx.studentRank.create({
    data: {
      studentProfileId,
      beltRankId: resolved.belt.id,
      currentStripes: 0,
      accumulatedHours: 0,
      promotedAt: row.startDate ?? options.today,
      lastStripeAt: row.startDate ?? options.today,
    },
  });
  return { assigned: true, beltName: resolved.belt.name };
}

/**
 * Creates or reuses the payer's SEPA mandate and points the student profile at it.
 * One parent User owns one active mandate covering every sibling.
 *
 * @param {StudentImportStore} tx - Transaction.
 * @param {string} studentProfileId - Academic profile to cover.
 * @param {MappedStudentRow} row - Mapped row.
 * @param {string | null} payerUserId - Parent or adult student User who owns the IBAN.
 * @param {string} tenantId - Academy key.
 * @param {MappedFlag[]} extraFlags - Mutated when a mandate cannot be attributed to a payer.
 * @returns {Promise<boolean>} Whether a mandate row was inserted.
 */
async function maybeCreateMandate(
  tx: StudentImportStore,
  studentProfileId: string,
  row: MappedStudentRow,
  payerUserId: string | null,
  tenantId: string,
  extraFlags: MappedFlag[],
): Promise<boolean> {
  if (!row.iban || !row.accountHolderName) {
    return false;
  }
  if (!payerUserId) {
    extraFlags.push({
      field: 'iban',
      detail: 'IBAN present but no payer User (parent/adult login); mandate skipped',
    });
    return false;
  }

  let mandate = await tx.bankMandate.findFirst({
    where: { tenantId, payerUserId, isActive: true },
  });
  let created = false;
  if (!mandate) {
    mandate = await tx.bankMandate.create({
      data: {
        payerUserId,
        tenantId,
        iban: row.iban,
        accountHolderName: row.accountHolderName,
        accountHolderDni: row.accountHolderDni || PENDING_HOLDER_DNI,
        mandateReference: generateMandateReference(),
        signatureDate: new Date(),
        isSigned: false,
        isActive: true,
      },
    });
    created = true;
  }

  await tx.studentProfile.update({
    where: { id: studentProfileId },
    data: { bankMandateId: mandate.id },
  });
  return created;
}

/**
 * Loads discipline programs and belt ranks once per batch.
 *
 * @param {StudentImportPrisma} prisma - Prisma client.
 * @returns {Promise<CatalogDiscipline[]>} Catalog snapshot.
 */
async function loadCatalog(prisma: StudentImportPrisma): Promise<CatalogDiscipline[]> {
  const rows = await prisma.discipline.findMany({
    include: { programs: { include: { beltRanks: { orderBy: { order: 'asc' as const } } } } },
  });
  return rows.map((discipline) => ({
    id: discipline.id,
    name: discipline.name,
    acronym: discipline.acronym ?? null,
    programs: (discipline.programs ?? []).map((program) => ({
      id: program.id,
      name: program.name,
      minAge: program.minAge,
      maxAge: program.maxAge,
      beltRanks: (program.beltRanks ?? []).map((rank) => ({
        id: rank.id,
        name: rank.name,
        order: rank.order,
      })),
    })),
  }));
}

/**
 * @returns {ImportSummary} Zeroed counters.
 */
function emptySummary(): ImportSummary {
  return {
    processed: 0,
    usersCreated: 0,
    usersReused: 0,
    profilesCreated: 0,
    profilesSkipped: 0,
    mandatesCreated: 0,
    ranksAssigned: 0,
    guardiansLinked: 0,
    flagged: 0,
    errors: 0,
    minorsImported: 0,
    skippedProfiles: [],
    flaggedRecords: [],
    errorRecords: [],
    selfReferencingParentErrors: [],
    duplicateParentSkipped: [],
    minorsAssignedMockParent: [],
  };
}

/**
 * @param {MappedStudentRow} row - Student row.
 * @param {string} displayName - Full name.
 * @param {SelfReferencingParent} overlap - Mapper overlap.
 * @returns {SelfReferencingParentAudit} Audit row.
 */
function toOverlapAudit(
  row: MappedStudentRow,
  displayName: string,
  overlap: SelfReferencingParent,
): SelfReferencingParentAudit {
  const parentValue =
    overlap.matchedField === 'email'
      ? overlap.parentEmail ?? ''
      : overlap.matchedField === 'phone'
        ? overlap.parentPhone ?? ''
        : overlap.parentDni ?? '';
  return {
    index: row.index,
    name: displayName,
    email: row.email,
    matchedField: overlap.matchedField,
    relationship: overlap.relationship,
    parentValue,
  };
}

/**
 * @param {MappedStudentRow} row - Student row.
 * @returns {IdentityInput} Identity fields.
 */
function identityFromStudent(row: MappedStudentRow): IdentityInput {
  return {
    email: row.email,
    dni: row.dni,
    firstName: row.firstName,
    lastName: row.lastName,
    phone: row.phone,
    birthDate: row.birthDate,
    gender: row.gender,
    address: row.address,
    city: row.city,
    state: row.state,
    postalCode: row.postalCode,
    country: row.country,
    password: row.password,
  };
}

/**
 * @param {MappedGuardian} guardian - Parent row.
 * @param {string} country - Student country fallback.
 * @returns {IdentityInput} Identity fields for the PARENT user.
 */
function identityFromGuardian(guardian: MappedGuardian, country: string): IdentityInput {
  return {
    email: guardian.email,
    dni: guardian.dni,
    firstName: guardian.firstName,
    lastName: guardian.lastName,
    phone: guardian.phone,
    birthDate: null,
    gender: null,
    address: null,
    city: null,
    state: null,
    postalCode: null,
    country,
    password: null,
  };
}

export { DATA_VALIDATION_FLAG, TUTOR_VALIDATION_FLAG };
