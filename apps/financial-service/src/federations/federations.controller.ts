/**
 * @file federations.controller.ts
 * @description Staff-only HTTP API for federation catalogs, seasonal charges, and payout budgets.
 */

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser, JwtAuthGuard, Roles, RolesGuard, TenantId } from '@dms/shared-auth';
import { AuthenticatedUser, Role } from '@dms/shared-types';
import { FederationsService } from './federations.service';
import { CreateFederationDto } from './dto/create-federation.dto';
import { UpdateFederationDto } from './dto/update-federation.dto';
import { BatchFederationChargesDto } from './dto/batch-federation-charges.dto';
import { PreviewFederationBudgetDto } from './dto/preview-federation-budget.dto';
import { FederationContactDto, ReplaceFederationContactsDto } from './dto/federation-contact.dto';
import { FederationListQueryDto } from './dto/federation-list-query.dto';
import { DeleteFederationQueryDto } from './dto/delete-federation-query.dto';

/**
 * Staff-only federation catalog (`/financial/federations`).
 */
@ApiTags('Financial - Federations')
@ApiBearerAuth()
@ApiHeader({ name: 'x-school-id', required: true, description: 'Tenant (academy) identifier.' })
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF)
@Controller('financial/federations')
export class FederationsController {
  /**
   * @param {FederationsService} federationsService - Tenant-scoped catalog and budget logic.
   */
  constructor(private readonly federationsService: FederationsService) {}

  /**
   * Creates a federation catalog entry.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {CreateFederationDto} dto - Identity, contacts, and seasons.
   * @returns {Promise<object>} Created row.
   */
  @Post()
  @ApiOperation({ summary: 'Create a federation catalog entry' })
  @ApiResponse({ status: 201, description: 'Federation created.' })
  create(@TenantId() tenantId: string, @Body() dto: CreateFederationDto) {
    return this.federationsService.create(tenantId, dto);
  }

  /**
   * Lists federations of this tenant. Soft-deleted rows require SUPER_ADMIN + `status=DELETED`.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {FederationListQueryDto} query - Search and status filter.
   * @param {AuthenticatedUser} user - Caller (roles gate the deleted filter).
   * @returns {Promise<object[]>} Catalog rows.
   */
  @Get()
  @ApiOperation({ summary: 'List federations' })
  findAll(
    @TenantId() tenantId: string,
    @Query() query: FederationListQueryDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.federationsService.findAll(tenantId, query, user.roles);
  }

  /**
   * Returns the payout from persisted seasonal charges.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {string} id - Federation UUID.
   * @param {string} season - Season query.
   * @returns {Promise<object>} Cost and sale totals.
   */
  @Get(':id/budget')
  @ApiOperation({ summary: 'Get federation payout from issued charges' })
  getBudget(
    @TenantId() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Query('season') season: string,
  ) {
    return this.federationsService.getBudget(tenantId, id, season);
  }

  /**
   * Returns seasonal pricing matrices grouped by season.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {string} id - Federation UUID.
   * @param {AuthenticatedUser} user - Caller (SUPER_ADMIN may read a soft-deleted catalog).
   * @returns {Promise<object>} Price list.
   */
  @Get(':id/price-list')
  @ApiOperation({ summary: 'Get seasonal price list' })
  getPriceList(
    @TenantId() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.federationsService.getPriceList(tenantId, id, {
      includeDeleted: user.roles.includes(Role.SUPER_ADMIN),
    });
  }

  /**
   * Returns one federation catalog row of this tenant.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {string} id - Federation UUID.
   * @param {AuthenticatedUser} user - Caller (SUPER_ADMIN may read a soft-deleted catalog).
   * @returns {Promise<object>} Catalog row.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a federation' })
  findOne(
    @TenantId() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.federationsService.findOne(tenantId, id, {
      includeDeleted: user.roles.includes(Role.SUPER_ADMIN),
    });
  }

  /**
   * Updates identity, contacts, and seasonal pricing.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {string} id - Federation UUID.
   * @param {UpdateFederationDto} dto - Partial fields.
   * @returns {Promise<object>} Updated row.
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Update a federation' })
  update(
    @TenantId() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateFederationDto,
  ) {
    return this.federationsService.update(tenantId, id, dto);
  }

  /**
   * Marks a live federation active.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {string} id - Federation UUID.
   * @returns {Promise<object>} Updated row.
   */
  @Patch(':id/activate')
  @ApiOperation({ summary: 'Activate a federation' })
  activate(@TenantId() tenantId: string, @Param('id', ParseUUIDPipe) id: string) {
    return this.federationsService.activate(tenantId, id);
  }

