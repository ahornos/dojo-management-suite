import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@dms/shared-types';

/**
 * @group e2e
 * @description End-to-end tests for Academic Service endpoints (Disciplines, Attendances, Graduations, Students).
 */
describe('Academic Service (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  let adminToken: string;
  let studentToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.setGlobalPrefix('api');
    await app.init();

    prismaService = app.get<PrismaService>(PrismaService);
    jwtService = app.get<JwtService>(JwtService);

    // Generate mock authentication tokens for different roles based on shared JWT_SECRET
    adminToken = jwtService.sign({ sub: 'admin-uuid', email: 'admin@dojo.com', role: Role.SUPER_ADMIN });
    studentToken = jwtService.sign({ sub: 'student-uuid', email: 'student@dojo.com', role: Role.STUDENT });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/disciplines (GET)', () => {
    it('should return 401 Unauthorized if no bearer token is provided', async () => {
      const response: any = await request(app.getHttpServer()).get('/api/disciplines');
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
  });
});