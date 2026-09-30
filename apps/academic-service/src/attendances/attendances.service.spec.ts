import { Test, TestingModule } from '@nestjs/testing';
import { AttendancesService } from './attendances.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

/**
 * @group unit
 * @description Unit tests for AttendancesService managing class attendance logs and rank hour increments.
 */
describe('AttendancesService', () => {
  let service: AttendancesService;
  let prisma: PrismaService;

  const mockPrisma = {
    studentProfile: {
      findUnique: jest.fn(),
    },
    attendance: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn().mockImplementation((dto) => Promise.resolve({ id: 'attendance-uuid', ...dto.data })),
      delete: jest.fn(),
    },
    studentRank: {
      findFirst: jest.fn().mockResolvedValue({ id: 'rank-uuid', currentHours: 5 }),
      update: jest.fn().mockResolvedValue({ id: 'rank-uuid', accumulatedHours: 6 }), // <-- Añadido el método update faltante
    },
    $transaction: jest.fn((callback) => callback(mockPrisma)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttendancesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<AttendancesService>(AttendancesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw NotFoundException if student profile does not exist', async () => {
      mockPrisma.studentProfile.findUnique.mockResolvedValue(null);

      await expect(
        service.create({ studentProfileId: 'invalid-profile-id' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should successfully log attendance if student profile exists', async () => {
      mockPrisma.studentProfile.findUnique.mockResolvedValue({ id: 'valid-profile-id' });
      mockPrisma.attendance.findFirst.mockResolvedValue(null); // No duplicate attendance on same day

      const result = await service.create({ studentProfileId: 'valid-profile-id' });

      expect(result).toHaveProperty('id', 'attendance-uuid');
      expect(mockPrisma.attendance.create).toHaveBeenCalled();
      expect(mockPrisma.studentRank.update).toHaveBeenCalled(); // Verifica que también actualiza las horas del rango
    });
  });

  describe('findAll', () => {
    it('should return an array of attendance logs', async () => {
      const mockLogs = [{ id: '1', studentProfileId: 'valid-profile-id', date: new Date() }];
      mockPrisma.attendance.findMany.mockResolvedValue(mockLogs);

      const result = await service.findAll();
      expect(result).toEqual(mockLogs);
    });
  });
});