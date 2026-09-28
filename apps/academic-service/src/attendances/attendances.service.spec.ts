import { Test, TestingModule } from '@nestjs/testing';
import { AttendancesService } from './attendances.service';
import { PrismaService } from '../prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('AttendancesService', () => {
  let service: AttendancesService;
  let prisma: PrismaService;

  const mockPrismaService = {
    studentProfile: {
      findUnique: jest.fn(),
    },
    attendance: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully register attendance if student profile exists', async () => {
      const dto = { studentProfileId: 'profile-uuid-1' };

      mockPrismaService.studentProfile.findUnique.mockResolvedValue({
        id: 'profile-uuid-1',
      });

      const mockCreatedAttendance = {
        id: 'attendance-uuid-1',
        studentProfileId: 'profile-uuid-1',
        attendedAt: new Date(),
      };

      mockPrismaService.attendance.create.mockResolvedValue(mockCreatedAttendance);

      const result = await service.create(dto);

      expect(prisma.studentProfile.findUnique).toHaveBeenCalledWith({
        where: { id: dto.studentProfileId },
      });
      expect(prisma.attendance.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockCreatedAttendance);
    });

    it('should throw NotFoundException if student profile does not exist', async () => {
      const dto = { studentProfileId: 'non-existent-id' };

      mockPrismaService.studentProfile.findUnique.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
      expect(prisma.attendance.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of attendances', async () => {
      const mockAttendances = [
        { id: 'att-1', studentProfileId: 'profile-uuid-1' },
      ];

      mockPrismaService.attendance.findMany.mockResolvedValue(mockAttendances);

      const result = await service.findAll();

      expect(prisma.attendance.findMany).toHaveBeenCalledWith({
        include: expect.any(Object),
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

      expect(prisma.attendance.findUnique).toHaveBeenCalledWith({
        where: { id: attendanceId },
      });
      expect(prisma.attendance.delete).toHaveBeenCalledWith({
        where: { id: attendanceId },
      });
      expect(result).toEqual({ id: attendanceId });
    });

    it('should throw NotFoundException if attendance record does not exist', async () => {
      mockPrismaService.attendance.findUnique.mockResolvedValue(null);

      await expect(service.remove('non-existent')).rejects.toThrow(NotFoundException);
      expect(prisma.attendance.delete).not.toHaveBeenCalled();
    });
  });
});