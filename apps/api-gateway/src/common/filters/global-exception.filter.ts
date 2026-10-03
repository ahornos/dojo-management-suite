import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * @file global-exception.filter.ts
 * @description Global exception filter for the API Gateway.
 * Intercepts standard HTTP exceptions, proxy network errors (e.g., ECONNREFUSED, ETIMEDOUT),
 * and microservice downstream errors to return standardized JSON responses.
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';

    if (exception instanceof HttpException) {
      // Standard NestJS HTTP Exceptions (e.g., ValidationPipe 400s, 401 Unauthorized)
      status = exception.getStatus();
      const exceptionResponse: any = exception.getResponse();
      message = exceptionResponse.message || exception.message;
    } else if (exception.code === 'ECONNREFUSED') {
      // Internal microservice is down or unreachable
      status = HttpStatus.BAD_GATEWAY;
      message = 'Target microservice is unavailable or unreachable (Bad Gateway).';
      this.logger.error(`Proxy Error: Connection refused for ${request.url}`);
    } else if (exception.code === 'ETIMEDOUT') {
      // Internal microservice takes too long to respond
      status = HttpStatus.GATEWAY_TIMEOUT;
      message = 'Target microservice timed out (Gateway Timeout).';
      this.logger.error(`Proxy Error: Timeout for ${request.url}`);
    } else if (exception.isAxiosError && exception.response) {
      // Propagate the exact error status and message returned by the downstream microservice
      status = exception.response.status;
      message = exception.response.data?.message || exception.message;
    } else {
      // Log completely unknown errors for internal debugging
      this.logger.error(`Unhandled exception: ${exception.message}`, exception.stack);
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}