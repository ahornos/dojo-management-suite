import { Test, TestingModule } from '@nestjs/testing';
import { GraduationsService } from './graduations.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { AuthenticatedUser, Role } from '@dms/shared-types';

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
  describe('graduateOrPropose (role-based workflow)', () => {
    const dto = { proposedBeltId: 'belt-2' };

    /**
     * Builds an authenticated user holding the given roles.
     *
     * @param {Role[]} roles - Roles carried by the JWT.
     * @returns {AuthenticatedUser} Request user.
     */
    const userWith = (roles: Role[]): AuthenticatedUser => ({ userId: 'user-1', email: 'u@dojo.com', roles });

    let proposeSpy: jest.SpyInstance;
    let executeSpy: jest.SpyInstance;

    beforeEach(() => {
      proposeSpy = jest.spyOn(service, 'proposeGraduation').mockResolvedValue({ status: 'PENDING' } as never);
      executeSpy = jest.spyOn(service, 'executeGraduation').mockResolvedValue({ status: 'EXECUTED' } as never);
    });

    afterEach(() => {
      proposeSpy.mockRestore();
      executeSpy.mockRestore();
    });

    it('proposes (does not execute) for a user with roles [INSTRUCTOR, STUDENT]', async () => {
      await expect(service.graduateOrPropose('student-1', userWith([Role.INSTRUCTOR, Role.STUDENT]), dto)).resolves.toEqual({
        status: 'PENDING',
      });

      expect(proposeSpy).toHaveBeenCalledWith('student-1', 'user-1', dto);
      expect(executeSpy).not.toHaveBeenCalled();
    });

    it.each([Role.SUPER_ADMIN, Role.ADMIN_STAFF, Role.SPORTS_TECHNICAL_DIRECTOR])('executes directly for %s', async (role) => {
      await expect(service.graduateOrPropose('student-1', userWith([role]), dto)).resolves.toEqual({ status: 'EXECUTED' });

      expect(executeSpy).toHaveBeenCalledWith('student-1');
      expect(proposeSpy).not.toHaveBeenCalled();
    });

    it('executes directly when INSTRUCTOR is combined with an executor role', async () => {
      await service.graduateOrPropose('student-1', userWith([Role.INSTRUCTOR, Role.ADMIN_STAFF]), dto);

      expect(executeSpy).toHaveBeenCalledWith('student-1');
      expect(proposeSpy).not.toHaveBeenCalled();
    });
  });
});