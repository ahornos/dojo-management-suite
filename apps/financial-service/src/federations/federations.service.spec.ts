/**
 * @file federations.service.spec.ts
 * @description Unit tests for federation catalog CRUD, charge batching, and budget projection.
 */

import { ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { LicensePriceRowKind, Prisma } from '@dms/database/client';
import { LicenseHolderType, Role } from '@dms/shared-types';
import { PrismaService } from '../prisma/prisma.service';
import { FederationsService } from './federations.service';

const tenantId = 'fox-jiujitsu-academy';

const instructorRow = {
  id: 'row-instructor',
  licenseTypeId: 'type-1',
  kind: LicensePriceRowKind.INSTRUCTOR,
  label: '',
  birthYearFrom: null,
  cost: new Prisma.Decimal('50.00'),
  reduction: new Prisma.Decimal('0.00'),
  chargePrice: new Prisma.Decimal('55.00'),
  sortOrder: 0,
  createdAt: new Date('2026-10-01T00:00:00.000Z'),
  updatedAt: new Date('2026-10-01T00:00:00.000Z'),
};

const adultRow = {
  ...instructorRow,
  id: 'row-adult',
  kind: LicensePriceRowKind.ADULT,
  cost: new Prisma.Decimal('35.00'),
  chargePrice: new Prisma.Decimal('40.00'),
  sortOrder: 1,
};

const standardType = {
  id: '44444444-4444-4444-8444-444444444444',
  seasonId: 'season-1',
  name: 'Standard',
  isActive: true,
  createdAt: new Date('2026-10-01T00:00:00.000Z'),
  updatedAt: new Date('2026-10-01T00:00:00.000Z'),
  priceRows: [instructorRow, adultRow],
};

const seasonRow = {
  id: 'season-1',
  federationId: '11111111-1111-4111-8111-111111111111',
  seasonName: '2026-2027',
  currency: 'EUR',
  clubCost: new Prisma.Decimal('120.00'),
  isActive: true,
  createdAt: new Date('2026-10-01T00:00:00.000Z'),
  updatedAt: new Date('2026-10-01T00:00:00.000Z'),
  licenseTypes: [standardType],
};

const federationRow = {
  id: '11111111-1111-4111-8111-111111111111',
  tenantId,
  name: 'FCJ',
  acronym: 'FCJ',
  country: 'ES',
  email: 'secretaria@fcj.cat',
  isActive: true,
  deletedAt: null as Date | null,
  createdAt: new Date('2026-10-01T00:00:00.000Z'),
  updatedAt: new Date('2026-10-01T00:00:00.000Z'),
  contacts: [] as Array<{ id: string; medium: string; value: string; tag: string }>,
  seasons: [seasonRow],
};

describe('FederationsService', () => {
  let service: FederationsService;
  const prisma = {
    $transaction: jest.fn(),
    federation: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    federationContact: {
      deleteMany: jest.fn(),
      createMany: jest.fn(),
    },
    federationSeason: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
    federationLicenseType: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
    federationLicensePriceRow: {
      deleteMany: jest.fn(),
      createMany: jest.fn(),
    },
    federationSeasonCharge: {
      createMany: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    prisma.$transaction.mockImplementation(async (fn: (tx: typeof prisma) => Promise<unknown>) => fn(prisma));
    const module = await Test.createTestingModule({
      providers: [FederationsService, { provide: PrismaService, useValue: prisma }],
    }).compile();
    service = module.get(FederationsService);
  });

  it('creates a catalog row with official email and nested seasons', async () => {
    prisma.federation.create.mockResolvedValue(federationRow);
    prisma.federation.findFirst.mockResolvedValue(federationRow);

    const result = await service.create(tenantId, {
      name: 'FCJ',
      country: 'ES',
      email: 'secretaria@fcj.cat',
      seasons: [
        {
          seasonName: '2026-2027',
          currency: 'EUR',
          clubCost: '120.00',
          licenseTypes: [
            {
              name: 'Standard',
              priceRows: [
                { kind: 'INSTRUCTOR', cost: '50.00', reduction: '0.00', chargePrice: '55.00' },
                { kind: 'ADULT', cost: '35.00', reduction: '0.00', chargePrice: '40.00' },
              ],
            },
          ],
        },
      ],
    });

    expect(result.email).toBe('secretaria@fcj.cat');
    expect(result.seasons).toHaveLength(1);
    expect(result.seasons[0].licenseTypes[0].priceRows).toHaveLength(2);
    expect(prisma.federation.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        tenantId,
        name: 'FCJ',
        email: 'secretaria@fcj.cat',
        country: 'ES',
      }),
      include: expect.any(Object),
    });
  });

  it('maps unique-name conflicts', async () => {
    prisma.federation.create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('dup', { code: 'P2002', clientVersion: '5' }),
    );

    await expect(
      service.create(tenantId, { name: 'FCJ', country: 'ES', email: 'secretaria@fcj.cat' }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('rejects catalog lookups for another tenant', async () => {
    prisma.federation.findFirst.mockResolvedValue(null);
    await expect(service.findOne(tenantId, federationRow.id)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('skips duplicate seasonal charges via skipDuplicates', async () => {
    prisma.federation.findFirst.mockResolvedValue(federationRow);
    prisma.federationSeasonCharge.createMany.mockResolvedValue({ count: 1 });

    const result = await service.createCharges(tenantId, federationRow.id, {
      season: '2026-2027',
      includeClubFee: true,
      holders: [
        {
          holderType: LicenseHolderType.STUDENT,
          holderUserId: '22222222-2222-4222-8222-222222222222',
          studentProfileId: '33333333-3333-4333-8333-333333333333',
        },
      ],
    });

    expect(result).toEqual({ created: 1, skipped: 1 });
    expect(prisma.federationSeasonCharge.createMany).toHaveBeenCalledWith({
      data: expect.arrayContaining([
        expect.objectContaining({ holderType: LicenseHolderType.CLUB, costAmount: seasonRow.clubCost }),
        expect.objectContaining({
          holderType: LicenseHolderType.STUDENT,
          costAmount: new Prisma.Decimal('35.00'),
          saleAmount: new Prisma.Decimal('40.00'),
        }),
      ]),
      skipDuplicates: true,
    });
  });

  it('projects a budget from season matrix prices and holder counts', async () => {
    prisma.federation.findFirst.mockResolvedValue(federationRow);

    const result = await service.previewBudget(tenantId, federationRow.id, {
      season: '2026-2027',
      studentCount: 2,
      instructorCount: 1,
      technicalDirectorCount: 0,
      includeClubFee: true,
    });

    expect(result.totalCost).toBe('240.00');
    expect(result.totalSale).toBe('135.00');
  });

  it('builds a seasonal payout from persisted charge rows', async () => {
    prisma.federation.findFirst.mockResolvedValue(federationRow);
    prisma.federationSeasonCharge.findMany.mockResolvedValue([
      { holderType: LicenseHolderType.STUDENT },
      { holderType: LicenseHolderType.STUDENT },
      { holderType: LicenseHolderType.INSTRUCTOR },
      { holderType: LicenseHolderType.CLUB },
    ]);

    const result = await service.getBudget(tenantId, federationRow.id, '2026-2027');

    expect(result.studentCount).toBe(2);
    expect(result.instructorCount).toBe(1);
    expect(result.totalCost).toBe('240.00');
    expect(result.totalSale).toBe('135.00');
  });

  it('replaces tagged contacts without rewriting official email', async () => {
    prisma.federation.findFirst.mockResolvedValue(federationRow);
    prisma.federationContact.deleteMany.mockResolvedValue({ count: 0 });
    prisma.federationContact.createMany.mockResolvedValue({ count: 2 });

    await service.replaceContactList(tenantId, federationRow.id, [
      { medium: 'EMAIL', value: 'presidencia@fcj.cat', tag: 'Presidencia' },
      { medium: 'PHONE', value: '931234567', tag: 'Sede nacional' },
    ]);

    expect(prisma.federationContact.deleteMany).toHaveBeenCalledWith({ where: { federationId: federationRow.id } });
    expect(prisma.federationContact.createMany).toHaveBeenCalledWith({
      data: expect.arrayContaining([
        expect.objectContaining({ medium: 'EMAIL', tag: 'Presidencia' }),
        expect.objectContaining({ medium: 'PHONE', tag: 'Sede nacional' }),
      ]),
    });
    expect(prisma.federation.update).not.toHaveBeenCalled();
  });

  it('lists live federations and hides soft-deleted rows by default', async () => {
    prisma.federation.findMany.mockResolvedValue([federationRow]);

    await service.findAll(tenantId);

    expect(prisma.federation.findMany).toHaveBeenCalledWith({
      where: { tenantId, deletedAt: null },
      include: expect.any(Object),
      orderBy: { name: 'asc' },
    });
  });

  it('forbids non-super-admins from listing deleted federations', async () => {
    await expect(service.findAll(tenantId, { status: 'DELETED' }, [Role.ADMIN_STAFF])).rejects.toBeInstanceOf(
      ForbiddenException,
    );
    expect(prisma.federation.findMany).not.toHaveBeenCalled();
  });

  it('lists only soft-deleted rows for SUPER_ADMIN', async () => {
    prisma.federation.findMany.mockResolvedValue([]);

    await service.findAll(tenantId, { status: 'DELETED', q: 'FCJ' }, [Role.SUPER_ADMIN]);

    expect(prisma.federation.findMany).toHaveBeenCalledWith({
      where: {
        tenantId,
        deletedAt: { not: null },
        OR: expect.arrayContaining([
          expect.objectContaining({ name: { contains: 'FCJ', mode: 'insensitive' } }),
        ]),
      },
      include: expect.any(Object),
      orderBy: { name: 'asc' },
    });
  });

  it('activates a live inactive federation', async () => {
    prisma.federation.findFirst.mockResolvedValue({ ...federationRow, isActive: false });
    prisma.federation.update.mockResolvedValue(federationRow);

    const result = await service.activate(tenantId, federationRow.id);

    expect(result.isActive).toBe(true);
    expect(prisma.federation.update).toHaveBeenCalledWith({
      where: { id: federationRow.id },
      data: { isActive: true },
      include: expect.any(Object),
    });
  });

  it('soft-deletes by setting deletedAt and isActive false', async () => {
    const deleted = { ...federationRow, isActive: false, deletedAt: new Date('2026-10-31T00:00:00.000Z') };
    prisma.federation.findFirst.mockResolvedValue(federationRow);
    prisma.federation.update.mockResolvedValue(deleted);

    const result = await service.remove(tenantId, federationRow.id, 'soft', [Role.SUPER_ADMIN]);

    expect('deletedAt' in result && result.deletedAt).toBeTruthy();
    expect(prisma.federation.update).toHaveBeenCalledWith({
      where: { id: federationRow.id },
      data: { deletedAt: expect.any(Date), isActive: false },
      include: expect.any(Object),
    });
  });

  it('hard-deletes by wiping the federation row', async () => {
    prisma.federation.findFirst.mockResolvedValue(federationRow);
    prisma.federation.delete.mockResolvedValue(federationRow);

    const result = await service.remove(tenantId, federationRow.id, 'hard', [Role.SUPER_ADMIN]);

    expect(result).toEqual({ deleted: true, id: federationRow.id });
    expect(prisma.federation.delete).toHaveBeenCalledWith({ where: { id: federationRow.id } });
  });

  it('rejects delete from non-super-admins', async () => {
    await expect(service.remove(tenantId, federationRow.id, 'soft', [Role.ADMIN_STAFF])).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });

  it('returns seasonal price lists grouped by season', async () => {
    prisma.federation.findFirst.mockResolvedValue(federationRow);

    const result = await service.getPriceList(tenantId, federationRow.id);

    expect(result.federationId).toBe(federationRow.id);
    expect(result.seasons).toHaveLength(1);
    expect(result.seasons[0].seasonName).toBe('2026-2027');
    expect(result.seasons[0].licenseTypes[0].priceRows[0].netTotal).toBe('50.00');
  });
});
