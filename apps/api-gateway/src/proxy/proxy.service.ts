/**
 * @file proxy.service.ts
 * @description Service responsible for forwarding incoming HTTP requests from the API Gateway
 * to downstream microservices. Propagates a strict whitelist of headers, mirrors downstream HTTP
 * status codes and adds resilience (per-attempt timeout, bounded exponential-backoff retries).
 *
 * Authentication model: the gateway does NOT verify JWTs. It forwards the `Authorization` header
 * untouched and every microservice verifies the token itself (`JwtAuthGuard` + `RolesGuard`),
 * so a compromised or bypassed gateway can never widen access.
 */

import { Injectable, Logger, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import type { AxiosResponse } from 'axios';
import type { Request } from 'express';
import { TimeoutError, defer, firstValueFrom, map, retry, throwError, timeout, timer } from 'rxjs';
import { readNumber } from '../config/gateway.config';

/** Stable error codes returned in the `message` field; mapped to translations by the frontend. */
export const UPSTREAM_TIMEOUT = 'UPSTREAM_TIMEOUT';
export const UPSTREAM_UNAVAILABLE = 'UPSTREAM_UNAVAILABLE';

/** Methods that are safe to replay: a retry cannot duplicate a payment, enrolment or remittance. */
const IDEMPOTENT_METHODS: ReadonlySet<string> = new Set(['GET', 'HEAD', 'OPTIONS', 'PUT', 'DELETE']);

/** Upstream statuses that signal a transient condition worth retrying. */
const RETRYABLE_STATUSES: ReadonlySet<number> = new Set([502, 503, 504]);

/** Network error codes that mean "the upstream did not answer in time". */
const TIMEOUT_CODES: ReadonlySet<string> = new Set(['ETIMEDOUT', 'ECONNABORTED']);

/** Defaults, overridable through `PROXY_TIMEOUT_MS`, `PROXY_MAX_RETRIES` and `PROXY_RETRY_BASE_DELAY_MS`. */
const DEFAULT_TIMEOUT_MS = 10_000;
const DEFAULT_MAX_RETRIES = 3;
const DEFAULT_RETRY_BASE_DELAY_MS = 200;

/** Carries a transient upstream response through the RxJS error channel so `retry` can see it. */
class RetryableUpstreamResponseError extends Error {
  constructor(readonly response: AxiosResponse) {
    super(`Retryable upstream status ${response.status}`);
  }
}

/** Minimal shape of an Axios error, which is all the proxy needs to inspect. */
interface AxiosLikeError {
  isAxiosError?: boolean;
  code?: string;
  message?: string;
  response?: { status: number; data: unknown };
}

@Injectable()
export class ProxyService {
  private readonly logger = new Logger(ProxyService.name);
  private readonly timeoutMs: number;
  private readonly maxRetries: number;
  private readonly retryBaseDelayMs: number;

  /**
   * @param {HttpService} httpService - Outbound HTTP client.
   * @param {ConfigService} config - Source of the resilience settings.
   */
  constructor(
    private readonly httpService: HttpService,
    config: ConfigService,
  ) {
    this.timeoutMs = readNumber(config, 'PROXY_TIMEOUT_MS', DEFAULT_TIMEOUT_MS);
    this.maxRetries = readNumber(config, 'PROXY_MAX_RETRIES', DEFAULT_MAX_RETRIES);
    this.retryBaseDelayMs = readNumber(config, 'PROXY_RETRY_BASE_DELAY_MS', DEFAULT_RETRY_BASE_DELAY_MS);
  }

  /**
   * Forwards a client request to a target microservice URL, preserving the whitelisted headers and query parameters.
   * Mirrors the exact HTTP status code returned by the target microservice back to the client.
   * Idempotent methods are retried up to `maxRetries` times (exponential backoff) on timeouts, network
   * failures and 502/503/504 answers; non-idempotent methods are sent exactly once.
   *
   * @param {string} targetUrl - The absolute URL of the downstream microservice endpoint.
   * @param {Request} req - The incoming Express request object from the Gateway.
   * @returns {Promise<unknown>} The data returned by the target microservice.
   * @throws {HttpException} Downstream error status (mirrored), `UPSTREAM_TIMEOUT` (504) or `UPSTREAM_UNAVAILABLE` (502).
   */
  async forwardRequest(targetUrl: string, req: Request): Promise<any> {
    // Strict whitelist: anything else (cookies, `x-internal-api-key`, ...) never reaches the services.
    const headers = {
      ...(req.headers.authorization && { authorization: req.headers.authorization }),
      ...(req.headers['x-school-id'] && { 'x-school-id': req.headers['x-school-id'] }),
      'x-forwarded-for': req.ip || req.socket.remoteAddress,
      'x-real-ip': req.ip,
      ...(req.headers['content-type'] && { 'content-type': req.headers['content-type'] }),
    };

    const method = req.method.toUpperCase();
    this.logger.log(`Forwarding ${method} request to: ${targetUrl}`);

    const response$ = defer(() =>
      this.httpService.request({
        method: req.method,
        url: targetUrl,
        headers,
        data: req.body,
        params: req.query,
        timeout: this.timeoutMs,
        // Resolve every status so 4xx/5xx bodies can be mirrored verbatim.
        validateStatus: () => true,
      }),
    ).pipe(
      timeout(this.timeoutMs),
      map((response) => {
        if (RETRYABLE_STATUSES.has(response.status)) throw new RetryableUpstreamResponseError(response);
        return response;
      }),
      retry({
        count: IDEMPOTENT_METHODS.has(method) ? this.maxRetries : 0,
        delay: (error: unknown, attempt: number) =>
          this.isTransient(error) ? timer(this.retryBaseDelayMs * 2 ** (attempt - 1)) : throwError(() => error),
      }),
    );

    try {
      const response = await firstValueFrom(response$);

      if (response.status >= 400) {
        throw new HttpException(response.data, response.status);
      }

      return response.data;
    } catch (error) {
      throw this.toHttpException(error, targetUrl);
    }
  }

  /**
   * Decides whether a failed attempt is worth repeating.
   *
   * @param {unknown} error - Error raised by the attempt.
   * @returns {boolean} `true` for timeouts, network failures and 502/503/504 answers.
   */
  private isTransient(error: unknown): boolean {
    if (error instanceof RetryableUpstreamResponseError || error instanceof TimeoutError) return true;

    const axiosError = error as AxiosLikeError;
    if (axiosError?.response) return RETRYABLE_STATUSES.has(axiosError.response.status);

    // No response at all: connection refused/reset, DNS failure, aborted request... Programming errors are not retried.
    return axiosError?.isAxiosError === true || typeof axiosError?.code === 'string';
  }

  /**
   * Normalises any failure into the `HttpException` returned to the client.
   *
   * @param {unknown} error - Error caught while forwarding.
   * @param {string} targetUrl - Target of the failed request (for logging only).
   * @returns {HttpException} Mirrored downstream error, or a gateway error carrying a stable code.
   */
  private toHttpException(error: unknown, targetUrl: string): HttpException {
    if (error instanceof HttpException) return error;

    if (error instanceof RetryableUpstreamResponseError) {
      return new HttpException(error.response.data as string | object, error.response.status);
    }

    const axiosError = error as AxiosLikeError;
    // Axios rejects instead of honouring `validateStatus` in some adapters/mocks; mirror those too.
    if (axiosError?.response && axiosError.response.status >= 400) {
      return new HttpException(axiosError.response.data as string | object, axiosError.response.status);
    }

    this.logger.error(`Failed to forward request to ${targetUrl}: ${axiosError?.message ?? 'unknown error'}`);

    const timedOut = error instanceof TimeoutError || TIMEOUT_CODES.has(axiosError?.code ?? '');
    return timedOut
      ? new HttpException({ statusCode: 504, message: UPSTREAM_TIMEOUT }, 504)
      : new HttpException({ statusCode: 502, message: UPSTREAM_UNAVAILABLE }, 502);
  }
}
