/**
 * @file env.validation.ts
 * @description Fail-fast environment validation for the financial-service.
 * Wired into `ConfigModule.forRoot({ validate })` so a missing mandatory variable aborts bootstrap.
 */

/**
 * Environment variables the financial-service cannot run without.
 */
export interface EnvironmentVariables {
  /** Secret used to sign and verify JWTs. Never has a default value. */
  JWT_SECRET: string;
  /** Base URL of the auth-service (host only, e.g. `http://auth-service:3000`). */
  AUTH_SERVICE_URL: string;
  /** Shared secret sent as `x-internal-api-key` to the auth-service internal API. */
  INTERNAL_API_KEY: string;
  /** Optional token lifetime (e.g. `1d`). */
  JWT_EXPIRES_IN?: string;
}

/** Variables that must be present and non-blank for the service to boot. */
const REQUIRED_VARIABLES = ['JWT_SECRET', 'AUTH_SERVICE_URL', 'INTERNAL_API_KEY'] as const;

/**
 * Validates the raw environment and aborts startup when a mandatory variable is absent.
 * Throwing here is deliberate: a service must never boot with a guessable signing key
 * or without the means to authenticate against its peers.
 *
 * @param {Record<string, unknown>} config - Raw environment variables loaded by ConfigModule.
 * @returns {Record<string, unknown>} The unchanged configuration when validation succeeds.
 * @throws {Error} If any required variable is missing or blank.
 */
export function validateEnv(config: Record<string, unknown>): Record<string, unknown> {
  for (const name of REQUIRED_VARIABLES) {
    const value = config[name];

    if (typeof value !== 'string' || value.trim().length === 0) {
      throw new Error(`FATAL: environment variable ${name} is required and must not be empty.`);
    }
  }

  return config;
}
