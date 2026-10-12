import { Test, TestingModule } from '@nestjs/testing';
import { FeesService } from './fees.service';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@dms/database/client';

/**
 * @file fees.service.spec.ts
 * @description Unit tests for FeesService covering fee tier creation, student overrides, and mass updates.
 */
describe('FeesService', () => {
  let service: FeesService;
  let prismaService: PrismaService;

  /** Transaction client handed to the interactive `$transaction` callback. */
  const mockTx = {
    feeTier: {
      findMany: jest.fn(),
      update: jest.fn().mockImplementation((args) => Promise.resolve({ id: args.where.id, ...args.data })),
    },
  };

  const mockPrismaService = {
    $transaction: jest.fn().mockImplementation((callback: (tx: typeof mockTx) => unknown) => callback(mockTx)),
    feeTier: {
      create: jest.fn().mockImplementation((dto) => Promise.resolve({ id: 'tier-uuid', ...dto.data })),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    studentFee: {
      create: jest.fn().mockImplementation((dto) => Promise.resolve({ id: 'student-fee-uuid', ...dto.data })),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<FeesService>(FeesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createFeeTier', () => {
    it('should successfully create a fee tier', async () => {
      const dto = { name: 'GOLD', baseAmount: 80.0 };
      const result = await service.createFeeTier(dto as any);
      expect(result).toEqual(expect.objectContaining({ name: 'GOLD', baseAmount: 80.0 }));
      expect(prismaService.feeTier.create).toHaveBeenCalled();
    });
  });

  describe('assignStudentFee', () => {
    it('should successfully assign a student fee override', async () => {
      const dto = { studentProfileId: 'student-uuid', customAmount: 45.0 };
      const result = await service.assignStudentFee(dto as any);
      expect(result).toEqual(expect.objectContaining({ studentProfileId: 'student-uuid', customAmount: 45.0 }));
      expect(prismaService.studentFee.create).toHaveBeenCalled();
    });
  });

  describe('massFeeUpdate', () => {
    const dec = (value: string) => new Prisma.Decimal(value);
    const tier = (id: string, baseAmount: string) => ({ id, name: id, baseAmount: dec(baseAmount) });

    beforeEach(() => {
      mockTx.feeTier.findMany.mockReset();
      mockTx.feeTier.update.mockClear();
      mockPrismaService.$transaction.mockClear();
    });

    it('should throw BadRequestException with a stable code if neither percentage nor fixedAmount is provided', async () => {
      await expect(service.massFeeUpdate({})).rejects.toThrow('MASS_UPDATE_REQUIRES_PERCENTAGE_OR_FIXED_AMOUNT');
      expect(mockPrismaService.$transaction).not.toHaveBeenCalled();
    });

    it('reads and writes inside one transaction', async () => {
      mockTx.feeTier.findMany.mockResolvedValue([tier('tier-1', '50.00'), tier('tier-2', '80.00')]);

      const result = await service.massFeeUpdate({ percentage: 10 });

      expect(mockPrismaService.$transaction).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.feeTier.findMany).not.toHaveBeenCalled();
      expect(mockTx.feeTier.findMany).toHaveBeenCalledWith({ where: { isActive: true } });
      expect(result).toHaveLength(2);
      expect(mockTx.feeTier.update.mock.calls.map(([args]) => args.data.baseAmount.toFixed(2))).toEqual(['55.00', '88.00']);
    });

    it('targets a single tier when tierId is given', async () => {
      mockTx.feeTier.findMany.mockResolvedValue([tier('tier-1', '50.00')]);

      await service.massFeeUpdate({ tierId: 'tier-1', fixedAmount: 5 });

      expect(mockTx.feeTier.findMany).toHaveBeenCalledWith({ where: { id: 'tier-1' } });
      expect(mockTx.feeTier.update.mock.calls[0][0].data.baseAmount.toFixed(2)).toBe('55.00');
    });

    it('does not accumulate binary-float error (10% of 33.33 + 0.10)', async () => {
      // Number math: 33.33 + 33.33 * 0.1 + 0.1 = 36.763000000000005 -> must be exactly 36.76.
      mockTx.feeTier.findMany.mockResolvedValue([tier('tier-1', '33.33')]);

      await service.massFeeUpdate({ percentage: 10, fixedAmount: 0.1 });

      const written = mockTx.feeTier.update.mock.calls[0][0].data.baseAmount as Prisma.Decimal;
      expect(written).toBeInstanceOf(Prisma.Decimal);
      expect(written.toString()).toBe('36.76');
    });

    it('rounds half-up to the column scale of 2 decimals', async () => {
      mockTx.feeTier.findMany.mockResolvedValue([tier('tier-1', '10.05')]);

      await service.massFeeUpdate({ percentage: 10 }); // 11.055 -> 11.06

      expect(mockTx.feeTier.update.mock.calls[0][0].data.baseAmount.toString()).toBe('11.06');
    });

    it('supports negative percentages (price decrease)', async () => {
      mockTx.feeTier.findMany.mockResolvedValue([tier('tier-1', '40.00')]);

      await service.massFeeUpdate({ percentage: -25 });

      expect(mockTx.feeTier.update.mock.calls[0][0].data.baseAmount.toString()).toBe('30');
    });

    it('rolls back (propagates the error) when a tier would become negative', async () => {
      mockTx.feeTier.findMany.mockResolvedValue([tier('tier-1', '50.00'), tier('tier-2', '2.00')]);

      await expect(service.massFeeUpdate({ percentage: -100, fixedAmount: -1 })).rejects.toThrow(
        'MASS_UPDATE_RESULTS_IN_NEGATIVE_AMOUNT',
      );
      // The thrown error is what makes Prisma discard the interactive transaction.
      expect(mockTx.feeTier.update).not.toHaveBeenCalled();
    });

    it('propagates a failure of a later update so the whole batch is rolled back', async () => {
      mockTx.feeTier.findMany.mockResolvedValue([tier('tier-1', '50.00'), tier('tier-2', '80.00')]);
      mockTx.feeTier.update.mockResolvedValueOnce({ id: 'tier-1' }).mockRejectedValueOnce(new Error('db down'));

      await expect(service.massFeeUpdate({ percentage: 5 })).rejects.toThrow('db down');
    });
  });
});
