import { Test, TestingModule } from '@nestjs/testing';
import { DisciplinesService } from './disciplines.service';
import { PrismaService } from '../prisma/prisma.service';

/**
 * @group unit
 * @description Unit tests for DisciplinesService managing martial arts disciplines and belt structures.
 */
describe('DisciplinesService', () => {
  let service: DisciplinesService;
  let prisma: PrismaService;

  const mockPrisma = {
    discipline: {
      findMany: jest.fn().mockResolvedValue([{ id: '1', name: 'BJJ', description: 'Brazilian Jiu-Jitsu' }]),
      findUnique: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockImplementation((dto) => Promise.resolve({ id: '1', ...dto.data })),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DisciplinesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<DisciplinesService>(DisciplinesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an array of disciplines', async () => {
    const result = await service.findAll();
    expect(result).toEqual([{ id: '1', name: 'BJJ', description: 'Brazilian Jiu-Jitsu' }]);
  });

  it('persists a trimmed acronym when creating a discipline', async () => {
    await service.create({
      name: 'Brazilian Jiu-Jitsu',
      acronym: '  BJJ  ',
      programs: [
        {
          name: 'Adults',
          beltRanks: [{ name: 'White Belt', order: 1, maxStripes: 4, minMonthsRequired: 0, minHoursRequired: 0 }],
        },
      ],
    });

    expect(mockPrisma.discipline.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ name: 'Brazilian Jiu-Jitsu', acronym: 'BJJ' }),
      }),
    );
  });
});