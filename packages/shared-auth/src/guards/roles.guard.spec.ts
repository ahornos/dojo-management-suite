/**
 * @file roles.guard.spec.ts
 * @description Unit tests for the shared RolesGuard, verifying multi-role (array) RBAC.
 */

import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@dms/shared-types';
import { INSUFFICIENT_ROLE, RolesGuard, USER_NOT_AUTHENTICATED } from './roles.guard';

describe('RolesGuard (shared)', () => {
  let guard: RolesGuard;
  let reflector: jest.Mocked<Pick<Reflector, 'getAllAndOverride'>>;

  /**
   * Builds a minimal ExecutionContext exposing the given `req.user`.
   *
   * @param {unknown} user - Value injected as `request.user`.
   * @returns {ExecutionContext} Mocked execution context.
   */
  const buildContext = (user?: unknown): ExecutionContext =>
    ({
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: () => ({ getRequest: () => ({ user }) }),
    }) as unknown as ExecutionContext;

  beforeEach(() => {
    reflector = { getAllAndOverride: jest.fn() };
    guard = new RolesGuard(reflector as unknown as Reflector);
  });

  it.each([undefined, []])('allows access when the route declares no roles (%j)', (declared) => {
    reflector.getAllAndOverride.mockReturnValue(declared);

    expect(guard.canActivate(buildContext())).toBe(true);
  });

  it('allows a user with roles [INSTRUCTOR, STUDENT] on a route requiring INSTRUCTOR', () => {
    reflector.getAllAndOverride.mockReturnValue([Role.INSTRUCTOR]);

    expect(guard.canActivate(buildContext({ roles: [Role.INSTRUCTOR, Role.STUDENT] }))).toBe(true);
  });

  it('allows a user when only one of several required roles matches', () => {
    reflector.getAllAndOverride.mockReturnValue([Role.SUPER_ADMIN, Role.INSTRUCTOR]);

    expect(guard.canActivate(buildContext({ roles: [Role.STUDENT, Role.INSTRUCTOR] }))).toBe(true);
  });

  it('denies a user whose roles do not include any required role', () => {
    reflector.getAllAndOverride.mockReturnValue([Role.INSTRUCTOR]);

    expect(() => guard.canActivate(buildContext({ roles: [Role.STUDENT, Role.PARENT] }))).toThrow(INSUFFICIENT_ROLE);
  });

  it.each([
    ['an empty roles array', { roles: [] }],
    ['the legacy singular `role` claim', { role: Role.INSTRUCTOR }],
    ['a non-array roles claim', { roles: Role.INSTRUCTOR }],
  ])('denies %s', (_label, user) => {
    reflector.getAllAndOverride.mockReturnValue([Role.INSTRUCTOR]);

    expect(() => guard.canActivate(buildContext(user))).toThrow(ForbiddenException);
  });

  it('denies a request without an authenticated user', () => {
    reflector.getAllAndOverride.mockReturnValue([Role.INSTRUCTOR]);

    expect(() => guard.canActivate(buildContext())).toThrow(USER_NOT_AUTHENTICATED);
  });
});
