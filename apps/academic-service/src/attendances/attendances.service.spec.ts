import { Test, TestingModule } from '@nestjs/testing';
import { AttendancesService } from './attendances.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ServiceUnavailableException, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of, throwError } from 'rxjs';
import { UsersDirectoryClient } from '../users-directory/users-directory.client';

/**
 * @group unit
 * @description Unit tests for AttendancesService managing class attendance logs and rank hour increments.
 * The outbound `HttpService` is mocked; the real `UsersDirectoryClient` runs on top of it.
 */
describe('AttendancesService', () => {

  beforeAll(() => {
    // Negative-path tests intentionally trigger the client's error log; keep the console clean.
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
  let service: AttendancesService;
  let prisma: PrismaService;

  const mockHttp = { post: jest.fn() };
  const mockConfig = {
    getOrThrow: (key: string) => ({ AUTH_SERVICE_URL: 'http://auth-service:3000', INTERNAL_API_KEY: 'test-key' })[key],
  };

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
      update: jest.fn().mockResolvedValue({ id: 'rank-uuid', accumulatedHours: 6 }),
    },
    $transaction: jest.fn((callback) => callback(mockPrisma)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttendancesService,
        UsersDirectoryClient,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: HttpService, useValue: mockHttp },
        { provide: ConfigService, useValue: mockConfig },
      ],
    }).compile();

    service = module.get<AttendancesService>(AttendancesService);
    prisma = module.get<PrismaService>(PrismaService);
    mockHttp.post.mockReset();
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
      expect(mockPrisma.studentRank.update).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    const logs = [
      { id: '1', studentProfileId: 'p-1', date: new Date(), student: { id: 'p-1', userId: 'u-1' } },
      { id: '2', studentProfileId: 'p-1', date: new Date(), student: { id: 'p-1', userId: 'u-1' } },
      { id: '3', studentProfileId: 'p-2', date: new Date(), student: { id: 'p-2', userId: 'u-2' } },
    ];

    it('never joins the users table and merges names from ONE batch call', async () => {
      mockPrisma.attendance.findMany.mockResolvedValue(logs);
      mockHttp.post.mockReturnValue(
        of({
          data: [
            { id: 'u-1', firstName: 'Ana', lastName: 'Gómez', email: 'ana@dojo.test', passwordHash: 'must-not-leak' },
            { id: 'u-2', firstName: 'Luis', lastName: 'Ruiz', email: 'luis@dojo.test' },
          ],
        }),
      );

      const result = await service.findAll();

      expect(mockPrisma.attendance.findMany).toHaveBeenCalledWith({ include: { student: true }, orderBy: { date: 'desc' } });
      expect(mockHttp.post).toHaveBeenCalledTimes(1);
      expect(mockHttp.post.mock.calls[0][1]).toEqual({ ids: ['u-1', 'u-2'] });
      expect(result[0].student.user).toEqual({ firstName: 'Ana', lastName: 'Gómez', email: 'ana@dojo.test' });
      expect(result[2].student.user).toEqual({ firstName: 'Luis', lastName: 'Ruiz', email: 'luis@dojo.test' });
    });

    it('returns user as null when the identity cannot be resolved', async () => {
      mockPrisma.attendance.findMany.mockResolvedValue(logs);
      mockHttp.post.mockReturnValue(of({ data: [] }));

      const result = await service.findAll();

      expect(result.every((log) => log.student.user === null)).toBe(true);
    });

    it('skips the HTTP call when there are no attendances', async () => {
      mockPrisma.attendance.findMany.mockResolvedValue([]);

      await expect(service.findAll()).resolves.toEqual([]);
      expect(mockHttp.post).not.toHaveBeenCalled();
    });

    it('surfaces ServiceUnavailableException when the auth-service rejects the call', async () => {
      mockPrisma.attendance.findMany.mockResolvedValue(logs);
      mockHttp.post.mockReturnValue(
        throwError(() => Object.assign(new Error('forbidden'), { isAxiosError: true, response: { status: 401, data: {} } })),
      );

      await expect(service.findAll()).rejects.toThrow(ServiceUnavailableException);
    });
  });
});
