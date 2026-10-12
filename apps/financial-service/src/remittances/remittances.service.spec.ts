import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { BadRequestException, ServiceUnavailableException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { of, throwError } from 'rxjs';
import { UsersDirectoryClient } from '../users-directory/users-directory.client';
import { RemittancesService } from './remittances.service';
import { PrismaService } from '../prisma/prisma.service';
import { RemittanceStatus, RemittanceItemStatus } from '@dms/shared-types';
import { Prisma } from '@dms/database/client';

/**
 * @file remittances.service.spec.ts
 * @description Unit tests for RemittancesService covering mandates, batch generation with XML preview, and status updates.
 * The outbound `HttpService` is mocked with `of(...)`; the real `UsersDirectoryClient` runs on top of it, so the
 * tests also assert that debtors are resolved with a SINGLE batch request (no N+1).
 */
describe('RemittancesService', () => {

  beforeAll(() => {
    // Negative-path tests intentionally trigger the client's error log; keep the console clean.
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
  let service: RemittancesService;
  let prismaService: PrismaService;

  const mockHttp = { post: jest.fn() };
  const mockConfig = {
    getOrThrow: (key: string) => ({ AUTH_SERVICE_URL: 'http://auth-service:3000', INTERNAL_API_KEY: 'test-key' })[key],
  };

  /**
   * Builds a persisted mandate with the minimal student reference the service reads.
   *
   * @param {string} id - Mandate id.
   * @param {string} userId - Identity id of the debtor.
   * @param {Record<string, unknown>} overrides - Fields to override.
   * @returns {Record<string, unknown>} Mandate record.
   */
  const buildMandate = (id: string, userId: string, overrides: Record<string, unknown> = {}) => ({
    id,
    mandateReference: `REF-${id}`,
    signatureDate: new Date('2026-01-01'),
    iban: 'ES9112345678901234567890',
    isActive: true,
    student: { userId },
    ...overrides,
  });

  const mockPrismaService = {
    bankMandate: {
      findUnique: jest.fn().mockImplementation((args) => {
        if (args.where.mandateReference === 'DUPLICATE') return { id: 'existing-mandate' };
        return null;
      }),
      findMany: jest.fn(),
      create: jest.fn().mockImplementation((dto) => Promise.resolve({ id: 'mandate-uuid', ...dto.data })),
    },
    remittanceBatch: {
      findUnique: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockImplementation((dto) => Promise.resolve({ id: 'batch-uuid', ...dto.data })),
    },
    remittanceItem: {
      findUnique: jest.fn().mockResolvedValue({ id: 'item-uuid', status: RemittanceItemStatus.PENDING }),
      update: jest.fn().mockImplementation((args) => Promise.resolve({ id: args.where.id, ...args.data })),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RemittancesService,
        UsersDirectoryClient,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: HttpService, useValue: mockHttp },
        { provide: ConfigService, useValue: mockConfig },
      ],
    }).compile();

    service = module.get<RemittancesService>(RemittancesService);
    prismaService = module.get<PrismaService>(PrismaService);
    mockHttp.post.mockReset();
    mockPrismaService.bankMandate.findMany.mockReset();
    mockPrismaService.remittanceBatch.create.mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createMandate', () => {
    it('should create a bank mandate successfully', async () => {
      const dto = {
        studentProfileId: 'student-uuid',
        iban: 'ES9112345678901234567890',
        mandateReference: 'MANDATE-001',
        signatureDate: '2026-01-01T00:00:00.000Z',
      };
      const result = await service.createMandate(dto);
      expect(result).toEqual(expect.objectContaining({ mandateReference: 'MANDATE-001' }));
    });
  });

  describe('generateBatch', () => {
    const dto = {
      batchReference: 'REM-2026-01',
      executionDate: '2026-04-05T00:00:00.000Z',
      items: [
        { mandateId: 'mandate-uuid-1', amount: 50.0 },
        { mandateId: 'mandate-uuid-2', amount: 30.0 },
      ],
    };

    beforeEach(() => {
      mockPrismaService.bankMandate.findMany.mockResolvedValue([
        buildMandate('mandate-uuid-1', 'user-1'),
        buildMandate('mandate-uuid-2', 'user-2'),
      ]);
      mockHttp.post.mockReturnValue(
        of({
          data: [
            { id: 'user-1', firstName: 'John', lastName: 'Doe' },
            { id: 'user-2', firstName: 'Jane', lastName: 'Roe' },
          ],
        }),
      );
    });

    it('should generate a remittance batch with XML preview and correct calculations', async () => {
      const result = await service.generateBatch(dto, 'user-uuid');

      expect(result).toEqual(
        expect.objectContaining({
          totalItems: 2,
          status: RemittanceStatus.GENERATED,
        }),
      );
      expect(result.totalAmount).toBeInstanceOf(Prisma.Decimal);
      expect(result.totalAmount.toFixed(2)).toBe('80.00');
      expect(result).toHaveProperty('xmlPreview');
      expect(result.xmlPreview).toContain('<CtrlSum>80.00</CtrlSum>');
      expect(result.xmlPreview).toContain('<InstdAmt Ccy="EUR">50.00</InstdAmt>');
      expect(result.xmlPreview).toContain('REM-2026-01');
      expect(result.xmlPreview).toContain('John Doe');
      expect(result.xmlPreview).toContain('Jane Roe');
    });

    it('resolves all mandates with one query and all debtors with ONE batch HTTP request (no N+1)', async () => {
      await service.generateBatch(dto, 'user-uuid');

      expect(mockPrismaService.bankMandate.findMany).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.bankMandate.findMany).toHaveBeenCalledWith({
        where: { id: { in: ['mandate-uuid-1', 'mandate-uuid-2'] } },
        include: { student: { select: { userId: true } } },
      });
      expect(mockHttp.post).toHaveBeenCalledTimes(1);
      expect(mockHttp.post).toHaveBeenCalledWith(
        'http://auth-service:3000/api/internal/users/batch',
        { ids: ['user-1', 'user-2'] },
        { headers: { 'x-internal-api-key': 'test-key' } },
      );
    });

    it('handles the same mandate appearing twice with a single lookup', async () => {
      mockPrismaService.bankMandate.findMany.mockResolvedValue([buildMandate('mandate-uuid-1', 'user-1')]);
      mockHttp.post.mockReturnValue(of({ data: [{ id: 'user-1', firstName: 'John', lastName: 'Doe' }] }));

      const result = await service.generateBatch(
        { ...dto, items: [{ mandateId: 'mandate-uuid-1', amount: 10 }, { mandateId: 'mandate-uuid-1', amount: 15 }] },
        'user-uuid',
      );

      expect(mockPrismaService.bankMandate.findMany.mock.calls[0][0].where.id.in).toEqual(['mandate-uuid-1']);
      expect(mockHttp.post.mock.calls[0][1]).toEqual({ ids: ['user-1'] });
      expect(result.totalAmount.toFixed(2)).toBe('25.00');
    });

    it('sums money exactly (0.1 + 0.2 collections)', async () => {
      const result = await service.generateBatch(
        { ...dto, items: [{ mandateId: 'mandate-uuid-1', amount: 0.1 }, { mandateId: 'mandate-uuid-2', amount: 0.2 }] },
        'user-uuid',
      );

      expect(result.totalAmount.toString()).toBe('0.3');
      expect(result.xmlPreview).toContain('<CtrlSum>0.30</CtrlSum>');
    });

    it('uses collision-safe UUID-based item ids that fit the SEPA EndToEndId limit and match the stored items', async () => {
      const result = await service.generateBatch(dto, 'user-uuid');

      const stored = mockPrismaService.remittanceBatch.create.mock.calls[0][0].data.items.create as { id: string }[];
      const ids = stored.map((item) => item.id);

      expect(ids).toHaveLength(2);
      expect(new Set(ids).size).toBe(2);
      for (const id of ids) {
        expect(id).toMatch(/^[0-9a-f]{32}$/);
        expect(id.length).toBeLessThanOrEqual(35);
        expect(result.xmlPreview).toContain(`<EndToEndId>${id}</EndToEndId>`);
      }
    });

    it('never relies on Math.random for identifiers', async () => {
      const randomSpy = jest.spyOn(Math, 'random');

      await service.generateBatch(dto, 'user-uuid');

      expect(randomSpy).not.toHaveBeenCalled();
      randomSpy.mockRestore();
    });

    it('rejects a batch whose reference already exists', async () => {
      mockPrismaService.remittanceBatch.findUnique.mockResolvedValueOnce({ id: 'existing' });

      await expect(service.generateBatch(dto, 'user-uuid')).rejects.toThrow(BadRequestException);
      expect(mockPrismaService.bankMandate.findMany).not.toHaveBeenCalled();
    });

    it('rejects a missing mandate before calling the auth-service', async () => {
      mockPrismaService.bankMandate.findMany.mockResolvedValue([buildMandate('mandate-uuid-1', 'user-1')]);

      await expect(service.generateBatch(dto, 'user-uuid')).rejects.toThrow(BadRequestException);
      expect(mockHttp.post).not.toHaveBeenCalled();
      expect(mockPrismaService.remittanceBatch.create).not.toHaveBeenCalled();
    });

    it('rejects an inactive mandate before calling the auth-service', async () => {
      mockPrismaService.bankMandate.findMany.mockResolvedValue([
        buildMandate('mandate-uuid-1', 'user-1'),
        buildMandate('mandate-uuid-2', 'user-2', { isActive: false }),
      ]);

      await expect(service.generateBatch(dto, 'user-uuid')).rejects.toThrow(BadRequestException);
      expect(mockHttp.post).not.toHaveBeenCalled();
    });

    it('rejects the batch when a debtor identity cannot be resolved', async () => {
      mockHttp.post.mockReturnValue(of({ data: [{ id: 'user-1', firstName: 'John', lastName: 'Doe' }] }));

      await expect(service.generateBatch(dto, 'user-uuid')).rejects.toThrow('DEBTOR_IDENTITY_NOT_FOUND');
      expect(mockPrismaService.remittanceBatch.create).not.toHaveBeenCalled();
    });

    it('does not persist anything when the auth-service rejects the call', async () => {
      mockHttp.post.mockReturnValue(
        throwError(() => Object.assign(new Error('unauthorized'), { isAxiosError: true, response: { status: 401, data: {} } })),
      );

      await expect(service.generateBatch(dto, 'user-uuid')).rejects.toThrow(ServiceUnavailableException);
      expect(mockPrismaService.remittanceBatch.create).not.toHaveBeenCalled();
    });
  });

  describe('updateItemStatus', () => {
    it('should update remittance item status and return reason', async () => {
      const dto = {
        status: RemittanceItemStatus.RETURNED,
        returnReason: 'Insufficient funds',
      };
      const result = await service.updateItemStatus('item-uuid', dto);
      expect(result).toEqual(
        expect.objectContaining({
          status: RemittanceItemStatus.RETURNED,
          returnReason: 'Insufficient funds',
        }),
      );
    });
  });
});