import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RemittancesService } from './remittances.service';
import { CreateBankMandateDto } from './dto/create-bank-mandate.dto';
import { CreateRemittanceBatchDto } from './dto/create-remittance-batch.dto';
import { UpdateRemittanceItemStatusDto } from './dto/update-remittance-item-status.dto';
import { JwtAuthGuard, RolesGuard, Roles, CurrentUser } from '@dms/shared-auth';
import { Role } from '@dms/shared-types';

/**
 * @file remittances.controller.ts
 * @description Exposes endpoints for managing SEPA bank mandates and direct debit remittance batches.
 */
@ApiTags('Financial - SEPA Remittances')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('financial/remittances')
/**
 * Staff-only SEPA mandate and remittance-batch HTTP API.
 */
export class RemittancesController {
  /**
   * @param {RemittancesService} remittancesService - Mandate and batch domain service.
   */
  constructor(private readonly remittancesService: RemittancesService) {}

  /**
   * Registers a new bank mandate for a student debtor.
   *
   * @param {CreateBankMandateDto} dto - Mandate reference, IBAN/BIC, and signature date.
   * @returns {Promise<object>} The persisted mandate.
   */
  @Post('mandates')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF)
  @ApiOperation({ summary: 'Register a new SEPA bank mandate' })
  @ApiResponse({ status: 201, description: 'Bank mandate successfully registered.' })
  async createMandate(@Body() dto: CreateBankMandateDto) {
    return this.remittancesService.createMandate(dto);
  }

  /**
   * Builds a remittance batch, persists items, and returns a SEPA XML preview.
   *
   * @param {CreateRemittanceBatchDto} dto - Batch reference, execution date, and collection items.
   * @param {string} userId - Authenticated operator recorded as `generatedById`.
   * @returns {Promise<object>} The batch with items and `xmlPreview`.
   */
  @Post('batches')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF)
  @ApiOperation({ summary: 'Generate a new SEPA direct debit remittance batch file' })
  @ApiResponse({ status: 201, description: 'Remittance batch successfully generated.' })
  async generateBatch(@Body() dto: CreateRemittanceBatchDto, @CurrentUser('userId') userId: string) {
    return this.remittancesService.generateBatch(dto, userId);
  }

  /**
   * Loads a remittance batch and its collection items.
   *
   * @param {string} id - Batch UUID.
   * @returns {Promise<object>} Batch details including nested items and mandates.
   */
  @Get('batches/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF)
  @ApiOperation({ summary: 'Get remittance batch details and items' })
  @ApiResponse({ status: 200, description: 'Batch details retrieved successfully.' })
  async getBatchDetails(@Param('id') id: string) {
    return this.remittancesService.getBatchDetails(id);
  }

  /**
   * Updates a collection item after a bank return or settlement.
   *
   * @param {string} id - Remittance item UUID.
   * @param {UpdateRemittanceItemStatusDto} dto - New status and optional return reason.
   * @returns {Promise<object>} The updated item.
   */
  @Patch('items/:id/status')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF)
  @ApiOperation({ summary: 'Update collection item status (e.g., handle returned SEPA items)' })
  @ApiResponse({ status: 200, description: 'Remittance item status updated.' })
  async updateItemStatus(@Param('id') id: string, @Body() dto: UpdateRemittanceItemStatusDto) {
    return this.remittancesService.updateItemStatus(id, dto);
  }
}