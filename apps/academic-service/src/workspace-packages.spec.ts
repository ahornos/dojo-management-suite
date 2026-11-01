/**
 * @file workspace-packages.spec.ts
 * @description Guards the pnpm workspace link that `nest build` needs for `@dms/shared-auth`.
 * Jest maps `@dms/*` to source for unit tests; this spec asserts the *package.json* contract
 * and that the compiled `dist/` used by `tsconfig.build.json` exists.
 */

import { spawnSync } from 'child_process';
import { createRequire } from 'module';
import { existsSync, readFileSync } from 'fs';
import { join, sep } from 'path';

const SERVICE_ROOT = join(__dirname, '..');
const WORKSPACE_ROOT = join(SERVICE_ROOT, '..', '..');

describe('workspace package linkage', () => {
  it('declares @dms/shared-auth as a workspace dependency', () => {
    const pkg = JSON.parse(readFileSync(join(SERVICE_ROOT, 'package.json'), 'utf8')) as {
      dependencies: Record<string, string>;
    };
    expect(pkg.dependencies['@dms/shared-auth']).toBe('workspace:*');
    expect(pkg.dependencies['@dms/shared-types']).toBe('workspace:*');
    expect(pkg.dependencies['@dms/database']).toBe('workspace:*');
  });

  it('resolves @dms/shared-auth to the compiled package (Nest tsconfig.build.json consumes dist)', () => {
    const requireFromService = createRequire(join(SERVICE_ROOT, 'package.json'));
    const resolved = requireFromService.resolve('@dms/shared-auth');
    expect(resolved).toContain(`${sep}packages${sep}shared-auth${sep}`);
    expect(existsSync(join(WORKSPACE_ROOT, 'packages/shared-auth/dist/index.d.ts'))).toBe(true);
  });

  it('verify script succeeds for every Nest service', () => {
    const result = spawnSync(
      process.execPath,
      [join(WORKSPACE_ROOT, 'scripts/ensure-workspace-packages.cjs'), '--verify'],
      { cwd: WORKSPACE_ROOT, encoding: 'utf8' },
    );
    expect(result.status).toBe(0);
    expect(result.stdout).toContain('academic-service → @dms/shared-auth');
    expect(result.stdout).toContain('auth-service → @dms/shared-auth');
    expect(result.stdout).toContain('financial-service → @dms/shared-auth');
    expect(result.stdout).toContain('api-gateway → @dms/shared-auth');
  });
});
