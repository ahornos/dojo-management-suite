import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Role } from '@dms/shared-types';
import * as bcrypt from 'bcrypt';

/**
 * @file auth.service.spec.ts
 * @description Unit test suite for AuthService, covering user registration, 
 * authentication login, listing, updating, and administrative deletion.
 */
describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
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

    it('should throw BadRequestException if email already exists', async () => {
      const dto = {
        email: 'existing@dojo.com',
        password: 'securePassword123',
        firstName: 'John',
        lastName: 'Doe',
        role: Role.STUDENT, 
      };

      mockPrismaService.user.findUnique.mockResolvedValue({ id: 'uuid-existing' });

      await expect(service.register(dto)).rejects.toThrow(BadRequestException);
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

    it('should throw UnauthorizedException on invalid email', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.login({ email: 'wrong@dojo.com', password: '123' })).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException on invalid password', async () => {
      const hashedPassword = await bcrypt.hash('correctPassword', 10);
      mockPrismaService.user.findUnique.mockResolvedValue({
        email: 'test@dojo.com',
        passwordHash: hashedPassword,
      });

      await expect(service.login({ email: 'test@dojo.com', password: 'wrongPassword' })).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('findAllUsers', () => {
    it('should return an array of users excluding passwordHash', async () => {
      const mockUsers = [
        {
          id: 'uuid-1',
          email: 'user1@dojo.com',
          passwordHash: 'hash1',
          firstName: 'Alice',
          lastName: 'Smith',
          role: Role.INSTRUCTOR,
        },
      ];

      mockPrismaService.user.findMany.mockResolvedValue(mockUsers);

      const result = await service.findAllUsers();

      expect(prismaService.user.findMany).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0]).not.toHaveProperty('passwordHash');
      expect(result[0]).toHaveProperty('email', 'user1@dojo.com');
    });
  });

  describe('updateUser', () => {
    it('should successfully update a user and return the updated profile without passwordHash', async () => {
      const userId = 'uuid-123';
      const dto = { firstName: 'Jonathan' };

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: userId,
        email: 'test@dojo.com',
        passwordHash: 'hash',
        firstName: 'John',
        lastName: 'Doe',
      });

      mockPrismaService.user.update.mockResolvedValue({
        id: userId,
        email: 'test@dojo.com',
        passwordHash: 'hash',
        firstName: 'Jonathan',
        lastName: 'Doe',
      });

      const result = await service.updateUser(userId, dto);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { id: userId } });
      expect(prismaService.user.update).toHaveBeenCalled();
      expect(result).toHaveProperty('message', 'Usuario actualizado exitosamente');
      expect(result.user).toHaveProperty('firstName', 'Jonathan');
      expect(result.user).not.toHaveProperty('passwordHash');
    });

    it('should throw NotFoundException if user to update is not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.updateUser('non-existent', { firstName: 'Test' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('removeUser', () => {
    it('should successfully delete a user', async () => {
      const userId = 'uuid-123';

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: userId,
        email: 'test@dojo.com',
      });

      mockPrismaService.user.delete.mockResolvedValue({});

      const result = await service.removeUser(userId);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { id: userId } });
      expect(prismaService.user.delete).toHaveBeenCalledWith({ where: { id: userId } });
      expect(result).toHaveProperty('message', 'Usuario eliminado exitosamente');
    });

    it('should throw NotFoundException if user to delete is not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.removeUser('non-existent')).rejects.toThrow(NotFoundException);
    });
  });
});