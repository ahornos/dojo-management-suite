import { Controller, All, Req } from '@nestjs/common';
import type { Request } from 'express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProxyService } from '../proxy/proxy.service';

/**
 * @file financial.controller.ts
 * @description API Gateway controller responsible for routing financial and billing requests.
 * Acts as a reverse proxy forwarding requests to the internal financial-service.
 */
@ApiTags('Financial Proxy')
@ApiBearerAuth()
@Controller()
export class FinancialController {
  // Internal URL resolved from the environment, defaulting to the Docker service name
  private readonly targetUrl = process.env.FINANCIAL_SERVICE_URL || 'http://financial-service:3000';

  constructor(private readonly proxyService: ProxyService) {}

  /**
   * @description Catch-all route to forward daily cash register and POS requests.
   * @param {Request} req - The incoming Express request object.
   * @returns {Promise<any>} The transparent response from the financial-service.
   */
  @All('financial/cash*')
  @ApiOperation({ summary: 'Forward all cash register requests' })
  async proxyCash(@Req() req: Request) {
    return this.proxyService.forwardRequest(`${this.targetUrl}${req.originalUrl}`, req);
  }

  /**
   * @description Catch-all route to forward fee assignment and historical overrides.
   * @param {Request} req - The incoming Express request object.
   * @returns {Promise<any>} The transparent response from the financial-service.
   */
  @All('financial/fees*')
  @ApiOperation({ summary: 'Forward all fee assignment requests' })
  async proxyFees(@Req() req: Request) {
    return this.proxyService.forwardRequest(`${this.targetUrl}${req.originalUrl}`, req);
  }

  /**
   * @description Catch-all route to forward SEPA direct debit batch requests.
   * @param {Request} req - The incoming Express request object.
   * @returns {Promise<any>} The transparent response from the financial-service.
   */
  @All('financial/remittances*')
  @ApiOperation({ summary: 'Forward all SEPA remittance requests' })
  async proxyRemittances(@Req() req: Request) {
    return this.proxyService.forwardRequest(`${this.targetUrl}${req.originalUrl}`, req);
  }

  /**
   * @description Catch-all route to forward dynamic discount and financial campaign requests.
   * @param {Request} req - The incoming Express request object.
   * @returns {Promise<any>} The transparent response from the financial-service.
   */
  @All('financial/discounts*')
  @ApiOperation({ summary: 'Forward all financial discount requests' })
  async proxyDiscounts(@Req() req: Request) {
    return this.proxyService.forwardRequest(`${this.targetUrl}${req.originalUrl}`, req);
  }
}