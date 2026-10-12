import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CashService } from './cash.service';
import { OpenCashSessionDto } from './dto/open-cash-session.dto';
import { CloseCashSessionDto } from './dto/close-cash-session.dto';
import { CreateCashTransactionDto } from './dto/create-cash-transaction.dto';
import { JwtAuthGuard, RolesGuard, Roles, CurrentUser } from '@dms/shared-auth';
import { Role } from '@dms/shared-types';

/**
 * @file cash.controller.ts
 * @description Exposes endpoints for managing cash register sessions and corrective transactions.
 */
@ApiTags('Financial - Cash Register')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('financial/cash')
/**
 * Staff-only cash-register HTTP API (open/close sessions, record and correct movements).
 */
export class CashController {
  /**
   * @param {CashService} cashService - Session and transaction domain service.
   */
  constructor(private readonly cashService: CashService) {}

  /**
   * Opens a new cash register session for the authenticated staff member.
   *
   * @param {OpenCashSessionDto} dto - Opening float and optional notes.
   * @param {string} userId - Authenticated operator identity.
   * @returns {Promise<object>} The created `OPEN` session.
   */
  @Post('sessions/open')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF)
  @ApiOperation({ summary: 'Open a new cash register session' })
  @ApiResponse({ status: 201, description: 'Cash session successfully opened.' })
  async openSession(@Body() dto: OpenCashSessionDto, @CurrentUser('userId') userId: string) {
    return this.cashService.openSession(dto, userId);
  }

  /**
   * Closes a session and reconciles the counted physical balance against expected cash.
   *
   * @param {string} id - Session UUID.
   * @param {CloseCashSessionDto} dto - Counted closing balance and optional notes.
   * @param {string} userId - Authenticated operator identity.
   * @returns {Promise<object>} Closed session plus income/expense/discrepancy summary.
   */
  @Patch('sessions/:id/close')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF)
  @ApiOperation({ summary: 'Close an active cash session with physical balance reconciliation' })
  @ApiResponse({ status: 200, description: 'Cash session successfully closed.' })
  async closeSession(@Param('id') id: string, @Body() dto: CloseCashSessionDto, @CurrentUser('userId') userId: string) {
    return this.cashService.closeSession(id, dto, userId);
  }

  /**
   * Records an income or expense against a cash session (including post-closure audit entries).
   *
   * @param {CreateCashTransactionDto} dto - Movement payload.
   * @param {string} userId - Authenticated operator identity.
   * @returns {Promise<object>} The persisted transaction.
   */
  @Post('transactions')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF)
  @ApiOperation({ summary: 'Record a cash income or expense transaction' })
  @ApiResponse({ status: 201, description: 'Transaction successfully recorded.' })
  async createTransaction(@Body() dto: CreateCashTransactionDto, @CurrentUser('userId') userId: string) {
    return this.cashService.createTransaction(dto, userId);
  }

  /**
   * Corrects an existing cash movement (type, amount, category, or description).
   *
   * @param {string} id - Transaction UUID.
   * @param {Partial<CreateCashTransactionDto>} dto - Fields to overwrite.
   * @returns {Promise<object>} The updated transaction.
   */
  @Patch('transactions/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF)
  @ApiOperation({ summary: 'Update/correct an existing cash transaction (supports post-closure audit correction)' })
  @ApiResponse({ status: 200, description: 'Transaction successfully updated.' })
  async updateTransaction(@Param('id') id: string, @Body() dto: Partial<CreateCashTransactionDto>) {
    return this.cashService.updateTransaction(id, dto);
  }

  /**
   * Deletes an erroneous cash movement.
   *
   * @param {string} id - Transaction UUID.
   * @returns {Promise<{ message: string; deletedId: string }>} Confirmation payload.
   */
  @Delete('transactions/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF)
  @ApiOperation({ summary: 'Delete an erroneous cash transaction' })
  @ApiResponse({ status: 200, description: 'Transaction successfully deleted.' })
  async deleteTransaction(@Param('id') id: string) {
    return this.cashService.deleteTransaction(id);
  }
}