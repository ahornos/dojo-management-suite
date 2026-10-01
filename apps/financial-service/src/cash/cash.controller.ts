import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CashService } from './cash.service';
import { OpenCashSessionDto } from './dto/open-cash-session.dto';
import { CloseCashSessionDto } from './dto/close-cash-session.dto';
import { CreateCashTransactionDto } from './dto/create-cash-transaction.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@dms/shared-types';

/**
 * @file cash.controller.ts
 * @description Exposes endpoints for managing cash register sessions and corrective transactions.
 */
@ApiTags('Financial - Cash Register')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('financial/cash')
export class CashController {
  constructor(private readonly cashService: CashService) {}

  @Post('sessions/open')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF)
  @ApiOperation({ summary: 'Open a new cash register session' })
  @ApiResponse({ status: 201, description: 'Cash session successfully opened.' })
  async openSession(@Body() dto: OpenCashSessionDto, @Req() req: any) {
    const userId = req.user?.sub || 'system-admin';
    return this.cashService.openSession(dto, userId);
  }

  @Patch('sessions/:id/close')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF)
  @ApiOperation({ summary: 'Close an active cash session with physical balance reconciliation' })
  @ApiResponse({ status: 200, description: 'Cash session successfully closed.' })
  async closeSession(@Param('id') id: string, @Body() dto: CloseCashSessionDto, @Req() req: any) {
    const userId = req.user?.sub || 'system-admin';
    return this.cashService.closeSession(id, dto, userId);
  }

  @Post('transactions')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF)
  @ApiOperation({ summary: 'Record a cash income or expense transaction' })
  @ApiResponse({ status: 201, description: 'Transaction successfully recorded.' })
  async createTransaction(@Body() dto: CreateCashTransactionDto, @Req() req: any) {
    const userId = req.user?.sub || 'system-admin';
    return this.cashService.createTransaction(dto, userId);
  }

  @Patch('transactions/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF)
  @ApiOperation({ summary: 'Update/correct an existing cash transaction (supports post-closure audit correction)' })
  @ApiResponse({ status: 200, description: 'Transaction successfully updated.' })
  async updateTransaction(@Param('id') id: string, @Body() dto: Partial<CreateCashTransactionDto>) {
    return this.cashService.updateTransaction(id, dto);
  }

  @Delete('transactions/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF)
  @ApiOperation({ summary: 'Delete an erroneous cash transaction' })
  @ApiResponse({ status: 200, description: 'Transaction successfully deleted.' })
  async deleteTransaction(@Param('id') id: string) {
    return this.cashService.deleteTransaction(id);
  }
}