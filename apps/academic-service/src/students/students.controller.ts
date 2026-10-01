import { Controller, Get, Patch, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { StudentsService } from './students.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@dms/shared-types';

/**
 * @class StudentsController
 * @description Controller for managing student profiles and personal data updates.
 * Implements data ownership, conditional approval workflows, and administrative deletions.
 */
@ApiTags('Student Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  /**
   * @description Retrieves all student profiles. Strictly limited to staff members. Students cannot access the directory.
   * @returns {Promise<any[]>} An array of student profile records.
   */
  @Get()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF, Role.SPORTS_TECHNICAL_DIRECTOR, Role.INSTRUCTOR)
  @ApiOperation({ summary: 'List all students (Staff only)' })
  async findAll() {
    return this.studentsService.findAll();
  }

  /**
   * @description Retrieves a specific student profile. Accessible by staff or the owner of the profile.
   * @param {string} id - The UUID of the student profile.
   * @param {any} req - The Express request object containing the authenticated user.
   * @returns {Promise<any>} The student profile details.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Retrieve student details (Owner or Staff)' })
  async findOne(@Param('id') id: string, @Req() req: any) {
    return this.studentsService.findOne(id, req.user);
  }

  /**
   * @description Updates student data. Staff bypasses approval, whereas students generate an update request.
   * @param {string} id - The UUID of the student profile to update.
   * @param {any} updateDto - The payload containing the updated fields.
   * @param {any} req - The Express request object containing the authenticated user.
   * @returns {Promise<any>} The updated profile or the generated update request.
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Update profile or propose changes' })
  @ApiResponse({ status: 200, description: 'Profile updated or request created.' })
  async update(@Param('id') id: string, @Body() updateDto: any, @Req() req: any) {
    return this.studentsService.updateProfile(id, updateDto, req.user);
  }

  /**
   * @description Deletes a student profile by its unique identifier. Strictly restricted to SUPER_ADMIN.
   * @param {string} id - The UUID of the student profile to delete.
   * @returns {Promise<any>} The deleted student profile record.
   */
  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete a student profile (Super Admin only)' })
  @ApiResponse({ status: 200, description: 'Student profile successfully deleted.' })
  async remove(@Param('id') id: string) {
    return this.studentsService.remove(id);
  }
}