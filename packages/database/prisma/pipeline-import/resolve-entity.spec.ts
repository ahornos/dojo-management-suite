/**
 * @file resolve-entity.spec.ts
 * @description Name / acronym matching used to resolve pipeline foreign keys.
 */

import {
  namesMatch,
  normalizePersonKey,
  resolveDisciplineId,
  resolveFederationId,
  resolveUserId,
} from './resolve-entity';
import type { PipelinePrisma } from './types';

describe('normalizePersonKey / namesMatch', () => {
  it('ignores accents, case, and punctuation', () => {
    expect(normalizePersonKey('Solà')).toBe(normalizePersonKey('Sola'));
    expect(namesMatch('Pau', 'Ribas', 'pau', 'ribas')).toBe(true);
    expect(namesMatch('Ana', 'Gomez', 'Ana', 'Ruiz')).toBe(false);
  });
});

describe('resolveUserId', () => {
  const pau = { id: 'u-pau', firstName: 'Pau', lastName: 'Ribas', email: 'pau.ribas@dojo.test' };
  const options = { tenantId: 'fox', passwordHash: 'hashed', hashPassword: async () => 'hashed' };

  /**
   * @returns {PipelinePrisma} Partial user store.
   */
  function prismaWith(users: Array<typeof pau>): PipelinePrisma {
    return {
      user: {
        findUnique: jest.fn(async ({ where }: { where: { email?: string } }) =>
          users.find((user) => user.email === where.email) ?? null,
        ),
        findMany: jest.fn(async () => users),
        create: jest.fn(async ({ data }: { data: Record<string, unknown> }) => {
          const created = { id: 'u-placeholder', ...data } as typeof pau;
          users.push(created);
          return created;
        }),
      },
    } as unknown as PipelinePrisma;
  }

  it('resolves an instructor by full name', async () => {
    const id = await resolveUserId(prismaWith([pau]), 'Pau Ribas', options);
    expect(id).toBe('u-pau');
  });

  it('resolves a user by email', async () => {
    const id = await resolveUserId(prismaWith([pau]), 'pau.ribas@dojo.test', options);
    expect(id).toBe('u-pau');
  });

  it('creates a placeholder user when the name is unknown', async () => {
    const users: Array<typeof pau> = [];
    const prisma = prismaWith(users);
    const id = await resolveUserId(prisma, 'Nina Costa', options);
    expect(id).toBe('u-placeholder');
    expect(users[0]?.email).toBe('user.ninacosta@import.placeholder');
  });
});

describe('resolveDisciplineId', () => {
  const bjj = { id: 'd-bjj', name: 'Brazilian Jiu-Jitsu', acronym: 'BJJ' };

  /**
   * @returns {PipelinePrisma} Partial discipline store.
   */
  function prismaWith(rows: Array<typeof bjj>): PipelinePrisma {
    return {
      discipline: {
        findUnique: jest.fn(async ({ where }: { where: { name?: string } }) =>
          rows.find((row) => row.name === where.name) ?? null,
        ),
        findMany: jest.fn(async () => rows),
        create: jest.fn(async ({ data }: { data: Record<string, unknown> }) => {
          const created = { id: 'd-placeholder', acronym: 'JUDO', ...data } as unknown as typeof bjj;
          rows.push(created);
          return created;
        }),
      },
    } as unknown as PipelinePrisma;
  }

  it('resolves a discipline by acronym when the official name is omitted', async () => {
    const id = await resolveDisciplineId(prismaWith([bjj]), 'BJJ');
    expect(id).toBe('d-bjj');
  });

  it('creates a placeholder discipline when the catalog row is missing', async () => {
    const rows: Array<typeof bjj> = [];
    const id = await resolveDisciplineId(prismaWith(rows), 'Judo');
    expect(id).toBe('d-placeholder');
    expect(rows[0]?.name).toBe('Judo');
  });
});

describe('resolveFederationId', () => {
  it('creates a placeholder federation from an acronym when the master sheet is missing', async () => {
    const rows: Array<{ id: string; name: string; acronym: string; email: string }> = [];
    const prisma = {
      federation: {
        findFirst: jest.fn(async () => null),
        findMany: jest.fn(async () => rows),
        create: jest.fn(async ({ data }: { data: Record<string, unknown> }) => {
          const created = { id: 'fed-placeholder', ...data } as (typeof rows)[number];
          rows.push(created);
          return created;
        }),
      },
    } as unknown as PipelinePrisma;

    const id = await resolveFederationId(prisma, 'fox-jiujitsu-academy', 'FCLODA');
    expect(id).toBe('fed-placeholder');
    expect(rows[0]?.name).toBe('FCLODA');
    expect(rows[0]?.acronym).toBe('FCLODA');
    expect(rows[0]?.email).toBe('federation.fcloda@import.placeholder');
  });
});
