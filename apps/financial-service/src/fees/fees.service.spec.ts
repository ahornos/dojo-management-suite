import { Test, TestingModule } from '@nestjs/testing';
import { FeesService } from './fees.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';

/**
 * @file fees.service.spec.ts
 * @description Unit tests for FeesService covering fee tier creation, student overrides, and mass updates.
 */
describe('FeesService', () => {
  let service: FeesService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    feeTier: {
      create: jest.fn().mockImplementation((dto) => Promise.resolve({ id: 'tier-uuid', ...dto.data })),
      findMany: jest.fn().mockResolvedValue([
        { id: 'tier-1', name: 'BRONZE', baseAmount: 50.0 },
      ]),
      update: jest.fn().mockImplementation((args) => Promise.resolve({ id: args.where.id, ...args.data })),
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
    it('should throw BadRequestException if neither percentage nor fixedAmount is provided', async () => {
      await expect(service.massFeeUpdate({})).rejects.toThrow(BadRequestException);
    });

    it('should successfully update fees by percentage', async () => {
      const result = await service.massFeeUpdate({ percentage: 10 });
      expect(result).toBeDefined();
      expect(prismaService.feeTier.update).toHaveBeenCalled();
    });
  });
});