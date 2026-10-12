/**
 * @file internal-users.controller.spec.ts
 * @description Unit tests for the internal user directory controller: DTO validation (as enforced by the
 * global ValidationPipe) and delegation to the service. The API key guard is covered by its own spec.
 */

import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '@dms/shared-types';
import { InternalApiKeyGuard } from './guards/internal-api-key.guard';
import { InternalUsersController } from './internal-users.controller';
import { UsersService } from './users.service';
import { ProvisionUserDto } from './dto/provision-user.dto';
import { UserBatchDto, USER_BATCH_MAX_SIZE } from './dto/user-batch.dto';

describe('InternalUsersController', () => {
  let controller: InternalUsersController;
  const usersService = { findManyByIds: jest.fn(), provision: jest.fn(), updatePersonalData: jest.fn() };
  const pipe = new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true });

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [InternalUsersController],
      providers: [
        { provide: UsersService, useValue: usersService },
        { provide: ConfigService, useValue: { getOrThrow: () => 'key' } },
        InternalApiKeyGuard,
      ],
    }).compile();

    controller = module.get(InternalUsersController);
  });

  it('delegates batch lookups to the service', async () => {
    usersService.findManyByIds.mockResolvedValue([{ id: 'u1' }]);

    await expect(controller.batch({ ids: ['u1'] })).resolves.toEqual([{ id: 'u1' }]);
    expect(usersService.findManyByIds).toHaveBeenCalledWith(['u1']);
  });

  it('delegates provisioning to the service', async () => {
    const dto: ProvisionUserDto = { email: 'a@b.co', role: Role.PARENT };
    usersService.provision.mockResolvedValue({ id: 'u1' });

    await controller.provision(dto);

    expect(usersService.provision).toHaveBeenCalledWith(dto);
  });

  it('delegates personal data updates to the service', async () => {
    await controller.updatePersonalData('id-1', { phone: '600' });

    expect(usersService.updatePersonalData).toHaveBeenCalledWith('id-1', { phone: '600' });
  });

  describe('DTO validation', () => {
    it('rejects privileged roles on provisioning', async () => {
      await expect(
        pipe.transform({ email: 'a@b.co', role: 'SUPER_ADMIN' }, { type: 'body', metatype: ProvisionUserDto }),
      ).rejects.toThrow();
    });

    it('rejects unknown properties on provisioning', async () => {
      await expect(
        pipe.transform(
          { email: 'a@b.co', role: 'STUDENT', passwordHash: 'x' },
          { type: 'body', metatype: ProvisionUserDto },
        ),
      ).rejects.toThrow();
    });

    it('accepts a valid provisioning payload', async () => {
      await expect(
        pipe.transform({ email: 'a@b.co', role: 'PARENT' }, { type: 'body', metatype: ProvisionUserDto }),
      ).resolves.toBeInstanceOf(ProvisionUserDto);
    });

    it.each([
      ['non-uuid ids', { ids: ['not-a-uuid'] }],
      ['duplicated ids', { ids: ['11111111-1111-4111-8111-111111111111', '11111111-1111-4111-8111-111111111111'] }],
      ['missing ids', {}],
      [
        'oversized batches',
        {
          ids: Array.from({ length: USER_BATCH_MAX_SIZE + 1 }, (_v, i) => `00000000-0000-4000-8000-${String(i).padStart(12, '0')}`),
        },
      ],
    ])('rejects a batch with %s', async (_label, body) => {
      await expect(pipe.transform(body, { type: 'body', metatype: UserBatchDto })).rejects.toThrow();
    });
  });
});
