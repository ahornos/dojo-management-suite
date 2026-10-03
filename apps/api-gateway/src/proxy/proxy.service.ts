import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Request } from 'express';
import { firstValueFrom } from 'rxjs';

/**
 * @file proxy.service.ts
 * @description Service responsible for forwarding incoming HTTP requests from the API Gateway
 * to downstream microservices. Propagates vital headers (Authorization, Tenant ID, Client IPs).
 */
@Injectable()
export class ProxyService {
  private readonly logger = new Logger(ProxyService.name);

  constructor(private readonly httpService: HttpService) {}

  /**
   * Forwards a client request to a target microservice URL, preserving headers and query parameters.
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
        validateStatus: () => true, // Let the gateway pass through downstream HTTP status codes transparently
      });

      const response = await firstValueFrom(response$);
      return response.data;
    } catch (error: any) {
      this.logger.error(`Failed to forward request to ${targetUrl}: ${error.message}`);
      throw error; // Propagates to the GlobalExceptionFilter for proper formatting
    }
  }
}