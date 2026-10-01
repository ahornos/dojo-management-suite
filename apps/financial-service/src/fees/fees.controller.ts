import { Controller, Get, Post, Body, Patch, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { FeesService } from './fees.service';
import { CreateFeeTierDto } from './dto/create-fee-tier.dto';
import { AssignStudentFeeDto } from './dto/assign-student-fee.dto';
import { MassFeeUpdateDto } from './dto/mass-fee-update.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@dms/shared-types';

/**
 * @file fees.controller.ts
 * @description Controller managing academy fee tiers, student specific overrides, and mass price updates.
 */
@ApiTags('Financial - Fees')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('financial/fees')
export class FeesController {
  constructor(private readonly feesService: FeesService) {}

  /**
   * Creates a new base fee tier. Restricted to Admin and Super Admin.
   * 
   * @param dto - Fee tier data
   * @returns The created fee tier
   */
  @Post('tiers')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF)
  @ApiOperation({ summary: 'Create a new base fee tier' })
  @ApiResponse({ status: 201, description: 'Fee tier successfully created.' })
  @ApiResponse({ status: 403, description: 'Forbidden access.' })
  async createFeeTier(@Body() dto: CreateFeeTierDto) {
    return this.feesService.createFeeTier(dto);
  }

  /**
   * Retrieves all active base fee tiers.
   * 
   * @returns List of active fee tiers
   */
  @Get('tiers')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF)
  @ApiOperation({ summary: 'Get all active base fee tiers' })
  @ApiResponse({ status: 200, description: 'List of fee tiers retrieved successfully.' })
  async findAllFeeTiers() {
    return this.feesService.findAllFeeTiers();
  }

  /**
   * Assigns or overrides a fee configuration for a specific student.
   * 
   * @param dto - Student fee assignment details
   * @returns The created student fee record
   */
  @Post('student-override')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF)
  @ApiOperation({ summary: 'Assign a custom fee or tier override to a student' })
  @ApiResponse({ status: 201, description: 'Student fee successfully assigned.' })
  async assignStudentFee(@Body() dto: AssignStudentFeeDto) {
    return this.feesService.assignStudentFee(dto);
  }

  /**
   * Performs a mass fee update (percentage or fixed amount) across fee tiers.
   * 
   * @param dto - Mass update criteria and values
   * @returns List of updated fee tiers
   */
  @Patch('mass-update')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF)
  @ApiOperation({ summary: 'Perform a mass fee update (IPC or general increase)' })
  @ApiResponse({ status: 200, description: 'Fees successfully updated in bulk.' })
  async massFeeUpdate(@Body() dto: MassFeeUpdateDto) {
    return this.feesService.massFeeUpdate(dto);
  }
}