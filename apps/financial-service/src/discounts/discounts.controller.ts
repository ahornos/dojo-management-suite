import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DiscountsService } from './discounts.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { AssignDiscountDto } from './dto/assign-discount.dto';
import { JwtAuthGuard, RolesGuard, Roles } from '@dms/shared-auth';
import { Role } from '@dms/shared-types';
import { Prisma } from '@dms/database/client';
import { ParseDecimalPipe } from '../common/pipes/parse-decimal.pipe';

/**
 * @file discounts.controller.ts
 * @description Exposes endpoints for discount rules and financial campaign management.
 */
@ApiTags('Financial - Discounts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('financial/discounts')
/**
 * Staff-only discount-rule and fee-preview HTTP API.
 */
export class DiscountsController {
  /**
   * @param {DiscountsService} discountsService - Discount catalog and calculation service.
   */
  constructor(private readonly discountsService: DiscountsService) {}

  /**
   * Creates a reusable discount rule (percentage, fixed, or free period).
   *
   * @param {CreateDiscountDto} dto - Rule definition.
   * @returns {Promise<object>} The persisted discount.
   */
  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF)
  @ApiOperation({ summary: 'Create a new financial discount rule' })
  @ApiResponse({ status: 201, description: 'Discount created.' })
  async createDiscount(@Body() dto: CreateDiscountDto) {
    return this.discountsService.createDiscount(dto);
  }

  /**
   * Links an existing discount rule to a student profile.
   *
   * @param {AssignDiscountDto} dto - Student, discount, and optional expiry.
   * @returns {Promise<object>} The `StudentDiscount` assignment.
   */
  @Post('assign')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF)
  @ApiOperation({ summary: 'Assign a discount to a student' })
  @ApiResponse({ status: 201, description: 'Discount successfully assigned.' })
  async assignDiscount(@Body() dto: AssignDiscountDto) {
    return this.discountsService.assignDiscountToStudent(dto);
  }

  /**
   * Calculates the final fee of a student after applying every active discount.
   *
   * @param {string} studentId - Student profile UUID.
   * @param {Prisma.Decimal} baseAmount - Exact base amount parsed by `ParseDecimalPipe`.
   * @returns {Promise<{ baseAmount: string; finalAmount: string }>} Amounts as 2-decimal strings (no float rounding).
   */
  @Get('calculate/:studentProfileId/:baseAmount')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF)
  @ApiOperation({ summary: 'Calculate final fee for a student based on active discounts' })
  @ApiResponse({ status: 200, description: 'Returns base and final amounts as fixed 2-decimal strings.' })
  @ApiResponse({ status: 400, description: 'INVALID_MONETARY_AMOUNT: the amount is not a non-negative value with up to 2 decimals.' })
  async calculateDiscount(
    @Param('studentProfileId') studentId: string,
    @Param('baseAmount', ParseDecimalPipe) baseAmount: Prisma.Decimal,
  ) {
    const finalFee = await this.discountsService.calculateDiscountedFee(studentId, baseAmount);
    return { baseAmount: baseAmount.toFixed(2), finalAmount: finalFee.toFixed(2) };
  }
}