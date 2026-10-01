import { Controller, Get, Post, Delete, Param, UseGuards, Req } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@dms/shared-types';

/**
 * @class PromotionsController
 * @description Controller responsible for evaluating and executing martial arts promotions and rollbacks.
 * Protected by JWT authentication and Role-Based Access Control.
 */
@ApiTags('Academic Promotions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  /**
   * @description Evaluates if a student is eligible for a stripe or belt promotion based on hours and time in rank.
   * @param {string} studentProfileId - The UUID of the student's profile.
   * @returns {Promise<any>} Eligibility report.
   */
  @Get('eligibility/:studentProfileId')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF, Role.SPORTS_TECHNICAL_DIRECTOR, Role.INSTRUCTOR)
  @ApiOperation({ summary: 'Check promotion eligibility for a student' })
  async checkEligibility(@Param('studentProfileId') studentProfileId: string) {
    return this.promotionsService.evaluatePromotionEligibility(studentProfileId);
  }

  /**
   * @description Attempts to promote a student. Behavior changes based on the user's role:
   * - INSTRUCTOR: Creates a pending PromotionRequest for approval.
   * - DIRECTOR / ADMIN: Directly executes the promotion in the database.
   * 
   * @param studentProfileId - The UUID of the student's profile.
   * @param req - The injected Express request containing the authenticated user.
   * @returns The resulting rank or the pending request.
   */
  @Post('promote/:studentProfileId')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF, Role.SPORTS_TECHNICAL_DIRECTOR, Role.INSTRUCTOR)
  @ApiOperation({ summary: 'Promote a student or propose a promotion' })
  async promoteStudent(
    @Param('studentProfileId') studentProfileId: string,
    @Req() req: any
  ) {
    const user = req.user;

    if (user.role === Role.INSTRUCTOR) {
      return this.promotionsService.proposePromotion(studentProfileId, user.userId);
    }

    return this.promotionsService.executePromotion(studentProfileId);
  }

  /**
   * @description Reverts the last promotion or stripe awarded to a student in case of an administrative error.
   * Strictly restricted to SUPER_ADMIN, ADMIN_STAFF, and SPORTS_TECHNICAL_DIRECTOR.
   * 
   * @param studentProfileId - The UUID of the student's profile.
   * @returns The restored active rank state.
   */
  @Post('rollback/:studentProfileId')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF, Role.SPORTS_TECHNICAL_DIRECTOR)
  @ApiOperation({ summary: 'Rollback last promotion or stripe for a student' })
  @ApiResponse({ status: 200, description: 'Promotion successfully rolled back.' })
  async rollbackPromotion(@Param('studentProfileId') studentProfileId: string) {
    return this.promotionsService.rollbackPromotion(studentProfileId);
  }
}