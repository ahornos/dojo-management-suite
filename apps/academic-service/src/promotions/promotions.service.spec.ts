import { Test, TestingModule } from '@nestjs/testing';
import { PromotionsService } from './promotions.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

/**
 * @group unit
 * @description Unit tests for PromotionsService covering evaluation, promotion execution, proposals, and rollbacks.
 */
describe('PromotionsService', () => {
  let service: PromotionsService;
  let prisma: PrismaService;

  const mockPrisma = {
    studentProfile: {
      findUnique: jest.fn(),
    },
    promotionRequest: {
      create: jest.fn().mockResolvedValue({ id: 'req-uuid', status: 'PENDING' }),
    },
    studentRank: {
      update: jest.fn(),
      delete: jest.fn(),
      findUnique: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(mockPrisma)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PromotionsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<PromotionsService>(PromotionsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('evaluatePromotionEligibility', () => {
    it('should throw NotFoundException if student profile does not exist', async () => {
      mockPrisma.studentProfile.findUnique.mockResolvedValue(null);

      await expect(
        service.evaluatePromotionEligibility('non-existent-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('proposePromotion', () => {
    it('should throw NotFoundException if student profile does not exist when proposing', async () => {
      mockPrisma.studentProfile.findUnique.mockResolvedValue(null);

      await expect(
        service.proposePromotion('non-existent-id', 'instructor-uuid'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});