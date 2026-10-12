/**
 * @file users.service.spec.ts
 * @description Unit tests for the internal user directory service (Prisma mocked).
 */

import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Prisma } from '@dms/database/client';
import { Role } from '@dms/shared-types';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from './users.service';

jest.mock('bcrypt', () => ({ hash: jest.fn() }));

/**
 * Builds a persisted-user fixture.
 *
 * @param {Record<string, unknown>} overrides - Fields to override.
 * @returns {Record<string, unknown>} User record.
 */
const buildUser = (overrides: Record<string, unknown> = {}): Record<string, unknown> => ({
  id: '11111111-1111-4111-8111-111111111111',
  email: 'ana@dojo.test',
  passwordHash: 'secret-hash',
  firstName: 'Ana',
  lastName: 'Gómez',
  dni: null,
  birthDate: new Date('2010-05-01T00:00:00.000Z'),
  phone: null,
  address: null,
  city: null,
  state: null,
  postalCode: null,
  country: 'ES',
  isActive: true,
  roles: [Role.STUDENT],
  ...overrides,
});

describe('UsersService', () => {
  let service: UsersService;
  const prisma = {
    user: { findMany: jest.fn(), findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-random-password');

    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get(UsersService);
  });

  describe('findManyByIds', () => {
    it('issues a single query and never leaks credentials', async () => {
      prisma.user.findMany.mockResolvedValue([buildUser()]);

      const result = await service.findManyByIds(['11111111-1111-4111-8111-111111111111']);

      expect(prisma.user.findMany).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(1);
      expect(result[0]).not.toHaveProperty('passwordHash');
      expect(result[0].birthDate).toBe('2010-05-01T00:00:00.000Z');
    });

    it('short-circuits without touching the database for an empty list', async () => {
      await expect(service.findManyByIds([])).resolves.toEqual([]);
      expect(prisma.user.findMany).not.toHaveBeenCalled();
    });
  });

  describe('provision', () => {
    it('creates a user with a random hashed password when the email is unknown', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue(buildUser());

      await service.provision({ email: 'ana@dojo.test', firstName: 'Ana', lastName: 'Gómez', role: Role.STUDENT });

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: 'ana@dojo.test',
          passwordHash: 'hashed-random-password',
          roles: [Role.STUDENT],
          country: 'ES',
        }),
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(expect.stringMatching(/^[0-9a-f]{24}$/), 10);
    });

    it('rejects creation when mandatory identity data is missing', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.provision({ email: 'ana@dojo.test', role: Role.STUDENT })).rejects.toThrow(
        BadRequestException,
      );
      expect(prisma.user.create).not.toHaveBeenCalled();
    });

    it('adds the role to an existing user without duplicating it and preserves data on empty strings', async () => {
      prisma.user.findUnique.mockResolvedValue(buildUser({ roles: [Role.PARENT] }));
      prisma.user.update.mockResolvedValue(buildUser({ roles: [Role.PARENT, Role.STUDENT] }));

      await service.provision({ email: 'ana@dojo.test', role: Role.STUDENT, phone: '', city: 'Madrid' });

      const { data } = prisma.user.update.mock.calls[0][0];
      expect(data.roles).toEqual([Role.PARENT, Role.STUDENT]);
      expect(data.city).toBe('Madrid');
      expect(data).not.toHaveProperty('phone');
      expect(prisma.user.create).not.toHaveBeenCalled();
    });

    it('is idempotent regarding roles already granted', async () => {
      prisma.user.findUnique.mockResolvedValue(buildUser());
      prisma.user.update.mockResolvedValue(buildUser());

      await service.provision({ email: 'ana@dojo.test', role: Role.STUDENT });

      expect(prisma.user.update.mock.calls[0][0].data.roles).toEqual([Role.STUDENT]);
    });

    it('throws NotFoundException when an explicit userId does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.provision({ userId: '22222222-2222-4222-8222-222222222222', role: Role.STUDENT }),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws ConflictException when the DNI belongs to another user', async () => {
      prisma.user.findUnique
        .mockResolvedValueOnce(buildUser())
        .mockResolvedValueOnce(buildUser({ id: 'another-user' }));

      await expect(service.provision({ email: 'ana@dojo.test', dni: '12345678Z', role: Role.STUDENT })).rejects.toThrow(
        ConflictException,
      );
      expect(prisma.user.update).not.toHaveBeenCalled();
    });

    it('maps a unique-constraint race to ConflictException', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('Unique constraint failed', { code: 'P2002', clientVersion: 'test' }),
      );

      await expect(
        service.provision({ email: 'ana@dojo.test', firstName: 'Ana', lastName: 'Gómez', role: Role.STUDENT }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('updatePersonalData', () => {
    it('applies only the provided fields and converts birthDate to a Date', async () => {
      prisma.user.findUnique.mockResolvedValue(buildUser());
      prisma.user.update.mockResolvedValue(buildUser({ phone: '600' }));

      await service.updatePersonalData('11111111-1111-4111-8111-111111111111', {
        phone: '600',
        birthDate: '2011-01-02',
      });

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: '11111111-1111-4111-8111-111111111111' },
        data: { phone: '600', birthDate: new Date('2011-01-02') },
      });
    });

    it('throws NotFoundException for an unknown user', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.updatePersonalData('missing', { phone: '600' })).rejects.toThrow(NotFoundException);
      expect(prisma.user.update).not.toHaveBeenCalled();
    });
  });
});
