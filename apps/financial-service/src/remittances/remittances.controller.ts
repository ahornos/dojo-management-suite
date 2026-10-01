import { Controller, Get, Post, Patch, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RemittancesService } from './remittances.service';
import { CreateBankMandateDto } from './dto/create-bank-mandate.dto';
import { CreateRemittanceBatchDto } from './dto/create-remittance-batch.dto';
import { UpdateRemittanceItemStatusDto } from './dto/update-remittance-item-status.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@dms/shared-types';

/**
 * @file remittances.controller.ts
 * @description Exposes endpoints for managing SEPA bank mandates and direct debit remittance batches.
 */
@ApiTags('Financial - SEPA Remittances')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('financial/remittances')
export class RemittancesController {
  constructor(private readonly remittancesService: RemittancesService) {}

  @Post('mandates')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF)
  @ApiOperation({ summary: 'Register a new SEPA bank mandate' })
  @ApiResponse({ status: 201, description: 'Bank mandate successfully registered.' })
  async createMandate(@Body() dto: CreateBankMandateDto) {
    return this.remittancesService.createMandate(dto);
  }

  @Post('batches')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF)
  @ApiOperation({ summary: 'Generate a new SEPA direct debit remittance batch file' })
  @ApiResponse({ status: 201, description: 'Remittance batch successfully generated.' })
  async generateBatch(@Body() dto: CreateRemittanceBatchDto, @Req() req: any) {
    const userId = req.user?.sub || 'system-admin';
    return this.remittancesService.generateBatch(dto, userId);
  }

  @Get('batches/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF)
  @ApiOperation({ summary: 'Get remittance batch details and items' })
  @ApiResponse({ status: 200, description: 'Batch details retrieved successfully.' })
  async getBatchDetails(@Param('id') id: string) {
    return this.remittancesService.getBatchDetails(id);
  }

  @Patch('items/:id/status')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF)
  @ApiOperation({ summary: 'Update collection item status (e.g., handle returned SEPA items)' })
  @ApiResponse({ status: 200, description: 'Remittance item status updated.' })
  async updateItemStatus(@Param('id') id: string, @Body() dto: UpdateRemittanceItemStatusDto) {
    return this.remittancesService.updateItemStatus(id, dto);
  }
}