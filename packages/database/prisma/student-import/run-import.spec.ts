/**
 * @file run-import.spec.ts
 * @description Import orchestration: new users, duplicate identities, incomplete rows, SEPA mandates, guardians, belts.
 */

import { Role, StudentStatus } from '../../client';
import { DATA_VALIDATION_FLAG, PENDING_HOLDER_DNI } from './constants';
import { mapCsvRow } from './map-row';
import { formatAuditSummary, importStudentRows, type StudentImportPrisma } from './run-import';
import type { CatalogDiscipline } from './belt-map';

const today = new Date('2026-10-12T00:00:00.000Z');

const catalog: CatalogDiscipline[] = [
  {
    id: 'bjj',
    name: 'Brazilian Jiu-Jitsu',
    programs: [
      {
        id: 'adults',
        name: 'Adults Program',
        minAge: 16,
        maxAge: 99,
        beltRanks: [
          { id: 'white-a', name: 'White Belt', order: 1 },
          { id: 'blue', name: 'Blue Belt', order: 2 },
        ],
      },
      {
        id: 'kids',
        name: 'Kids Program',
        minAge: 4,
        maxAge: 15,
        beltRanks: [
          { id: 'white-k', name: 'White Belt', order: 1 },
          { id: 'gw', name: 'Grey/White Belt', order: 2 },
        ],
      },
    ],
  },
];

