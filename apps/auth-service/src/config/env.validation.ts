/**
 * @file env.validation.ts
 * @description Fail-fast environment validation for the auth-service.
 * Wired into `ConfigModule.forRoot({ validate })` so a missing mandatory variable aborts bootstrap.
 */

/**
 * Environment variables the auth-service cannot run without.
 */
export interface EnvironmentVariables {
  /** Secret used to sign and verify JWTs. Never has a default value. */
  JWT_SECRET: string;
  /** Shared secret that peer services must present to the internal user directory. */
  INTERNAL_API_KEY: string;
  /** Optional token lifetime (e.g. `1d`). */
  JWT_EXPIRES_IN?: string;
}

/** Variables that must be present and non-blank for the service to boot. */
const REQUIRED_VARIABLES = ['JWT_SECRET', 'INTERNAL_API_KEY'] as const;

/** Example catalog values that must never be used as production secrets. */
const PLACEHOLDER_SECRET_PATTERN = /replace-with-|your-jwt-secret/i;

/**
 * Validates the raw environment and aborts startup when a mandatory variable is absent.
 * In production, catalog placeholders (`replace-with-a-long-random-secret`, `your-jwt-secret`) are rejected.
 *
 * @param {Record<string, unknown>} config - Raw environment variables loaded by ConfigModule.
 * @returns {Record<string, unknown>} The unchanged configuration when validation succeeds.
 * @throws {Error} If any required variable is missing, blank, or a production placeholder.
 */
export function validateEnv(config: Record<string, unknown>): Record<string, unknown> {
  for (const name of REQUIRED_VARIABLES) {
    const value = config[name];

    if (typeof value !== 'string' || value.trim().length === 0) {
      throw new Error(`FATAL: environment variable ${name} is required and must not be empty.`);
    }
  }

  rejectProductionPlaceholders(config, REQUIRED_VARIABLES);
  return config;
}

/**
 * @param {Record<string, unknown>} config - Loaded environment.
 * @returns {boolean} Whether this process is production.
 */
function isProduction(config: Record<string, unknown>): boolean {
  const fromConfig = typeof config.NODE_ENV === 'string' ? config.NODE_ENV.trim() : '';
  return (fromConfig || process.env.NODE_ENV) === 'production';
}

/**
 * @param {Record<string, unknown>} config - Loaded environment.
 * @param {readonly string[]} names - Secret keys that cannot be example placeholders in production.
 * @throws {Error} If a production secret still looks like the root `.env.example` catalog.
 */
function rejectProductionPlaceholders(config: Record<string, unknown>, names: readonly string[]): void {
  if (!isProduction(config)) {
    return;
  }

  for (const name of names) {
    const value = typeof config[name] === 'string' ? config[name].trim() : '';
    if (PLACEHOLDER_SECRET_PATTERN.test(value)) {
      throw new Error(`FATAL: environment variable ${name} must not use a placeholder value in production.`);
    }
  }
}
