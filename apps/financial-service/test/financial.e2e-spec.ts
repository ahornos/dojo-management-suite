import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Role } from '@dms/shared-types';

/**
 * Deterministic secret injected before the app boots, so the suite never depends on a local `.env`.
 * Both the application's JwtStrategy and the test JwtService read it through ConfigService.
 */
const TEST_JWT_SECRET = 'e2e-financial-secret-not-for-production';

/**
 * @group e2e
 * @description End-to-end integration tests for Financial Service endpoints, guards, and DTO validations.
 * Runs against the REAL Passport JWT strategy and RolesGuard; tokens carry a `roles` ARRAY like production.
 */
describe('Financial Service (E2E)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  let adminToken: string;
  let studentToken: string;

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
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    app.setGlobalPrefix('api');
    await app.init();

    prismaService = app.get<PrismaService>(PrismaService);
    jwtService = app.get<JwtService>(JwtService);

    adminToken = signToken('admin-uuid', [Role.SUPER_ADMIN]);
    studentToken = signToken('student-uuid', [Role.STUDENT]);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/financial/cash/sessions/open (POST)', () => {
    it('should return 401 Unauthorized if no bearer token is provided', async () => {
      const response: any = await (request(app.getHttpServer())
        .post('/api/financial/cash/sessions/open') as any)
        .send({ openingFloat: 50.0 });
      expect(response.status).toBe(401);
    });

    it('should return 401 for a token signed with a different secret', async () => {
      const forgedToken = new JwtService({ secret: 'some-other-secret' }).sign({
        sub: 'attacker',
        email: 'attacker@dojo.com',
        roles: [Role.SUPER_ADMIN],
      });

      const response: any = await (request(app.getHttpServer())
        .post('/api/financial/cash/sessions/open') as any)
        .set('Authorization', `Bearer ${forgedToken}`)
        .send({ openingFloat: 50.0 });
      expect(response.status).toBe(401);
    });
  });

  describe('/api/financial/cash/transactions (POST)', () => {
    it('should validate payload structure and fail on negative amounts with admin token', async () => {
      const response: any = await (request(app.getHttpServer())
        .post('/api/financial/cash/transactions') as any)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          cashSessionId: 'invalid-uuid',
          type: 'INCOME',
          category: 'MEMBERSHIP_PAYMENT',
          paymentMethod: 'CASH',
          amount: -10.0,
          description: 'Test transaction',
        });
      expect([400, 404]).toContain(response.status);
    });

    it('should forbid a legacy token carrying a singular `role` claim instead of `roles`', async () => {
      const legacyToken = jwtService.sign({ sub: 'legacy-uuid', email: 'legacy@dojo.com', role: Role.SUPER_ADMIN });

      const response: any = await (request(app.getHttpServer())
        .post('/api/financial/cash/transactions') as any)
        .set('Authorization', `Bearer ${legacyToken}`)
        .send({});
      expect(response.status).toBe(403);
    });
  });

  describe('/api/financial/remittances/mandates (POST)', () => {
    it('should forbid students from creating bank mandates (RBAC validation)', async () => {
      const response: any = await (request(app.getHttpServer())
        .post('/api/financial/remittances/mandates') as any)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          studentProfileId: 'uuid',
          iban: 'ES9112345678901234567890',
          mandateReference: 'MANDATE-TEST',
          signatureDate: '2026-01-01T00:00:00.000Z',
        });
      expect(response.status).toBe(403);
    });
  });
});
