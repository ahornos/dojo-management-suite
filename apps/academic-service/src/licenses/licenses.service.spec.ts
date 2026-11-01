/**
 * @file licenses.service.spec.ts
 * @description Unit tests for filtered license preview and batch issuance.
 */

import { Test } from '@nestjs/testing';
import { AffiliationLicenseStatus, Prisma, StudentStatus } from '@dms/database/client';
import { LicenseHolderType, Role } from '@dms/shared-types';
import { PrismaService } from '../prisma/prisma.service';
import { UsersDirectoryClient } from '../users-directory/users-directory.client';
import { FederationsClient } from '../federations/federations.client';
import { LicensesService } from './licenses.service';

const tenantId = 'fox-jiujitsu-academy';
const federationId = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const disciplineId = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';

const catalog = {
  id: federationId,
  name: 'Federació Catalana de Judo',
  acronym: 'FCJ',
  isActive: true,
  seasons: [
    {
      id: 'season-1',
      seasonName: '2026-2027',
      currency: 'EUR',
      clubCost: '120.00',
      isActive: true,
      licenseTypes: [
        {
          id: 'type-standard',
          name: 'Standard',
          isActive: true,
          priceRows: [
            {
              id: 'row-instructor',
              kind: 'INSTRUCTOR' as const,
              label: '',
              birthYearFrom: null,
              cost: '50.00',
              reduction: '0.00',
              chargePrice: '55.00',
              sortOrder: 0,
            },
            {
              id: 'row-adult',
              kind: 'ADULT' as const,
              label: '',
              birthYearFrom: null,
              cost: '35.00',
              reduction: '0.00',
              chargePrice: '40.00',
              sortOrder: 1,
            },
          ],
        },
      ],
    },
  ],
};

const directoryUser = (id: string, overrides: Record<string, unknown> = {}) => ({
  id,
  email: `${id}@dojo.test`,
  firstName: 'Ana',
  lastName: 'Gomez',
  gender: null,
  isActive: true,
  roles: [Role.STUDENT],
  ...overrides,
});

