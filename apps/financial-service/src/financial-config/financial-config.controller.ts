/**
 * @file financial-config.controller.ts
 * @description Staff-only HTTP API for the academy's SEPA creditor / invoicing identity.
 */

import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, Roles, RolesGuard, TenantId } from '@dms/shared-auth';
import { Role } from '@dms/shared-types';
import { FinancialConfigService } from './financial-config.service';
import { UpdateFinancialConfigDto } from './dto/update-financial-config.dto';

/**
 * Staff-only tenant financial configuration (`/financial/config`).
 */
@ApiTags('Financial - Configuration')
@ApiBearerAuth()
@ApiHeader({ name: 'x-school-id', required: true, description: 'Tenant (academy) identifier.' })
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF)
@Controller('financial/config')
export class FinancialConfigController {
  /**
   * @param {FinancialConfigService} financialConfigService - Tenant-scoped persistence.
   */
  constructor(private readonly financialConfigService: FinancialConfigService) {}

  /**
   * Returns this tenant's configuration, creating a blank default when missing.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @returns {Promise<object>} The configuration row.
   */
  @Get()
  @ApiOperation({ summary: 'Get academy financial configuration' })
  @ApiResponse({ status: 200, description: 'Configuration returned (created if missing).' })
  async getConfig(@TenantId() tenantId: string) {
    return this.financialConfigService.getConfig(tenantId);
  }

  /**
   * Creates or updates this tenant's configuration.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {UpdateFinancialConfigDto} dto - Partial fields to persist.
   * @returns {Promise<object>} The persisted configuration.
   */
  @Put()
  @ApiOperation({ summary: 'Update academy financial configuration' })
  @ApiResponse({ status: 200, description: 'Configuration saved.' })
  async upsertConfig(@TenantId() tenantId: string, @Body() dto: UpdateFinancialConfigDto) {
    return this.financialConfigService.upsertConfig(tenantId, dto);
  }
}