  /**
   * Marks a live federation inactive without hiding it from the catalog.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {string} id - Federation UUID.
   * @returns {Promise<object>} Updated row.
   */
  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate a federation' })
  deactivate(@TenantId() tenantId: string, @Param('id', ParseUUIDPipe) id: string) {
    return this.federationsService.deactivate(tenantId, id);
  }

  /**
   * Soft- or hard-deletes a federation. SUPER_ADMIN only.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {string} id - Federation UUID.
   * @param {DeleteFederationQueryDto} query - `mode=soft|hard` (default soft).
   * @param {AuthenticatedUser} user - Caller roles re-checked in the service.
   * @returns {Promise<object>} Soft-deleted row or wipe acknowledgement.
   */
  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Soft- or hard-delete a federation (SUPER_ADMIN)' })
  remove(
    @TenantId() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: DeleteFederationQueryDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.federationsService.remove(tenantId, id, query.mode ?? 'soft', user.roles);
  }

  /**
   * Records seasonal charges for previewed holders (and optionally the club fee).
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {string} id - Federation UUID.
   * @param {BatchFederationChargesDto} dto - Season and holders.
   * @returns {Promise<object>} Created vs skipped counts.
   */
  @Post(':id/charges')
  @ApiOperation({ summary: 'Create seasonal federation charges in bulk' })
  createCharges(
    @TenantId() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: BatchFederationChargesDto,
  ) {
    return this.federationsService.createCharges(tenantId, id, dto);
  }

  /**
   * Projects a payout from catalog prices and holder counts.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {string} id - Federation UUID.
   * @param {PreviewFederationBudgetDto} dto - Season and counts.
   * @returns {Promise<object>} Cost and sale totals.
   */
  @Post(':id/budget')
  @ApiOperation({ summary: 'Preview federation payout for holder counts' })
  previewBudget(
    @TenantId() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: PreviewFederationBudgetDto,
  ) {
    return this.federationsService.previewBudget(tenantId, id, dto);
  }

  /**
   * Replaces the tagged contact list.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {string} id - Federation UUID.
   * @param {ReplaceFederationContactsDto} dto - Full contact list.
   * @returns {Promise<object>} Updated catalog.
   */
  @Post(':id/contacts')
  @ApiOperation({ summary: 'Replace tagged federation contacts' })
  replaceContacts(
    @TenantId() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ReplaceFederationContactsDto,
  ) {
    return this.federationsService.replaceContactList(tenantId, id, dto.contacts);
  }

  /**
   * Updates one tagged contact.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {string} id - Federation UUID.
   * @param {string} contactId - Contact UUID.
   * @param {FederationContactDto} dto - New values.
   * @returns {Promise<object>} Updated catalog.
   */
  @Patch(':id/contacts/:contactId')
  @ApiOperation({ summary: 'Update a tagged federation contact' })
  updateContact(
    @TenantId() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Param('contactId', ParseUUIDPipe) contactId: string,
    @Body() dto: FederationContactDto,
  ) {
    return this.federationsService.updateContact(tenantId, id, contactId, dto);
  }

  /**
   * Removes one tagged contact.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {string} id - Federation UUID.
   * @param {string} contactId - Contact UUID.
   * @returns {Promise<object>} Updated catalog.
   */
  @Delete(':id/contacts/:contactId')
  @ApiOperation({ summary: 'Remove a tagged federation contact' })
  removeContact(
    @TenantId() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Param('contactId', ParseUUIDPipe) contactId: string,
  ) {
    return this.federationsService.removeContact(tenantId, id, contactId);
  }
}
