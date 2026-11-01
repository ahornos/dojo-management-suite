/**
 * @file tenant-id.decorator.spec.ts
 * @description Unit tests for the `@TenantId()` resolver.
 */

import { BadRequestException, ExecutionContext } from '@nestjs/common';
import { MISSING_TENANT_ID, resolveTenantId } from './tenant-id.decorator';

describe('resolveTenantId', () => {
  /**
   * Builds a minimal ExecutionContext exposing the given headers.
   *
   * @param {Record<string, unknown>} headers - Incoming request headers.
   * @returns {ExecutionContext} Mocked execution context.
   */
  const buildContext = (headers: Record<string, unknown>): ExecutionContext =>
    ({ switchToHttp: () => ({ getRequest: () => ({ headers }) }) }) as unknown as ExecutionContext;

  it('returns the trimmed x-school-id header', () => {
    expect(resolveTenantId(undefined, buildContext({ 'x-school-id': '  fox-jiujitsu-academy  ' }))).toBe(
      'fox-jiujitsu-academy',
    );
  });

  it('uses the first value when the header is an array', () => {
    expect(resolveTenantId(undefined, buildContext({ 'x-school-id': ['dojo-a', 'dojo-b'] }))).toBe('dojo-a');
  });

  it('rejects a missing or blank header with MISSING_TENANT_ID', () => {
    expect(() => resolveTenantId(undefined, buildContext({}))).toThrow(BadRequestException);
    expect(() => resolveTenantId(undefined, buildContext({ 'x-school-id': '   ' }))).toThrow(MISSING_TENANT_ID);
  });
});
