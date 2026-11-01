/**
 * @file federations.client.ts
 * @description HTTP client for the financial-service internal federation API.
 * Academic-service must not query the `federations` table (financial bounded context).
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
import { INTERNAL_API_KEY_HEADER } from '@dms/shared-types';
import { FederationSeasonCatalog } from '../licenses/license-pricing';

/** Per-attempt time budget before the request is aborted. */
export const FEDERATIONS_TIMEOUT_MS = 5000;
/** Retries after the first attempt, applied only to transient failures. */
export const FEDERATIONS_MAX_RETRIES = 2;
/** First backoff delay; doubles on every retry. */
export const FEDERATIONS_BACKOFF_MS = 200;

/** Stable error code when financial-service stays unreachable. */
export const FINANCIAL_SERVICE_UNAVAILABLE = 'FINANCIAL_SERVICE_UNAVAILABLE';

const TENANT_HEADER = 'x-school-id';

/**
 * JSON-safe federation catalog returned by financial-service.
 */
export interface FederationCatalog {
  id: string;
  name?: string;
  acronym?: string;
  isActive: boolean;
  seasons?: FederationSeasonCatalog[];
}

/**
 * One holder to register as a seasonal federation charge.
 */
export interface FederationChargeHolder {
  holderType: string;
  holderUserId?: string;
  studentProfileId?: string;
  licenseId?: string;
  costAmount?: string;
  saleAmount?: string;
}

/**
 * HTTP client for `/api/internal/federations`.
 */
@Injectable()
export class FederationsClient {
  private readonly logger = new Logger(FederationsClient.name);
  private readonly baseUrl: string;
  private readonly apiKey: string;

  /**
   * @param {HttpService} httpService - Axios wrapper.
   * @param {ConfigService} configService - `FINANCIAL_SERVICE_URL` and `INTERNAL_API_KEY`.
   * @throws {Error} If either variable is missing.
   */
  constructor(
    private readonly httpService: HttpService,
    configService: ConfigService,
  ) {
    const host = configService.getOrThrow<string>('FINANCIAL_SERVICE_URL').replace(/\/+$/, '');
    this.baseUrl = `${host}/api/internal/federations`;
    this.apiKey = configService.getOrThrow<string>('INTERNAL_API_KEY');
  }

  /**
   * Loads one tenant federation. Throws `FEDERATION_NOT_FOUND` when missing.
   *
   * @param {string} tenantId - Academy key.
   * @param {string} federationId - Federation UUID.
   * @returns {Promise<FederationCatalog>} Catalog row.
   */
  getFederation(tenantId: string, federationId: string): Promise<FederationCatalog> {
    return this.execute<FederationCatalog>(() =>
      this.httpService.get<FederationCatalog>(
        `${this.baseUrl}/${encodeURIComponent(federationId)}`,
        this.requestConfig(tenantId),
      ),
    );
  }

  /**
   * Persists seasonal charges for issued, non-exempt licenses.
   *
   * @param {string} tenantId - Academy key.
   * @param {string} federationId - Federation UUID.
   * @param {string} season - `YYYY-YYYY`.
   * @param {FederationChargeHolder[]} holders - Charge rows with Decimal string amounts.
   * @param {boolean} [includeClubFee] - Also persist the club licensing cost.
   * @returns {Promise<{ created: number; skipped: number }>} Insert vs duplicate counts.
   */
  registerCharges(
    tenantId: string,
    federationId: string,
    season: string,
    holders: FederationChargeHolder[],
    includeClubFee = false,
  ): Promise<{ created: number; skipped: number }> {
    return this.execute<{ created: number; skipped: number }>(() =>
      this.httpService.post<{ created: number; skipped: number }>(
        `${this.baseUrl}/${encodeURIComponent(federationId)}/charges`,
        { season, includeClubFee, holders },
        this.requestConfig(tenantId),
      ),
    );
  }

  /**
   * @param {string} tenantId - Academy key forwarded as `x-school-id`.
   * @returns {{ headers: Record<string, string> }} Authenticated request config.
   */
  private requestConfig(tenantId: string): { headers: Record<string, string> } {
    return {
      headers: {
        [INTERNAL_API_KEY_HEADER]: this.apiKey,
        [TENANT_HEADER]: tenantId,
      },
    };
  }

  /**
   * @param {() => Observable<AxiosResponse<T>>} requestFactory - Cold request factory.
   * @returns {Promise<T>} Response body.
   */
  private async execute<T>(requestFactory: () => Observable<AxiosResponse<T>>): Promise<T> {
    try {
      const response = await firstValueFrom(
        defer(requestFactory).pipe(
          timeout(FEDERATIONS_TIMEOUT_MS),
          retry({
            count: FEDERATIONS_MAX_RETRIES,
            delay: (error: unknown, retryCount: number) =>
              this.isTransient(error)
                ? timer(FEDERATIONS_BACKOFF_MS * 2 ** (retryCount - 1))
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
   * @param {unknown} error - HTTP failure.
   * @returns {boolean} Whether a retry may succeed.
   */
  private isTransient(error: unknown): boolean {
    if (error instanceof TimeoutError) {
      return true;
    }
    return isAxiosError(error) && (!error.response || error.response.status >= 500);
  }

  /**
   * @param {unknown} error - HTTP failure.
   * @returns {HttpException} Mapped Nest exception.
   */
  private mapError(error: unknown): HttpException {
    if (isAxiosError(error) && error.response) {
      const { status, data } = error.response as { status: number; data?: { message?: unknown } };
      const code = typeof data?.message === 'string' ? data.message : undefined;
      if (status === 400) return new BadRequestException(code ?? 'FEDERATION_REQUEST_REJECTED');
      if (status === 404) return new NotFoundException(code ?? 'FEDERATION_NOT_FOUND');
    }

    this.logger.error(`Federation client call failed: ${error instanceof Error ? error.message : String(error)}`);
    return new ServiceUnavailableException(FINANCIAL_SERVICE_UNAVAILABLE);
  }
}
