import { Test, TestingModule } from '@nestjs/testing';
import { PromotionsService } from './promotions.service';
import { PrismaService } from '../prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('PromotionsService', () => {
  let service: PromotionsService;
  let prisma: PrismaService;

  const mockTx = {
    studentRank: {
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockPrismaService = {
    studentProfile: {
      findUnique: jest.fn(),
    },
    studentRank: {
      findFirst: jest.fn(),
    },
    beltRank: {
      findFirst: jest.fn(),
    },
    $transaction: jest.fn(async (callback) => callback(mockTx)),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PromotionsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<PromotionsService>(PromotionsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('evaluatePromotionEligibility', () => {
    it('should throw NotFoundException if student profile does not exist', async () => {
      mockPrismaService.studentProfile.findUnique.mockResolvedValue(null);

      await expect(service.evaluatePromotionEligibility('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should correctly evaluate eligibility for a stripe promotion', async () => {
      const studentId = 'profile-uuid-1';
      const pastDate = new Date();
      pastDate.setMonth(pastDate.getMonth() - 7); // 7 months ago

      const mockStudent = {
        id: studentId,
        ranks: [
          {
            id: 'rank-1',
            currentStripes: 1,
            accumulatedHours: 25,
            promotedAt: pastDate,
            lastStripeAt: null,
            beltRank: {
              name: 'Blue',
              maxStripes: 4,
              minHoursRequired: 20,
              minMonthsRequired: 6,
              disciplineProgramId: 'prog-1',
            },
          },
        ],
      };

      mockPrismaService.studentProfile.findUnique.mockResolvedValue(mockStudent);

      const result = await service.evaluatePromotionEligibility(studentId);

      expect(result.isEligibleForStripe).toBe(true);
      expect(result.accumulatedHours).toBe(25);
      expect(result.elapsedMonths).toBeGreaterThanOrEqual(6);
    });
  });

  describe('promoteStudent', () => {
    it('should throw BadRequestException if student is not eligible', async () => {
      const studentId = 'profile-uuid-1';
      const recentDate = new Date(); // Today

      const mockStudent = {
        id: studentId,
        ranks: [
          {
            id: 'rank-1',
            currentStripes: 0,
            accumulatedHours: 2, // Not enough hours
            promotedAt: recentDate,
            lastStripeAt: null,
            beltRank: {
              name: 'White',
              maxStripes: 4,
              minHoursRequired: 20,
              minMonthsRequired: 3,
              disciplineProgramId: 'prog-1',
            },
          },
        ],
      };

      mockPrismaService.studentProfile.findUnique.mockResolvedValue(mockStudent);

      await expect(service.promoteStudent(studentId)).rejects.toThrow(BadRequestException);
    });
  });
});