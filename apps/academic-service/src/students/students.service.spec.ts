/**
 * @file students.service.spec.ts
 * @group unit
 * @description Unit tests for StudentsService. Prisma and the outbound HTTP layer (`HttpService`) are mocked;
 * the real `UsersDirectoryClient` runs on top of the mocked `HttpService` so the tests also verify the exact
 * requests sent to the auth-service. Covers RBAC, in-memory identity merging, HTTP-before-transaction ordering
 * and auth-service failure propagation.
 */
import { HttpService } from '@nestjs/axios';
import { BadRequestException, ConflictException, ForbiddenException, NotFoundException, ServiceUnavailableException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticatedUser, Gender, LeaveNoticeMethod, LeaveReason, Role } from '@dms/shared-types';
import { AxiosError } from 'axios';
import { of, throwError } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';
import { UsersDirectoryClient } from '../users-directory/users-directory.client';
import { CreateStudentDto, StudentStatusEnum } from './dto/create-student.dto';
import { StudentsService } from './students.service';

/**
 * Builds an authenticated caller.
 *
 * @param {Role[]} roles - Roles held by the caller.
 * @param {string} userId - Caller identity.
 * @returns {AuthenticatedUser} Request user.
 */
const caller = (roles: Role[], userId = 'caller-id'): AuthenticatedUser => ({ userId, email: 'caller@dojo.test', roles });

/**
 * Builds an identity as returned by the auth-service.
 *
 * @param {string} id - User id.
 * @param {Record<string, unknown>} overrides - Fields to override.
 * @returns {Record<string, unknown>} User summary.
 */
const directoryUser = (id: string, overrides: Record<string, unknown> = {}) => ({
  id,
  email: `${id}@dojo.test`,
  firstName: `First-${id}`,
  lastName: `Last-${id}`,
  gender: null,
  isActive: true,
  roles: [Role.STUDENT],
  ...overrides,
});

/**
 * Builds a transient axios failure carrying an HTTP status.
 *
 * @param {number} status - Upstream HTTP status.
 * @param {string} message - Upstream error code.
 * @returns {AxiosError} Error recognised by `axios.isAxiosError`.
 */
const httpError = (status: number, message: string): AxiosError =>
  Object.assign(new Error(message), { isAxiosError: true, response: { status, data: { message } } }) as AxiosError;

