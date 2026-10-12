/**
 * @file graduations.controller.ts
 * @description HTTP facade for belt-rank eligibility, graduation execution/proposal, and rollback.
 */

import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { GraduationsService } from './graduations.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard, Roles, CurrentUser } from '@dms/shared-auth';
import { AuthenticatedUser, Role } from '@dms/shared-types';
import { GraduationParamDto } from './dto/graduation-param.dto';
import { ProposeGraduationDto } from './dto/propose-graduation.dto';

/**
 * Academic graduation endpoints. Authorization is enforced by `JwtAuthGuard` + `RolesGuard`.
 */
@ApiTags('Academic Graduations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('graduations')
export class GraduationsController {
  /**
   * @param {GraduationsService} graduationsService - Domain service for eligibility and rank mutations.
   */
  constructor(private readonly graduationsService: GraduationsService) {}

  /**
   * Evaluates whether a student meets time-in-rank and hours requirements for the next stripe or belt.
   *
   * @param {GraduationParamDto} params - Path parameters containing `studentProfileId`.
   * @returns {Promise<object>} Eligibility metrics and boolean flags.
   */
  @Get('eligibility/:studentProfileId')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF, Role.SPORTS_TECHNICAL_DIRECTOR, Role.INSTRUCTOR)
  @ApiOperation({ summary: 'Check graduation eligibility for a student' })
  async checkEligibility(@Param() params: GraduationParamDto) {
    return this.graduationsService.evaluateGraduationEligibility(params.studentProfileId);
  }

  /**
   * Graduates the student immediately when the caller is an executor role; instructors only propose.
   *
   * @param {GraduationParamDto} params - Path parameters containing `studentProfileId`.
   * @param {ProposeGraduationDto} dto - Optional proposed belt/stripes (used for instructor proposals).
   * @param {AuthenticatedUser} user - Authenticated caller from the JWT.
   * @returns {Promise<object>} Created graduation request, or the updated/created rank.
   */
  @Post('graduate/:studentProfileId')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF, Role.SPORTS_TECHNICAL_DIRECTOR, Role.INSTRUCTOR)
  @ApiOperation({ summary: 'Graduate a student or propose a graduation' })
  async graduateStudent(
    @Param() params: GraduationParamDto,
    @Body() dto: ProposeGraduationDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.graduationsService.graduateOrPropose(params.studentProfileId, user, dto);
  }

  /**
   * Reverts the latest stripe increment, or deletes the newest rank when stripes are already zero.
   *
   * @param {GraduationParamDto} params - Path parameters containing `studentProfileId`.
   * @returns {Promise<object>} The restored rank after rollback.
   */
  @Post('rollback/:studentProfileId')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF, Role.SPORTS_TECHNICAL_DIRECTOR)
  @ApiOperation({ summary: 'Rollback last graduation or stripe for a student' })
  @ApiResponse({ status: 200, description: 'Graduation successfully rolled back.' })
  async rollbackGraduation(@Param() params: GraduationParamDto) {
    return this.graduationsService.rollbackGraduation(params.studentProfileId);
  }
}