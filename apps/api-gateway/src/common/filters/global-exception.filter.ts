import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * @file global-exception.filter.ts
 * @description Global exception filter for the API Gateway.
 * Intercepts standard HTTP exceptions, proxy network errors (e.g., ECONNREFUSED, ETIMEDOUT),
 * and microservice downstream errors to return standardized JSON responses.
 */

/**
 * Pulls a string or class-validator message array out of a Nest/Axios error payload.
 * Downstream ValidationPipe bodies (`{ message: string[] }`) and raw arrays are preserved
 * so the frontend can display the actual 400 reasons instead of a generic "Bad Request".
 *
 * @param {unknown} payload - `HttpException.getResponse()`, Axios `response.data`, or a nested `message`.
 * @param {string} fallback - Used when the payload has no usable message.
 * @returns {string | string[]} Machine-readable code or ValidationPipe constraint list.
 */
export function extractErrorMessage(payload: unknown, fallback: string): string | string[] {
  if (Array.isArray(payload) && payload.every((item) => typeof item === 'string')) {
    return payload;
  }
  if (typeof payload === 'string' && payload.length > 0) {
    return payload;
  }
  if (payload && typeof payload === 'object') {
    const record = payload as { message?: unknown };
    if (record.message !== undefined && record.message !== payload) {
      return extractErrorMessage(record.message, fallback);
    }
  }
  return fallback;
}

/**
 * Gateway-wide exception filter. Downstream 400 validation arrays are forwarded verbatim.
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  /**
   * Converts any thrown value into the standard gateway error payload.
   * `message` carries either downstream validation messages or a stable machine-readable code
   * (`UPSTREAM_UNAVAILABLE`, `UPSTREAM_TIMEOUT`, `INTERNAL_SERVER_ERROR`) that the frontend maps to a translation.
   *
   * @param {unknown} exception - The thrown value (HttpException, Axios error or unknown).
   * @param {ArgumentsHost} host - Execution context giving access to the HTTP request/response.
   * @returns {void} Writes the JSON response; nothing is returned.
   */
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'INTERNAL_SERVER_ERROR';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = extractErrorMessage(exception.getResponse(), exception.message);
    } else if (isNamedError(exception, 'ECONNREFUSED')) {
      status = HttpStatus.BAD_GATEWAY;
      message = 'UPSTREAM_UNAVAILABLE';
      this.logger.error(`Proxy Error: Connection refused for ${request.url}`);
    } else if (isNamedError(exception, 'ETIMEDOUT')) {
      status = HttpStatus.GATEWAY_TIMEOUT;
      message = 'UPSTREAM_TIMEOUT';
      this.logger.error(`Proxy Error: Timeout for ${request.url}`);
    } else if (isAxiosError(exception) && exception.response) {
      status = exception.response.status;
      message = extractErrorMessage(exception.response.data, exception.message);
    } else {
      const error = exception as { message?: string; stack?: string };
      this.logger.error(`Unhandled exception: ${error.message}`, error.stack);
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}

/**
 * Narrows a thrown value that carries a Node-style `code` string.
 *
 * @param {unknown} exception - Thrown value.
 * @param {string} code - Expected `code`.
 * @returns {boolean} Whether the value matches.
 */
function isNamedError(exception: unknown, code: string): boolean {
  return Boolean(exception && typeof exception === 'object' && (exception as { code?: string }).code === code);
}

/**
 * Minimal Axios error shape used by the filter.
 */
interface AxiosLikeError {
  isAxiosError?: boolean;
  message: string;
  response?: { status: number; data: unknown };
}

/**
 * Narrows a thrown Axios error that already has an HTTP response.
 *
 * @param {unknown} exception - Thrown value.
 * @returns {exception is AxiosLikeError} Whether the value looks like an Axios error.
 */
function isAxiosError(exception: unknown): exception is AxiosLikeError {
  return Boolean(exception && typeof exception === 'object' && (exception as AxiosLikeError).isAxiosError);
}
