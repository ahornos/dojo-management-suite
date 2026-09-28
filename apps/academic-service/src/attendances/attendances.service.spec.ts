import { Test, TestingModule } from '@nestjs/testing';
import { AttendancesService } from './attendances.service';
import { PrismaService } from '../prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('AttendancesService', () => {
  let service: AttendancesService;
  let prisma: PrismaService;

  // Mock Prisma Service to isolate attendance unit tests
  const mockPrismaService = {
    studentProfile: {
      findUnique: jest.fn(),
    },
    attendance: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
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
    it('should successfully register attendance if student profile exists', async () => {
      const dto = { studentProfileId: 'profile-uuid-1' };

      // Ensure student profile validation passes successfully
      mockPrismaService.studentProfile.findUnique.mockResolvedValue({
        id: 'profile-uuid-1',
      });

      const mockCreatedAttendance = {
        id: 'attendance-uuid-1',
        studentProfileId: 'profile-uuid-1',
        attendedAt: new Date(),
        countedForRank: false,
      };

      mockPrismaService.attendance.create.mockResolvedValue(mockCreatedAttendance);

      const result = await service.create(dto);

      // Verify profile lookup and attendance creation execution
      expect(prisma.studentProfile.findUnique).toHaveBeenCalledWith({
        where: { id: dto.studentProfileId },
      });
      expect(prisma.attendance.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockCreatedAttendance);
    });

    it('should throw NotFoundException if student profile does not exist', async () => {
      const dto = { studentProfileId: 'non-existent-id' };

      // Simulate missing student profile in database
      mockPrismaService.studentProfile.findUnique.mockResolvedValue(null);

      // Verify that a NotFoundException is thrown and attendance is never created
      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
      expect(prisma.attendance.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of attendances', async () => {
      const mockAttendances = [
        { id: 'att-1', studentProfileId: 'profile-uuid-1' },
      ];

      // Mock fetching all attendance records ordered by date
      mockPrismaService.attendance.findMany.mockResolvedValue(mockAttendances);

      const result = await service.findAll();

      expect(prisma.attendance.findMany).toHaveBeenCalledWith({
        include: expect.any(Object),
        orderBy: { attendedAt: 'desc' },
      });
      expect(result).toEqual(mockAttendances);
    });
  });
});