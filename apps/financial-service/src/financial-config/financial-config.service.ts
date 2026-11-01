/**
 * @file financial-config.service.ts
 * @description Owns the academy (tenant) SEPA creditor identity. Every query is scoped to `tenantId`
 * from `x-school-id`; there is no join to auth-service users or academic profiles.
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateFinancialConfigDto } from './dto/update-financial-config.dto';

/**
 * Persistence for `tenant_financial_configs`. One row per academy.
 */
@Injectable()
export class FinancialConfigService {
  /**
   * @param {PrismaService} prisma - Database access limited to the financial domain.
   */
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Returns the tenant config, creating a blank row (country `ES`) when none exists.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @returns {Promise<object>} The existing or newly created configuration.
   */
  async getConfig(tenantId: string) {
    return this.prisma.tenantFinancialConfig.upsert({
      where: { tenantId },
      create: { tenantId },
      update: {},
    });
  }

  /**
   * Creates or updates the tenant configuration. Only provided DTO fields are written.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {UpdateFinancialConfigDto} data - Partial creditor / invoicing fields.
   * @returns {Promise<object>} The persisted configuration.
   */
  async upsertConfig(tenantId: string, data: UpdateFinancialConfigDto) {
    return this.prisma.tenantFinancialConfig.upsert({
      where: { tenantId },
      create: { tenantId, ...data },
      update: { ...data },
    });
  }
}
