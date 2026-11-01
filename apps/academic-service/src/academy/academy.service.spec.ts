/**
 * @file academy.service.spec.ts
 * @description Unit tests for tenant-scoped academy settings, age brackets, and schedule slots.
 */

import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AcademyService } from './academy.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AcademyService', () => {
  let service: AcademyService;

  const mockPrisma = {
    academySettings: {
      upsert: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    academySavedTheme: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    ageBracket: {
      count: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      createMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    academyScheduleSlot: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    discipline: {
      findUnique: jest.fn(),
    },
    $transaction: jest.fn((callback: (tx: Record<string, unknown>) => unknown) => callback(mockPrisma)),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [AcademyService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();
    service = module.get(AcademyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('upserts a blank settings row on first read', async () => {
    mockPrisma.academySettings.upsert.mockResolvedValue({
      tenantId: 't-1',
      displayName: '',
      tradeName: '',
      brandName: '',
      themeConfig: {},
    });
    await expect(service.getSettings('t-1')).resolves.toEqual(
      expect.objectContaining({ tenantId: 't-1', tradeName: '', timezone: 'Europe/Madrid' }),
    );
    expect(mockPrisma.academySettings.upsert).toHaveBeenCalledWith({
      where: { tenantId: 't-1' },
      create: { tenantId: 't-1' },
      update: {},
    });
  });

  it('seeds default age brackets when the tenant has none', async () => {
    mockPrisma.ageBracket.count.mockResolvedValue(0);
    mockPrisma.ageBracket.createMany.mockResolvedValue({ count: 4 });
    mockPrisma.ageBracket.findMany.mockResolvedValue([{ code: 'kids' }]);

    const result = await service.listAgeBrackets('t-1');

    expect(mockPrisma.ageBracket.createMany).toHaveBeenCalled();
    expect(result).toEqual([{ code: 'kids' }]);
  });

  it('syncs tradeName onto legacy displayName and brandName', async () => {
    mockPrisma.academySettings.upsert.mockResolvedValue({
      tenantId: 't-1',
      legalName: 'Fox SL',
      tradeName: 'Fox Jiu Jitsu',
      displayName: 'Fox Jiu Jitsu',
      brandName: 'Fox Jiu Jitsu',
      themeConfig: { primaryColor: '#112233' },
    });

    await expect(
      service.upsertSettings('t-1', { tradeName: 'Fox Jiu Jitsu', legalName: 'Fox SL' }),
    ).resolves.toEqual(
      expect.objectContaining({
        tradeName: 'Fox Jiu Jitsu',
        displayName: 'Fox Jiu Jitsu',
        brandName: 'Fox Jiu Jitsu',
        themeConfig: expect.objectContaining({ primary: '#112233' }),
      }),
    );
    expect(mockPrisma.academySettings.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({
          tenantId: 't-1',
          tradeName: 'Fox Jiu Jitsu',
          displayName: 'Fox Jiu Jitsu',
          brandName: 'Fox Jiu Jitsu',
        }),
      }),
    );
  });

  it('creates a custom appearance and optionally activates it', async () => {
    mockPrisma.academySavedTheme.create.mockResolvedValue({
      id: '11111111-1111-4111-8111-111111111111',
      tenantId: 't-1',
      name: 'Night tatami',
      themeConfig: { primary: '#111111' },
    });
    mockPrisma.academySettings.upsert.mockResolvedValue({ tenantId: 't-1' });

    await expect(
      service.createSavedTheme('t-1', {
        name: 'Night tatami',
        themeConfig: { primary: '#111111' },
        activate: true,
      }),
    ).resolves.toEqual(
      expect.objectContaining({
        name: 'Night tatami',
        themeConfig: expect.objectContaining({ primary: '#111111' }),
      }),
    );
    expect(mockPrisma.academySettings.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({
          activeAppearanceKey: 'saved:11111111-1111-4111-8111-111111111111',
        }),
      }),
    );
  });

  it('rejects activating an unknown appearance key', async () => {
    await expect(service.activateAppearance('t-1', { key: 'preset:unknown' })).rejects.toThrow(
      BadRequestException,
    );
  });

  it('activates a system preset onto academy settings', async () => {
    mockPrisma.academySettings.upsert.mockResolvedValue({
      tenantId: 't-1',
      tradeName: '',
      brandName: '',
      displayName: '',
      themeConfig: { primary: '#990000' },
      activeAppearanceKey: 'preset:tatami',
    });

    await expect(service.activateAppearance('t-1', { key: 'preset:tatami' })).resolves.toEqual(
      expect.objectContaining({
        activeAppearanceKey: 'preset:tatami',
        themeConfig: expect.objectContaining({ primary: '#990000' }),
      }),
    );
  });

  it('refuses to load a missing custom appearance', async () => {
    mockPrisma.academySavedTheme.findFirst.mockResolvedValue(null);
    await expect(service.updateSavedTheme('t-1', 'missing', { name: 'Nope' })).rejects.toThrow(
      NotFoundException,
    );
  });

  it('rejects an inverted age range', async () => {
    await expect(
      service.createAgeBracket('t-1', { name: 'Bad', minAge: 12, maxAge: 4 }),
    ).rejects.toThrow(BadRequestException);
  });

  it('rejects a schedule slot for an unknown discipline', async () => {
    mockPrisma.discipline.findUnique.mockResolvedValue(null);
    await expect(
      service.createScheduleSlot('t-1', {
        weekday: 1,
        startTime: '18:00',
        endTime: '19:00',
        disciplineId: 'missing',
        instructorUserId: 'u-1',
      }),
    ).rejects.toThrow(NotFoundException);
  });
});
