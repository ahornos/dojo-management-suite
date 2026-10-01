import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Role } from '@dms/shared-types';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mocked-jwt-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should successfully register a new user and return user info excluding passwordHash', async () => {
      const dto = {
        email: 'test@dojo.com',
        password: 'securePassword123',
        firstName: 'John',
        lastName: 'Doe',
        role: Role.STUDENT,
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue({
        id: 'uuid-123',
        email: dto.email,
        passwordHash: 'hashed-password',
        firstName: dto.firstName,
        lastName: dto.lastName,
        role: Role.STUDENT,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.register(dto);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { email: dto.email } });
      expect(prismaService.user.create).toHaveBeenCalled();
      expect(result).toHaveProperty('message', 'Usuario registrado exitosamente');
      expect(result.user).not.toHaveProperty('passwordHash');
    });
  });

  describe('login', () => {
    it('should return an access token and user metadata on valid credentials', async () => {
      const dto = { email: 'test@dojo.com', password: 'securePassword123' };
      const hashedPassword = await bcrypt.hash(dto.password, 10);

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'uuid-123',
        email: dto.email,
        passwordHash: hashedPassword,
        firstName: 'John',
        lastName: 'Doe',
        role: Role.STUDENT,
      });

      const result = await service.login(dto);

      expect(result).toHaveProperty('access_token', 'mocked-jwt-token');
      expect(result.user).toHaveProperty('email', dto.email);
      expect(result.user.role).toBe(Role.STUDENT);
    });
  });
});