/**
 * @file jwt-auth.guard.spec.ts
 * @description Unit tests for the shared JwtAuthGuard.handleRequest: unauthenticated requests must be rejected.
 */

import { UnauthorizedException } from '@nestjs/common';
import { Role } from '@dms/shared-types';
import { INVALID_OR_MISSING_TOKEN, JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard (shared)', () => {
  const guard = new JwtAuthGuard();
  const user = { userId: 'user-1', email: 'a@dojo.com', roles: [Role.ADMIN_STAFF] };

  it('returns the authenticated user when Passport succeeds', () => {
    expect(guard.handleRequest(null, user)).toBe(user);
  });

  it.each([false, null] as const)('throws UnauthorizedException when no user is resolved (%s)', (noUser) => {
    expect(() => guard.handleRequest(null, noUser)).toThrow(UnauthorizedException);
    expect(() => guard.handleRequest(null, noUser)).toThrow(INVALID_OR_MISSING_TOKEN);
  });

  it('rethrows the underlying Passport error', () => {
    const failure = new UnauthorizedException('jwt expired');

    expect(() => guard.handleRequest(failure, false)).toThrow(failure);
  });

  it('maps a non-Error failure to UnauthorizedException', () => {
    expect(() => guard.handleRequest('boom', false)).toThrow(UnauthorizedException);
  });
});
