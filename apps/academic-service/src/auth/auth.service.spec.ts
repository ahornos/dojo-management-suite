import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException } from '@nestjs/common';
import { Role } from '@dms/database/client';

/**
 * Mock @nestjs/jwt to prevent Jest from evaluating ESM import syntax inside node_modules.
 */
jest.mock('@nestjs/jwt', () => ({
  JwtService: jest.fn().mockImplementation(() => ({
    sign: jest.fn().mockReturnValue('mock-jwt-token'),
  })),
}));

/**
 * Unit tests for AuthService handling user registration and JWT authentication.
 */
describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-jwt-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should throw ConflictException if the email is already registered', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: '1', email: 'test@dojo.com' });

      await expect(
        service.register({ email: 'test@dojo.com', password: 'password123', firstName: 'John', lastName: 'Doe' }),
      ).rejects.toThrow(ConflictException);
    });

    it('should successfully register a new user with STUDENT role', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({
        id: '1',
        email: 'new@dojo.com',
        passwordHash: 'hashedpassword',
        firstName: 'John',
        lastName: 'Doe',
        role: Role.STUDENT,
      });

      const result = await service.register({
        email: 'new@dojo.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      });

      expect(result).toEqual({
        id: '1',
        email: 'new@dojo.com',
        firstName: 'John',
        lastName: 'Doe',
        role: Role.STUDENT,
      });
    });
  });
});