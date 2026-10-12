/**
 * @file users-directory.client.ts
 * @description Read-only HTTP client for the auth-service internal user directory (`/api/internal/users`).
 * It is the only way the financial bounded context may resolve identities, replacing direct access to the
 * `users` table. Adds service authentication, per-attempt timeouts and retries with exponential backoff,
 * and maps upstream failures to Nest exceptions.
 */

import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  HttpException,
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse, isAxiosError } from 'axios';
import { defer, firstValueFrom, Observable, retry, throwError, timeout, TimeoutError, timer } from 'rxjs';
import {
  INTERNAL_API_KEY_HEADER,
  UserBatchRequest,
  UserSummary,
} from '@dms/shared-types';

/** Per-attempt time budget before the request is aborted. */
export const USER_DIRECTORY_TIMEOUT_MS = 5000;
/** Retries after the first attempt, applied only to transient failures. */
export const USER_DIRECTORY_MAX_RETRIES = 2;
/** First backoff delay; doubles on every retry. */
export const USER_DIRECTORY_BACKOFF_MS = 200;
/** Server-side cap of ids per batch request (see auth-service `USER_BATCH_MAX_SIZE`). */
export const USER_DIRECTORY_BATCH_SIZE = 500;

/** Stable error codes surfaced to API consumers (translated by the frontend). */
export const USER_DIRECTORY_UNAVAILABLE = 'AUTH_SERVICE_UNAVAILABLE';

@Injectable()
export class UsersDirectoryClient {
  private readonly logger = new Logger(UsersDirectoryClient.name);
  private readonly baseUrl: string;
  private readonly apiKey: string;

  /**
   * @param {HttpService} httpService - Axios wrapper used for the outbound calls.
   * @param {ConfigService} configService - Provides `AUTH_SERVICE_URL` and `INTERNAL_API_KEY`.
   * @throws {Error} If either variable is not configured.
   */
  constructor(
    private readonly httpService: HttpService,
    configService: ConfigService,
  ) {
    this.baseUrl = `${configService.getOrThrow<string>('AUTH_SERVICE_URL').replace(/\/+$/, '')}/api/internal/users`;
    this.apiKey = configService.getOrThrow<string>('INTERNAL_API_KEY');
  }

  /**
   * Resolves users by id. Ids are de-duplicated and split into server-sized chunks that run in parallel,
   * so any number of users costs a constant number of round trips (never N+1).
   *
   * @param {Array<string | null | undefined>} ids - User identifiers; nullish entries are ignored.
   * @returns {Promise<Map<string, UserSummary>>} Users found, indexed by id (unknown ids are absent).
   * @throws {ServiceUnavailableException} If the auth-service stays unreachable after retries.
   */
  async findManyByIds(ids: Array<string | null | undefined>): Promise<Map<string, UserSummary>> {
    const uniqueIds = Array.from(new Set(ids.filter((id): id is string => Boolean(id))));
    const chunks: string[][] = [];

    for (let i = 0; i < uniqueIds.length; i += USER_DIRECTORY_BATCH_SIZE) {
      chunks.push(uniqueIds.slice(i, i + USER_DIRECTORY_BATCH_SIZE));
    }

    const responses = await Promise.all(
      chunks.map((chunk) =>
        this.execute<UserSummary[]>(() =>
          this.httpService.post<UserSummary[]>(`${this.baseUrl}/batch`, { ids: chunk } satisfies UserBatchRequest, this.requestConfig()),
        ),
      ),
    );

    return new Map(responses.flat().map((user) => [user.id, user]));
  }

  /**
   * Builds the axios config carrying the service-to-service credential.
   *
   * @returns {{ headers: Record<string, string> }} Request config with the internal API key header.
   */
  private requestConfig(): { headers: Record<string, string> } {
    return { headers: { [INTERNAL_API_KEY_HEADER]: this.apiKey } };
  }

  /**
   * Runs a request with a timeout and exponential-backoff retries on transient failures, unwrapping the body.
   * The factory is re-invoked per attempt so every retry issues a fresh HTTP call.
   *
   * @param {() => Observable<AxiosResponse<T>>} requestFactory - Builds the cold request observable.
   * @returns {Promise<T>} Response body.
   * @throws {HttpException} Mapped upstream failure.
   */
  private async execute<T>(requestFactory: () => Observable<AxiosResponse<T>>): Promise<T> {
    try {
      const response = await firstValueFrom(
        defer(requestFactory).pipe(
          timeout(USER_DIRECTORY_TIMEOUT_MS),
          retry({
            count: USER_DIRECTORY_MAX_RETRIES,
            delay: (error: unknown, retryCount: number) =>
              this.isTransient(error)
                ? timer(USER_DIRECTORY_BACKOFF_MS * 2 ** (retryCount - 1))
                : throwError(() => error),
          }),
        ),
      );
      return response.data;
    } catch (error) {
      throw this.mapError(error);
    }
  }

  /**
   * Tells whether a failure is worth retrying (network error, timeout, or 5xx).
   *
   * @param {unknown} error - Failure raised by the HTTP call.
   * @returns {boolean} `true` when a retry may succeed.
   */
  private isTransient(error: unknown): boolean {
    if (error instanceof TimeoutError) {
      return true;
    }

    return isAxiosError(error) && (!error.response || error.response.status >= 500);
  }

  /**
   * Translates an upstream failure to a domain-appropriate Nest exception.
   * Upstream error codes (e.g. `USER_NOT_FOUND`) are forwarded verbatim; other failures,
   * including credential problems, are reported as service unavailability.
   *
   * @param {unknown} error - Failure raised by the HTTP call.
   * @returns {HttpException} Exception to throw to the API consumer.
   */
  private mapError(error: unknown): HttpException {
    if (isAxiosError(error) && error.response) {
      const { status, data } = error.response as { status: number; data?: { message?: unknown } };
      const code = typeof data?.message === 'string' ? data.message : undefined;

      if (status === 400) return new BadRequestException(code ?? 'USER_DIRECTORY_REQUEST_REJECTED');
      if (status === 404) return new NotFoundException(code ?? 'USER_NOT_FOUND');
    }

    this.logger.error(`User directory call failed: ${error instanceof Error ? error.message : String(error)}`);
    return new ServiceUnavailableException(USER_DIRECTORY_UNAVAILABLE);
  }
}
