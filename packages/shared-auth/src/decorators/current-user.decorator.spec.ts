/**
 * @file current-user.decorator.spec.ts
 * @description Unit tests for the `@CurrentUser()` resolver.
 */

import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Role } from '@dms/shared-types';
import { MISSING_AUTHENTICATED_USER, resolveCurrentUser } from './current-user.decorator';

describe('resolveCurrentUser', () => {
  const user = { userId: 'user-1', email: 'a@dojo.com', roles: [Role.INSTRUCTOR] };

  /**
   * Builds a minimal ExecutionContext exposing the given `req.user`.
   *
   * @param {unknown} requestUser - Value injected as `request.user`.
   * @returns {ExecutionContext} Mocked execution context.
   */
  const buildContext = (requestUser?: unknown): ExecutionContext =>
    ({ switchToHttp: () => ({ getRequest: () => ({ user: requestUser }) }) }) as unknown as ExecutionContext;

  it('returns the whole authenticated user by default', () => {
    expect(resolveCurrentUser(undefined, buildContext(user))).toBe(user);
  });

  it.each([
    ['userId', 'user-1'],
    ['email', 'a@dojo.com'],
    ['roles', [Role.INSTRUCTOR]],
  ] as const)('returns only the %s property when requested', (property, expected) => {
    expect(resolveCurrentUser(property, buildContext(user))).toEqual(expected);
  });

  it('fails loudly when the route is not protected by JwtAuthGuard', () => {
    expect(() => resolveCurrentUser(undefined, buildContext())).toThrow(UnauthorizedException);
    expect(() => resolveCurrentUser('userId', buildContext())).toThrow(MISSING_AUTHENTICATED_USER);
  });
});
