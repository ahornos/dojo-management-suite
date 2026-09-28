import { Test, TestingModule } from '@nestjs/testing';
import { StudentsService } from './students.service';
import { PrismaService } from '../prisma.service';

describe('StudentsService', () => {
  let service: StudentsService;
  let prisma: PrismaService;

  // Mock Prisma Service to isolate unit tests from real database operations
  const mockPrismaService = {
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
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

  // Test suite initialization check
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a student and their profile', async () => {
      const dto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+34600000000',
        disciplineId: 'disc-uuid-1',
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
        },
      };

      // Mock database response for user creation
      mockPrismaService.user.create.mockResolvedValue(mockCreatedUser);

      const result = await service.create(dto);

      // Verify Prisma client method interactions and expected output
      expect(prisma.user.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockCreatedUser);
    });
  });

  describe('findAll', () => {
    it('should return an array of students', async () => {
      const mockStudents = [
        { id: 'user-1', email: 'student1@example.com', role: 'STUDENT' },
      ];

      // Mock database query for filtering users by student role
      mockPrismaService.user.findMany.mockResolvedValue(mockStudents);

      const result = await service.findAll();

      // Verify that the query filters by role and includes relations
      expect(prisma.user.findMany).toHaveBeenCalledWith({
        where: { role: 'STUDENT' },
        include: expect.any(Object),
      });
      expect(result).toEqual(mockStudents);
    });
  });
});