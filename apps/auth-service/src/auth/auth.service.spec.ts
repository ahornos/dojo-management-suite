/**
 * @file auth.service.spec.ts
 * @description Unit test suite for AuthService, covering user registration, 
 * authentication login, listing, updating, and administrative deletion.
 * Updated to reflect the Role[] array schema modifications.
 */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Role } from '@dms/shared-types';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

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
        roles: [Role.STUDENT],
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue({
        id: 'uuid-123',
        email: dto.email,
        passwordHash: 'hashed-password',
        firstName: dto.firstName,
        lastName: dto.lastName,
        roles: [Role.STUDENT],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.register(dto as any);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { email: dto.email } });
      expect(prismaService.user.create).toHaveBeenCalled();
      expect(result).toHaveProperty('message', 'Usuario registrado exitosamente');
      expect(result.user).not.toHaveProperty('passwordHash');
    });

    it('should always persist [Role.STUDENT] even if the payload smuggles elevated roles', async () => {
      const dto = {
        email: 'attacker@dojo.com',
        password: 'securePassword123',
        firstName: 'Eve',
        lastName: 'Mallory',
        roles: [Role.SUPER_ADMIN],
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue({ id: 'uuid-evil', ...dto, passwordHash: 'h', roles: [Role.STUDENT] });

      await service.register(dto as any);

      const createArgs = mockPrismaService.user.create.mock.calls[0][0];
      expect(createArgs.data.roles).toEqual([Role.STUDENT]);
    });

    it('should throw BadRequestException if email already exists', async () => {
      const dto = {
        email: 'existing@dojo.com',
        password: 'securePassword123',
        firstName: 'John',
        lastName: 'Doe',
        roles: [Role.STUDENT], 
      };

      mockPrismaService.user.findUnique.mockResolvedValue({ id: 'uuid-existing' });

      await expect(service.register(dto as any)).rejects.toThrow(BadRequestException);
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
        roles: [Role.STUDENT],
      });

      const result = await service.login(dto);

      expect(result).toHaveProperty('access_token', 'mocked-jwt-token');
      expect(result.user).toHaveProperty('email', dto.email);
      expect(result.user.roles).toContain(Role.STUDENT);
    });

    it('should throw UnauthorizedException on invalid email', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      await expect(service.login({ email: 'wrong@dojo.com', password: '123' })).rejects.toThrow(UnauthorizedException);
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
          roles: [Role.INSTRUCTOR],
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

  describe('login (invalid password)', () => {
    it('should throw UnauthorizedException when the password does not match', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'uuid-1', email: 'a@dojo.com', passwordHash: await bcrypt.hash('right-password', 4), roles: [Role.STUDENT],
      });

      await expect(service.login({ email: 'a@dojo.com', password: 'wrong-password' })).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('createUser', () => {
    const dto: CreateUserDto = {
      email: 'new@dojo.com',
      firstName: 'New',
      lastName: 'User',
      dni: '12345678Z',
      birthDate: '1990-05-21',
      roles: [Role.INSTRUCTOR],
      password: 'SecurePassword123!',
    };

    it('creates the user hashing the password and normalising optional fields', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockImplementation(async ({ data }) => ({ id: 'uuid-new', ...data }));

      const result = await service.createUser(dto);

      const data = mockPrismaService.user.create.mock.calls[0][0].data;
      expect(await bcrypt.compare('SecurePassword123!', data.passwordHash)).toBe(true);
      expect(data).toMatchObject({
        email: 'new@dojo.com', roles: [Role.INSTRUCTOR], isActive: true, country: 'ES',
        phone: null, address: null, birthDate: new Date('1990-05-21'),
      });
      expect(result.user).not.toHaveProperty('passwordHash');
    });

    it('falls back to the STUDENT role and a temporary password when omitted', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockImplementation(async ({ data }) => ({ id: 'uuid-new', ...data }));

      await service.createUser({ email: 'x@dojo.com', firstName: 'X', lastName: 'Y' });

      const data = mockPrismaService.user.create.mock.calls[0][0].data;
      expect(data.roles).toEqual([Role.STUDENT]);
      expect(data.dni).toBeNull();
      expect(data.birthDate).toBeNull();
      expect(data.passwordHash).toEqual(expect.any(String));
    });

    it('rejects a duplicated email', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce({ id: 'other' });

      await expect(service.createUser(dto)).rejects.toThrow(BadRequestException);
      expect(mockPrismaService.user.create).not.toHaveBeenCalled();
    });

    it('rejects a duplicated DNI', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce(null).mockResolvedValueOnce({ id: 'other' });

      await expect(service.createUser(dto)).rejects.toThrow(BadRequestException);
      expect(mockPrismaService.user.create).not.toHaveBeenCalled();
    });
  });

  describe('updateUser', () => {
    it('updates personal data, roles and re-hashes a provided password', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: 'u1' });
      mockPrismaService.user.update.mockImplementation(async ({ data }) => ({ id: 'u1', ...data }));

      const result = await service.updateUser('u1', {
        firstName: 'Ann', roles: [Role.ADMIN_STAFF], password: 'NewPassword123!', birthDate: '1991-01-02', isActive: false,
      });

      const data = mockPrismaService.user.update.mock.calls[0][0].data;
      expect(data).toMatchObject({ firstName: 'Ann', roles: [Role.ADMIN_STAFF], isActive: false, birthDate: new Date('1991-01-02') });
      expect(await bcrypt.compare('NewPassword123!', data.passwordHash)).toBe(true);
      expect(result.user).not.toHaveProperty('passwordHash');
    });

    it('does not touch roles or password when they are not provided', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: 'u1' });
      mockPrismaService.user.update.mockImplementation(async ({ data }) => ({ id: 'u1', ...data }));

      await service.updateUser('u1', { firstName: 'Ann' });

      const data = mockPrismaService.user.update.mock.calls[0][0].data;
      expect(data).not.toHaveProperty('roles');
      expect(data).not.toHaveProperty('passwordHash');
      expect(data.birthDate).toBeUndefined();
    });

    it('throws NotFoundException for an unknown user', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.updateUser('missing', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeUser', () => {
    it('deletes an existing user', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: 'u1' });

      await service.removeUser('u1');

      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({ where: { id: 'u1' } });
    });

    it('throws NotFoundException for an unknown user', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.removeUser('missing')).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.user.delete).not.toHaveBeenCalled();
    });
  });
});
