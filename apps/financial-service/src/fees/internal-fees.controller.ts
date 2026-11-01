/**
 * @file internal-fees.controller.ts
 * @description Service-to-service one-off member charge creation.
 * Not routed by the API Gateway; academic-service authenticates with `x-internal-api-key`.
 */

import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { TenantId } from '@dms/shared-auth';
import { InternalApiKeyGuard } from '../guards/internal-api-key.guard';
import { FeesService } from './fees.service';
import { BatchStudentChargesDto } from './dto/batch-student-charges.dto';

/**
 * Internal fee API consumed by academic-service (`/api/internal/financial/fees`).
 */
@ApiExcludeController()
@UseGuards(InternalApiKeyGuard)
@Controller('internal/financial/fees')
export class InternalFeesController {
  /**
   * @param {FeesService} feesService - Fee tiers and one-off member charges.
   */
  constructor(private readonly feesService: FeesService) {}

  /**
   * Persists one-off `StudentCharge` rows for a license batch.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {BatchStudentChargesDto} dto - Charge rows (Decimal string amounts).
   * @returns {Promise<{ feeIds: string[] }>} Generated charge ids, same order as input.
   */
  @Post('batch')
  createBatch(@TenantId() tenantId: string, @Body() dto: BatchStudentChargesDto) {
    return this.feesService.createChargeBatch(tenantId, dto);
  }
}
