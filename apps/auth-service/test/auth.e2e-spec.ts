import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { Role } from '@dms/shared-types';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  const testEmail = 'e2e-test@dojo.com';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    /**
     * Enforce validation rules during tests to mirror the production environment.
     * The whitelist option ensures only properties explicitly defined in DTOs are accepted.
     */
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.setGlobalPrefix('api');
    await app.init();

    prismaService = app.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    /**
     * Clean up test database records to maintain idempotency across test runs.
     * We catch potential errors to prevent the teardown phase from crashing.
     */
    await prismaService.user.deleteMany({ where: { email: testEmail } }).catch(() => {});
    await app.close();
  });

  it('/api/auth/register (POST) - should register a new user', async () => {
    /**
     * Payload must comply with RegisterDto requirements, including the shared Role enum.
     */
    const payload = {
      email: testEmail,
      password: 'Password123!',
      firstName: 'E2E',
      lastName: 'User',
      role: Role.STUDENT,
    };

    const response = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send(payload);

    if (response.status !== 201) {
      console.error('Registration validation failed. DTO errors:', response.body);
    }

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message');
    expect(response.body.user).toHaveProperty('email', testEmail);
  });

  it('/api/auth/login (POST) - should authenticate user and return token', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: testEmail,
        password: 'Password123!',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('access_token');
  });
});