/**
 * @file env.validation.spec.ts
 * @description Unit tests for the fail-fast environment validation of the academic-service.
 */

import { validateEnv } from './env.validation';

describe('validateEnv (academic-service)', () => {
  const validConfig = (): Record<string, unknown> => ({
    JWT_SECRET: 'a-real-secret',
    AUTH_SERVICE_URL: 'http://auth-service:3000',
    INTERNAL_API_KEY: 'internal-key',
    OTHER: 'value',
  });

  it('returns the config untouched when every required variable is present', () => {
    const config = validConfig();

    expect(validateEnv(config)).toBe(config);
  });

  it.each(['JWT_SECRET', 'AUTH_SERVICE_URL', 'INTERNAL_API_KEY'])('throws a fatal error when %s is missing', (name) => {
    const config = validConfig();
    delete config[name];

    expect(() => validateEnv(config)).toThrow(new RegExp(name));
  });

  it.each([
    ['empty', ''],
    ['blank', '   '],
    ['non-string', 12345],
  ])('throws a fatal error when JWT_SECRET is %s', (_label, value) => {
    expect(() => validateEnv({ ...validConfig(), JWT_SECRET: value })).toThrow(/JWT_SECRET/);
  });
});
