import { Test, TestingModule } from '@nestjs/testing';
import { StudentsService } from './students.service';
import { PrismaService } from '../prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { Role } from '@dms/database/client';

/**
 * Unit tests for StudentsService covering data isolation and profile update workflows.
 */
describe('StudentsService', () => {
  let service: StudentsService;
  let prisma: PrismaService;

  const mockPrisma = {
    studentProfile: {
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
    },
    profileUpdateRequest: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<StudentsService>(StudentsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should throw NotFoundException if student profile does not exist', async () => {
      mockPrisma.studentProfile.findUnique.mockResolvedValue(null);

      await expect(
        service.findOne('non-existent-id', { role: Role.SUPER_ADMIN, userId: 'admin-user' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if a student tries to view another profile', async () => {
      mockPrisma.studentProfile.findUnique.mockResolvedValue({
        id: 'student-profile-1',
        userId: 'owner-user-id',
      });

      await expect(
        service.findOne('student-profile-1', { role: Role.STUDENT, userId: 'stranger-user-id' }),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});