import { Test, TestingModule } from '@nestjs/testing';
import { StudentsService } from './students.service';
import { PrismaService } from '../prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('StudentsService', () => {
  let service: StudentsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    discipline: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentsService,
        { provide: PrismaService, useValue: mockPrismaService },
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

  describe('create', () => {
    it('should successfully create a student, their profile, and optional guardian', async () => {
      const dto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+34600000000',
        birthDate: '2012-05-15T00:00:00.000Z',
        guardian: {
          dni: '12345678X',
          firstName: 'Jane',
          lastName: 'Doe',
          phone: '+34600111222',
          email: 'parent@example.com',
          relation: 'Mother',
        },
      };

      const mockCreatedUser = {
        id: 'user-uuid-1',
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        role: 'STUDENT',
        studentProfile: {
          id: 'profile-uuid-1',
          phone: dto.phone,
          birthDate: new Date(dto.birthDate),
          guardians: [
            {
              relation: 'Mother',
              guardian: {
                dni: '12345678X',
                firstName: 'Jane',
                lastName: 'Doe',
              },
            },
          ],
        },
      };

      mockPrismaService.user.create.mockResolvedValue(mockCreatedUser);

      const result = await service.create(dto);

      expect(prisma.user.create).toHaveBeenCalledTimes(1);
      expect(prisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            studentProfile: expect.objectContaining({
              create: expect.objectContaining({
                guardians: expect.any(Object),
              }),
            }),
          }),
        }),
      );
      expect(result).toEqual(mockCreatedUser);
    });
  });

  describe('findAll', () => {
    it('should return an array of students', async () => {
      const mockStudents = [
        { id: 'user-1', email: 'student1@example.com', role: 'STUDENT' },
      ];

      mockPrismaService.user.findMany.mockResolvedValue(mockStudents);

      const result = await service.findAll();

      expect(prisma.user.findMany).toHaveBeenCalledWith({
        where: { role: 'STUDENT' },
        include: expect.any(Object),
      });
      expect(result).toEqual(mockStudents);
    });
  });

  describe('update', () => {
    it('should successfully update an existing student', async () => {
      const studentId = 'user-uuid-1';
      const dto = { firstName: 'Jonathan' };

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: studentId,
        role: 'STUDENT',
      });

      const mockUpdatedUser = { id: studentId, firstName: 'Jonathan', role: 'STUDENT' };
      mockPrismaService.user.update.mockResolvedValue(mockUpdatedUser);

      const result = await service.update(studentId, dto);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: studentId },
        include: { studentProfile: true },
      });
      expect(prisma.user.update).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockUpdatedUser);
    });

    it('should throw NotFoundException if student to update does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.update('non-existent', { firstName: 'Test' })).rejects.toThrow(
        NotFoundException,
      );
      expect(prisma.user.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should successfully delete an existing student', async () => {
      const studentId = 'user-uuid-1';

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: studentId,
        role: 'STUDENT',
      });

      mockPrismaService.user.delete.mockResolvedValue({ id: studentId });

      const result = await service.remove(studentId);

      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { id: studentId },
      });
      expect(result).toEqual({ id: studentId });
    });

    it('should throw NotFoundException if student to delete does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.remove('non-existent')).rejects.toThrow(NotFoundException);
      expect(prisma.user.delete).not.toHaveBeenCalled();
    });
  });
});