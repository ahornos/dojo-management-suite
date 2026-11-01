/**
 * @file bank-mandates.controller.ts
 * @description HTTP API for SEPA bank mandates and clickwrap digital signature.
 */

import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClientIp, CurrentUser, JwtAuthGuard, Roles, RolesGuard, TenantId } from '@dms/shared-auth';
import { AuthenticatedUser, Role } from '@dms/shared-types';
import { BankMandatesService } from './bank-mandates.service';
import { CreateBankMandateDto } from './dto/create-bank-mandate.dto';
import { FindMandateQueryDto } from './dto/find-mandate-query.dto';
import { SignMandateDto } from './dto/sign-mandate.dto';

/**
 * SEPA mandate registration, lookup, and digital signature (`/financial/mandates`).
 */
@ApiTags('Financial - Bank Mandates')
@ApiBearerAuth()
@ApiHeader({ name: 'x-school-id', required: true, description: 'Tenant (academy) identifier.' })
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('financial/mandates')
export class BankMandatesController {
  /**
   * @param {BankMandatesService} bankMandatesService - Mandate persistence.
   */
  constructor(private readonly bankMandatesService: BankMandatesService) {}

  /**
   * Registers an unsigned SEPA mandate for a payer, or returns the payer's existing active mandate.
   *
   * @param {CreateBankMandateDto} dto - Payer, IBAN, and account-holder identity.
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @returns {Promise<object>} The persisted mandate (reference generated server-side).
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF)
  @ApiOperation({ summary: 'Register a SEPA bank mandate' })
  @ApiResponse({ status: 201, description: 'Bank mandate successfully registered.' })
  async create(@Body() dto: CreateBankMandateDto, @TenantId() tenantId: string) {
    return this.bankMandatesService.create(dto, tenantId);
  }

  /**
   * Loads a mandate by id, or the latest active mandate for a payer in this tenant.
   *
   * @param {FindMandateQueryDto} query - Mandate id or payer user id.
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @returns {Promise<object>} The mandate.
   */
  @Get()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF, Role.PARENT, Role.STUDENT)
  @ApiOperation({ summary: 'Get a SEPA mandate by id or payer' })
  async findOne(@Query() query: FindMandateQueryDto, @TenantId() tenantId: string) {
    if (query.id) {
      return this.bankMandatesService.findById(tenantId, query.id);
    }
    if (query.payerUserId) {
      return this.bankMandatesService.findForPayer(tenantId, query.payerUserId);
    }
    throw new BadRequestException('MANDATE_QUERY_REQUIRED');
  }

  /**
   * Records clickwrap acceptance. User id comes from the JWT; IP from gateway headers.
   *
   * @param {string} id - Mandate UUID.
   * @param {SignMandateDto} dto - Explicit `accepted: true`.
   * @param {AuthenticatedUser} user - Signer from the access token.
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {string} ipAddress - Client IP forwarded by the API Gateway.
   * @returns {Promise<object>} The signed mandate.
   */
  @Patch(':id/sign')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF, Role.PARENT, Role.STUDENT)
  @ApiOperation({ summary: 'Digitally sign a SEPA mandate (clickwrap)' })
  @ApiResponse({ status: 200, description: 'Mandate marked as signed.' })
  async sign(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() _dto: SignMandateDto,
    @CurrentUser() user: AuthenticatedUser,
    @TenantId() tenantId: string,
    @ClientIp() ipAddress: string,
  ) {
    return this.bankMandatesService.markAsSigned(id, tenantId, user.userId, ipAddress, user.roles);
  }
}
