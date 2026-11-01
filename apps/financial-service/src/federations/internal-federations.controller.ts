/**
 * @file internal-federations.controller.ts
 * @description Service-to-service catalog lookup and seasonal charge registration.
 * Not routed by the API Gateway; academic-service authenticates with `x-internal-api-key`.
 */

import { Body, Controller, Get, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { TenantId } from '@dms/shared-auth';
import { InternalApiKeyGuard } from '../guards/internal-api-key.guard';
import { FederationsService } from './federations.service';
import { BatchFederationChargesDto } from './dto/batch-federation-charges.dto';

/**
 * Internal federation API consumed by academic-service (`/api/internal/federations`).
 */
@ApiExcludeController()
@UseGuards(InternalApiKeyGuard)
@Controller('internal/federations')
export class InternalFederationsController {
  /**
   * @param {FederationsService} federationsService - Tenant-scoped catalog and charges.
   */
  constructor(private readonly federationsService: FederationsService) {}

  /**
   * Returns one federation catalog row so academic-service can price licenses.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {string} id - Federation UUID.
   * @returns {Promise<object>} JSON-safe catalog row.
   */
  @Get(':id')
  findOne(@TenantId() tenantId: string, @Param('id', ParseUUIDPipe) id: string) {
    return this.federationsService.findOne(tenantId, id);
  }

  /**
   * Registers seasonal charges for issued (non-exempt) licenses.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {string} id - Federation UUID.
   * @param {BatchFederationChargesDto} dto - Season and holders (optional amount overrides).
   * @returns {Promise<{ created: number; skipped: number }>} Insert vs duplicate counts.
   */
  @Post(':id/charges')
  createCharges(
    @TenantId() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: BatchFederationChargesDto,
  ) {
    return this.federationsService.createCharges(tenantId, id, dto);
  }
}
