import { Controller, Get, Patch, Param, Body, UseGuards, Req } from '@nestjs/common';
import { StudentsService } from './students.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@dms/database/client';

/**
 * Controller for managing student profiles and personal data updates.
 * Implements data ownership and conditional approval workflows.
 */
@ApiTags('Student Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  /**
   * Retrieves all student profiles.
   * Strictly limited to staff members. Students cannot access the directory.
   */
  @Get()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF, Role.SPORTS_TECHNICAL_DIRECTOR, Role.INSTRUCTOR)
  @ApiOperation({ summary: 'List all students (Staff only)' })
  async findAll() {
    return this.studentsService.findAll();
  }

  /**
   * Retrieves a specific student profile.
   * Accessible by staff or the owner of the profile.
   */
  @Get(':id')
  // No @Roles decorator applied here to allow STUDENT and PARENT access to their own data.
  @ApiOperation({ summary: 'Retrieve student details (Owner or Staff)' })
  async findOne(@Param('id') id: string, @Req() req: any) {
    return this.studentsService.findOne(id, req.user);
  }

  /**
   * Updates student data. Staff bypasses approval, students generate a request.
   */
  @Patch(':id')
  // No @Roles decorator applied here to allow STUDENT and PARENT to propose updates.
  @ApiOperation({ summary: 'Update profile or propose changes' })
  @ApiResponse({ status: 200, description: 'Profile updated or request created.' })
  async update(@Param('id') id: string, @Body() updateDto: any, @Req() req: any) {
    return this.studentsService.updateProfile(id, updateDto, req.user);
  }
}