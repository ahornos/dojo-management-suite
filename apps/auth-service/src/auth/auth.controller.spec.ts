/**
 * @file auth.controller.spec.ts
 * @description Unit tests verifying the access-control metadata of AuthController:
 * the `/auth/users` CRUD endpoints must be guarded, while login/register stay public.
 */

import 'reflect-metadata';
import { GUARDS_METADATA } from '@nestjs/common/constants';
import { Role } from '@dms/shared-types';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard, RolesGuard, ROLES_KEY } from '@dms/shared-auth';

describe('AuthController access control', () => {
  const proto = AuthController.prototype;
  const protectedHandlers = ['createUser', 'findAllUsers', 'updateUser', 'removeUser'] as const;
  const publicHandlers = ['register', 'login'] as const;

  it.each(protectedHandlers)('%s is guarded by JwtAuthGuard and RolesGuard', (handler) => {
    expect(Reflect.getMetadata(GUARDS_METADATA, proto[handler])).toEqual([JwtAuthGuard, RolesGuard]);
  });

  it.each(protectedHandlers)('%s is restricted to SUPER_ADMIN and ADMIN_STAFF', (handler) => {
    expect(Reflect.getMetadata(ROLES_KEY, proto[handler])).toEqual([Role.SUPER_ADMIN, Role.ADMIN_STAFF]);
  });

  it.each(publicHandlers)('%s stays public (no guards)', (handler) => {
    expect(Reflect.getMetadata(GUARDS_METADATA, proto[handler])).toBeUndefined();
  });

  it('delegates register to the service with the validated DTO only', async () => {
    const authService = { register: jest.fn().mockResolvedValue({ message: 'ok' }) };
    const controller = new AuthController(authService as unknown as AuthService);
    const dto = { email: 'a@dojo.com', password: 'SecurePassword123!', firstName: 'A', lastName: 'B' };

    await controller.register(dto);

    expect(authService.register).toHaveBeenCalledWith(dto);
  });

  describe('administrative user endpoints delegate to the service', () => {
    const authService = {
      createUser: jest.fn().mockResolvedValue({ message: 'created' }),
      findAllUsers: jest.fn().mockResolvedValue([]),
      updateUser: jest.fn().mockResolvedValue({ message: 'updated' }),
      removeUser: jest.fn().mockResolvedValue({ message: 'removed' }),
      login: jest.fn().mockResolvedValue({ access_token: 't' }),
    };
    const controller = new AuthController(authService as unknown as AuthService);

    beforeEach(() => jest.clearAllMocks());

    it('createUser forwards the DTO', async () => {
      const dto = { email: 'a@dojo.com', firstName: 'A', lastName: 'B' };
      await controller.createUser(dto);
      expect(authService.createUser).toHaveBeenCalledWith(dto);
    });

    it('findAllUsers lists users', async () => {
      await expect(controller.findAllUsers()).resolves.toEqual([]);
    });

    it('updateUser forwards id and DTO', async () => {
      await controller.updateUser('u1', { firstName: 'A' });
      expect(authService.updateUser).toHaveBeenCalledWith('u1', { firstName: 'A' });
    });

    it('removeUser forwards the id', async () => {
      await controller.removeUser('u1');
      expect(authService.removeUser).toHaveBeenCalledWith('u1');
    });

    it('login forwards the credentials', async () => {
      const dto = { email: 'a@dojo.com', password: 'x' };
      await controller.login(dto);
      expect(authService.login).toHaveBeenCalledWith(dto);
    });
  });
});
