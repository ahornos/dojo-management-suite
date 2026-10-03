import { Test, TestingModule } from '@nestjs/testing';
import { DiscountsService } from './discounts.service';
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
          discount: { type: 'PERCENTAGE', value: 20, isActive: true },
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
    it('should correctly apply a percentage discount', async () => {
      const baseAmount = 100;
      const result = await service.calculateDiscountedFee('student-uuid', baseAmount);
      expect(result).toBe(80); 
    });
  });
});