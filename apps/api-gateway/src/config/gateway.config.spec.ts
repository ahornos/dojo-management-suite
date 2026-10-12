/**
 * @file gateway.config.spec.ts
 * @description Unit tests for the typed configuration helpers of the gateway.
 */

import { ConfigService } from '@nestjs/config';
import { DEFAULT_ALLOWED_ORIGIN, SERVICE_URL_DEFAULTS, readNumber, resolveAllowedOrigins, resolveServiceUrl } from './gateway.config';

/**
 * Builds a ConfigService double backed by a plain object.
 *
 * @param {Record<string, unknown>} values - Environment values.
 * @returns {ConfigService} Config double.
 */
const config = (values: Record<string, unknown>): ConfigService => ({ get: (key: string) => values[key] }) as unknown as ConfigService;

describe('gateway.config', () => {
  describe('resolveServiceUrl', () => {
    it('uses the configured URL and strips trailing slashes', () => {
      expect(resolveServiceUrl(config({ AUTH_SERVICE_URL: 'http://auth:3000//' }), 'AUTH_SERVICE_URL')).toBe('http://auth:3000');
    });

    it.each(['AUTH_SERVICE_URL', 'ACADEMIC_SERVICE_URL', 'FINANCIAL_SERVICE_URL'] as const)('defaults %s when unset', (key) => {
      expect(resolveServiceUrl(config({}), key)).toBe(SERVICE_URL_DEFAULTS[key]);
    });
  });

  describe('readNumber', () => {
    it.each([
      [{ N: '42' }, 42],
      [{ N: 7 }, 7],
      [{ N: '0' }, 0],
      [{}, 5],
      [{ N: '' }, 5],
      [{ N: 'abc' }, 5],
      [{ N: 'Infinity' }, 5],
    ])('reads %j as %p', (values, expected) => {
      expect(readNumber(config(values), 'N', 5)).toBe(expected);
    });
  });

  describe('resolveAllowedOrigins', () => {
    it('parses and trims a comma-separated allow-list', () => {
      expect(resolveAllowedOrigins(config({ ALLOWED_ORIGINS: 'https://a.test, https://b.test ,' }))).toEqual(['https://a.test', 'https://b.test']);
    });

    it.each([[undefined], [''], [' , ']])('falls back to the local dev origin for %p', (raw) => {
      expect(resolveAllowedOrigins(config({ ALLOWED_ORIGINS: raw }))).toEqual([DEFAULT_ALLOWED_ORIGIN]);
    });
  });
});
