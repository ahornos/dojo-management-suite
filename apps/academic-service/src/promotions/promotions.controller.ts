import { Controller, Get, Post, Param, UseGuards, Req } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@dms/database/client';

/**
 * Controller responsible for evaluating and executing martial arts promotions.
 * Protected by JWT authentication and Role-Based Access Control.
 */
@ApiTags('Academic Promotions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  /**
   * Evaluates if a student is eligible for a stripe or belt promotion
   * based on their accumulated hours and minimum time in rank.
   * 
   * @param studentProfileId - The UUID of the student's profile.
   * @returns Eligibility report.
   */
  @Get('eligibility/:studentProfileId')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF, Role.SPORTS_TECHNICAL_DIRECTOR, Role.INSTRUCTOR)
  @ApiOperation({ summary: 'Check promotion eligibility for a student' })
  async checkEligibility(@Param('studentProfileId') studentProfileId: string) {
    return this.promotionsService.evaluatePromotionEligibility(studentProfileId);
  }

  /**
   * Attempts to promote a student. Behavior changes based on the user's role:
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

    // Instructors can only propose promotions
    if (user.role === Role.INSTRUCTOR) {
      return this.promotionsService.proposePromotion(studentProfileId, user.userId);
    }

    // Technical Directors and Admins can execute promotions directly
    return this.promotionsService.executePromotion(studentProfileId);
  }
}