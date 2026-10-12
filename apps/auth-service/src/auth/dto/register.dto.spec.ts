/**
 * @file register.dto.spec.ts
 * @description Unit tests guaranteeing that public registration can never carry a `roles` property.
 * Validation options mirror the global `ValidationPipe` configured in `main.ts`.
 */

import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { RegisterDto } from './register.dto';

describe('RegisterDto', () => {
  const validPayload = {
    email: 'student@dojo.com',
    password: 'SecurePassword123!',
    firstName: 'John',
    lastName: 'Doe',
  };

  /**
   * Validates a plain payload using the production pipe options.
   *
   * @param {Record<string, unknown>} payload - Raw request body.
   * @returns {Promise<ValidationError[]>} Validation errors, empty when the payload is accepted.
   */
  const validatePayload = (payload: Record<string, unknown>): Promise<ValidationError[]> =>
    validate(plainToInstance(RegisterDto, payload), {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

  it('accepts a payload without roles', async () => {
    await expect(validatePayload(validPayload)).resolves.toHaveLength(0);
  });

  it('rejects a payload carrying roles: ["SUPER_ADMIN"]', async () => {
    const errors = await validatePayload({ ...validPayload, roles: ['SUPER_ADMIN'] });

    expect(errors).toHaveLength(1);
    expect(errors[0].property).toBe('roles');
    expect(errors[0].constraints).toHaveProperty('whitelistValidation');
  });

  it('rejects an empty roles array as well', async () => {
    const errors = await validatePayload({ ...validPayload, roles: [] });

    expect(errors.map((e) => e.property)).toContain('roles');
  });

  it('does not declare a roles property on the DTO', () => {
    expect(Object.keys(plainToInstance(RegisterDto, validPayload))).not.toContain('roles');
  });

  it('rejects a weak password and an invalid email', async () => {
    const errors = await validatePayload({ ...validPayload, email: 'not-an-email', password: 'short' });

    expect(errors.map((e) => e.property).sort()).toEqual(['email', 'password']);
  });
});
