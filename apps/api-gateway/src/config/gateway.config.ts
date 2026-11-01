/**
 * @file gateway.config.ts
 * @description Typed access to the gateway's environment configuration through `ConfigService`.
 * Centralises keys and defaults so controllers, the proxy and `main.ts` never read `process.env` directly.
 */

import { ConfigService } from '@nestjs/config';

/** Environment keys holding the internal base URL of each downstream microservice. */
export type ServiceUrlKey = 'AUTH_SERVICE_URL' | 'ACADEMIC_SERVICE_URL' | 'FINANCIAL_SERVICE_URL';

/** Default CORS origin (Vite dev server). */
export const DEFAULT_ALLOWED_ORIGIN = 'http://localhost:5173';

/** Default listening port of the gateway. */
export const DEFAULT_PORT = 3000;

/**
 * Resolves the base URL of a downstream service.
 *
 * @param {ConfigService} config - Nest configuration service.
 * @param {ServiceUrlKey} key - Environment key of the service URL.
 * @returns {string} Base URL without a trailing slash.
 */
export function resolveServiceUrl(config: ConfigService, key: ServiceUrlKey): string {
  const value = config.get<string>(key)?.trim();
  if (!value) {
    throw new Error(`FATAL: environment variable ${key} is required and must not be empty.`);
  }
  return value.replace(/\/+$/, '');
}

/**
 * Reads a numeric setting, falling back to a default when it is missing or not a finite number.
 *
 * @param {ConfigService} config - Nest configuration service.
 * @param {string} key - Environment key.
 * @param {number} fallback - Value used when the setting is absent or invalid.
 * @returns {number} Parsed number.
 */
export function readNumber(config: ConfigService, key: string, fallback: number): number {
  const raw = config.get<string | number>(key);
  if (raw === undefined || raw === '') return fallback;

  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

/**
 * Parses the comma-separated CORS allow-list.
 *
 * @param {ConfigService} config - Nest configuration service.
 * @returns {string[]} Allowed origins (defaults to the local Vite dev server).
 */
export function resolveAllowedOrigins(config: ConfigService): string[] {
  const raw = config.get<string>('ALLOWED_ORIGINS');
  const origins = raw?.split(',').map((origin) => origin.trim()).filter(Boolean);
  return origins?.length ? origins : [DEFAULT_ALLOWED_ORIGIN];
}
