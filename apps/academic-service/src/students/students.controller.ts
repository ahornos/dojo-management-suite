/**
 * @file students.controller.ts
 * @description Controller for managing student profiles and personal data updates.
 * Implements data ownership, conditional approval workflows, and administrative deletions.
 */

import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { StudentsService } from './students.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, RolesGuard, Roles, CurrentUser } from '@dms/shared-auth';
import { AuthenticatedUser, Role } from '@dms/shared-types';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

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
   * @param {AuthenticatedUser} user - The authenticated caller.
   * @returns {Promise<object>} The student profile details.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Retrieve student details (Owner or Staff)' })
  async findOne(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.studentsService.findOne(id, user);
  }

  /**
   * @description Creates a new student profile. Strictly limited to staff members.
   * @param {CreateStudentDto} createStudentDto - The payload for the new student.
   * @param {AuthenticatedUser} user - The authenticated caller, recorded in the status audit log.
   * @returns {Promise<any>} The newly created student profile.
   */
  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF)
  @ApiOperation({ summary: 'Create a new student (Staff only)' })
  @ApiResponse({ status: 201, description: 'Student successfully created.' })
  async create(@Body() createStudentDto: CreateStudentDto, @CurrentUser() user: AuthenticatedUser) {
    return this.studentsService.create(createStudentDto, user);
  }

  /**
   * @description Updates student data. Staff bypasses approval, whereas students generate an update request.
   * @param {string} id - The UUID of the student profile to update.
   * @param {UpdateStudentDto} updateDto - The validated payload containing the updated fields.
   * @param {AuthenticatedUser} user - The authenticated caller.
   * @returns {Promise<any>} The updated profile or the generated update request.
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Update profile or propose changes' })
  @ApiResponse({ status: 200, description: 'Profile updated or request created.' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateStudentDto, @CurrentUser() user: AuthenticatedUser) {
    return this.studentsService.updateProfile(id, updateDto, user);
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