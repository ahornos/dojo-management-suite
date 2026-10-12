import { Controller, All, Req } from '@nestjs/common';
import type { Request } from 'express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ProxyService } from '../proxy/proxy.service';
import { resolveServiceUrl } from '../config/gateway.config';

/**
 * @file financial.controller.ts
 * @description API Gateway controller responsible for routing financial and billing requests.
 * Acts as a reverse proxy forwarding requests to the internal financial-service.
 */
@ApiTags('Financial Proxy')
@ApiBearerAuth()
@Controller()
export class FinancialController {
  /** Internal base URL of the financial-service, resolved once from configuration. */
  private readonly targetUrl: string;

  /**
   * @param {ProxyService} proxyService - Forwards requests to the downstream service.
   * @param {ConfigService} config - Source of `FINANCIAL_SERVICE_URL`.
   */
  constructor(
    private readonly proxyService: ProxyService,
    config: ConfigService,
  ) {
    this.targetUrl = resolveServiceUrl(config, 'FINANCIAL_SERVICE_URL');
  }

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