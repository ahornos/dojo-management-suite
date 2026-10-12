/**
 * @file proxy.service.spec.ts
 * @description Unit tests for the ProxyService: strict header propagation, status mirroring,
 * retry/backoff policy (idempotent methods only) and stable-code error mapping.
 * `HttpService` and `ConfigService` are mocked; no network traffic is generated.
 */

import { Test } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { HttpException, Logger } from '@nestjs/common';
import { NEVER, of, throwError } from 'rxjs';
import type { Request } from 'express';
import { ProxyService, UPSTREAM_TIMEOUT, UPSTREAM_UNAVAILABLE } from './proxy.service';

describe('ProxyService', () => {
  const targetUrl = 'http://internal-microservice:3000/api/test';
  const mockHttpService = { request: jest.fn() };

  beforeAll(() => {
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  afterEach(() => {
    mockHttpService.request.mockReset();
  });

  /**
   * Builds a service with fast resilience settings so retry/timeout paths run in milliseconds.
   *
   * @param {Record<string, unknown>} settings - Overrides for the mocked ConfigService.
   * @returns {Promise<ProxyService>} Configured service.
   */
  const buildService = async (settings: Record<string, unknown> = {}): Promise<ProxyService> => {
    const values: Record<string, unknown> = { PROXY_TIMEOUT_MS: 25, PROXY_MAX_RETRIES: 3, PROXY_RETRY_BASE_DELAY_MS: 1, ...settings };
    const module = await Test.createTestingModule({
      providers: [
        ProxyService,
        { provide: HttpService, useValue: mockHttpService },
        { provide: ConfigService, useValue: { get: jest.fn((key: string) => values[key]) } },
      ],
    }).compile();

    return module.get(ProxyService);
  };

  /**
   * Builds a minimal Express request.
   *
   * @param {Partial<Request>} overrides - Request fields to override.
   * @returns {Request} Request double.
   */
  const buildRequest = (overrides: Record<string, unknown> = {}): Request =>
    ({
      method: 'GET',
      headers: {},
      ip: '192.168.1.100',
      socket: {},
      body: undefined,
      query: {},
      ...overrides,
    }) as unknown as Request;

  const upstream = (status: number, data: unknown = {}) => of({ status, data });
  const networkError = (code: string) => throwError(() => Object.assign(new Error(code), { isAxiosError: true, code }));

  /**
   * Captures the thrown HttpException of a forwarded request.
   *
   * @param {Promise<unknown>} promise - Pending forward.
   * @returns {Promise<HttpException>} The thrown exception.
   */
  const capture = async (promise: Promise<unknown>): Promise<HttpException> => {
    try {
      await promise;
    } catch (error) {
      return error as HttpException;
    }
    throw new Error('Expected the request to fail');
  };

  it('should be defined', async () => {
    expect(await buildService()).toBeDefined();
  });

  describe('header propagation', () => {
    it('forwards only the whitelisted headers together with body and query', async () => {
      const service = await buildService();
      mockHttpService.request.mockReturnValue(upstream(200, { success: true }));

      const result = await service.forwardRequest(
        targetUrl,
        buildRequest({
          method: 'POST',
          headers: {
            authorization: 'Bearer token-123',
            'x-school-id': 'dojo-barcelona',
            'content-type': 'application/json',
            cookie: 'session=secret',
            'x-internal-api-key': 'smuggled',
            'x-forwarded-host': 'evil.example',
          },
          body: { someData: true },
          query: { filter: 'active' },
        }),
      );

      expect(result).toEqual({ success: true });
      const config = mockHttpService.request.mock.calls[0][0];
      expect(config).toMatchObject({ method: 'POST', url: targetUrl, data: { someData: true }, params: { filter: 'active' } });
      expect(config.headers).toEqual({
        authorization: 'Bearer token-123',
        'x-school-id': 'dojo-barcelona',
        'content-type': 'application/json',
        'x-forwarded-for': '192.168.1.100',
        'x-real-ip': '192.168.1.100',
      });
    });

    it('omits optional headers that the client did not send and falls back to the socket address', async () => {
      const service = await buildService();
      mockHttpService.request.mockReturnValue(upstream(200));

      await service.forwardRequest(targetUrl, buildRequest({ ip: undefined, socket: { remoteAddress: '10.0.0.7' } }));

      expect(mockHttpService.request.mock.calls[0][0].headers).toEqual({ 'x-forwarded-for': '10.0.0.7', 'x-real-ip': undefined });
    });

    it('applies the configured timeout to the outbound request', async () => {
      const service = await buildService();
      mockHttpService.request.mockReturnValue(upstream(200));

      await service.forwardRequest(targetUrl, buildRequest());

      expect(mockHttpService.request.mock.calls[0][0].timeout).toBe(25);
    });
  });

  describe('status mirroring', () => {
    it.each([400, 401, 403, 404, 409, 422])('mirrors a %i answer without retrying', async (status) => {
      const service = await buildService();
      mockHttpService.request.mockReturnValue(upstream(status, { message: 'CODE' }));

      const error = await capture(service.forwardRequest(targetUrl, buildRequest()));

      expect(error.getStatus()).toBe(status);
      expect(error.getResponse()).toEqual({ message: 'CODE' });
      expect(mockHttpService.request).toHaveBeenCalledTimes(1);
    });

    it('mirrors an Axios rejection that carries a 4xx response', async () => {
      const service = await buildService();
      mockHttpService.request.mockReturnValue(
        throwError(() => Object.assign(new Error('bad'), { isAxiosError: true, response: { status: 400, data: { message: ['x'] } } })),
      );

      const error = await capture(service.forwardRequest(targetUrl, buildRequest()));

      expect(error.getStatus()).toBe(400);
      expect(error.getResponse()).toEqual({ message: ['x'] });
      expect(mockHttpService.request).toHaveBeenCalledTimes(1);
    });
  });

  describe('retry policy', () => {
    it('retries an idempotent request on a transient 503 and returns the eventual success', async () => {
      const service = await buildService();
      mockHttpService.request
        .mockReturnValueOnce(upstream(503))
        .mockReturnValueOnce(upstream(502))
        .mockReturnValueOnce(upstream(200, { ok: true }));

      await expect(service.forwardRequest(targetUrl, buildRequest())).resolves.toEqual({ ok: true });
      expect(mockHttpService.request).toHaveBeenCalledTimes(3);
    });

    it.each(['GET', 'HEAD', 'OPTIONS', 'PUT', 'DELETE'])('treats %s as replayable', async (method) => {
      const service = await buildService();
      mockHttpService.request.mockReturnValueOnce(upstream(503)).mockReturnValueOnce(upstream(200, { ok: true }));

      await service.forwardRequest(targetUrl, buildRequest({ method }));

      expect(mockHttpService.request).toHaveBeenCalledTimes(2);
    });

    it('gives up after 3 retries (4 attempts) and mirrors the last upstream answer', async () => {
      const service = await buildService();
      mockHttpService.request.mockReturnValue(upstream(503, { message: 'DOWN' }));

      const error = await capture(service.forwardRequest(targetUrl, buildRequest()));

      expect(mockHttpService.request).toHaveBeenCalledTimes(4);
      expect(error.getStatus()).toBe(503);
      expect(error.getResponse()).toEqual({ message: 'DOWN' });
    });

    it('retries network failures and recovers', async () => {
      const service = await buildService();
      mockHttpService.request.mockReturnValueOnce(networkError('ECONNREFUSED')).mockReturnValueOnce(upstream(200, { ok: 1 }));

      await expect(service.forwardRequest(targetUrl, buildRequest())).resolves.toEqual({ ok: 1 });
      expect(mockHttpService.request).toHaveBeenCalledTimes(2);
    });

    it('re-invokes the HTTP client on every attempt (cold observable)', async () => {
      const service = await buildService();
      mockHttpService.request.mockReturnValue(upstream(503));

      await capture(service.forwardRequest(targetUrl, buildRequest()));

      expect(mockHttpService.request).toHaveBeenCalledTimes(4);
    });

    it('honours PROXY_MAX_RETRIES', async () => {
      const service = await buildService({ PROXY_MAX_RETRIES: 1 });
      mockHttpService.request.mockReturnValue(upstream(503));

      await capture(service.forwardRequest(targetUrl, buildRequest()));

      expect(mockHttpService.request).toHaveBeenCalledTimes(2);
    });

    it.each(['POST', 'PATCH'])('never replays a non-idempotent %s (no duplicated payments/enrolments)', async (method) => {
      const service = await buildService();
      mockHttpService.request.mockReturnValue(upstream(503, { message: 'DOWN' }));

      const error = await capture(service.forwardRequest(targetUrl, buildRequest({ method })));

      expect(mockHttpService.request).toHaveBeenCalledTimes(1);
      expect(error.getStatus()).toBe(503);
    });

    it('does not retry a non-idempotent request after a network failure', async () => {
      const service = await buildService();
      mockHttpService.request.mockReturnValue(networkError('ECONNRESET'));

      const error = await capture(service.forwardRequest(targetUrl, buildRequest({ method: 'POST' })));

      expect(mockHttpService.request).toHaveBeenCalledTimes(1);
      expect(error.getStatus()).toBe(502);
    });

    it('does not retry programming errors (non-network failures)', async () => {
      const service = await buildService();
      mockHttpService.request.mockReturnValue(throwError(() => new TypeError('boom')));

      const error = await capture(service.forwardRequest(targetUrl, buildRequest()));

      expect(mockHttpService.request).toHaveBeenCalledTimes(1);
      expect(error.getStatus()).toBe(502);
    });
  });

  describe('error mapping (stable codes, no prose)', () => {
    it('maps an unreachable upstream to 502 UPSTREAM_UNAVAILABLE', async () => {
      const service = await buildService({ PROXY_MAX_RETRIES: 0 });
      mockHttpService.request.mockReturnValue(networkError('ECONNREFUSED'));

      const error = await capture(service.forwardRequest(targetUrl, buildRequest()));

      expect(error.getStatus()).toBe(502);
      expect(error.getResponse()).toEqual({ statusCode: 502, message: UPSTREAM_UNAVAILABLE });
    });

    it.each(['ETIMEDOUT', 'ECONNABORTED'])('maps the %s network code to 504 UPSTREAM_TIMEOUT', async (code) => {
      const service = await buildService({ PROXY_MAX_RETRIES: 0 });
      mockHttpService.request.mockReturnValue(networkError(code));

      const error = await capture(service.forwardRequest(targetUrl, buildRequest()));

      expect(error.getStatus()).toBe(504);
      expect(error.getResponse()).toEqual({ statusCode: 504, message: UPSTREAM_TIMEOUT });
    });

    it('times out a hanging upstream per attempt, retries, then answers 504 UPSTREAM_TIMEOUT', async () => {
      const service = await buildService({ PROXY_TIMEOUT_MS: 5 });
      mockHttpService.request.mockReturnValue(NEVER);

      const error = await capture(service.forwardRequest(targetUrl, buildRequest()));

      expect(mockHttpService.request).toHaveBeenCalledTimes(4);
      expect(error.getStatus()).toBe(504);
      expect(error.getResponse()).toEqual({ statusCode: 504, message: UPSTREAM_TIMEOUT });
    });

    it('falls back to the defaults when a setting is missing or malformed', async () => {
      const service = await buildService({ PROXY_TIMEOUT_MS: 'abc', PROXY_MAX_RETRIES: '', PROXY_RETRY_BASE_DELAY_MS: undefined });
      mockHttpService.request.mockReturnValue(upstream(200));

      await service.forwardRequest(targetUrl, buildRequest());

      expect(mockHttpService.request.mock.calls[0][0].timeout).toBe(10_000);
    });
  });
});
