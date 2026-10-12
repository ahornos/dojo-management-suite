/**
 * @file internal-api-key.guard.spec.ts
 * @description Unit tests for the service-to-service API key guard.
 */

import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InternalApiKeyGuard } from './internal-api-key.guard';

/**
 * Builds a minimal execution context carrying the given request headers.
 *
 * @param {Record<string, unknown>} headers - Request headers.
 * @returns {ExecutionContext} Mocked context.
 */
const contextWith = (headers: Record<string, unknown>): ExecutionContext =>
  ({ switchToHttp: () => ({ getRequest: () => ({ headers }) }) }) as unknown as ExecutionContext;

describe('InternalApiKeyGuard', () => {
  const configService = { getOrThrow: jest.fn() } as unknown as jest.Mocked<ConfigService>;

  beforeEach(() => {
    jest.resetAllMocks();
    configService.getOrThrow.mockReturnValue('expected-key');
  });

  it('allows a request presenting the configured key', () => {
    const guard = new InternalApiKeyGuard(configService);

    expect(guard.canActivate(contextWith({ 'x-internal-api-key': 'expected-key' }))).toBe(true);
  });

  it.each([
    ['missing', {}],
    ['wrong', { 'x-internal-api-key': 'other-key' }],
    ['empty', { 'x-internal-api-key': '' }],
    ['repeated', { 'x-internal-api-key': ['expected-key', 'expected-key'] }],
  ])('rejects a request whose key is %s', (_label, headers) => {
    const guard = new InternalApiKeyGuard(configService);

    expect(() => guard.canActivate(contextWith(headers))).toThrow(UnauthorizedException);
  });

  it('fails fast at construction when INTERNAL_API_KEY is not configured', () => {
    configService.getOrThrow.mockImplementation(() => {
      throw new Error('INTERNAL_API_KEY missing');
    });

    expect(() => new InternalApiKeyGuard(configService)).toThrow(/INTERNAL_API_KEY/);
  });
});
