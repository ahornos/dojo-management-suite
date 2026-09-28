import { Test, TestingModule } from '@nestjs/testing';
import { AttendancesService } from './attendances.service';
import { PrismaService } from '../prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('AttendancesService', () => {
  let service: AttendancesService;
  let prisma: PrismaService;

  // Mock Prisma Service and transaction client
  const mockTx = {
    attendance: {
      create: jest.fn(),
    },
    studentRank: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockPrismaService = {
    studentProfile: {
      findUnique: jest.fn(),
    },
    attendance: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
    $transaction: jest.fn(async (callback) => callback(mockTx)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttendancesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<AttendancesService>(AttendancesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test suite initialization check
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully register attendance and increment rank hours if first time today', async () => {
      const dto = { studentProfileId: 'profile-uuid-1' };

      // Mock student profile existence
      mockPrismaService.studentProfile.findUnique.mockResolvedValue({
        id: 'profile-uuid-1',
      });

      // Mock that no attendance has been counted for rank today yet
      mockPrismaService.attendance.findFirst.mockResolvedValue(null);

      // Mock transaction operations
      const mockCreatedAttendance = {
        id: 'attendance-uuid-1',
        studentProfileId: 'profile-uuid-1',
        attendedAt: new Date(),
        countedForRank: true,
      };
      mockTx.attendance.create.mockResolvedValue(mockCreatedAttendance);
      mockTx.studentRank.findFirst.mockResolvedValue({
        id: 'rank-uuid-1',
        accumulatedHours: 5,
      });
      mockTx.studentRank.update.mockResolvedValue({
        id: 'rank-uuid-1',
        accumulatedHours: 6,
      });

      const result = await service.create(dto);

      expect(prisma.studentProfile.findUnique).toHaveBeenCalledWith({
        where: { id: dto.studentProfileId },
        include: {
          ranks: {
            where: {},
            include: { beltRank: true },
          },
        },
      });
      expect(prisma.$transaction).toHaveBeenCalledTimes(1);
      expect(mockTx.attendance.create).toHaveBeenCalledWith({
        data: {
          studentProfileId: dto.studentProfileId,
          countedForRank: true,
        },
      });
      expect(mockTx.studentRank.update).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockCreatedAttendance);
    });

    it('should throw NotFoundException if student profile does not exist', async () => {
      const dto = { studentProfileId: 'non-existent-id' };

      // Simulate missing student profile
      mockPrismaService.studentProfile.findUnique.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
      expect(prisma.$transaction).not.toHaveBeenCalled();
    });
  });

  describe('findAll and findByStudent', () => {
    it('should return an array of all attendances', async () => {
      const mockAttendances = [{ id: 'att-1', studentProfileId: 'profile-uuid-1' }];
      mockPrismaService.attendance.findMany.mockResolvedValue(mockAttendances);

      const result = await service.findAll();

      expect(prisma.attendance.findMany).toHaveBeenCalledWith({
        include: expect.any(Object),
        orderBy: { attendedAt: 'desc' },
      });
      expect(result).toEqual(mockAttendances);
    });

    it('should return attendances filtered by student profile ID', async () => {
      const studentId = 'profile-uuid-1';
      const mockAttendances = [{ id: 'att-1', studentProfileId: studentId }];
      mockPrismaService.attendance.findMany.mockResolvedValue(mockAttendances);

      const result = await service.findByStudent(studentId);

      expect(prisma.attendance.findMany).toHaveBeenCalledWith({
        where: { studentProfileId: studentId },
        orderBy: { attendedAt: 'desc' },
      });
      expect(result).toEqual(mockAttendances);
    });
  });

  describe('remove', () => {
    it('should successfully delete an attendance record', async () => {
      const attendanceId = 'attendance-uuid-1';

      mockPrismaService.attendance.findUnique.mockResolvedValue({
        id: attendanceId,
      });
      mockPrismaService.attendance.delete.mockResolvedValue({ id: attendanceId });

      const result = await service.remove(attendanceId);

      expect(prisma.attendance.delete).toHaveBeenCalledWith({
        where: { id: attendanceId },
      });
      expect(result).toEqual({ id: attendanceId });
    });

    it('should throw NotFoundException if attendance record does not exist for deletion', async () => {
      mockPrismaService.attendance.findUnique.mockResolvedValue(null);

      await expect(service.remove('non-existent')).rejects.toThrow(NotFoundException);
      expect(prisma.attendance.delete).not.toHaveBeenCalled();
    });
  });
});