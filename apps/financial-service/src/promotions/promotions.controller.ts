import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PromotionsService } from './promotions.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { AssignPromotionDto } from './dto/assign-promotion.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@dms/shared-types';

/**
 * @file promotions.controller.ts
 * @description Exposes endpoints for discount rules and campaign management.
 */
@ApiTags('Financial - Promotions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('financial/promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF)
  @ApiOperation({ summary: 'Create a new promotion or discount rule' })
  @ApiResponse({ status: 201, description: 'Promotion created.' })
  async createPromotion(@Body() dto: CreatePromotionDto) {
    return this.promotionsService.createPromotion(dto);
  }

  @Post('assign')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF)
  @ApiOperation({ summary: 'Assign a promotion to a student' })
  @ApiResponse({ status: 201, description: 'Promotion successfully assigned.' })
  async assignPromotion(@Body() dto: AssignPromotionDto) {
    return this.promotionsService.assignPromotionToStudent(dto);
  }

  @Get('calculate/:studentProfileId/:baseAmount')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF)
  @ApiOperation({ summary: 'Calculate final fee for a student based on active promotions' })
  @ApiResponse({ status: 200, description: 'Returns the calculated numeric value.' })
  async calculateDiscount(@Param('studentProfileId') studentId: string, @Param('baseAmount') amount: string) {
    const finalFee = await this.promotionsService.calculateDiscountedFee(studentId, Number(amount));
    return { baseAmount: Number(amount), finalAmount: finalFee };
  }
}