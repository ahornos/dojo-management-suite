import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import request = require('supertest');
import { of, throwError } from 'rxjs';
import { AppModule } from '../src/app.module';
import { GlobalExceptionFilter } from '../src/common/filters/global-exception.filter';

/**
 * @file api-gateway.e2e-spec.ts
 * @description End-to-end integration tests for the API Gateway.
 */
describe('API Gateway (E2E)', () => {
  let app: INestApplication;
  let httpService: HttpService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalFilters(new GlobalExceptionFilter());
    app.setGlobalPrefix('api');

    await app.init();
    httpService = moduleFixture.get<HttpService>(HttpService);
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock behavior for successful proxy
    jest.spyOn(httpService, 'request').mockImplementation(() =>
      of({
        status: 200,
        data: { message: 'Proxied successfully' },
        statusText: 'OK',
        headers: {},
        config: { headers: {} } as any,
      }),
    );
  });

  describe('Academic Domain Routing', () => {
    it('should successfully proxy a request to /api/graduations', async () => {
      const response: any = await request(app.getHttpServer())
        .post('/api/graduations')
        .set('Authorization', 'Bearer mock-jwt-token')
        .set('X-School-Id', 'dojo-central-uuid')
        .send({ studentProfileId: 'student-uuid', proposedBeltId: 'belt-uuid' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Proxied successfully' });
    });
  });

  describe('Financial Domain Routing', () => {
    it('should successfully proxy a request to /api/financial/discounts', async () => {
      const response: any = await request(app.getHttpServer())
        .post('/api/financial/discounts')
        .set('Authorization', 'Bearer mock-jwt-token')
        .send({
          code: 'WINTER2026',
          name: 'Winter Campaign',
          type: 'PERCENTAGE',
          category: 'TEMPORARY',
          value: 10,
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Proxied successfully' });
    });
  });

  describe('Exception Handling & Propagation', () => {
    it('should propagate 400 Bad Request when the downstream microservice rejects a payload', async () => {
      // Simulate the downstream microservice throwing a validation error
      jest.spyOn(httpService, 'request').mockImplementationOnce(() => {
        const error: any = new Error('Bad Request from Downstream');
        error.isAxiosError = true;
        error.response = {
          status: 400,
          data: { message: ['property maliciousField should not exist'] },
        };
        return throwError(() => error);
      });

      const response: any = await request(app.getHttpServer())
        .post('/api/financial/discounts')
        .set('Authorization', 'Bearer mock-jwt-token')
        .send({
          maliciousField: 'should-be-stripped',
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toEqual(
        expect.arrayContaining(['property maliciousField should not exist'])
      );
    });
  });
});