describe('LicensesService', () => {
  let service: LicensesService;
  const prisma = {
    affiliationLicense: {
      findMany: jest.fn(),
      create: jest.fn(),
      createMany: jest.fn(),
      updateMany: jest.fn(),
    },
    studentProfile: { findMany: jest.fn() },
  };
  const usersClient = { findManyByIds: jest.fn(), findByRoles: jest.fn() };
  const federationsClient = { getFederation: jest.fn(), registerCharges: jest.fn() };

  beforeEach(async () => {
    jest.resetAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        LicensesService,
        { provide: PrismaService, useValue: prisma },
        { provide: UsersDirectoryClient, useValue: usersClient },
        { provide: FederationsClient, useValue: federationsClient },
      ],
    }).compile();
    service = module.get(LicensesService);
    prisma.affiliationLicense.findMany.mockResolvedValue([]);
    usersClient.findManyByIds.mockResolvedValue(new Map());
    federationsClient.getFederation.mockResolvedValue(catalog);
    federationsClient.registerCharges.mockResolvedValue({ created: 1, skipped: 0 });
  });

  it('previews ACTIVE students matching age, discipline and enrollment date from StudentProfile', async () => {
    const today = new Date();
    const birthDate = new Date(today);
    birthDate.setFullYear(today.getFullYear() - 12);
    prisma.studentProfile.findMany.mockResolvedValue([
      {
        id: 'profile-1',
        userId: 'user-1',
        firstName: 'Ana',
        lastName: 'Gomez',
        birthDate,
        createdAt: new Date('2026-01-10T00:00:00.000Z'),
        ranks: [{ beltRank: { program: { disciplineId } } }],
        guardians: [{ guardian: { userId: 'parent-1' } }],
      },
    ]);
    usersClient.findManyByIds.mockResolvedValue(new Map([['user-1', directoryUser('user-1')]]));

    const result = await service.preview(tenantId, {
      federationId,
      season: '2026-2027',
      holderType: LicenseHolderType.STUDENT,
      age: 12,
      disciplineId,
      enrollmentDateBefore: '2026-02-01',
    });

    expect(prisma.studentProfile.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          status: StudentStatus.ACTIVE,
          createdAt: { lt: new Date('2026-02-01') },
          ranks: { some: { beltRank: { program: { disciplineId } } } },
        }),
      }),
    );
    expect(result.holders).toHaveLength(1);
    expect(result.holders[0].alreadyLicensed).toBe(false);
    expect(result.holders[0].holderUserId).toBe('user-1');
    expect(result.holders[0].payerUserId).toBe('parent-1');
    expect(result.holders[0].age).toBe(12);
  });

  it('includes minors with userId null and ages them from StudentProfile.birthDate', async () => {
    const today = new Date();
    const birthDate = new Date(today);
    birthDate.setFullYear(today.getFullYear() - 10);
    prisma.studentProfile.findMany.mockResolvedValue([
      {
        id: 'profile-minor',
        userId: null,
        firstName: 'Leo',
        lastName: 'Kid',
        birthDate,
        createdAt: new Date('2026-01-10T00:00:00.000Z'),
        ranks: [],
        guardians: [{ guardian: { userId: 'parent-1' } }],
      },
    ]);

    const result = await service.preview(tenantId, {
      federationId,
      season: '2026-2027',
      holderType: LicenseHolderType.STUDENT,
      age: 10,
    });

    expect(result.holders).toHaveLength(1);
    expect(result.holders[0].holderUserId).toBeNull();
    expect(result.holders[0].studentProfileId).toBe('profile-minor');
    expect(result.holders[0].firstName).toBe('Leo');
    expect(result.holders[0].age).toBe(10);
    expect(result.holders[0].payerUserId).toBe('parent-1');
    expect(usersClient.findManyByIds).toHaveBeenCalledWith([]);
  });

  it('excludes students who already have a license for the season (by profile id)', async () => {
    prisma.affiliationLicense.findMany.mockResolvedValue([{ holderUserId: 'user-1', studentProfileId: 'profile-1' }]);
    prisma.studentProfile.findMany.mockResolvedValue([
      {
        id: 'profile-1',
        userId: 'user-1',
        firstName: 'Ana',
        lastName: 'Gomez',
        birthDate: new Date('2010-01-01T00:00:00.000Z'),
        createdAt: new Date('2026-01-10T00:00:00.000Z'),
        ranks: [],
        guardians: [],
      },
    ]);
    usersClient.findManyByIds.mockResolvedValue(new Map([['user-1', directoryUser('user-1')]]));

    const result = await service.preview(tenantId, {
      federationId,
      season: '2026-2027',
      holderType: LicenseHolderType.STUDENT,
    });

    expect(result.holders[0].alreadyLicensed).toBe(true);
  });

  it('previews instructors from the auth directory by role without reading User.birthDate', async () => {
    usersClient.findByRoles.mockResolvedValue([
      directoryUser('inst-1', { email: 'coach@dojo.test', firstName: 'Coach', lastName: 'Lee', roles: [Role.INSTRUCTOR] }),
    ]);

    const result = await service.preview(tenantId, {
      federationId,
      season: '2026-2027',
      holderType: LicenseHolderType.INSTRUCTOR,
    });

    expect(usersClient.findByRoles).toHaveBeenCalledWith([Role.INSTRUCTOR]);
    expect(result.holders[0].holderType).toBe(LicenseHolderType.INSTRUCTOR);
    expect(result.holders[0].age).toBeNull();
    expect(prisma.studentProfile.findMany).not.toHaveBeenCalled();
  });

  it('batch issuance skips already licensed holders with a warning and continues', async () => {
    usersClient.findByRoles.mockResolvedValue([
      directoryUser('inst-1', { roles: [Role.INSTRUCTOR], firstName: 'Coach', lastName: 'Lee' }),
    ]);
    prisma.affiliationLicense.findMany.mockResolvedValue([{ holderUserId: 'inst-1', studentProfileId: null }]);

    const result = await service.issueBatch(tenantId, {
      federationId,
      season: '2026-2027',
      holderType: LicenseHolderType.INSTRUCTOR,
    });

    expect(result.created).toBe(0);
    expect(result.skipped).toBe(1);
    expect(result.warnings).toEqual([
      expect.objectContaining({ code: 'LICENSE_ALREADY_EXISTS_FOR_SEASON', holderUserId: 'inst-1' }),
    ]);
    expect(prisma.affiliationLicense.create).not.toHaveBeenCalled();
    expect(federationsClient.registerCharges).not.toHaveBeenCalled();
  });

  it('issues staff licenses as exempt (zero charge) unless chargeStaff is set', async () => {
    const instructor = directoryUser('inst-1', {
      email: 'coach@dojo.test',
      firstName: 'Coach',
      lastName: 'Lee',
      roles: [Role.INSTRUCTOR],
    });
    usersClient.findByRoles.mockResolvedValue([instructor]);
    prisma.affiliationLicense.create.mockResolvedValue({
      id: 'lic-1',
      tenantId,
      holderUserId: 'inst-1',
      holderType: LicenseHolderType.INSTRUCTOR,
      federationId,
      season: '2026-2027',
      amountCharged: new Prisma.Decimal(0),
      status: AffiliationLicenseStatus.EXEMPT,
      isExempt: true,
      validUntil: new Date('2027-08-31T00:00:00.000Z'),
    });
    prisma.affiliationLicense.findMany
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([
        {
          id: 'lic-1',
          holderUserId: 'inst-1',
          amountCharged: new Prisma.Decimal(0),
          validUntil: new Date('2027-08-31T00:00:00.000Z'),
        },
      ]);
    usersClient.findManyByIds.mockResolvedValue(new Map([['inst-1', instructor]]));

    const result = await service.issueBatch(tenantId, {
      federationId,
      season: '2026-2027',
      holderType: LicenseHolderType.INSTRUCTOR,
    });

    expect(prisma.affiliationLicense.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          holderUserId: 'inst-1',
          isExempt: true,
          status: AffiliationLicenseStatus.EXEMPT,
        }),
      }),
    );
    expect(federationsClient.registerCharges).not.toHaveBeenCalled();
    expect(result.created).toBe(1);
    expect(result.charged).toBe(0);
  });

  it('resolves a minor payer from the guardian and registers a seasonal charge', async () => {
    const today = new Date();
    const birthDate = new Date(today);
    birthDate.setFullYear(today.getFullYear() - 8);
    prisma.studentProfile.findMany.mockResolvedValue([
      {
        id: 'profile-minor',
        userId: null,
        firstName: 'Mia',
        lastName: 'Kid',
        birthDate,
        createdAt: new Date('2026-01-10T00:00:00.000Z'),
        ranks: [],
        guardians: [{ guardian: { userId: 'parent-9' } }],
      },
    ]);
    prisma.affiliationLicense.create.mockResolvedValue({
      id: 'lic-minor',
      tenantId,
      holderUserId: null,
      studentProfileId: 'profile-minor',
      payerUserId: 'parent-9',
      amountCharged: new Prisma.Decimal('40.00'),
      validUntil: new Date('2027-08-31T00:00:00.000Z'),
    });
    prisma.affiliationLicense.findMany
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([
        {
          id: 'lic-minor',
          holderUserId: null,
          studentProfileId: 'profile-minor',
          amountCharged: new Prisma.Decimal('40.00'),
          validUntil: new Date('2027-08-31T00:00:00.000Z'),
        },
      ]);

    const result = await service.issueBatch(tenantId, {
      federationId,
      season: '2026-2027',
      holderType: LicenseHolderType.STUDENT,
      issuedAt: '2026-03-15T00:00:00.000Z',
    });

    expect(prisma.affiliationLicense.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          holderUserId: null,
          studentProfileId: 'profile-minor',
          payerUserId: 'parent-9',
          isExempt: false,
        }),
      }),
    );
    expect(federationsClient.registerCharges).toHaveBeenCalledWith(
      tenantId,
      federationId,
      '2026-2027',
      [
        expect.objectContaining({
          studentProfileId: 'profile-minor',
          holderUserId: 'parent-9',
          saleAmount: '40.00',
          costAmount: '35.00',
        }),
      ],
      false,
    );
    expect(result.created).toBe(1);
    expect(result.charged).toBe(1);
  });

  it('prices adult students from the season matrix using Prisma.Decimal', async () => {
    const today = new Date();
    const birthDate = new Date(today);
    birthDate.setFullYear(today.getFullYear() - 20);
    prisma.studentProfile.findMany.mockResolvedValue([
      {
        id: 'profile-adult',
        userId: 'user-adult',
        firstName: 'Ada',
        lastName: 'Adult',
        birthDate,
        createdAt: new Date('2026-01-10T00:00:00.000Z'),
        ranks: [],
        guardians: [],
      },
    ]);
    prisma.affiliationLicense.create.mockResolvedValue({
      id: 'lic-adult',
      amountCharged: new Prisma.Decimal('40.00'),
      validUntil: new Date('2027-08-31T00:00:00.000Z'),
      holderUserId: 'user-adult',
    });
    prisma.affiliationLicense.findMany.mockResolvedValueOnce([]).mockResolvedValueOnce([]);

    await service.issueBatch(tenantId, {
      federationId,
      season: '2026-2027',
      holderType: LicenseHolderType.STUDENT,
    });

    const payload = prisma.affiliationLicense.create.mock.calls[0][0].data as {
      amountCharged: Prisma.Decimal;
    };
    expect(payload.amountCharged).toBeInstanceOf(Prisma.Decimal);
    expect(payload.amountCharged.toFixed(2)).toBe('40.00');
    expect(federationsClient.registerCharges).toHaveBeenCalledWith(
      tenantId,
      federationId,
      '2026-2027',
      [expect.objectContaining({ saleAmount: '40.00', costAmount: '35.00' })],
      false,
    );
  });

  it('issues designated student profiles as exempt with zero financial charge', async () => {
    const today = new Date();
    const birthDate = new Date(today);
    birthDate.setFullYear(today.getFullYear() - 16);
    prisma.studentProfile.findMany.mockResolvedValue([
      {
        id: 'profile-staff-kid',
        userId: 'user-kid',
        firstName: 'Sam',
        lastName: 'Staff',
        birthDate,
        createdAt: new Date('2026-01-10T00:00:00.000Z'),
        ranks: [],
        guardians: [],
      },
    ]);
    prisma.affiliationLicense.create.mockResolvedValue({
      id: 'lic-ex',
      isExempt: true,
      amountCharged: new Prisma.Decimal(0),
      holderUserId: 'user-kid',
      validUntil: new Date('2027-08-31T00:00:00.000Z'),
    });
    prisma.affiliationLicense.findMany.mockResolvedValueOnce([]).mockResolvedValueOnce([]);

    await service.issueBatch(tenantId, {
      federationId,
      season: '2026-2027',
      holderType: LicenseHolderType.STUDENT,
      exemptStudentProfileIds: ['profile-staff-kid'],
    });

    expect(prisma.affiliationLicense.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          isExempt: true,
          status: AffiliationLicenseStatus.EXEMPT,
        }),
      }),
    );
    expect(federationsClient.registerCharges).not.toHaveBeenCalled();
  });

  it('returns federated status from current licenses and financial catalog names', async () => {
    prisma.affiliationLicense.findMany.mockResolvedValue([
      {
        federationId,
        isActive: true,
        validUntil: new Date('2027-08-31T00:00:00.000Z'),
        season: '2026-2027',
        status: AffiliationLicenseStatus.PAID,
      },
      {
        federationId,
        isActive: true,
        validUntil: new Date('2025-08-31T00:00:00.000Z'),
        season: '2025-2026',
        status: AffiliationLicenseStatus.PAID,
      },
    ]);

    const result = await service.getAffiliationStatus(tenantId, 'profile-1');

    expect(result.federated).toBe(true);
    expect(result.affiliations).toHaveLength(1);
    expect(result.affiliations[0]).toEqual(
      expect.objectContaining({
        federationName: 'Federació Catalana de Judo',
        federationAcronym: 'FCJ',
        season: '2026-2027',
      }),
    );
    expect(federationsClient.getFederation).toHaveBeenCalledWith(tenantId, federationId);
  });

  it('returns not federated when the student has no current license', async () => {
    prisma.affiliationLicense.findMany.mockResolvedValue([]);

    const result = await service.getAffiliationStatus(tenantId, 'profile-1');

    expect(result).toEqual({ studentProfileId: 'profile-1', federated: false, affiliations: [] });
    expect(federationsClient.getFederation).not.toHaveBeenCalled();
  });
});
