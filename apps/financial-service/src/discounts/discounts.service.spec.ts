import { Test, TestingModule } from '@nestjs/testing';
import { DiscountsService } from './discounts.service';
import { Prisma } from '@dms/database/client';
import { PrismaService } from '../prisma/prisma.service';

/**
 * @file discounts.service.spec.ts
 * @description Unit tests validating the calculation logic of the financial discount engine.
 */
describe('DiscountsService', () => {
  let service: DiscountsService;

  const mockPrismaService = {
    discount: {
      create: jest.fn().mockImplementation((dto) => Promise.resolve({ id: 'discount-uuid', ...dto.data })),
    },
    studentDiscount: {
      create: jest.fn().mockImplementation((dto) => Promise.resolve({ id: 'sd-uuid', ...dto.data })),
      findMany: jest.fn().mockResolvedValue([
        {
          discount: { type: 'PERCENTAGE', value: new Prisma.Decimal(20), isActive: true },
        },
      ]),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiscountsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<DiscountsService>(DiscountsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculateDiscountedFee', () => {
    const dec = (value: string) => new Prisma.Decimal(value);
    const rule = (type: string, value: string | null) => ({ discount: { type, value: value === null ? null : dec(value), isActive: true } });

    it('should correctly apply a percentage discount', async () => {
      const result = await service.calculateDiscountedFee('student-uuid', dec('100'));

      expect(result).toBeInstanceOf(Prisma.Decimal);
      expect(result.toFixed(2)).toBe('80.00');
    });

    it('queries only the active, non-expired discounts of the student', async () => {
      await service.calculateDiscountedFee('student-uuid', dec('100'));

      const where = mockPrismaService.studentDiscount.findMany.mock.calls.at(-1)[0].where;
      expect(where.studentProfileId).toBe('student-uuid');
      expect(where.discount).toEqual({ isActive: true });
    });

    it('applies a fixed discount', async () => {
      mockPrismaService.studentDiscount.findMany.mockResolvedValueOnce([rule('FIXED_DISCOUNT', '7.50')]);

      expect((await service.calculateDiscountedFee('s', dec('50'))).toFixed(2)).toBe('42.50');
    });

    it('stacks several discounts, computing percentages over the ORIGINAL base amount', async () => {
      mockPrismaService.studentDiscount.findMany.mockResolvedValueOnce([rule('PERCENTAGE', '10'), rule('FIXED_DISCOUNT', '5'), rule('PERCENTAGE', '10')]);

      expect((await service.calculateDiscountedFee('s', dec('50'))).toFixed(2)).toBe('35.00');
    });

    it('is exact where float math is not (33.33 with 15% off)', async () => {
      mockPrismaService.studentDiscount.findMany.mockResolvedValueOnce([rule('PERCENTAGE', '15')]);

      // 33.33 - 4.9995 = 28.3305 -> 28.33
      expect((await service.calculateDiscountedFee('s', dec('33.33'))).toFixed(2)).toBe('28.33');
    });

    it('returns zero for a FREE_PERIOD discount, ignoring the rest', async () => {
      mockPrismaService.studentDiscount.findMany.mockResolvedValueOnce([rule('PERCENTAGE', '10'), rule('FREE_PERIOD', null), rule('FIXED_DISCOUNT', '5')]);

      expect((await service.calculateDiscountedFee('s', dec('80'))).toFixed(2)).toBe('0.00');
    });

    it('never returns a negative amount', async () => {
      mockPrismaService.studentDiscount.findMany.mockResolvedValueOnce([rule('FIXED_DISCOUNT', '100')]);

      expect((await service.calculateDiscountedFee('s', dec('30'))).toFixed(2)).toBe('0.00');
    });

    it('ignores value-less percentage/fixed rules and unknown types', async () => {
      mockPrismaService.studentDiscount.findMany.mockResolvedValueOnce([rule('PERCENTAGE', null), rule('FIXED_DISCOUNT', null), rule('OTHER', '5')]);

      expect((await service.calculateDiscountedFee('s', dec('30'))).toFixed(2)).toBe('30.00');
    });

    it('does not mutate the caller-provided base amount', async () => {
      const base = dec('100');
      await service.calculateDiscountedFee('student-uuid', base);

      expect(base.toFixed(2)).toBe('100.00');
    });
  });
});
