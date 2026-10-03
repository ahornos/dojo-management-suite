import { Controller, Get, Post, Param, Body, UseGuards, Req } from '@nestjs/common';
import { GraduationsService } from './graduations.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@dms/shared-types';
import { GraduationParamDto } from './dto/graduation-param.dto';
import { ProposeGraduationDto } from './dto/propose-graduation.dto';

@ApiTags('Academic Graduations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('graduations')
export class GraduationsController {
  constructor(private readonly graduationsService: GraduationsService) {}

  @Get('eligibility/:studentProfileId')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF, Role.SPORTS_TECHNICAL_DIRECTOR, Role.INSTRUCTOR)
  @ApiOperation({ summary: 'Check graduation eligibility for a student' })
  async checkEligibility(@Param() params: GraduationParamDto) {
    return this.graduationsService.evaluateGraduationEligibility(params.studentProfileId);
  }

  @Post('graduate/:studentProfileId')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF, Role.SPORTS_TECHNICAL_DIRECTOR, Role.INSTRUCTOR)
  @ApiOperation({ summary: 'Graduate a student or propose a graduation' })
  async graduateStudent(
    @Param() params: GraduationParamDto,
    @Body() dto: ProposeGraduationDto,
    @Req() req: any
  ) {
    const user = req.user;

    if (user.role === Role.INSTRUCTOR) {
      return this.graduationsService.proposeGraduation(params.studentProfileId, user.userId, dto);
    }

    return this.graduationsService.executeGraduation(params.studentProfileId);
  }

  @Post('rollback/:studentProfileId')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF, Role.SPORTS_TECHNICAL_DIRECTOR)
  @ApiOperation({ summary: 'Rollback last graduation or stripe for a student' })
  @ApiResponse({ status: 200, description: 'Graduation successfully rolled back.' })
  async rollbackGraduation(@Param() params: GraduationParamDto) {
    return this.graduationsService.rollbackGraduation(params.studentProfileId);
  }
}