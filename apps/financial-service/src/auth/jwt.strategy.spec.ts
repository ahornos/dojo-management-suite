/**
 * @file jwt.strategy.spec.ts
 * @description Unit tests for the financial-service JwtStrategy: secret sourcing and payload mapping.
 */

import { ConfigService } from '@nestjs/config';
import { Role } from '@dms/shared-types';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy (financial-service)', () => {
  /**
   * Builds a strategy from an explicit env map. `JWT_SECRET` is removed from
   * `process.env` unless the map sets it, so host/bootstrap `.env` cannot
   * satisfy the "missing secret" case.
   *
   * @param {Record<string, unknown>} env - Values seeded into `ConfigService`.
   * @returns {JwtStrategy} Constructed strategy.
   */
  const buildStrategy = (env: Record<string, unknown>): JwtStrategy => {
    const previous = process.env.JWT_SECRET;
    if (!('JWT_SECRET' in env)) {
      delete process.env.JWT_SECRET;
    }
    try {
      return new JwtStrategy(new ConfigService(env));
    } finally {
      if (previous === undefined) {
        delete process.env.JWT_SECRET;
      } else {
        process.env.JWT_SECRET = previous;
      }
    }
  };

  it('throws at construction when JWT_SECRET is not configured', () => {
    expect(() => buildStrategy({})).toThrow();
  });

  it('constructs when JWT_SECRET is configured', () => {
    expect(buildStrategy({ JWT_SECRET: 'unit-test-secret' })).toBeInstanceOf(JwtStrategy);
  });

  it('maps the payload keeping the full roles array', () => {
    const strategy = buildStrategy({ JWT_SECRET: 'unit-test-secret' });

    expect(
      strategy.validate({ sub: 'user-1', email: 'a@dojo.com', roles: [Role.INSTRUCTOR, Role.STUDENT] }),
    ).toEqual({ userId: 'user-1', email: 'a@dojo.com', roles: [Role.INSTRUCTOR, Role.STUDENT] });
  });

  it('grants no roles when the token carries no roles array', () => {
    const strategy = buildStrategy({ JWT_SECRET: 'unit-test-secret' });
    const payload = { sub: 'user-1', email: 'a@dojo.com' } as unknown as Parameters<JwtStrategy['validate']>[0];

    expect(strategy.validate(payload).roles).toEqual([]);
  });
});
