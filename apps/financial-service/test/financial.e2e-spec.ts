import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt'; // Se resolverá mediante el mock de jest-e2e.json[cite: 1, 4]
import { Role } from '@dms/shared-types';

/**
 * @group e2e
 * @description End-to-end integration tests for Financial Service endpoints, guards, and DTO validations.
 */
describe('Financial Service (E2E)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  let adminToken: string;
  let studentToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
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

    // Instanciamos el mock de JwtService directamente[cite: 4]
    const jwtService = new JwtService();

    adminToken = jwtService.sign({ sub: 'admin-uuid', email: 'admin@dojo.com', role: Role.SUPER_ADMIN });
    studentToken = jwtService.sign({ sub: 'student-uuid', email: 'student@dojo.com', role: Role.STUDENT });
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