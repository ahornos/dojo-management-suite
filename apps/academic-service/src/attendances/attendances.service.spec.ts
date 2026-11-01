import { Test, TestingModule } from '@nestjs/testing';
import { AttendancesService } from './attendances.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ServiceUnavailableException, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of, throwError } from 'rxjs';
import { AcademyService } from '../academy/academy.service';
import { GraduationsService } from '../graduations/graduations.service';
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
  const mockAcademy = {
    listAgeBrackets: jest.fn().mockResolvedValue([
      { id: 'ab-kids', code: 'kids', minAge: 3, maxAge: 6 },
      { id: 'ab-infantil', code: 'infantil', minAge: 7, maxAge: 12 },
      { id: 'ab-juvenil', code: 'juvenil', minAge: 13, maxAge: 15 },
      { id: 'ab-adults', code: 'adults', minAge: 16, maxAge: 999 },
    ]),
    getSettings: jest.fn().mockResolvedValue({ timezone: 'Europe/Madrid' }),
  };
  const mockGraduations = {
    evaluateEligibilityBatch: jest.fn().mockResolvedValue([]),
  };

  const mockPrisma = {
    studentProfile: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    discipline: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    attendance: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn().mockImplementation((dto) => Promise.resolve({ id: 'attendance-uuid', ...dto.data })),
      delete: jest.fn(),
    },
    attendanceSession: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      createMany: jest.fn(),
      update: jest.fn(),
    },
    academyScheduleSlot: {
      findMany: jest.fn(),
    },
    attendanceRecord: {
      findMany: jest.fn(),
      upsert: jest.fn(),
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
        { provide: AcademyService, useValue: mockAcademy },
        { provide: GraduationsService, useValue: mockGraduations },
      ],
    }).compile();

    service = module.get<AttendancesService>(AttendancesService);
    prisma = module.get<PrismaService>(PrismaService);
    mockHttp.post.mockReset();
    mockAcademy.listAgeBrackets.mockClear();
    mockGraduations.evaluateEligibilityBatch.mockReset().mockResolvedValue([]);
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

  describe('sessions', () => {
    const actor = { userId: 'instructor-1', email: 'coach@dojo.test', roles: [] };
    const discipline = { id: 'disc-1', name: 'Brazilian Jiu-Jitsu', acronym: 'BJJ' };

    beforeEach(() => {
      mockPrisma.discipline.findUnique.mockResolvedValue(discipline);
      mockPrisma.attendanceRecord.findMany.mockResolvedValue([]);
      mockHttp.post.mockReturnValue(of({ data: [{ id: 'instructor-1', firstName: 'Coach', lastName: 'Lee', email: 'coach@dojo.test' }] }));
    });

    it('rejects an unknown discipline', async () => {
      mockPrisma.discipline.findUnique.mockResolvedValue(null);
      await expect(
        service.createSession({ disciplineId: 'missing', date: '2026-11-01' }, actor as never),
      ).rejects.toThrow(NotFoundException);
    });

    it('reuses an existing session for the same discipline, day, and instructor', async () => {
      const existing = {
        id: 'session-1',
        disciplineId: 'disc-1',
        date: new Date('2026-11-01T00:00:00.000Z'),
        instructorUserId: 'instructor-1',
        maxCapacity: 20,
      };
      mockPrisma.attendanceSession.findFirst.mockResolvedValue(existing);

      const result = await service.createSession(
        { disciplineId: 'disc-1', date: '2026-11-01' },
        actor as never,
      );

      expect(mockPrisma.attendanceSession.create).not.toHaveBeenCalled();
      expect(result.id).toBe('session-1');
      expect(result.discipline).toEqual(discipline);
    });

    it('rejects a capacity overflow on bulk save', async () => {
      mockPrisma.attendanceSession.findUnique.mockResolvedValue({
        id: 'session-1',
        date: new Date('2026-11-01T00:00:00.000Z'),
        maxCapacity: 1,
        records: [{ studentProfileId: 'p-1', status: 'PRESENT' }],
      });
      mockPrisma.studentProfile.findMany.mockResolvedValue([{ id: 'p-2' }]);

      await expect(
        service.upsertRecords('tenant-1', 'session-1', {
          records: [{ studentProfileId: 'p-2', status: 'PRESENT' }],
        }),
      ).rejects.toThrow('ATTENDANCE_SESSION_CAPACITY_EXCEEDED');
    });

    it('upserts marks and credits one rank hour for PRESENT', async () => {
      mockPrisma.attendanceSession.findUnique
        .mockResolvedValueOnce({
          id: 'session-1',
          disciplineId: 'disc-1',
          date: new Date('2026-11-01T00:00:00.000Z'),
          instructorUserId: 'instructor-1',
          maxCapacity: null,
          records: [],
        })
        .mockResolvedValueOnce({
          id: 'session-1',
          disciplineId: 'disc-1',
          date: new Date('2026-11-01T00:00:00.000Z'),
          instructorUserId: 'instructor-1',
          maxCapacity: null,
          records: [{ id: 'rec-1', studentProfileId: 'p-1', status: 'PRESENT' }],
        });
      mockPrisma.studentProfile.findMany
        .mockResolvedValueOnce([{ id: 'p-1' }])
        .mockResolvedValueOnce([
          { id: 'p-1', firstName: 'Ana', lastName: 'Gomez', birthDate: new Date('2014-01-01'), status: 'ACTIVE' },
        ]);
      mockPrisma.attendance.findFirst.mockResolvedValue(null);
      mockPrisma.discipline.findMany.mockResolvedValue([discipline]);
      mockPrisma.discipline.findUnique.mockResolvedValue(discipline);

      const result = await service.upsertRecords('tenant-1', 'session-1', {
        records: [{ studentProfileId: 'p-1', status: 'PRESENT' }],
      });

      expect(mockPrisma.attendanceRecord.upsert).toHaveBeenCalled();
      expect(mockPrisma.attendance.create).toHaveBeenCalled();
      expect(mockPrisma.studentRank.update).toHaveBeenCalled();
      expect(result.students[0].attendanceStatus).toBe('PRESENT');
    });

    it('generates missing sessions from the master calendar for a single day', async () => {
      mockPrisma.academyScheduleSlot.findMany.mockResolvedValue([
        {
          id: 'slot-1',
          disciplineId: 'disc-1',
          instructorUserId: 'instructor-1',
          maxCapacity: 20,
          startTime: '18:00',
          endTime: '19:30',
          ageBracketIds: ['ab-kids'],
        },
      ]);
      mockPrisma.attendanceSession.findMany
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);
      mockPrisma.attendanceSession.createMany.mockResolvedValue({ count: 1 });

      await service.listSessions('tenant-1', { dateFrom: '2026-11-02', dateTo: '2026-11-02' });

      expect(mockPrisma.attendanceSession.createMany).toHaveBeenCalledWith({
        data: [
          expect.objectContaining({
            scheduleSlotId: 'slot-1',
            startTime: '18:00',
            isExceptional: false,
          }),
        ],
      });
    });
  });
});
