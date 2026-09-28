import { Test, TestingModule } from '@nestjs/testing';
import { DisciplinesService } from './disciplines.service';
import { PrismaService } from '../prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('DisciplinesService', () => {
  let service: DisciplinesService;
  let prisma: PrismaService;

  const mockPrismaService = {
    discipline: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DisciplinesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<DisciplinesService>(DisciplinesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw ConflictException if discipline with the same name already exists', async () => {
      const dto = { name: 'Brazilian Jiu-Jitsu', description: 'Grappling art', programs: [] };
      mockPrismaService.discipline.findUnique.mockResolvedValue({ id: '1', name: 'Brazilian Jiu-Jitsu' });

      await expect(service.create(dto)).rejects.toThrow(ConflictException);
    });

    it('should successfully create a discipline', async () => {
      const dto = {
        name: 'Brazilian Jiu-Jitsu',
        description: 'Grappling art',
        programs: [
          {
            name: 'Adults (16+)',
            minAge: 16,
            maxAge: 99,
            beltRanks: [{ name: 'White', order: 1, maxStripes: 4, minMonthsRequired: 0, minHoursRequired: 0 }],
          },
        ],
      };
      mockPrismaService.discipline.findUnique.mockResolvedValue(null);
      mockPrismaService.discipline.create.mockResolvedValue({ id: 'disc-1', ...dto });

      const result = await service.create(dto);
      expect(result).toBeDefined();
    });
  });

  describe('update', () => {
    it('should throw NotFoundException if discipline to update does not exist', async () => {
      mockPrismaService.discipline.findUnique.mockResolvedValue(null);

      await expect(service.update('non-existent', { name: 'New Name' })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should successfully update a discipline', async () => {
      const existing = { id: 'disc-1', name: 'BJJ', description: null, programs: [] };
      const updated = { id: 'disc-1', name: 'BJJ Updated', description: 'Updated desc', programs: [] };

      mockPrismaService.discipline.findUnique.mockResolvedValueOnce(existing);
      mockPrismaService.discipline.findUnique.mockResolvedValueOnce(null); // No name collision
      mockPrismaService.discipline.update.mockResolvedValue(updated);

      const result = await service.update('disc-1', { name: 'BJJ Updated', description: 'Updated desc' });
      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('should throw NotFoundException if discipline to delete does not exist', async () => {
      mockPrismaService.discipline.findUnique.mockResolvedValue(null);

      await expect(service.remove('non-existent')).rejects.toThrow(NotFoundException);
    });

    it('should successfully delete a discipline', async () => {
      const existing = { id: 'disc-1', name: 'BJJ', description: null, programs: [] };
      mockPrismaService.discipline.findUnique.mockResolvedValue(existing);
      mockPrismaService.discipline.delete.mockResolvedValue(existing);

	      const result = await service.remove('disc-1');
      expect(result).toEqual(existing);
    });
  });
});