/**
 * @file ensure-workspace-packages.cjs
 * @description Builds compiled workspace packages when their `dist/` (or Prisma client)
 * is missing, then asserts every Nest app can resolve its `@dms/*` dependencies.
 *
 * Nest `tsconfig.build.json` clears source path aliases so `nest build` consumes
 * `node_modules/@dms/shared-auth` → `packages/shared-auth/dist`. A clean tree without
 * that `dist/` yields TS2307. This script is the permanent guard.
 *
 * Usage:
 *   node scripts/ensure-workspace-packages.cjs           # build if missing, then verify
 *   node scripts/ensure-workspace-packages.cjs --build   # always rebuild, then verify
 *   node scripts/ensure-workspace-packages.cjs --verify  # verify only (no compile)
 */

const { spawnSync } = require('child_process');
const { createRequire } = require('module');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const COMPILED_PACKAGES = [
  {
    name: '@dms/shared-types',
    artifact: path.join(ROOT, 'packages/shared-types/dist/index.d.ts'),
  },
  {
    name: '@dms/shared-auth',
    artifact: path.join(ROOT, 'packages/shared-auth/dist/index.d.ts'),
  },
];

const PRISMA_CLIENT = path.join(ROOT, 'packages/database/client/index.d.ts');

/**
 * Services that must resolve internal workspace packages before `nest build` / watch.
 *
 * @type {{ name: string, dir: string, packages: string[] }[]}
 */
const SERVICES = [
  {
    name: 'auth-service',
    dir: 'apps/auth-service',
    packages: ['@dms/shared-auth', '@dms/shared-types', '@dms/database'],
  },
  {
    name: 'academic-service',
    dir: 'apps/academic-service',
    packages: ['@dms/shared-auth', '@dms/shared-types', '@dms/database'],
  },
  {
    name: 'financial-service',
    dir: 'apps/financial-service',
    packages: ['@dms/shared-auth', '@dms/shared-types', '@dms/database'],
  },
  {
    name: 'api-gateway',
    dir: 'apps/api-gateway',
    packages: ['@dms/shared-auth'],
  },
];

/**
 * Runs a command at the workspace root and exits on failure.
 *
 * @param {string} command - Executable.
 * @param {string[]} args - Arguments.
 * @returns {void}
 */
function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: ROOT,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  if (result.status !== 0) {
    process.exit(result.status === null ? 1 : result.status);
  }
}

/**
 * Compiles `@dms/shared-types` then `@dms/shared-auth` in workspace topological order.
 *
 * @returns {void}
 */
function buildCompiledPackages() {
  run('pnpm', ['--recursive', '--filter', './packages/**', '--if-present', 'run', 'build']);
}

/**
 * Generates the Prisma client when `packages/database/client` is absent.
 *
 * @returns {void}
 */
function generatePrismaClientIfMissing() {
  if (fs.existsSync(PRISMA_CLIENT)) {
    return;
  }
  run('pnpm', ['--filter', '@dms/database', 'db:generate']);
}

/**
 * @returns {boolean} True when every compiled package artifact exists.
 */
function compiledArtifactsExist() {
  return COMPILED_PACKAGES.every((pkg) => fs.existsSync(pkg.artifact));
}

/**
 * Fails with a pointer to the missing `workspace:*` declaration.
 *
 * @param {string} serviceName - Nest app name.
 * @param {string} packageName - Expected dependency.
 * @returns {never}
 */
function failMissingDep(serviceName, packageName) {
  console.error(
    `[ensure-workspace] ${serviceName} is missing "${packageName}": "workspace:*" in dependencies.`,
  );
  process.exit(1);
}

/**
 * Asserts a service declares and can resolve a workspace package, including its types entry.
 *
 * @param {{ name: string, dir: string }} service - Nest app under `apps/`.
 * @param {string} packageName - Package to resolve (`@dms/shared-auth`, …).
 * @returns {void}
 */
function assertServiceResolves(service, packageName) {
  const manifestPath = path.join(ROOT, service.dir, 'package.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const declared = (manifest.dependencies && manifest.dependencies[packageName]) || '';
  if (declared !== 'workspace:*') {
    failMissingDep(service.name, packageName);
  }

  const requireFromService = createRequire(manifestPath);
  let resolved;
  try {
    resolved = requireFromService.resolve(packageName);
  } catch (error) {
    const artifactHint = COMPILED_PACKAGES.find((pkg) => pkg.name === packageName);
    console.error(
      `[ensure-workspace] ${service.name} cannot resolve ${packageName}. ` +
        (artifactHint
          ? `Compile it first: pnpm --filter ${packageName} build (expected ${path.relative(ROOT, artifactHint.artifact)}).`
          : `Run pnpm install so the workspace symlink exists. (${error.message})`),
    );
    process.exit(1);
  }

  if (packageName !== '@dms/database') {
    const typesFile = COMPILED_PACKAGES.find((pkg) => pkg.name === packageName)?.artifact;
    if (typesFile && !fs.existsSync(typesFile)) {
      console.error(
        `[ensure-workspace] ${packageName} has no types at ${path.relative(ROOT, typesFile)}. ` +
          `pnpm --filter ${packageName} build`,
      );
      process.exit(1);
    }
  } else if (!fs.existsSync(PRISMA_CLIENT)) {
    console.error(
      '[ensure-workspace] @dms/database client is missing. pnpm --filter @dms/database db:generate',
    );
    process.exit(1);
  }

  console.log(`✔ ${service.name} → ${packageName} (${path.relative(ROOT, resolved)})`);
}

/**
 * Verifies linkage + Node resolution for every Nest service.
 *
 * @returns {void}
 */
function verify() {
  for (const service of SERVICES) {
    if (!fs.existsSync(path.join(ROOT, service.dir, 'package.json'))) {
      console.error(`[ensure-workspace] missing ${service.dir}/package.json`);
      process.exit(1);
    }
    for (const packageName of service.packages) {
      assertServiceResolves(service, packageName);
    }
  }
}

/**
 * Entry point: optional compile, then verify.
 *
 * @returns {void}
 */
function main() {
  const args = new Set(process.argv.slice(2));
  const verifyOnly = args.has('--verify');
  const forceBuild = args.has('--build');

  if (!verifyOnly) {
    if (forceBuild || !compiledArtifactsExist()) {
      console.log('[ensure-workspace] compiling @dms/shared-types and @dms/shared-auth…');
      buildCompiledPackages();
    }
    generatePrismaClientIfMissing();
  }

  verify();
  console.log('[ensure-workspace] workspace packages resolvable from auth, academic, financial, and gateway.');
}

main();