describe('StudentsService', () => {

  beforeAll(() => {
    // Negative-path tests intentionally trigger the client's error log; keep the console clean.
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
  let service: StudentsService;

  const mockTx = {
    studentProfile: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
    studentStatusHistory: { create: jest.fn() },
    guardian: { findUnique: jest.fn(), create: jest.fn() },
    studentGuardian: { create: jest.fn(), deleteMany: jest.fn() },
    studentRank: { create: jest.fn(), findMany: jest.fn(), update: jest.fn(), delete: jest.fn() },
    beltRank: { findFirst: jest.fn() },
  };
  const mockPrisma = {
    studentProfile: { findUnique: jest.fn(), findMany: jest.fn() , delete: jest.fn() },
    profileUpdateRequest: { create: jest.fn() },
    discipline: { findUnique: jest.fn() },
    $transaction: jest.fn((callback: (tx: typeof mockTx) => Promise<unknown>) => callback(mockTx)),
  };
  const mockHttp = { post: jest.fn(), patch: jest.fn() };
  const mockConfig = {
    getOrThrow: jest.fn((key: string) => ({ AUTH_SERVICE_URL: 'http://auth-service:3000/', INTERNAL_API_KEY: 'test-key' })[key]),
  };

  /** Default auth-service behaviour: batch echoes known ids, provision echoes the request. */
  const stubDirectory = (): void => {
    mockHttp.post.mockImplementation((url: string, body: { ids?: string[]; userId?: string; email?: string }) => {
      if (url.endsWith('/batch')) return of({ data: (body.ids ?? []).map((id) => directoryUser(id)) });
      return of({ data: directoryUser(body.userId ?? `provisioned-${body.email}`) });
    });
    mockHttp.patch.mockImplementation((url: string) => of({ data: directoryUser(url.split('/').slice(-2)[0]) }));
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    mockPrisma.$transaction.mockImplementation((callback: (tx: typeof mockTx) => Promise<unknown>) => callback(mockTx));
    mockConfig.getOrThrow.mockImplementation((key: string) =>
      ({ AUTH_SERVICE_URL: 'http://auth-service:3000/', INTERNAL_API_KEY: 'test-key' })[key],
    );
    stubDirectory();

    mockPrisma.discipline.findUnique.mockResolvedValue({ id: 'bjj' });
    mockTx.studentProfile.findUnique.mockResolvedValue(null);
    mockTx.studentProfile.create.mockResolvedValue({ id: 'profile-1', userId: 'provisioned-new@dojo.test' });
    mockTx.studentStatusHistory.create.mockResolvedValue({});
    mockTx.guardian.findUnique.mockResolvedValue(null);
    mockTx.guardian.create.mockResolvedValue({ id: 'guardian-1' });
    mockTx.studentGuardian.create.mockResolvedValue({});
    mockTx.studentGuardian.deleteMany.mockResolvedValue({});

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentsService,
        UsersDirectoryClient,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: HttpService, useValue: mockHttp },
        { provide: ConfigService, useValue: mockConfig },
      ],
    }).compile();

    service = module.get(StudentsService);
  });

  const studentRecord = (overrides: Record<string, unknown> = {}) => ({
    id: 'profile-1',
    userId: 'owner-id',
    firstName: 'First-owner-id',
    lastName: 'Last-owner-id',
    dni: null,
    birthDate: null,
    phone: null,
    address: null,
    city: null,
    state: null,
    postalCode: null,
    country: 'ES',
    gender: null,
    status: 'ACTIVE',
    statusHistory: [],
    ranks: [],
    guardians: [],
    ...overrides,
  });

  describe('findOne', () => {
    it('throws NotFoundException when the profile does not exist', async () => {
      mockPrisma.studentProfile.findUnique.mockResolvedValue(null);

      await expect(service.findOne('missing', caller([Role.SUPER_ADMIN]))).rejects.toThrow(NotFoundException);
    });

    it('rejects a stranger without calling the auth-service', async () => {
      mockPrisma.studentProfile.findUnique.mockResolvedValue(studentRecord());

      await expect(service.findOne('profile-1', caller([Role.STUDENT], 'stranger-id'))).rejects.toThrow(ForbiddenException);
      expect(mockHttp.post).not.toHaveBeenCalled();
    });

    it('allows a linked parent to read a minor profile that has no login User', async () => {
      mockPrisma.studentProfile.findUnique.mockResolvedValue(
        studentRecord({
          userId: null,
          firstName: 'Leo',
          lastName: 'Garcia',
          guardians: [{ id: 'link-1', guardian: { id: 'g-1', userId: 'parent-id' } }],
        }),
      );

      const result = await service.findOne('profile-1', caller([Role.PARENT], 'parent-id'));

      expect(result.user).toEqual(expect.objectContaining({ id: null, firstName: 'Leo', lastName: 'Garcia' }));
      expect(result.guardians[0].guardian.user?.id).toBe('parent-id');
    });

    it('never joins the users table locally', async () => {
      mockPrisma.studentProfile.findUnique.mockResolvedValue(studentRecord());

      await service.findOne('profile-1', caller([Role.SUPER_ADMIN]));

      const { include } = mockPrisma.studentProfile.findUnique.mock.calls[0][0];
      expect(include).not.toHaveProperty('user');
      expect(include.guardians).toEqual({ include: { guardian: true } });
      expect(include.statusHistory).toEqual({ orderBy: { createdAt: 'desc' } });
    });

    it.each([
      ['the owner', caller([Role.STUDENT], 'owner-id')],
      ['an administrative role', caller([Role.ADMIN_STAFF])],
    ])('returns the profile merged with identities for %s using a single batch call', async (_label, user) => {
      mockPrisma.studentProfile.findUnique.mockResolvedValue(
        studentRecord({
          guardians: [{ id: 'link-1', guardian: { id: 'g-1', userId: 'parent-id' } }],
          statusHistory: [
            { id: 'h-1', changedById: 'staff-id' },
            { id: 'h-2', changedById: null },
          ],
        }),
      );

      const result = await service.findOne('profile-1', user);

      expect(mockHttp.post).toHaveBeenCalledTimes(1);
      const [url, body, config] = mockHttp.post.mock.calls[0];
      expect(url).toBe('http://auth-service:3000/api/internal/users/batch');
      expect(body.ids.sort()).toEqual(['owner-id', 'parent-id', 'staff-id']);
      expect(config.headers['x-internal-api-key']).toBe('test-key');

      expect(result.user?.firstName).toBe('First-owner-id');
      expect(result.guardians[0].guardian.user?.id).toBe('parent-id');
      expect(result.statusHistory[0].changedBy).toEqual({ firstName: 'First-staff-id', lastName: 'Last-staff-id' });
      expect(result.statusHistory[1].changedBy).toBeNull();
    });

    it('returns user as null when the identity no longer exists upstream', async () => {
      mockPrisma.studentProfile.findUnique.mockResolvedValue(studentRecord());
      mockHttp.post.mockReturnValue(of({ data: [] }));

      const result = await service.findOne('profile-1', caller([Role.SUPER_ADMIN]));

      expect(result.user).toBeNull();
    });

    it('surfaces ServiceUnavailableException when the auth-service rejects our credentials', async () => {
      mockPrisma.studentProfile.findUnique.mockResolvedValue(studentRecord());
      mockHttp.post.mockReturnValue(throwError(() => httpError(401, 'Invalid or missing internal API key')));

      await expect(service.findOne('profile-1', caller([Role.SUPER_ADMIN]))).rejects.toThrow(ServiceUnavailableException);
    });
  });

  describe('findAll', () => {
    it('resolves every student and guardian identity with one HTTP call', async () => {
      mockPrisma.studentProfile.findMany.mockResolvedValue([
        studentRecord({ id: 'p-1', userId: 'u-1', guardians: [{ guardian: { id: 'g-1', userId: 'parent-1' } }] }),
        studentRecord({ id: 'p-2', userId: 'u-2', guardians: [{ guardian: { id: 'g-1', userId: 'parent-1' } }] }),
      ]);

      const result = await service.findAll();

      expect(mockHttp.post).toHaveBeenCalledTimes(1);
      expect(mockHttp.post.mock.calls[0][1].ids.sort()).toEqual(['parent-1', 'u-1', 'u-2']);
      expect(result[1].user?.id).toBe('u-2');
      expect(result[0].guardians[0].guardian.user?.id).toBe('parent-1');
      expect(mockPrisma.studentProfile.findMany.mock.calls[0][0].include).not.toHaveProperty('user');
      expect(mockPrisma.studentProfile.findMany.mock.calls[0][0].include.statusHistory).toEqual({
        orderBy: { createdAt: 'asc' },
        take: 30,
      });
    });

    it('skips the HTTP call when there are no students', async () => {
      mockPrisma.studentProfile.findMany.mockResolvedValue([]);

      await expect(service.findAll()).resolves.toEqual([]);
      expect(mockHttp.post).not.toHaveBeenCalled();
    });

    it('flattens ranks with discipline acronym, stripes, and belt name', async () => {
      mockPrisma.studentProfile.findMany.mockResolvedValue([
        studentRecord({
          ranks: [
            {
              id: 'rank-1',
              beltRankId: 'belt-1',
              currentStripes: 2,
              beltRank: {
                name: 'Grey/White Belt',
                maxStripes: 4,
                program: {
                  disciplineId: 'bjj',
                  discipline: { name: 'Brazilian Jiu-Jitsu', acronym: 'BJJ' },
                },
              },
            },
          ],
        }),
      ]);

      const result = await service.findAll();

      expect(result[0].ranks).toEqual([
        {
          id: 'rank-1',
          beltRankId: 'belt-1',
          disciplineId: 'bjj',
          disciplineName: 'Brazilian Jiu-Jitsu',
          disciplineAcronym: 'BJJ',
          beltName: 'Grey/White Belt',
          currentStripes: 2,
          maxStripes: 4,
        },
      ]);
    });
  });

  describe('create', () => {
    const payload = (overrides: Partial<CreateStudentDto> = {}): CreateStudentDto =>
      ({
        isExistingUser: false,
        isMinor: false,
        userData: { email: 'new@dojo.test', firstName: 'New', lastName: 'Student', phone: '600' },
        ...overrides,
      }) as CreateStudentDto;

    it('provisions the student identity over HTTP BEFORE opening the transaction', async () => {
      const result = await service.create(payload(), caller([Role.ADMIN_STAFF], 'admin-id'));

      const [url, body] = mockHttp.post.mock.calls[0];
      expect(url).toBe('http://auth-service:3000/api/internal/users/provision');
      expect(body).toMatchObject({ email: 'new@dojo.test', firstName: 'New', role: Role.STUDENT });
      expect(mockHttp.post.mock.invocationCallOrder[0]).toBeLessThan(mockPrisma.$transaction.mock.invocationCallOrder[0]);
      expect(mockTx.studentProfile.create.mock.calls[0][0].data.userId).toBe('provisioned-new@dojo.test');
      expect(mockTx.studentStatusHistory.create.mock.calls[0][0].data.changedById).toBe('admin-id');
      expect(result.user.id).toBe('provisioned-new@dojo.test');
    });

    it('writes studentStatusHistory.create with a plain changedById string (no User relation)', async () => {
      await service.create(payload(), caller([Role.ADMIN_STAFF], 'admin-id'));

      expect(mockTx.studentStatusHistory.create).toHaveBeenCalledTimes(1);
      const historyCall = mockTx.studentStatusHistory.create.mock.calls[0][0];
      expect(historyCall).toEqual({
        data: {
          studentProfileId: 'profile-1',
          previousStatus: null,
          newStatus: StudentStatusEnum.ACTIVE,
          reason: 'Initial enrollment',
          changedById: 'admin-id',
        },
      });
      expect(historyCall.data).not.toHaveProperty('changedBy');
      expect(typeof historyCall.data.changedById).toBe('string');
    });

    it('enrolling an existing user by id grants STUDENT without sending StudentProfile demographics', async () => {
      await service.create(payload({ isExistingUser: true, userId: 'existing-id' }));

      const body = mockHttp.post.mock.calls[0][1];
      expect(body.userId).toBe('existing-id');
      expect(body.role).toBe(Role.STUDENT);
      expect(body).not.toHaveProperty('phone');
      expect(body).not.toHaveProperty('dni');
      expect(body).not.toHaveProperty('firstName');
      expect(body).not.toHaveProperty('email');
    });

    it('does not write anything locally when the base user does not exist', async () => {
      mockHttp.post.mockReturnValue(throwError(() => httpError(404, 'USER_NOT_FOUND')));

      await expect(service.create(payload({ isExistingUser: true, userId: 'ghost' }))).rejects.toThrow(NotFoundException);
      expect(mockPrisma.$transaction).not.toHaveBeenCalled();
    });

    it('maps an identity conflict from the auth-service to ConflictException', async () => {
      mockHttp.post.mockReturnValue(throwError(() => httpError(409, 'USER_ALREADY_EXISTS')));

      await expect(service.create(payload())).rejects.toThrow(ConflictException);
      expect(mockPrisma.$transaction).not.toHaveBeenCalled();
    });

    it('rejects a user that already has a student profile and writes nothing', async () => {
      mockTx.studentProfile.findUnique.mockResolvedValue({ id: 'existing-profile' });

      await expect(service.create(payload())).rejects.toThrow(BadRequestException);
      expect(mockTx.studentProfile.create).not.toHaveBeenCalled();
    });

    it('provisions guardians as PARENT before the transaction and links them locally', async () => {
      await service.create(
        payload({
          isMinor: true,
          guardians: [
            { email: 'mum@dojo.test', firstName: 'Mum', lastName: 'M', phone: '611', dni: '1X', relationship: 'Otro', customRelationship: 'Tía' },
          ] as CreateStudentDto['guardians'],
        }),
      );

      expect(mockHttp.post).toHaveBeenCalledTimes(1);
      expect(mockHttp.post.mock.calls[0][1]).toMatchObject({ email: 'mum@dojo.test', role: Role.PARENT });
      expect(mockHttp.post.mock.invocationCallOrder[0]).toBeLessThan(mockPrisma.$transaction.mock.invocationCallOrder[0]);
      expect(mockTx.studentProfile.create.mock.calls[0][0].data.userId).toBeNull();
      expect(mockTx.guardian.create).toHaveBeenCalledWith({ data: { userId: 'provisioned-mum@dojo.test' } });
      expect(mockTx.studentGuardian.create).toHaveBeenCalledWith({
        data: { studentProfileId: 'profile-1', guardianId: 'guardian-1', relationship: 'Tía' },
      });
    });

    it('omits empty-string identifiers from the guardian provisioning request (form defaults)', async () => {
      await service.create(
        payload({
          isMinor: true,
          userData: { firstName: 'New', lastName: 'Student', birthDate: '' },
          guardians: [
            { userId: '', email: 'mum@dojo.test', firstName: 'Mum', lastName: 'M', phone: '', dni: '' },
          ] as CreateStudentDto['guardians'],
        }),
      );

      expect(mockHttp.post).toHaveBeenCalledTimes(1);
      expect(mockHttp.post.mock.calls[0][1].userId).toBeUndefined();
      expect(mockTx.studentProfile.create.mock.calls[0][0].data.birthDate).toBeNull();
    });

    it('runs every local write through the same single transaction (atomicity)', async () => {
      mockTx.beltRank.findFirst.mockResolvedValue({ id: 'lowest-belt' });
      mockTx.studentRank.create.mockResolvedValue({});

      await service.create(
        payload({
          isMinor: true,
          guardians: [{ email: 'mum@dojo.test', firstName: 'Mum', lastName: 'M', phone: '1', dni: '2' }] as CreateStudentDto['guardians'],
          disciplines: [{ disciplineId: 'bjj' }] as CreateStudentDto['disciplines'],
        }),
      );

      expect(mockPrisma.$transaction).toHaveBeenCalledTimes(1);
      expect(mockTx.studentProfile.create).toHaveBeenCalledTimes(1);
      expect(mockTx.studentStatusHistory.create).toHaveBeenCalledTimes(1);
      expect(mockTx.studentGuardian.create).toHaveBeenCalledTimes(1);
      expect(mockTx.studentRank.create).toHaveBeenCalledTimes(1);
      // Nothing is written through the non-transactional client.
      expect(mockPrisma.studentProfile.findUnique).not.toHaveBeenCalled();
    });

    it('enrolls the student in the lowest belt of a discipline when none is given', async () => {
      mockTx.beltRank.findFirst.mockResolvedValue({ id: 'lowest-belt' });
      mockTx.studentRank.create.mockResolvedValue({});

      await service.create(payload({ disciplines: [{ disciplineId: 'bjj', currentStripes: 2 }] as CreateStudentDto['disciplines'] }));

      expect(mockTx.beltRank.findFirst).toHaveBeenCalledWith({
        where: { program: { disciplineId: 'bjj' } },
        orderBy: { order: 'asc' },
      });
      expect(mockTx.studentRank.create).toHaveBeenCalledWith({
        data: { studentProfileId: 'profile-1', beltRankId: 'lowest-belt', currentStripes: 2 },
      });
    });

    it('uses the explicit belt without querying and skips disciplines that have no belts', async () => {
      mockTx.beltRank.findFirst.mockResolvedValue(null);
      mockTx.studentRank.create.mockResolvedValue({});

      await service.create(
        payload({
          disciplines: [{ disciplineId: 'bjj', beltRankId: 'blue' }, { disciplineId: 'empty' }] as CreateStudentDto['disciplines'],
        }),
      );

      expect(mockTx.studentRank.create).toHaveBeenCalledTimes(1);
      expect(mockTx.studentRank.create.mock.calls[0][0].data.beltRankId).toBe('blue');
      expect(mockTx.beltRank.findFirst).toHaveBeenCalledTimes(1);
    });

    it('reuses an existing local Guardian row instead of creating a duplicate', async () => {
      mockTx.guardian.findUnique.mockResolvedValue({ id: 'existing-guardian' });

      await service.create(
        payload({
          isMinor: true,
          guardians: [{ email: 'mum@dojo.test', firstName: 'Mum', lastName: 'M', phone: '1', dni: '2' }] as CreateStudentDto['guardians'],
        }),
      );

      expect(mockTx.guardian.create).not.toHaveBeenCalled();
      expect(mockTx.studentGuardian.create.mock.calls[0][0].data.guardianId).toBe('existing-guardian');
    });

    it('propagates a failure while linking guardians so the transaction rolls back', async () => {
      mockTx.studentGuardian.create.mockRejectedValue(new Error('db down'));

      await expect(
        service.create(
          payload({
            isMinor: true,
            guardians: [{ email: 'mum@dojo.test', firstName: 'Mum', lastName: 'M', phone: '1', dni: '2' }] as CreateStudentDto['guardians'],
            disciplines: [{ disciplineId: 'bjj', beltRankId: 'blue' }] as CreateStudentDto['disciplines'],
          }),
        ),
      ).rejects.toThrow('db down');
      expect(mockTx.studentRank.create).not.toHaveBeenCalled();
    });

    it('does not provision guardians for adult students', async () => {
      await service.create(
        payload({ isMinor: false, guardians: [{ email: 'x@y.z' }] as CreateStudentDto['guardians'] }),
      );

      expect(mockHttp.post).toHaveBeenCalledTimes(1);
      expect(mockTx.studentGuardian.create).not.toHaveBeenCalled();
    });
  });

  describe('createTrial', () => {
    const adultBirthDate = '1998-01-15';
    const minorBirthDate = '2014-06-01';

    it('provisions a TRIAL adult over HTTP then writes status TRIAL with a plain changedById', async () => {
      mockTx.beltRank.findFirst.mockResolvedValue({ id: 'lowest-belt' });
      mockTx.studentRank.create.mockResolvedValue({});

      const result = await service.createTrial(
        {
          disciplineId: 'bjj',
          firstName: 'Maria',
          lastName: 'Garcia',
          birthDate: adultBirthDate,
          email: 'maria@dojo.test',
          phone: '600111222',
        },
        caller([Role.ADMIN_STAFF], 'admin-id'),
      );

      expect(mockPrisma.discipline.findUnique).toHaveBeenCalledWith({ where: { id: 'bjj' } });
      expect(mockHttp.post.mock.invocationCallOrder[0]).toBeLessThan(mockPrisma.$transaction.mock.invocationCallOrder[0]);
      expect(mockHttp.post.mock.calls[0][1]).toMatchObject({
        email: 'maria@dojo.test',
        firstName: 'Maria',
        lastName: 'Garcia',
        role: Role.TRIAL,
      });
      expect(mockHttp.post.mock.calls[0][1]).not.toHaveProperty('phone');
      expect(mockHttp.post.mock.calls[0][1]).not.toHaveProperty('birthDate');
      expect(mockTx.studentProfile.create.mock.calls[0][0].data).toMatchObject({
        status: 'TRIAL',
        emergencyContacts: [],
      });
      expect(mockTx.studentStatusHistory.create.mock.calls[0][0].data).toEqual({
        studentProfileId: 'profile-1',
        previousStatus: null,
        newStatus: 'TRIAL',
        reason: 'Trial registration',
        changedById: 'admin-id',
      });
      expect(mockTx.studentGuardian.create).not.toHaveBeenCalled();
      expect(result.user.id).toBe('provisioned-maria@dojo.test');
    });

    it('stores a trial minor as a profile without a User identity', async () => {
      mockTx.beltRank.findFirst.mockResolvedValue(null);

      await service.createTrial(
        {
          disciplineId: 'bjj',
          firstName: 'Leo',
          lastName: 'Garcia',
          birthDate: minorBirthDate,
          guardianName: 'Ana Garcia',
          guardianPhone: '611000000',
        },
        caller([Role.ADMIN_STAFF], 'admin-id'),
      );

      expect(mockHttp.post).not.toHaveBeenCalled();
      expect(mockTx.studentProfile.create.mock.calls[0][0].data).toMatchObject({
        userId: null,
        firstName: 'Leo',
        lastName: 'Garcia',
        phone: '611000000',
        emergencyContacts: [{ name: 'Ana Garcia', phone: '611000000', relationship: 'Guardian' }],
      });
      expect(mockTx.studentGuardian.create).not.toHaveBeenCalled();
    });

    it('does not provision an identity when the discipline does not exist', async () => {
      mockPrisma.discipline.findUnique.mockResolvedValue(null);

      await expect(
        service.createTrial(
          {
            disciplineId: 'missing',
            firstName: 'Maria',
            lastName: 'Garcia',
            birthDate: adultBirthDate,
            email: 'maria@dojo.test',
            phone: '600',
          },
          caller([Role.ADMIN_STAFF], 'admin-id'),
        ),
      ).rejects.toThrow(BadRequestException);

      expect(mockHttp.post).not.toHaveBeenCalled();
      expect(mockPrisma.$transaction).not.toHaveBeenCalled();
    });
  });

  describe('updateProfile', () => {
    beforeEach(() => {
      mockPrisma.studentProfile.findUnique.mockResolvedValue(studentRecord());
    });

    it('creates an update request for non-staff owners without touching the auth-service', async () => {
      mockPrisma.profileUpdateRequest.create.mockResolvedValue({ id: 'req-1' });

      await service.updateProfile('profile-1', { userData: { phone: '1' } }, caller([Role.STUDENT], 'owner-id'));

      expect(mockPrisma.profileUpdateRequest.create).toHaveBeenCalled();
      expect(mockHttp.patch).not.toHaveBeenCalled();
      expect(mockPrisma.$transaction).not.toHaveBeenCalled();
    });

    it('forbids strangers', async () => {
      await expect(service.updateProfile('profile-1', {}, caller([Role.STUDENT], 'stranger'))).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('patches personal data in the auth-service BEFORE the transaction and returns the refreshed profile', async () => {
      const result = await service.updateProfile(
        'profile-1',
        { userData: { firstName: 'Ana', phone: '622' }, status: StudentStatusEnum.PAUSED, statusReason: 'Injury' },
        caller([Role.ADMIN_STAFF], 'admin-id'),
      );

      const [url, body] = mockHttp.patch.mock.calls[0];
      expect(url).toBe('http://auth-service:3000/api/internal/users/owner-id/personal-data');
      expect(body).toMatchObject({ firstName: 'Ana' });
      expect(body).not.toHaveProperty('phone');
      expect(mockHttp.patch.mock.invocationCallOrder[0]).toBeLessThan(mockPrisma.$transaction.mock.invocationCallOrder[0]);
      expect(mockTx.studentStatusHistory.create.mock.calls[0][0].data).toMatchObject({
        previousStatus: 'ACTIVE',
        newStatus: 'PAUSED',
        reason: 'Injury',
        changedById: 'admin-id',
      });
      expect(result).toHaveProperty('user');
    });

    it('persists structured leave metadata on PAUSED/DROPPED and forwards gender to auth-service', async () => {
      await service.updateProfile(
        'profile-1',
        {
          userData: { gender: Gender.FEMALE },
          status: StudentStatusEnum.DROPPED,
          statusReason: 'Other',
          leaveReason: LeaveReason.OTHER,
          leaveNoticeMethod: LeaveNoticeMethod.WHATSAPP,
          customReasonDetails: 'Family relocated outside Catalonia',
        },
        caller([Role.ADMIN_STAFF], 'admin-id'),
      );

      expect(mockHttp.patch.mock.calls[0][1]).toMatchObject({ gender: Gender.FEMALE });
      expect(mockTx.studentStatusHistory.create.mock.calls[0][0].data).toMatchObject({
        newStatus: 'DROPPED',
        reason: 'Other',
        leaveReason: LeaveReason.OTHER,
        leaveNoticeMethod: LeaveNoticeMethod.WHATSAPP,
        customReasonDetails: 'Family relocated outside Catalonia',
      });
    });

    it('does not open the transaction when the login-identity update fails', async () => {
      mockHttp.patch.mockReturnValue(throwError(() => httpError(409, 'USER_ALREADY_EXISTS')));

      await expect(
        service.updateProfile('profile-1', { userData: { firstName: 'Anita' } }, caller([Role.SUPER_ADMIN])),
      ).rejects.toThrow(ConflictException);
      expect(mockPrisma.$transaction).not.toHaveBeenCalled();
    });

    it('does not PATCH StudentProfile demographics to the auth-service', async () => {
      await service.updateProfile(
        'profile-1',
        { userData: { dni: '1', phone: '600' } },
        caller([Role.SUPER_ADMIN]),
      );

      expect(mockHttp.patch).not.toHaveBeenCalled();
      expect(mockPrisma.$transaction).toHaveBeenCalled();
    });

    it('replaces guardians: provisions first, then deletes and re-links inside the transaction', async () => {
      await service.updateProfile(
        'profile-1',
        {
          isMinor: true,
          guardians: [{ userId: 'parent-id', email: 'p@dojo.test', firstName: 'P', lastName: 'P', phone: '6', dni: '2', relationship: 'Padre' }],
        },
        caller([Role.SUPER_ADMIN]),
      );

      expect(mockHttp.post.mock.invocationCallOrder[0]).toBeLessThan(mockPrisma.$transaction.mock.invocationCallOrder[0]);
      expect(mockTx.studentGuardian.deleteMany).toHaveBeenCalledWith({ where: { studentProfileId: 'profile-1' } });
      expect(mockTx.guardian.create).toHaveBeenCalledWith({ data: { userId: 'parent-id' } });
    });

    it('only clears guardian links when the student stops being a minor', async () => {
      await service.updateProfile('profile-1', { isMinor: false }, caller([Role.SUPER_ADMIN]));

      expect(mockTx.studentGuardian.deleteMany).toHaveBeenCalled();
      expect(mockTx.studentGuardian.create).not.toHaveBeenCalled();
      expect(mockHttp.post).toHaveBeenCalledTimes(1); // only the final findOne batch lookup
    });
  });

  describe('remove', () => {
    it('throws NotFoundException for an unknown profile', async () => {
      mockPrisma.studentProfile.findUnique.mockResolvedValue(null);

      await expect(service.remove('missing')).rejects.toThrow(NotFoundException);
    });
  });
});
