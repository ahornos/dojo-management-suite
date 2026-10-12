/**
 * @file current-user.decorator.ts
 * @description Route parameter decorator exposing the authenticated user injected by the Passport JWT
 * strategy (`req.user`), so controllers never touch the raw request object.
 */

import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthenticatedUser } from '@dms/shared-types';

/** Stable error code raised when a handler asks for the user but none is attached to the request. */
export const MISSING_AUTHENTICATED_USER = 'MISSING_AUTHENTICATED_USER';

/**
 * Resolves the value of `@CurrentUser()`.
 * Exported separately from the decorator so it can be unit tested without a Nest runtime.
 *
 * @param {keyof AuthenticatedUser | undefined} property - Optional single property to extract (e.g. `'userId'`).
 * @param {ExecutionContext} context - Execution context of the current request.
 * @returns {AuthenticatedUser | AuthenticatedUser[keyof AuthenticatedUser]} The whole user, or the requested property.
 * @throws {UnauthorizedException} If no authenticated user is attached (the handler is missing `JwtAuthGuard`).
 */
export function resolveCurrentUser(
  property: keyof AuthenticatedUser | undefined,
  context: ExecutionContext,
): AuthenticatedUser | AuthenticatedUser[keyof AuthenticatedUser] {
  const { user } = context.switchToHttp().getRequest<{ user?: AuthenticatedUser }>();

  // Failing loudly prevents silent fallbacks such as attributing writes to a fake "system" user.
  if (!user) {
    throw new UnauthorizedException(MISSING_AUTHENTICATED_USER);
  }

  return property ? user[property] : user;
}

/**
 * Injects the authenticated user (`@CurrentUser() user`) or one of its properties (`@CurrentUser('userId') id`).
 * Must be used on routes protected by `JwtAuthGuard`.
 */
export const CurrentUser = createParamDecorator(resolveCurrentUser);
