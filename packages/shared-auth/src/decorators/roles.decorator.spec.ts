/**
 * @file roles.decorator.spec.ts
 * @description Unit tests for the `@Roles()` metadata decorator.
 */

import 'reflect-metadata';
import { Role } from '@dms/shared-types';
import { ROLES_KEY, Roles } from './roles.decorator';

describe('Roles decorator', () => {
  it('stores the allowed roles under ROLES_KEY on the decorated handler', () => {
    class Sample {
      @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF)
      handler(): void {}
    }

    expect(Reflect.getMetadata(ROLES_KEY, Sample.prototype.handler)).toEqual([Role.SUPER_ADMIN, Role.ADMIN_STAFF]);
  });
});
