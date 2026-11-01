/**
 * @file client-ip.decorator.spec.ts
 * @description Unit tests for the `@ClientIp()` resolver.
 */

import { ExecutionContext } from '@nestjs/common';
import { resolveClientIp } from './client-ip.decorator';

describe('resolveClientIp', () => {
  /**
   * Builds a minimal ExecutionContext exposing headers and connection metadata.
   *
   * @param {{ headers?: Record<string, unknown>; ip?: string; remoteAddress?: string }} extras - Request fields.
   * @returns {ExecutionContext} Mocked execution context.
   */
  const buildContext = (extras: {
    headers?: Record<string, unknown>;
    ip?: string;
    remoteAddress?: string;
  }): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: extras.headers ?? {},
          ip: extras.ip,
          socket: { remoteAddress: extras.remoteAddress },
        }),
      }),
    }) as unknown as ExecutionContext;

  it('uses the first X-Forwarded-For hop', () => {
    expect(
      resolveClientIp(undefined, buildContext({ headers: { 'x-forwarded-for': '203.0.113.10, 10.0.0.1' } })),
    ).toBe('203.0.113.10');
  });

  it('falls back to X-Real-IP then req.ip', () => {
    expect(resolveClientIp(undefined, buildContext({ headers: { 'x-real-ip': '198.51.100.2' } }))).toBe(
      '198.51.100.2',
    );
    expect(resolveClientIp(undefined, buildContext({ ip: '192.0.2.4' }))).toBe('192.0.2.4');
  });

  it('returns unknown when no address is present', () => {
    expect(resolveClientIp(undefined, buildContext({}))).toBe('unknown');
  });
});
