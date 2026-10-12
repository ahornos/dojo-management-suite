/**
 * @file create-user.dto.spec.ts
 * @description Validation contract of `CreateUserDto` / `UpdateUserDto` under the production pipe options,
 * including the empty-string tolerance required by the management form.
 */

import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Role } from '@dms/shared-types';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';

/**
 * Validates a payload like the global `ValidationPipe` (whitelist + forbidNonWhitelisted + transform).
 *
 * @param {new () => T} cls - DTO class.
 * @param {Record<string, unknown>} payload - Raw request body.
 * @returns {Promise<{ dto: T; errors: string[] }>} Transformed instance and offending property names.
 */
async function check<T extends object>(cls: new () => T, payload: Record<string, unknown>) {
  const dto = plainToInstance(cls, payload);
  const errors = await validate(dto, { whitelist: true, forbidNonWhitelisted: true });
  return { dto, errors: errors.map((e) => e.property) };
}

describe('CreateUserDto', () => {
  const valid = { email: 'a@dojo.com', firstName: 'A', lastName: 'B' };

  it('accepts the minimal payload', async () => {
    expect((await check(CreateUserDto, valid)).errors).toEqual([]);
  });

  it('accepts the full management-form payload with empty optional inputs', async () => {
    const { dto, errors } = await check(CreateUserDto, {
      ...valid, password: '', dni: '', birthDate: '', phone: '', address: '', city: '', state: '', postalCode: '',
      country: 'ES', roles: [Role.STUDENT, Role.PARENT], isActive: true,
    });

    expect(errors).toEqual([]);
    expect(dto.password).toBeUndefined();
    expect(dto.birthDate).toBeUndefined();
  });

  it.each([
    ['invalid email', { email: 'nope' }, 'email'],
    ['missing first name', { firstName: '' }, 'firstName'],
    ['short password', { password: 'short' }, 'password'],
    ['malformed birth date', { birthDate: '21/05/1990' }, 'birthDate'],
    ['bad country code', { country: 'ESP' }, 'country'],
    ['unknown role', { roles: ['HACKER'] }, 'roles'],
    ['empty roles array', { roles: [] }, 'roles'],
    ['non-boolean isActive', { isActive: 'yes' }, 'isActive'],
    ['unknown property', { passwordHash: 'x' }, 'passwordHash'],
  ])('rejects %s', async (_label, override, property) => {
    expect((await check(CreateUserDto, { ...valid, ...override })).errors).toContain(property);
  });
});

describe('UpdateUserDto', () => {
  // The Jest swagger mock's PartialType keeps the required validators, so the base fields are supplied.
  const base = { email: 'a@dojo.com', firstName: 'A', lastName: 'B' };

  it('keeps the validators of the create DTO', async () => {
    expect((await check(UpdateUserDto, { ...base, roles: ['HACKER'] })).errors).toContain('roles');
  });

  it('accepts a partial payload', async () => {
    expect((await check(UpdateUserDto, { ...base, isActive: false })).errors).toEqual([]);
  });
});
