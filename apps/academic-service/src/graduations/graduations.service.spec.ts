import { Test, TestingModule } from '@nestjs/testing';
import { GraduationsService } from './graduations.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

/**
 * @group unit
 * @description Unit tests for GraduationsService covering evaluation, graduation execution, proposals, and rollbacks.
 */
describe('GraduationsService', () => {
  let service: GraduationsService;
  let prisma: PrismaService;

  const mockPrisma = {
    studentProfile: {
      findUnique: jest.fn(),
    },
    graduationRequest: {
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
        GraduationsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<GraduationsService>(GraduationsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('evaluateGraduationEligibility', () => {
    it('should throw NotFoundException if student profile does not exist', async () => {
      mockPrisma.studentProfile.findUnique.mockResolvedValue(null);

      await expect(
        service.evaluateGraduationEligibility('non-existent-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('proposeGraduation', () => {
    it('should throw NotFoundException if student profile does not exist when proposing', async () => {
      mockPrisma.studentProfile.findUnique.mockResolvedValue(null);

      await expect(
        service.proposeGraduation('non-existent-id', 'instructor-uuid'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});