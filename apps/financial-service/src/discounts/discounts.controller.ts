import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DiscountsService } from './discounts.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { AssignDiscountDto } from './dto/assign-discount.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@dms/shared-types';

/**
 * @file discounts.controller.ts
 * @description Exposes endpoints for discount rules and financial campaign management.
 */
@ApiTags('Financial - Discounts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('financial/discounts')
export class DiscountsController {
  constructor(private readonly discountsService: DiscountsService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF)
  @ApiOperation({ summary: 'Create a new financial discount rule' })
  @ApiResponse({ status: 201, description: 'Discount created.' })
  async createDiscount(@Body() dto: CreateDiscountDto) {
    return this.discountsService.createDiscount(dto);
  }

  @Post('assign')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF)
  @ApiOperation({ summary: 'Assign a discount to a student' })
  @ApiResponse({ status: 201, description: 'Discount successfully assigned.' })
  async assignDiscount(@Body() dto: AssignDiscountDto) {
    return this.discountsService.assignDiscountToStudent(dto);
  }

  @Get('calculate/:studentProfileId/:baseAmount')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF)
  @ApiOperation({ summary: 'Calculate final fee for a student based on active discounts' })
  @ApiResponse({ status: 200, description: 'Returns the calculated numeric value.' })
  async calculateDiscount(@Param('studentProfileId') studentId: string, @Param('baseAmount') amount: string) {
    const finalFee = await this.discountsService.calculateDiscountedFee(studentId, Number(amount));
    return { baseAmount: Number(amount), finalAmount: finalFee };
  }
}