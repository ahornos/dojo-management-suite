import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Prisma } from '@dms/database/client';
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
          payerUserId: 'uuid',
          iban: 'ES9112345678901234567890',
          mandateReference: 'MANDATE-TEST',
          signatureDate: '2026-01-01T00:00:00.000Z',
        });
      expect(response.status).toBe(403);
    });
  });

  describe('/api/financial/mandates (POST)', () => {
    const validPayload = {
      payerUserId: '22222222-2222-4222-8222-222222222222',
      iban: 'ES91 2100 0418 4502 0005 1332',
      accountHolderName: 'Ana Garcia',
      accountHolderDni: '12345678Z',
      bic: '',
    };

    beforeEach(() => {
      jest.spyOn(prismaService.bankMandate, 'findFirst').mockResolvedValue(null);
      jest.spyOn(prismaService.bankMandate, 'create').mockImplementation(({ data }) =>
        Promise.resolve({
          id: 'mandate-e2e-1',
          payerUserId: data.payerUserId,
          tenantId: data.tenantId,
          iban: data.iban,
          bic: data.bic ?? null,
          mandateReference: data.mandateReference,
          signatureDate: data.signatureDate,
          accountHolderName: data.accountHolderName,
          accountHolderDni: data.accountHolderDni,
          isSigned: false,
          signedAt: null,
          signedByUserId: null,
          signatureIp: null,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        }) as ReturnType<typeof prismaService.bankMandate.create>,
      );
    });

    afterEach(() => {
      jest.mocked(prismaService.bankMandate.findFirst).mockRestore();
      jest.mocked(prismaService.bankMandate.create).mockRestore();
    });

    it('creates a mandate with a generated reference when the payload is valid', async () => {
      const response: any = await (request(app.getHttpServer())
        .post('/api/financial/mandates') as any)
        .set('Authorization', `Bearer ${adminToken}`)
        .set('x-school-id', 'fox-jiujitsu-academy')
        .send(validPayload);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(
        expect.objectContaining({
          id: 'mandate-e2e-1',
          payerUserId: validPayload.payerUserId,
          tenantId: 'fox-jiujitsu-academy',
          iban: 'ES9121000418450200051332',
          accountHolderName: 'Ana Garcia',
          accountHolderDni: '12345678Z',
          isSigned: false,
        }),
      );
      expect(response.body.mandateReference).toMatch(/^DMS-MANDATE-\d+-[A-F0-9]{8}$/);
      expect(prismaService.bankMandate.create).toHaveBeenCalledTimes(1);
    });

    it('returns 400 with a ValidationPipe message array for an invalid IBAN', async () => {
      const response: any = await (request(app.getHttpServer())
        .post('/api/financial/mandates') as any)
        .set('Authorization', `Bearer ${adminToken}`)
        .set('x-school-id', 'fox-jiujitsu-academy')
        .send({ ...validPayload, iban: 'NOT-AN-IBAN' });

      expect(response.status).toBe(400);
      expect(Array.isArray(response.body.message)).toBe(true);
      expect(response.body.message.some((item: string) => /iban/i.test(item))).toBe(true);
      expect(prismaService.bankMandate.create).not.toHaveBeenCalled();
    });
  });

  describe('/api/financial/mandates/:id/sign (PATCH)', () => {
    const mandateId = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
    const tenantId = 'fox-jiujitsu-academy';
    const unsignedMandate = {
      id: mandateId,
      payerUserId: 'parent-uuid',
      tenantId,
      iban: 'ES9121000418450200051332',
      bic: null,
      mandateReference: 'DMS-MANDATE-E2E',
      signatureDate: new Date('2026-10-12T00:00:00.000Z'),
      accountHolderName: 'Ana Garcia',
      accountHolderDni: '12345678Z',
      isSigned: false,
      signedAt: null,
      signedByUserId: null,
      signatureIp: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    beforeEach(() => {
      jest.spyOn(prismaService.bankMandate, 'findFirst').mockResolvedValue(
        unsignedMandate as Awaited<ReturnType<typeof prismaService.bankMandate.findFirst>>,
      );
      jest.spyOn(prismaService.bankMandate, 'update').mockImplementation(({ data }) =>
        Promise.resolve({
          ...unsignedMandate,
          ...data,
        }) as ReturnType<typeof prismaService.bankMandate.update>,
      );
    });

    afterEach(() => {
      jest.mocked(prismaService.bankMandate.findFirst).mockRestore();
      jest.mocked(prismaService.bankMandate.update).mockRestore();
    });

    it('signs the mandate and returns the clickwrap audit trail', async () => {
      const response: any = await (request(app.getHttpServer())
        .patch(`/api/financial/mandates/${mandateId}/sign`) as any)
        .set('Authorization', `Bearer ${adminToken}`)
        .set('x-school-id', tenantId)
        .set('x-forwarded-for', '203.0.113.10')
        .send({ accepted: true });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          id: mandateId,
          isSigned: true,
          signedByUserId: 'admin-uuid',
          signatureIp: '203.0.113.10',
        }),
      );
      expect(response.body.signedAt).toBeDefined();
      expect(prismaService.bankMandate.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: mandateId },
          data: expect.objectContaining({
            isSigned: true,
            signedByUserId: 'admin-uuid',
            signatureIp: '203.0.113.10',
          }),
        }),
      );
    });

    it('rejects unauthenticated sign requests', async () => {
      const response: any = await (request(app.getHttpServer())
        .patch(`/api/financial/mandates/${mandateId}/sign`) as any)
        .set('x-school-id', tenantId)
        .send({ accepted: true });

      expect(response.status).toBe(401);
      expect(prismaService.bankMandate.update).not.toHaveBeenCalled();
    });

    it('rejects unauthorized roles (INSTRUCTOR cannot sign)', async () => {
      const instructorToken = signToken('instructor-uuid', [Role.INSTRUCTOR]);
      const response: any = await (request(app.getHttpServer())
        .patch(`/api/financial/mandates/${mandateId}/sign`) as any)
        .set('Authorization', `Bearer ${instructorToken}`)
        .set('x-school-id', tenantId)
        .send({ accepted: true });

      expect(response.status).toBe(403);
      expect(prismaService.bankMandate.update).not.toHaveBeenCalled();
    });
  });

  describe('/api/financial/config', () => {
    const tenantId = 'fox-jiujitsu-academy';
    const blankConfig = {
      id: 'config-e2e-1',
      tenantId,
      legalName: '',
      taxId: '',
      address: '',
      city: '',
      postalCode: '',
      country: 'ES',
      creditorId: '',
      iban: '',
      bic: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    beforeEach(() => {
      jest.spyOn(prismaService.tenantFinancialConfig, 'upsert').mockImplementation(({ create, update }) =>
        Promise.resolve({
          ...blankConfig,
          ...create,
          ...update,
        }) as ReturnType<typeof prismaService.tenantFinancialConfig.upsert>,
      );
    });

    afterEach(() => {
      jest.mocked(prismaService.tenantFinancialConfig.upsert).mockRestore();
    });

    it('GET returns 200 and upserts a default row for the tenant', async () => {
      const response: any = await (request(app.getHttpServer())
        .get('/api/financial/config') as any)
        .set('Authorization', `Bearer ${adminToken}`)
        .set('x-school-id', tenantId);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({ tenantId, country: 'ES' }));
      expect(prismaService.tenantFinancialConfig.upsert).toHaveBeenCalledWith(
        expect.objectContaining({ where: { tenantId }, create: { tenantId }, update: {} }),
      );
    });

    it('PUT updates the configuration with a SEPA creditor id', async () => {
      const response: any = await (request(app.getHttpServer())
        .put('/api/financial/config') as any)
        .set('Authorization', `Bearer ${adminToken}`)
        .set('x-school-id', tenantId)
        .send({ creditorId: 'ES12ZZZ1234567', legalName: 'Fox Jiu-Jitsu Academy' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          tenantId,
          creditorId: 'ES12ZZZ1234567',
          legalName: 'Fox Jiu-Jitsu Academy',
        }),
      );
    });

    it('forbids a STUDENT from GET and PUT', async () => {
      const getResponse: any = await (request(app.getHttpServer())
        .get('/api/financial/config') as any)
        .set('Authorization', `Bearer ${studentToken}`)
        .set('x-school-id', tenantId);
      const putResponse: any = await (request(app.getHttpServer())
        .put('/api/financial/config') as any)
        .set('Authorization', `Bearer ${studentToken}`)
        .set('x-school-id', tenantId)
        .send({ creditorId: 'ES12ZZZ1234567' });

      expect(getResponse.status).toBe(403);
      expect(putResponse.status).toBe(403);
    });
  });

  describe('/api/financial/federations', () => {
    const tenantId = 'fox-jiujitsu-academy';
    const federationId = '11111111-1111-4111-8111-111111111111';
    const federationRow = {
      id: federationId,
      tenantId,
      name: 'FCJ',
      acronym: 'FCJ',
      country: 'ES',
      email: 'secretaria@fcj.cat',
      isActive: true,
      deletedAt: null,
      createdAt: new Date('2026-10-01T00:00:00.000Z'),
      updatedAt: new Date('2026-10-01T00:00:00.000Z'),
      contacts: [],
      seasons: [
        {
          id: 'season-1',
          federationId,
          seasonName: '2026-2027',
          currency: 'EUR',
          clubCost: new Prisma.Decimal('120.00'),
          isActive: true,
          createdAt: new Date('2026-10-01T00:00:00.000Z'),
          updatedAt: new Date('2026-10-01T00:00:00.000Z'),
          licenseTypes: [
            {
              id: '55555555-5555-4555-8555-555555555555',
              seasonId: 'season-1',
              name: 'Standard',
              isActive: true,
              createdAt: new Date('2026-10-01T00:00:00.000Z'),
              updatedAt: new Date('2026-10-01T00:00:00.000Z'),
              priceRows: [
                {
                  id: 'row-instructor',
                  kind: 'INSTRUCTOR',
                  label: '',
                  birthYearFrom: null,
                  cost: new Prisma.Decimal('50.00'),
                  reduction: new Prisma.Decimal('0.00'),
                  chargePrice: new Prisma.Decimal('55.00'),
                  sortOrder: 0,
                },
                {
                  id: 'row-adult',
                  kind: 'ADULT',
                  label: '',
                  birthYearFrom: null,
                  cost: new Prisma.Decimal('35.00'),
                  reduction: new Prisma.Decimal('0.00'),
                  chargePrice: new Prisma.Decimal('40.00'),
                  sortOrder: 1,
                },
              ],
            },
          ],
        },
      ],
    };

    beforeEach(() => {
      jest.spyOn(prismaService, '$transaction').mockImplementation(async (fn: unknown) => {
        if (typeof fn === 'function') {
          return (fn as (tx: PrismaService) => Promise<unknown>)(prismaService);
        }
        return Promise.all(fn as never);
      });
      jest.spyOn(prismaService.federation, 'create').mockResolvedValue(federationRow as never);
      jest.spyOn(prismaService.federation, 'findFirst').mockResolvedValue(federationRow as never);
      jest.spyOn(prismaService.federation, 'findMany').mockResolvedValue([federationRow] as never);
      jest.spyOn(prismaService.federationSeason, 'findMany').mockResolvedValue([]);
    });

    afterEach(() => {
      jest.mocked(prismaService.$transaction).mockRestore();
      jest.mocked(prismaService.federation.create).mockRestore();
      jest.mocked(prismaService.federation.findFirst).mockRestore();
      jest.mocked(prismaService.federation.findMany).mockRestore();
      jest.mocked(prismaService.federationSeason.findMany).mockRestore();
    });

    it('forbids students from listing federations', async () => {
      const response: any = await (request(app.getHttpServer()).get('/api/financial/federations') as any)
        .set('Authorization', `Bearer ${studentToken}`)
        .set('x-school-id', tenantId);

      expect(response.status).toBe(403);
    });

    it('creates a catalog row and serializes prices as strings', async () => {
      const response: any = await (request(app.getHttpServer()).post('/api/financial/federations') as any)
        .set('Authorization', `Bearer ${adminToken}`)
        .set('x-school-id', tenantId)
        .send({ name: 'FCJ', country: 'ES', email: 'secretaria@fcj.cat' });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(
        expect.objectContaining({
          name: 'FCJ',
          email: 'secretaria@fcj.cat',
          country: 'ES',
        }),
      );
    });

    it('projects a seasonal payout from catalog prices and holder counts', async () => {
      const response: any = await (request(app.getHttpServer())
        .post(`/api/financial/federations/${federationId}/budget`) as any)
        .set('Authorization', `Bearer ${adminToken}`)
        .set('x-school-id', tenantId)
        .send({
          season: '2026-2027',
          studentCount: 2,
          instructorCount: 1,
          technicalDirectorCount: 0,
          includeClubFee: true,
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(
        expect.objectContaining({
          season: '2026-2027',
          totalCost: '240.00',
          totalSale: '135.00',
        }),
      );
    });
  });
});
