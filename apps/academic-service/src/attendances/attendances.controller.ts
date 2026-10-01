import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { AttendancesService } from './attendances.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@dms/shared-types';

/**
 * @class AttendancesController
 * @description Controller responsible for tracking student class attendances.
 */
@ApiTags('Attendances')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('attendances')
export class AttendancesController {
  constructor(private readonly attendancesService: AttendancesService) {}

  /**
   * @description Registers a new class attendance record for a student.
   * @param {CreateAttendanceDto} createAttendanceDto - The attendance details.
   * @returns {Promise<any>} The created attendance record.
   */
  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF, Role.SPORTS_TECHNICAL_DIRECTOR, Role.INSTRUCTOR)
  @ApiOperation({ summary: 'Register class attendance for a student' })
  @ApiResponse({ status: 201, description: 'Attendance successfully logged.' })
  create(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendancesService.create(createAttendanceDto);
  }

  /**
   * @description Retrieves all recorded attendance logs across the academy.
   * @returns {Promise<any[]>} A list of all attendances.
   */
  @Get()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF, Role.SPORTS_TECHNICAL_DIRECTOR)
  @ApiOperation({ summary: 'Retrieve all recorded attendance logs' })
  @ApiResponse({ status: 200, description: 'List of attendances retrieved successfully.' })
  findAll() {
    return this.attendancesService.findAll();
  }

  /**
   * @description Retrieves attendance logs for a specific student. 
   * Open to all authenticated users (students can view their own, enforced by service logic).
   * @param {string} studentProfileId - The UUID of the student's profile.
   * @returns {Promise<any[]>} The student's attendance history.
   */
  @Get('student/:studentProfileId')
  @ApiOperation({ summary: 'Retrieve attendance logs for a specific student' })
  @ApiParam({ name: 'studentProfileId', description: 'Student profile UUID' })
  @ApiResponse({ status: 200, description: 'Student attendance history retrieved successfully.' })
  findByStudent(@Param('studentProfileId') studentProfileId: string) {
    return this.attendancesService.findByStudent(studentProfileId);
  }

  /**
   * @description Deletes a specific attendance record.
   * @param {string} id - The UUID of the attendance record.
   * @returns {Promise<any>} The deleted record.
   */
  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF)
  @ApiOperation({ summary: 'Delete an attendance record by ID' })
  @ApiParam({ name: 'id', description: 'Attendance record UUID' })
  @ApiResponse({ status: 200, description: 'Attendance record successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.attendancesService.remove(id);
  }
}