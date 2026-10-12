import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { UsersDirectoryClient } from '../src/users-directory/users-directory.client';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Role, UserSummary } from '@dms/shared-types';

/**
 * Deterministic secret injected before the app boots, so the suite never depends on a local `.env`.
 * Both the application's JwtStrategy and the test JwtService read it through ConfigService.
 */
const TEST_JWT_SECRET = 'e2e-academic-secret-not-for-production';

/**
 * @group e2e
 * @description End-to-end tests for Academic Service endpoints (Disciplines, Attendances, Graduations, Students).
 * Runs against the REAL Passport JWT strategy and RolesGuard; tokens carry a `roles` ARRAY like production.
 */
describe('Academic Service (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  let adminToken: string;
  let instructorToken: string;
  let multiRoleToken: string;
  let studentToken: string;
  const provisionedUserId = `e2e-provisioned-${Date.now()}`;
  const directoryStub = {
    provision: jest.fn(),
    findManyByIds: jest.fn(),
    updatePersonalData: jest.fn(),
  };

  /**
   * Signs a token with the same claim structure issued by the auth-service.
   *
   * @param {string} sub - User identifier (JWT `sub` claim).
   * @param {Role[]} roles - Roles assigned to the token owner.
   * @returns {string} Signed JWT.
   */
  const signToken = (sub: string, roles: Role[]): string =>
    jwtService.sign({ sub, email: `${sub}@dojo.com`, roles });

  beforeAll(async () => {
    process.env.JWT_SECRET = TEST_JWT_SECRET;
    // Peer-service settings are mandatory at boot; no real auth-service is contacted in these suites.
    process.env.AUTH_SERVICE_URL = 'http://auth-service.invalid:3000';
    process.env.INTERNAL_API_KEY = 'e2e-internal-key-not-for-production';

    const provisionedUser: UserSummary = {
      id: provisionedUserId,
      email: 'e2e.student@dojo.test',
      firstName: 'E2E',
      lastName: 'Student',
      dni: null,
      birthDate: null,
      phone: null,
      address: null,
      city: null,
      state: null,
      postalCode: null,
      country: 'ES',
      isActive: true,
      roles: [Role.STUDENT],
    };
    directoryStub.provision.mockResolvedValue(provisionedUser);
    directoryStub.findManyByIds.mockResolvedValue(new Map([[provisionedUser.id, provisionedUser]]));
    directoryStub.updatePersonalData.mockResolvedValue(provisionedUser);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        // AuthModule only verifies tokens, so the test registers its own signer fed by the same ConfigService.
        JwtModule.registerAsync({
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            secret: configService.getOrThrow<string>('JWT_SECRET'),
            signOptions: { expiresIn: '5m' },
          }),
        }),
      ],
    })
      .overrideProvider(UsersDirectoryClient)
      .useValue(directoryStub)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    app.setGlobalPrefix('api');
    await app.init();

    prismaService = app.get<PrismaService>(PrismaService);
    jwtService = app.get<JwtService>(JwtService);

    // Mock authentication tokens for different roles, signed with the shared JWT_SECRET
    adminToken = signToken('admin-uuid', [Role.SUPER_ADMIN]);
    instructorToken = signToken('instructor-uuid', [Role.INSTRUCTOR]);
    multiRoleToken = signToken('multi-uuid', [Role.INSTRUCTOR, Role.STUDENT]);
    studentToken = signToken('student-uuid', [Role.STUDENT]);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/disciplines (GET)', () => {
    it('should return 401 Unauthorized if no bearer token is provided', async () => {
      const response: any = await request(app.getHttpServer()).get('/api/disciplines');
      expect(response.status).toBe(401);
    });

    it('should return 401 for a token signed with a different secret', async () => {
      const forgedToken = new JwtService({ secret: 'some-other-secret' }).sign({
        sub: 'attacker',
        email: 'attacker@dojo.com',
        roles: [Role.SUPER_ADMIN],
      });

      const response: any = await (request(app.getHttpServer()).get('/api/disciplines') as any).set(
        'Authorization',
        `Bearer ${forgedToken}`,
      );
      expect(response.status).toBe(401);
    });

    it('should return 401 for an expired token', async () => {
      const expiredToken = jwtService.sign(
        { sub: 'admin-uuid', email: 'admin@dojo.com', roles: [Role.SUPER_ADMIN] },
        { expiresIn: '-1s' },
      );

      const response: any = await (request(app.getHttpServer()).get('/api/disciplines') as any).set(
        'Authorization',
        `Bearer ${expiredToken}`,
      );
      expect(response.status).toBe(401);
    });

    it('should return 200 and a list of disciplines when authenticated', async () => {
      const response: any = await (request(app.getHttpServer())
        .get('/api/disciplines') as any)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('/api/attendances (POST)', () => {
    it('should forbid students from creating attendances (RBAC validation)', async () => {
      const response: any = await (request(app.getHttpServer())
        .post('/api/attendances') as any)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ studentProfileId: 'some-profile-id' });

      expect(response.status).toBe(403);
    });

    it('should let an instructor pass the RBAC guard (rejected later by DTO validation)', async () => {
      const response: any = await (request(app.getHttpServer())
        .post('/api/attendances') as any)
        .set('Authorization', `Bearer ${instructorToken}`)
        .send({ studentProfileId: 'not-a-uuid' });

      expect(response.status).toBe(400);
    });

    it('should let a user with roles [INSTRUCTOR, STUDENT] pass the RBAC guard', async () => {
      const response: any = await (request(app.getHttpServer())
        .post('/api/attendances') as any)
        .set('Authorization', `Bearer ${multiRoleToken}`)
        .send({ studentProfileId: 'not-a-uuid' });

      expect(response.status).toBe(400);
    });

    it('should forbid a legacy token carrying a singular `role` claim instead of `roles`', async () => {
      const legacyToken = jwtService.sign({ sub: 'legacy-uuid', email: 'legacy@dojo.com', role: Role.SUPER_ADMIN });

      const response: any = await (request(app.getHttpServer())
        .post('/api/attendances') as any)
        .set('Authorization', `Bearer ${legacyToken}`)
        .send({ studentProfileId: 'not-a-uuid' });

      expect(response.status).toBe(403);
    });
  });

  describe('/api/students (POST)', () => {
    let createdProfileId: string | undefined;

    afterEach(async () => {
      if (!createdProfileId) {
        return;
      }
      await prismaService.studentProfile.delete({ where: { id: createdProfileId } }).catch(() => undefined);
      createdProfileId = undefined;
    });

    it('creates a student and records a plain changedById without a User FK', async () => {
      const response: any = await (request(app.getHttpServer()).post('/api/students') as any)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          isExistingUser: false,
          isMinor: false,
          userData: { email: 'e2e.student@dojo.test', firstName: 'E2E', lastName: 'Student' },
        });

      expect(response.status).toBe(201);
      expect(response.body.id).toEqual(expect.any(String));
      expect(response.body.user.id).toBe(provisionedUserId);
      createdProfileId = response.body.id;

      const audit = await prismaService.studentStatusHistory.findFirst({
        where: { studentProfileId: createdProfileId },
      });

      expect(audit).toMatchObject({
        studentProfileId: createdProfileId,
        previousStatus: null,
        newStatus: 'ACTIVE',
        changedById: 'admin-uuid',
      });
    });
  });
});
