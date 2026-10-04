/**
 * @file proxy.service.ts
 * @description Service responsible for forwarding incoming HTTP requests from the API Gateway
 * to downstream microservices. Propagates vital headers and mirrors downstream HTTP status codes.
 */

import { Injectable, Logger, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Request } from 'express';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProxyService {
  private readonly logger = new Logger(ProxyService.name);

  constructor(private readonly httpService: HttpService) {}

  /**
   * Forwards a client request to a target microservice URL, preserving headers and query parameters.
   * Mirrors the exact HTTP status code returned by the target microservice back to the client.
   * 
   * @param {string} targetUrl - The absolute URL of the downstream microservice endpoint.
   * @param {Request} req - The incoming Express request object from the Gateway.
   * @returns {Promise<any>} The data returned by the target microservice.
   */
  async forwardRequest(targetUrl: string, req: Request): Promise<any> {
    // 1. Extract and sanitize headers to propagate
    const headers = {
      ...(req.headers.authorization && { authorization: req.headers.authorization }),
      ...(req.headers['x-school-id'] && { 'x-school-id': req.headers['x-school-id'] }),
      'x-forwarded-for': req.ip || req.socket.remoteAddress,
      'x-real-ip': req.ip,
      // Forward content-type if present (e.g., application/json for POST/PUT requests)
      ...(req.headers['content-type'] && { 'content-type': req.headers['content-type'] }),
    };

    this.logger.log(`Forwarding ${req.method} request to: ${targetUrl}`);

    try {
      // 2. Execute the HTTP request matching the original method and payload
      const response$ = this.httpService.request({
        method: req.method,
        url: targetUrl,
        headers,
        data: req.body,
        params: req.query,
        validateStatus: () => true, // Attempt to resolve all HTTP statuses organically (Production behavior)
      });

      const response = await firstValueFrom(response$);

      // 3. Mirror downstream error statuses natively
      if (response.status >= 400) {
        throw new HttpException(response.data, response.status);
      }

      return response.data;
    } catch (error: any) {
      // If we manually threw an HttpException above, propagate it
      if (error instanceof HttpException) {
        throw error;
      }

      // CRITICAL E2E TEST FIX: 
      // Jest Axios mocks often reject promises directly instead of respecting `validateStatus`.
      // We catch the raw AxiosError here and convert it to a NestJS HttpException.
      if (error.response && error.response.status >= 400) {
        throw new HttpException(error.response.data, error.response.status);
      }
      
      this.logger.error(`Failed to forward request to ${targetUrl}: ${error.message}`);
      // Fallback for network errors (e.g., the downstream service is offline or unreachable)
      throw new HttpException({ message: 'Gateway Timeout or Internal Proxy Error' }, 504);
    }
  }
}