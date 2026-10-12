/**
 * @file global-exception.filter.spec.ts
 * @description Unit tests for the gateway's GlobalExceptionFilter: standard payload and stable error codes.
 */

import { ArgumentsHost, BadRequestException, HttpException, Logger } from '@nestjs/common';
import { GlobalExceptionFilter } from './global-exception.filter';

describe('GlobalExceptionFilter', () => {
  const filter = new GlobalExceptionFilter();
  const json = jest.fn();
  const status = jest.fn().mockReturnValue({ json });
  const host = {
    switchToHttp: () => ({ getResponse: () => ({ status }), getRequest: () => ({ url: '/api/x' }) }),
  } as unknown as ArgumentsHost;

  beforeAll(() => {
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
  });
  afterAll(() => jest.restoreAllMocks());
  beforeEach(() => jest.clearAllMocks());

  /**
   * Runs the filter and returns the written status/body.
   *
   * @param {unknown} exception - Thrown value.
   * @returns {{ status: number; body: Record<string, unknown> }} Response written by the filter.
   */
  const run = (exception: unknown) => {
    filter.catch(exception, host);
    return { status: status.mock.calls[0][0] as number, body: json.mock.calls[0][0] as Record<string, unknown> };
  };

  it('keeps the message array of validation errors', () => {
    const { status: code, body } = run(new BadRequestException(['a must be a string']));

    expect(code).toBe(400);
    expect(body).toMatchObject({ statusCode: 400, path: '/api/x', message: ['a must be a string'] });
  });

  it('uses the exception message for plain-string HttpExceptions', () => {
    expect(run(new HttpException('MY_CODE', 409)).body.message).toBe('MY_CODE');
  });

  it('keeps the code of a gateway-built upstream error', () => {
    const { status: code, body } = run(new HttpException({ statusCode: 502, message: 'UPSTREAM_UNAVAILABLE' }, 502));

    expect(code).toBe(502);
    expect(body.message).toBe('UPSTREAM_UNAVAILABLE');
  });

  it('maps ECONNREFUSED to 502 UPSTREAM_UNAVAILABLE', () => {
    const { status: code, body } = run({ code: 'ECONNREFUSED' });

    expect(code).toBe(502);
    expect(body.message).toBe('UPSTREAM_UNAVAILABLE');
  });

  it('maps ETIMEDOUT to 504 UPSTREAM_TIMEOUT', () => {
    const { status: code, body } = run({ code: 'ETIMEDOUT' });

    expect(code).toBe(504);
    expect(body.message).toBe('UPSTREAM_TIMEOUT');
  });

  it('propagates the status and message of a raw Axios error response', () => {
    const { status: code, body } = run({ isAxiosError: true, message: 'x', response: { status: 404, data: { message: 'NOT_FOUND' } } });

    expect(code).toBe(404);
    expect(body.message).toBe('NOT_FOUND');
  });

  it('falls back to the Axios message when the response has no message', () => {
    expect(run({ isAxiosError: true, message: 'oops', response: { status: 500, data: null } }).body.message).toBe('oops');
  });

  it('answers 500 INTERNAL_SERVER_ERROR for unknown failures', () => {
    const { status: code, body } = run(new Error('secret internals'));

    expect(code).toBe(500);
    expect(body.message).toBe('INTERNAL_SERVER_ERROR');
  });
});
