/**
 * @file run-pipeline.spec.ts
 * @description Belt-hierarchy upsert, dual-guardian linking, and name-based student lookup.
 */

import { Role } from '../../client';
import { collectPipelineGuardians } from './guardians';
import { resolveStudentProfileId } from './resolve-entity';
import {
  importDisciplines,
  linkGuardians,
  runImportPipeline,
  type PipelineOptions,
  type PipelinePrisma,
} from './run-pipeline';

describe('runImportPipeline', () => {
  it('imports nothing and warns when no production CSV files are present', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    const summary = await runImportPipeline({} as PipelinePrisma, {
      tenantId: 'fox-jiujitsu-academy',
      passwordHash: 'hashed',
      hashPassword: async () => 'hashed',
    }, []);
    expect(summary.studentsUpserted).toBe(0);
    expect(summary.attendancesUpserted).toBe(0);
    expect(summary.usersUpserted).toBe(0);
    expect(warn).toHaveBeenCalledWith(expect.stringMatching(/No production \.csv files found/));
    warn.mockRestore();
  });
});

describe('importDisciplines', () => {
  it('upserts a discipline, program, and the full belt ladder', async () => {
    const disciplines: Array<Record<string, unknown>> = [];
    const programs: Array<Record<string, unknown>> = [];
    const belts: Array<Record<string, unknown>> = [];
    const prisma = {
      discipline: {
        findUnique: jest.fn(async ({ where }: { where: { name: string } }) =>
          disciplines.find((row) => row.name === where.name) ?? null,
        ),
        create: jest.fn(async ({ data }: { data: Record<string, unknown> }) => {
          const created = { id: `d-${disciplines.length + 1}`, ...data };
          disciplines.push(created);
          return created;
        }),
        update: jest.fn(async ({ where, data }: { where: { id: string }; data: Record<string, unknown> }) => {
          const row = disciplines.find((item) => item.id === where.id)!;
          Object.assign(row, data);
          return row;
        }),
      },
      disciplineProgram: {
        findFirst: jest.fn(async ({ where }: { where: { disciplineId: string; name: string } }) =>
          programs.find((row) => row.disciplineId === where.disciplineId && row.name === where.name) ?? null,
        ),
        create: jest.fn(async ({ data }: { data: Record<string, unknown> }) => {
          const created = { id: `p-${programs.length + 1}`, ...data };
          programs.push(created);
          return created;
        }),
        update: jest.fn(async ({ where, data }: { where: { id: string }; data: Record<string, unknown> }) => {
          const row = programs.find((item) => item.id === where.id)!;
          Object.assign(row, data);
          return row;
        }),
      },
      beltRank: {
        findFirst: jest.fn(async ({ where }: { where: { disciplineProgramId: string; name?: string; order?: number } }) =>
          belts.find(
            (row) =>
              row.disciplineProgramId === where.disciplineProgramId &&
              (where.name ? row.name === where.name : row.order === where.order),
          ) ?? null,
        ),
        create: jest.fn(async ({ data }: { data: Record<string, unknown> }) => {
          const created = { id: `b-${belts.length + 1}`, ...data };
          belts.push(created);
          return created;
        }),
        update: jest.fn(async ({ where, data }: { where: { id: string }; data: Record<string, unknown> }) => {
          const row = belts.find((item) => item.id === where.id)!;
          Object.assign(row, data);
          return row;
        }),
      },
    } as unknown as PipelinePrisma;

    const summary = {
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

    await importDisciplines(
      prisma,
      [
        {
          disciplineName: 'Brazilian Jiu-Jitsu',
          acronym: 'BJJ',
          description: 'Grappling',
          programName: 'Adults Program',
          minAge: '16',
          maxAge: '99',
          beltName: 'White Belt',
          order: '1',
          maxStripes: '4',
          minMonthsRequired: '0',
          minHoursRequired: '0',
        },
        {
          disciplineName: 'Brazilian Jiu-Jitsu',
          acronym: 'BJJ',
          description: 'Grappling',
          programName: 'Adults Program',
          minAge: '16',
          maxAge: '99',
          beltName: 'Black Belt',
          order: '5',
          maxStripes: '6',
          minMonthsRequired: '36',
          minHoursRequired: '500',
        },
      ],
      summary,
    );

    expect(summary.disciplinesUpserted).toBe(1);
    expect(summary.beltRanksUpserted).toBe(2);
    expect(programs).toHaveLength(1);
    expect(belts.map((belt) => belt.name)).toEqual(['White Belt', 'Black Belt']);
    expect(belts[1]).toMatchObject({ order: 5, maxStripes: 6, minMonthsRequired: 36, minHoursRequired: 500 });
  });
});

describe('linkGuardians', () => {
  it('creates two PARENT users and two student-guardian links', async () => {
    const users: Array<Record<string, unknown>> = [];
    const guardians: Array<Record<string, unknown>> = [];
    const links: Array<Record<string, unknown>> = [];
    const options: PipelineOptions = {
      tenantId: 'fox-jiujitsu-academy',
      passwordHash: 'hashed',
      hashPassword: async () => 'hashed',
    };
    const prisma = {
      user: {
        findUnique: jest.fn(async ({ where }: { where: { email?: string } }) =>
          users.find((user) => user.email === where.email) ?? null,
        ),
        findMany: jest.fn(async () => users),
        create: jest.fn(async ({ data }: { data: Record<string, unknown> }) => {
          const created = { id: `u-${users.length + 1}`, roles: data.roles, ...data };
          users.push(created);
          return created;
        }),
        update: jest.fn(),
      },
      guardian: {
        findUnique: jest.fn(async ({ where }: { where: { userId?: string; id?: string } }) => {
          if (where.userId) return guardians.find((row) => row.userId === where.userId) ?? null;
          return guardians.find((row) => row.id === where.id) ?? null;
        }),
        create: jest.fn(async ({ data }: { data: Record<string, unknown> }) => {
          const created = { id: `g-${guardians.length + 1}`, ...data };
          guardians.push(created);
          return created;
        }),
      },
      studentGuardian: {
        findUnique: jest.fn(async () => null),
        create: jest.fn(async ({ data }: { data: Record<string, unknown> }) => {
          links.push(data);
          return data;
        }),
      },
    } as unknown as PipelinePrisma;

    const row = {
      motherName: 'Laura Marti',
      motherEmail: 'laura.marti@dojo.test',
      fatherName: 'Jordi Marti',
      fatherEmail: 'jordi.marti@dojo.test',
    };
    expect(collectPipelineGuardians(row)).toHaveLength(2);

    const linked = await linkGuardians(prisma, 'stu-nil', row, options);
    expect(linked).toBe(2);
    expect(users).toHaveLength(2);
    expect(users.every((user) => (user.roles as Role[]).includes(Role.PARENT))).toBe(true);
    expect(links).toHaveLength(2);
  });
});

describe('resolveStudentProfileId', () => {
  it('finds a student by first name + last name', async () => {
    const prisma = {
      studentProfile: {
        findFirst: jest.fn(async () => null),
        findUnique: jest.fn(async () => null),
        findMany: jest.fn(async () => [{ id: 'stu-ana', firstName: 'Ana', lastName: 'Gomez' }]),
      },
      user: { findUnique: jest.fn(async () => null) },
    } as unknown as PipelinePrisma;

    const id = await resolveStudentProfileId(prisma, {
      studentFirstName: 'Ana',
      studentLastName: 'Gomez',
    });
    expect(id).toBe('stu-ana');
  });

  it('creates a placeholder profile when the student master row is missing', async () => {
    const created: Array<Record<string, unknown>> = [];
    const prisma = {
      studentProfile: {
        findFirst: jest.fn(async () => null),
        findUnique: jest.fn(async () => null),
        findMany: jest.fn(async () => []),
        create: jest.fn(async ({ data }: { data: Record<string, unknown> }) => {
          const row = { id: 'stu-placeholder', ...data };
          created.push(row);
          return row;
        }),
      },
      user: { findUnique: jest.fn(async () => null) },
    } as unknown as PipelinePrisma;

    const id = await resolveStudentProfileId(prisma, {
      studentFirstName: 'Ana',
      studentLastName: 'Gomez',
    });
    expect(id).toBe('stu-placeholder');
    expect(created[0]).toMatchObject({ firstName: 'Ana', lastName: 'Gomez' });
  });
});
