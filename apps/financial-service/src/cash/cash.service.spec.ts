import { Test, TestingModule } from '@nestjs/testing';
import { CashService } from './cash.service';
import { PrismaService } from '../prisma/prisma.service';
import { CashMovementType, CashCategory, PaymentMethod } from '@dms/shared-types';

/**
 * @file cash.service.spec.ts
 * @description Unit tests for CashService covering session management and retroactive transaction edits.
 */
describe('CashService', () => {
  let service: CashService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    cashRegisterSession: {
      findFirst: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockImplementation((dto) => Promise.resolve({ id: 'session-uuid', ...dto.data })),
      findUnique: jest.fn().mockResolvedValue({
        id: 'session-uuid',
        status: 'OPEN',
        initialBalance: 50.0,
        transactions: [
          { type: CashMovementType.INCOME, amount: 30.0 },
        ],
      }),
      update: jest.fn().mockImplementation((args) => Promise.resolve({ id: args.where.id, ...args.data })),
    },
    cashTransaction: {
      create: jest.fn().mockImplementation((dto) => Promise.resolve({ id: 'tx-uuid', ...dto.data })),
      findUnique: jest.fn().mockResolvedValue({ id: 'tx-uuid', amount: 30.0 }),
      update: jest.fn().mockImplementation((args) => Promise.resolve({ id: args.where.id, ...args.data })),
      delete: jest.fn().mockResolvedValue({ id: 'tx-uuid' }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CashService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<CashService>(CashService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('openSession', () => {
    it('should open a cash session successfully', async () => {
      const result = await service.openSession({ openingFloat: 50.0 }, 'user-uuid');
      expect(result).toEqual(expect.objectContaining({ initialBalance: 50.0, status: 'OPEN' }));
    });
  });

  describe('createTransaction', () => {
    it('should record a transaction successfully', async () => {
      const dto = {
        cashSessionId: 'session-uuid',
        type: CashMovementType.INCOME,
        category: CashCategory.MERCHANDISE_SALE,
        paymentMethod: PaymentMethod.CASH,
        amount: 25.0,
        description: 'Gi sale',
      };
      const result = await service.createTransaction(dto, 'user-uuid');
      expect(result).toEqual(expect.objectContaining({ amount: 25.0 }));
    });
  });

  describe('deleteTransaction', () => {
    it('should delete a transaction successfully', async () => {
      const result = await service.deleteTransaction('tx-uuid');
      expect(result).toHaveProperty('deletedId', 'tx-uuid');
      expect(prismaService.cashTransaction.delete).toHaveBeenCalled();
    });
  });
});