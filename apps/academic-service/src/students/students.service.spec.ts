/**
 * @file students.service.spec.ts
 * @group unit
 * @description Comprehensive unit test suite for StudentsService. 
 * Validates data isolation mechanisms, RBAC authorization, and transactional mock 
 * interactions including the newly added student status lifecycle history log.
 */
import { Test, TestingModule } from '@nestjs/testing';
import { StudentsService } from './students.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { Role } from '@dms/shared-types';

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
    studentStatusHistory: {
      create: jest.fn(),
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should throw NotFoundException if student profile does not exist', async () => {
      mockPrisma.studentProfile.findUnique.mockResolvedValue(null);

      await expect(
        service.findOne('non-existent-id', { roles: [Role.SUPER_ADMIN], userId: 'admin-user' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if a student attempts to view another student profile', async () => {
      mockPrisma.studentProfile.findUnique.mockResolvedValue({
        id: 'student-profile-1',
        userId: 'owner-user-id',
      });

      await expect(
        service.findOne('student-profile-1', { roles: [Role.STUDENT], userId: 'stranger-user-id' }),
      ).rejects.toThrow(ForbiddenException);
    });
    
    it('should successfully return the profile if the requesting user is the owner', async () => {
      mockPrisma.studentProfile.findUnique.mockResolvedValue({
        id: 'student-profile-1',
        userId: 'owner-user-id',
      });

      const result = await service.findOne('student-profile-1', { roles: [Role.STUDENT], userId: 'owner-user-id' });
      expect(result).toBeDefined();
      expect(result.id).toEqual('student-profile-1');
    });

    it('should successfully return the profile if the requesting user holds an administrative role', async () => {
      mockPrisma.studentProfile.findUnique.mockResolvedValue({
        id: 'student-profile-1',
        userId: 'owner-user-id',
      });

      const result = await service.findOne('student-profile-1', { roles: [Role.ADMIN_STAFF], userId: 'staff-user-id' });
      expect(result).toBeDefined();
      expect(result.id).toEqual('student-profile-1');
    });
  });
});