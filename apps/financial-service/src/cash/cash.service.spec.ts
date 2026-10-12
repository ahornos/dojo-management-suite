import { Test, TestingModule } from '@nestjs/testing';
import { CashService } from './cash.service';
import { PrismaService } from '../prisma/prisma.service';
import { CashMovementType, CashCategory, PaymentMethod } from '@dms/shared-types';
import { Prisma } from '@dms/database/client';
import { BadRequestException, NotFoundException } from '@nestjs/common';

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
        initialBalance: new Prisma.Decimal('50.00'),
        notes: null,
        transactions: [
          { type: CashMovementType.INCOME, amount: new Prisma.Decimal('30.00') },
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

  describe('openSession (guard)', () => {
    it('rejects opening a second session while one is open', async () => {
      mockPrismaService.cashRegisterSession.findFirst.mockResolvedValueOnce({ id: 'open' });

      await expect(service.openSession({ openingFloat: 10 }, 'user-uuid')).rejects.toThrow(BadRequestException);
    });
  });

  describe('closeSession', () => {
    const dec = (value: string) => new Prisma.Decimal(value);

    it('computes totals, expected balance and discrepancy with exact decimals', async () => {
      mockPrismaService.cashRegisterSession.findUnique.mockResolvedValueOnce({
        id: 'session-uuid',
        status: 'OPEN',
        notes: 'Morning',
        initialBalance: dec('50.00'),
        transactions: [
          { type: CashMovementType.INCOME, amount: dec('0.10') },
          { type: CashMovementType.INCOME, amount: dec('0.20') },
          { type: CashMovementType.EXPENSE, amount: dec('10.05') },
        ],
      });

      const result = await service.closeSession('session-uuid', { closingBalance: 40.25, notes: 'ok' }, 'user-uuid');

      // Number math would give 0.30000000000000004 for the incomes.
      expect(result.summary.totalIncomes.toString()).toBe('0.3');
      expect(result.summary.totalExpenses.toString()).toBe('10.05');
      expect(result.summary.expectedBalance.toString()).toBe('40.25');
      expect(result.summary.discrepancy.toString()).toBe('0');

      const update = mockPrismaService.cashRegisterSession.update.mock.calls.at(-1)[0];
      expect(update.data).toMatchObject({ closedById: 'user-uuid', status: 'CLOSED', notes: 'Morning | Closing note: ok' });
      expect(update.data.expectedClosingBalance).toBeInstanceOf(Prisma.Decimal);
    });

    it('reports a negative discrepancy when the drawer is short', async () => {
      const result = await service.closeSession('session-uuid', { closingBalance: 70 }, 'user-uuid');

      expect(result.summary.expectedBalance.toString()).toBe('80');
      expect(result.summary.discrepancy.toString()).toBe('-10');
    });

    it.each([[null], [{ id: 'x', status: 'CLOSED' }]])('rejects a missing or already closed session (%j)', async (session) => {
      mockPrismaService.cashRegisterSession.findUnique.mockResolvedValueOnce(session);

      await expect(service.closeSession('x', { closingBalance: 0 }, 'user-uuid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('createTransaction (edge cases)', () => {
    const dto = {
      cashSessionId: 'session-uuid', type: CashMovementType.INCOME, category: CashCategory.MERCHANDISE_SALE,
      paymentMethod: PaymentMethod.CASH, amount: 5, description: 'late',
    };

    it('rejects an unknown session', async () => {
      mockPrismaService.cashRegisterSession.findUnique.mockResolvedValueOnce(null);

      await expect(service.createTransaction(dto, 'user-uuid')).rejects.toThrow(NotFoundException);
    });

    it('stamps an audit note when a transaction is added to a closed session', async () => {
      mockPrismaService.cashRegisterSession.findUnique.mockResolvedValueOnce({ id: 'session-uuid', status: 'CLOSED', notes: 'n' });

      await service.createTransaction(dto, 'user-uuid');

      expect(mockPrismaService.cashRegisterSession.update.mock.calls.at(-1)[0].data.notes).toContain('[Audit: Retroactive transaction');
    });
  });

  describe('updateTransaction / deleteTransaction (not found)', () => {
    it('updates an existing transaction', async () => {
      await service.updateTransaction('tx-uuid', { amount: 10 });

      expect(mockPrismaService.cashTransaction.update).toHaveBeenCalled();
    });

    it('rejects updating an unknown transaction', async () => {
      mockPrismaService.cashTransaction.findUnique.mockResolvedValueOnce(null);

      await expect(service.updateTransaction('x', {})).rejects.toThrow(NotFoundException);
    });

    it('rejects deleting an unknown transaction', async () => {
      mockPrismaService.cashTransaction.findUnique.mockResolvedValueOnce(null);

      await expect(service.deleteTransaction('x')).rejects.toThrow(NotFoundException);
    });
  });
});
