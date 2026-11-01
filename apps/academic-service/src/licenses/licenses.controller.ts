/**
 * @file licenses.controller.ts
 * @description Staff HTTP API for affiliation licenses, expiry alerts, and batch issuance.
 */

import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, Roles, RolesGuard, TenantId } from '@dms/shared-auth';
import { Role } from '@dms/shared-types';
import { LicensesService } from './licenses.service';
import { IssueLicenseDto } from './dto/issue-license.dto';
import { PreviewLicensesDto } from './dto/preview-licenses.dto';
import { BatchIssueLicensesDto } from './dto/batch-issue-licenses.dto';

/**
 * Staff-only affiliation licenses (`/licenses` proxied as `/academic/licenses`).
 */
@ApiTags('Academic - Licenses')
@ApiBearerAuth()
@ApiHeader({ name: 'x-school-id', required: true, description: 'Tenant (academy) identifier.' })
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF)
@Controller('licenses')
export class LicensesController {
  /**
   * @param {LicensesService} licensesService - License history and batch engine.
   */
  constructor(private readonly licensesService: LicensesService) {}

  /**
   * Active licenses expiring within the given number of days (default 30).
   * Registered before `GET /` so the static path is not treated as a list query.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {string} [days] - Window size.
   * @returns {Promise<object[]>} Expiring licenses.
   */
  @Get('expiring')
  @ApiOperation({ summary: 'List licenses expiring within N days' })
  findExpiring(@TenantId() tenantId: string, @Query('days') days?: string) {
    const parsed = days ? Number.parseInt(days, 10) : 30;
    return this.licensesService.findExpiring(tenantId, Number.isFinite(parsed) ? parsed : 30);
  }

  /**
   * Current federative status for one student (directory badge). Instructors may read this.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {string} studentProfileId - Academic student profile UUID.
   * @returns {Promise<object>} Federated flag and current affiliations.
   */
  @Get('affiliation-status')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF, Role.INSTRUCTOR, Role.SPORTS_TECHNICAL_DIRECTOR)
  @ApiOperation({ summary: 'Get current federation status for a student' })
  getAffiliationStatus(
    @TenantId() tenantId: string,
    @Query('studentProfileId') studentProfileId: string,
  ) {
    return this.licensesService.getAffiliationStatus(tenantId, studentProfileId);
  }

  /**
   * Lists licenses of this tenant.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {string} [federationId] - Optional federation filter.
   * @param {string} [holderUserId] - Optional holder filter.
   * @param {string} [studentProfileId] - Optional student profile filter.
   * @returns {Promise<object[]>} License rows.
   */
  @Get()
  @ApiOperation({ summary: 'List affiliation licenses' })
  findAll(
    @TenantId() tenantId: string,
    @Query('federationId') federationId?: string,
    @Query('holderUserId') holderUserId?: string,
    @Query('studentProfileId') studentProfileId?: string,
  ) {
    return this.licensesService.findAll(tenantId, { federationId, holderUserId, studentProfileId });
  }

  /**
   * Previews holders matching massive-issuance filters without writing.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {PreviewLicensesDto} dto - Filters.
   * @returns {Promise<object>} Matching holders.
   */
  @Post('preview')
  @ApiOperation({ summary: 'Preview license batch candidates' })
  preview(@TenantId() tenantId: string, @Body() dto: PreviewLicensesDto) {
    return this.licensesService.preview(tenantId, dto);
  }

  /**
   * Issues licenses in bulk. When `studentProfileIds` is present, runs the
   * selected-student engine (hydrate, price, charge, persist). Otherwise uses filters.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {BatchIssueLicensesDto} dto - Filters or explicit student profile ids.
   * @returns {Promise<object>} Filter summary or selected-student `{ totalProcessed, successCount, skippedCount, skippedDetails }`.
   */
  @Post('batch')
  @ApiOperation({ summary: 'Issue licenses in bulk (filters or explicit student ids)' })
  issueBatch(@TenantId() tenantId: string, @Body() dto: BatchIssueLicensesDto) {
    if (dto.studentProfileIds?.length) {
      return this.licensesService.issueSelectedStudents(tenantId, dto);
    }
    return this.licensesService.issueBatch(tenantId, dto);
  }

  /**
   * Issues or renews (new season) one license.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {IssueLicenseDto} dto - Holder and season.
   * @returns {Promise<object>} Created license.
   */
  @Post()
  @ApiOperation({ summary: 'Issue a single affiliation license' })
  issue(@TenantId() tenantId: string, @Body() dto: IssueLicenseDto) {
    return this.licensesService.issue(tenantId, dto);
  }
}