describe('importStudentRows', () => {
  const users: Array<Record<string, unknown>> = [];
  const profiles: Array<Record<string, unknown>> = [];
  const history: Array<Record<string, unknown>> = [];
  const mandates: Array<Record<string, unknown>> = [];
  const guardianRows: Array<Record<string, unknown>> = [];
  const links: Array<Record<string, unknown>> = [];
  const ranks: Array<Record<string, unknown>> = [];

  const prisma = {
    $transaction: jest.fn(async (fn: (tx: StudentImportPrisma) => Promise<unknown>) =>
      fn(prisma as unknown as StudentImportPrisma),
    ),
    user: {
      findUnique: jest.fn(async ({ where }: { where: { email?: string } }) => {
        if (where.email) return users.find((user) => user.email === where.email) ?? null;
        return null;
      }),
      findFirst: jest.fn(async ({ where }: { where: { phone?: string } }) => {
        if (where.phone) return users.find((user) => user.phone === where.phone) ?? null;
        return null;
      }),
      create: jest.fn(async ({ data }: { data: Record<string, unknown> }) => {
        const created = { id: `user-${users.length + 1}`, roles: data.roles, ...data };
        users.push(created);
        return created;
      }),
      update: jest.fn(async ({ where, data }: { where: { id: string }; data: Record<string, unknown> }) => {
        const user = users.find((row) => row.id === where.id);
        if (!user) throw new Error('missing user');
        Object.assign(user, data);
        return user;
      }),
    },
    studentProfile: {
      findUnique: jest.fn(async ({ where }: { where: { userId?: string; id?: string } }) => {
        if (where.id) return profiles.find((profile) => profile.id === where.id) ?? null;
        if (where.userId) return profiles.find((profile) => profile.userId === where.userId) ?? null;
        return null;
      }),
      findFirst: jest.fn(async ({ where }: { where: { dni?: string; firstName?: string; lastName?: string; birthDate?: Date } }) =>
        profiles.find((profile) => {
          if (where.dni) return profile.dni === where.dni;
          return (
            profile.firstName === where.firstName &&
            profile.lastName === where.lastName &&
            profile.birthDate === where.birthDate
          );
        }) ?? null,
      ),
      create: jest.fn(async ({ data }: { data: Record<string, unknown> }) => {
        const created = { id: `profile-${profiles.length + 1}`, ...data };
        profiles.push(created);
        return created;
      }),
      update: jest.fn(async ({ where, data }: { where: { id: string }; data: Record<string, unknown> }) => {
        const profile = profiles.find((row) => row.id === where.id);
        if (profile) Object.assign(profile, data);
        return profile;
      }),
    },
    studentStatusHistory: {
      create: jest.fn(async ({ data }: { data: Record<string, unknown> }) => {
        history.push(data);
        return { id: `hist-${history.length}`, ...data };
      }),
    },
    guardian: {
      findUnique: jest.fn(async ({ where }: { where: { userId: string } }) =>
        guardianRows.find((row) => row.userId === where.userId) ?? null,
      ),
      create: jest.fn(async ({ data }: { data: Record<string, unknown> }) => {
        const created = { id: `guardian-${guardianRows.length + 1}`, ...data };
        guardianRows.push(created);
        return created;
      }),
    },
    studentGuardian: {
      findUnique: jest.fn(
        async ({
          where,
        }: {
          where: { studentProfileId_guardianId: { studentProfileId: string; guardianId: string } };
        }) =>
          links.find(
            (link) =>
              link.studentProfileId === where.studentProfileId_guardianId.studentProfileId &&
              link.guardianId === where.studentProfileId_guardianId.guardianId,
          ) ?? null,
      ),
      findMany: jest.fn(async ({ where }: { where: { studentProfileId?: string } }) =>
        links
          .filter((link) => link.studentProfileId === where.studentProfileId)
          .map((link) => ({
            ...link,
            guardian: guardianRows.find((row) => row.id === link.guardianId) ?? { userId: 'unknown' },
          })),
      ),
      create: jest.fn(async ({ data }: { data: Record<string, unknown> }) => {
        links.push(data);
        return data;
      }),
      update: jest.fn(async ({ where, data }: { where: { studentProfileId_guardianId: { studentProfileId: string; guardianId: string } }; data: Record<string, unknown> }) => {
        const link = links.find(
          (row) =>
            row.studentProfileId === where.studentProfileId_guardianId.studentProfileId &&
            row.guardianId === where.studentProfileId_guardianId.guardianId,
        );
        if (link) Object.assign(link, data);
        return link;
      }),
      delete: jest.fn(async ({ where }: { where: { studentProfileId_guardianId: { studentProfileId: string; guardianId: string } } }) => {
        const idx = links.findIndex(
          (row) =>
            row.studentProfileId === where.studentProfileId_guardianId.studentProfileId &&
            row.guardianId === where.studentProfileId_guardianId.guardianId,
        );
        if (idx >= 0) links.splice(idx, 1);
        return {};
      }),
    },
    studentRank: {
      findFirst: jest.fn(async ({ where }: { where: { studentProfileId?: string } }) =>
        ranks.find((rank) => rank.studentProfileId === where.studentProfileId) ?? null,
      ),
      create: jest.fn(async ({ data }: { data: Record<string, unknown> }) => {
        ranks.push(data);
        return { id: `rank-${ranks.length}`, ...data };
      }),
    },
    discipline: {
      findMany: jest.fn(async () => catalog),
    },
    bankMandate: {
      findFirst: jest.fn(async ({ where }: { where: { payerUserId?: string; tenantId?: string; isActive?: boolean } }) =>
        mandates.find(
          (mandate) =>
            mandate.payerUserId === where.payerUserId &&
            (where.tenantId === undefined || mandate.tenantId === where.tenantId) &&
            (where.isActive === undefined || mandate.isActive === where.isActive),
        ) ?? null,
      ),
      create: jest.fn(async ({ data }: { data: Record<string, unknown> }) => {
        const created = { id: `mandate-${mandates.length + 1}`, ...data };
        mandates.push(created);
        return created;
      }),
    },
  } as unknown as StudentImportPrisma;

  beforeEach(() => {
    users.length = 0;
    profiles.length = 0;
    history.length = 0;
    mandates.length = 0;
    guardianRows.length = 0;
    links.length = 0;
    ranks.length = 0;
    jest.clearAllMocks();
    prisma.$transaction = jest.fn(async (fn: (tx: StudentImportPrisma) => Promise<unknown>) =>
      fn(prisma),
    ) as unknown as StudentImportPrisma['$transaction'];
  });

  const options = {
    tenantId: 'fox-jiujitsu-academy',
    defaultPasswordHash: 'hashed',
    hashPassword: jest.fn(async () => 'hashed'),
    catalog,
    today,
  };

  it('creates a user, profile, history and mandate for a complete ACTIVE row', async () => {
    const row = mapCsvRow(
      {
        firstName: 'Ana',
        lastName: 'Gomez',
        email: 'ana@dojo.test',
        dni: '12345678Z',
        phone: '600111222',
        birthDate: '1990-01-15',
        iban: 'ES91 2100 0418 4502 0005 1332',
        accountHolderName: 'Ana Gomez',
      },
      1,
      today,
    );

    const summary = await importStudentRows(prisma, [row], options);

    expect(summary).toEqual(
      expect.objectContaining({
        processed: 1,
        usersCreated: 1,
        profilesCreated: 1,
        mandatesCreated: 1,
        flagged: 0,
        errors: 0,
      }),
    );
    expect(mandates[0]).toEqual(
      expect.objectContaining({
        iban: 'ES9121000418450200051332',
        accountHolderName: 'Ana Gomez',
        tenantId: 'fox-jiujitsu-academy',
      }),
    );
  });

  it('reuses an existing user by email and records the skip reason', async () => {
    users.push({
      id: 'user-1',
      email: 'ana@dojo.test',
      roles: [Role.STUDENT],
      gender: null,
    });
    profiles.push({ id: 'profile-1', userId: 'user-1', status: StudentStatus.ACTIVE });

    const row = mapCsvRow(
      {
        firstName: 'Ana',
        lastName: 'Gomez',
        email: 'ana@dojo.test',
        dni: '12345678Z',
        phone: '600111222',
        birthDate: '1990-01-15',
      },
      2,
      today,
    );

    const summary = await importStudentRows(prisma, [row], options);

    expect(summary.usersReused).toBe(1);
    expect(summary.usersCreated).toBe(0);
    expect(summary.profilesSkipped).toBe(1);
    expect(summary.skippedProfiles[0]?.reason).toMatch(/StudentProfile already exists/);
    expect(prisma.user.create).not.toHaveBeenCalled();
    expect(prisma.studentProfile.create).not.toHaveBeenCalled();
  });

  it('does not match a User by DNI; login identity is email-only', async () => {
    users.push({
      id: 'user-dni',
      email: 'old@dojo.test',
      roles: [Role.PARENT],
      gender: null,
    });

    const row = mapCsvRow(
      {
        firstName: 'Ana',
        lastName: 'Gomez',
        email: 'new.ana@dojo.test',
        dni: '12345678Z',
        phone: '600111222',
        birthDate: '1990-01-15',
      },
      1,
      today,
    );

    const summary = await importStudentRows(prisma, [row], options);

    expect(summary.usersCreated).toBe(1);
    expect(prisma.user.create).toHaveBeenCalled();
    expect(summary.profilesCreated).toBe(1);
  });

  it('imports a mixed batch: valid row, duplicate email, and missing mandatory fields', async () => {
    const valid = mapCsvRow(
      {
        firstName: 'Ana',
        lastName: 'Gomez',
        email: 'ana@dojo.test',
        dni: '12345678Z',
        phone: '600111222',
        birthDate: '1990-01-15',
        iban: 'ES91 2100 0418 4502 0005 1332',
        accountHolderName: 'Ana Gomez',
      },
      1,
      today,
    );
    const duplicate = mapCsvRow(
      {
        firstName: 'Ana',
        lastName: 'Gomez',
        email: 'ana@dojo.test',
        dni: '12345678Z',
        phone: '600111222',
        birthDate: '1990-01-15',
      },
      2,
      today,
    );
    const incomplete = mapCsvRow(
      {
        firstName: 'Luis',
        lastName: 'Perez',
        email: 'luis@dojo.test',
        status: 'ACTIVE',
      },
      3,
      today,
    );

    const summary = await importStudentRows(prisma, [valid, duplicate, incomplete], options);

    expect(summary).toEqual(
      expect.objectContaining({
        processed: 3,
        usersCreated: 2,
        usersReused: 1,
        profilesCreated: 2,
        profilesSkipped: 1,
        mandatesCreated: 1,
        flagged: 1,
        errors: 0,
      }),
    );
    expect(history.some((entry) => entry.reason === DATA_VALIDATION_FLAG)).toBe(true);
    expect(formatAuditSummary(summary)).toContain('StudentProfile already exists');
    expect(formatAuditSummary(summary)).toContain('birth date missing');
  });

  it('persists incomplete rows with REQUIERE_VALIDACION_DATOS instead of failing', async () => {
    const row = mapCsvRow(
      {
        firstName: 'Luis',
        lastName: 'Perez',
        email: 'luis@dojo.test',
        status: 'ACTIVE',
      },
      3,
      today,
    );

    const summary = await importStudentRows(prisma, [row], options);

    expect(summary.errors).toBe(0);
    expect(summary.flagged).toBe(1);
    expect(summary.profilesCreated).toBe(1);
    expect(history[0]).toEqual(
      expect.objectContaining({
        reason: DATA_VALIDATION_FLAG,
        newStatus: StudentStatus.ACTIVE,
      }),
    );
    expect(prisma.bankMandate.create).not.toHaveBeenCalled();
  });

  it('creates PADRE and MADRE guardians and assigns Grey/White Belt', async () => {
    const row = mapCsvRow(
      {
        first_name: 'Jon',
        last_name: 'Ribera',
        birth_date: '2019-01-12',
        email: 'jon.ribera@dojo.test',
        phone: '600000000',
        dni: '12345678Z',
        mother_name: 'Ana Fondevila',
        mother_email: 'madre@dojo.test',
        mother_phone: '611000001',
        father_name: 'Joaquim Ribera',
        father_email: 'padre@dojo.test',
        father_phone: '611000002',
        discipline: 'Brazilian Jiu-Jitsu',
        belt_bjj: 'Grey/White Belt',
      },
      1,
      today,
    );

    const summary = await importStudentRows(prisma, [row], options);

    expect(summary.errors).toBe(0);
    expect(summary.guardiansLinked).toBe(2);
    expect(summary.ranksAssigned).toBe(1);
    expect(links.map((link) => link.relationship).sort()).toEqual(['Madre', 'Padre']);
    expect(summary.minorsImported).toBe(1);
    expect(ranks[0]).toEqual(expect.objectContaining({ beltRankId: 'gw' }));
  });

  it('saves a mandate with placeholder holder DNI instead of skipping banking data', async () => {
    const row = mapCsvRow(
      {
        firstName: 'Luis',
        lastName: 'Perez',
        email: 'luis.bank@dojo.test',
        phone: '600333444',
        birthDate: '1990-01-15',
        iban: 'ES91 2100 0418 4502 0005 1332',
        accountHolderName: 'Luis Perez',
      },
      4,
      today,
    );

    const summary = await importStudentRows(prisma, [row], options);

    expect(summary.mandatesCreated).toBe(1);
    expect(mandates[0]?.accountHolderDni).toBe(PENDING_HOLDER_DNI);
    expect(summary.flaggedRecords[0]?.details.some((detail) => detail.includes('00000000X'))).toBe(true);
  });

  it('does not create a User for a minor and does not invent a mock tutor', async () => {
    const row = mapCsvRow(
      {
        firstName: 'Leo',
        lastName: 'Solo',
        email: 'leo.solo@dojo.test',
        phone: '600111000',
        dni: '99887766C',
        birthDate: '2015-01-01',
        father_name: 'Leo Solo',
        father_email: 'leo.solo@dojo.test',
        father_phone: '600111000',
      },
      9,
      today,
    );

    const summary = await importStudentRows(prisma, [row], options);

    expect(summary.errors).toBe(0);
    expect(summary.minorsImported).toBe(1);
    expect(summary.usersCreated).toBe(0);
    expect(summary.duplicateParentSkipped).toHaveLength(1);
    expect(summary.selfReferencingParentErrors[0]?.matchedField).toBe('email');
    expect(summary.minorsAssignedMockParent).toHaveLength(0);
    expect(profiles[0]?.userId).toBeNull();
    expect(links).toHaveLength(0);
    expect(users.some((user) => user.firstName === 'Tutor Pendiente')).toBe(false);
    expect(history.some((entry) => entry.reason === 'REQUIERE_DATOS_TUTOR')).toBe(true);
  });
});
