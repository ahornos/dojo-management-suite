/**
 * @file env.validation.ts
 * @description Fail-fast environment validation for the API Gateway.
 * Wired into `ConfigModule.forRoot({ validate })` so missing routing or signing config aborts bootstrap.
 */

/**
 * Environment variables the gateway cannot run without.
 */
export interface EnvironmentVariables {
  /** Secret used by downstream services to verify JWTs. Required so the gateway never boots with a catalog placeholder. */
  JWT_SECRET: string;
  /** Auth-service base URL (Docker DNS or host port). */
  AUTH_SERVICE_URL: string;
  /** Academic-service base URL. */
  ACADEMIC_SERVICE_URL: string;
  /** Financial-service base URL. */
  FINANCIAL_SERVICE_URL: string;
  /** Optional CORS allow-list (comma-separated). */
  ALLOWED_ORIGINS?: string;
}

/** Variables that must be present and non-blank for the gateway to boot. */
const REQUIRED_VARIABLES = [
  'JWT_SECRET',
  'AUTH_SERVICE_URL',
  'ACADEMIC_SERVICE_URL',
  'FINANCIAL_SERVICE_URL',
] as const;

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

  rejectProductionPlaceholders(config, ['JWT_SECRET']);
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
