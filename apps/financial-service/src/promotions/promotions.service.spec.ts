import { Test, TestingModule } from '@nestjs/testing';
import { PromotionsService } from './promotions.service';
import { PrismaService } from '../prisma/prisma.service';

/**
 * @file promotions.service.spec.ts
 * @description Unit tests validating the calculation logic of the discount engine.
 */
describe('PromotionsService', () => {
  let service: PromotionsService;

  const mockPrismaService = {
    promotion: {
      create: jest.fn().mockImplementation((dto) => Promise.resolve({ id: 'promo-uuid', ...dto.data })),
    },
    studentPromotion: {
      create: jest.fn().mockImplementation((dto) => Promise.resolve({ id: 'sp-uuid', ...dto.data })),
      findMany: jest.fn().mockResolvedValue([
        {
          promotion: { type: 'PERCENTAGE', value: 20, isActive: true },
        },
      ]),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PromotionsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<PromotionsService>(PromotionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculateDiscountedFee', () => {
    it('should correctly apply a percentage discount', async () => {
      const baseAmount = 100;
      // Mock returns a 20% discount
      const result = await service.calculateDiscountedFee('student-uuid', baseAmount);
      expect(result).toBe(80); // 100 - 20% = 80
    });
  });
});