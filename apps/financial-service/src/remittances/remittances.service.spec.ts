import { Test, TestingModule } from '@nestjs/testing';
import { RemittancesService } from './remittances.service';
import { PrismaService } from '../prisma/prisma.service';
import { RemittanceStatus, RemittanceItemStatus } from '@dms/shared-types';

/**
 * @file remittances.service.spec.ts
 * @description Unit tests for RemittancesService covering mandates, batch generation with XML preview, and status updates.
 */
describe('RemittancesService', () => {
  let service: RemittancesService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    bankMandate: {
      findUnique: jest.fn().mockImplementation((args) => {
        if (args.where.mandateReference === 'DUPLICATE') return { id: 'existing-mandate' };
        // Mocking active mandates with student user relations for XML generation
        if (args.where.id?.startsWith('mandate-uuid')) {
          return {
            id: args.where.id,
            mandateReference: 'MANDATE-001',
            signatureDate: new Date('2026-01-01'),
            iban: 'ES9112345678901234567890',
            isActive: true,
            student: {
              user: {
                firstName: 'John',
                lastName: 'Doe',
              },
            },
          };
        }
        return null;
      }),
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
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<RemittancesService>(RemittancesService);
    prismaService = module.get<PrismaService>(PrismaService);
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
    it('should generate a remittance batch with XML preview and correct calculations', async () => {
      const dto = {
        batchReference: 'REM-2026-01',
        executionDate: '2026-04-05T00:00:00.000Z',
        items: [
          { mandateId: 'mandate-uuid-1', amount: 50.0 },
          { mandateId: 'mandate-uuid-2', amount: 30.0 },
        ],
      };
      const result = await service.generateBatch(dto, 'user-uuid');
      
      expect(result).toEqual(
        expect.objectContaining({
          totalAmount: 80.0,
          totalItems: 2,
          status: RemittanceStatus.GENERATED,
        }),
      );
      expect(result).toHaveProperty('xmlPreview');
      expect(result.xmlPreview).toContain('REM-2026-01');
      expect(result.xmlPreview).toContain('John Doe');
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