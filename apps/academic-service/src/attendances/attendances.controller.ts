/**
 * @file attendances.controller.ts
 * @description Staff HTTP API for legacy attendance logs and session-based quick check-in.
 */

import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser, JwtAuthGuard, Roles, RolesGuard, TenantId } from '@dms/shared-auth';
import { AuthenticatedUser, Role } from '@dms/shared-types';
import { AttendancesService } from './attendances.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { CreateAttendanceSessionDto } from './dto/create-attendance-session.dto';
import { ListAttendanceSessionsDto } from './dto/list-attendance-sessions.dto';
import { SessionRosterQueryDto } from './dto/session-roster-query.dto';
import { UpsertAttendanceRecordsDto } from './dto/upsert-attendance-records.dto';

const CHECKIN_ROLES = [Role.SUPER_ADMIN, Role.ADMIN_STAFF, Role.SPORTS_TECHNICAL_DIRECTOR, Role.INSTRUCTOR] as const;

/**
 * Controller responsible for tracking student class attendances.
 */
@ApiTags('Attendances')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('attendances')
export class AttendancesController {
  /**
   * @param {AttendancesService} attendancesService - Logs, sessions, and roll-call.
   */
  constructor(private readonly attendancesService: AttendancesService) {}

  /**
   * Opens a class session (idempotent for the same discipline, day, and instructor).
   *
   * @param {CreateAttendanceSessionDto} dto - Discipline, date, optional instructor and capacity.
   * @param {AuthenticatedUser} actor - Authenticated staff member.
   * @returns {Promise<object>} Session header.
   */
  @Post('sessions')
  @Roles(...CHECKIN_ROLES)
  @ApiOperation({ summary: 'Create or reuse a class attendance session' })
  createSession(@Body() dto: CreateAttendanceSessionDto, @CurrentUser() actor: AuthenticatedUser) {
    return this.attendancesService.createSession(dto, actor);
  }

  /**
   * Lists class sessions with optional date and discipline filters.
   *
   * @param {ListAttendanceSessionsDto} query - Filters.
   * @returns {Promise<object[]>} Sessions.
   */
  @Get('sessions')
  @Roles(...CHECKIN_ROLES)
  @ApiOperation({ summary: 'List class attendance sessions' })
  listSessions(@TenantId() tenantId: string, @Query() query: ListAttendanceSessionsDto) {
    return this.attendancesService.listSessions(tenantId, query);
  }

  /**
   * Session details and the check-in roster (age-filtered, with current marks).
   *
   * @param {string} sessionId - Session UUID.
   * @param {SessionRosterQueryDto} query - Optional age bracket.
   * @returns {Promise<object>} Session plus students.
   */
  @Get('sessions/:sessionId')
  @Roles(...CHECKIN_ROLES)
  @ApiOperation({ summary: 'Get a class session and its check-in roster' })
  @ApiParam({ name: 'sessionId', description: 'Attendance session UUID' })
  getSession(
    @TenantId() tenantId: string,
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
    @Query() query: SessionRosterQueryDto,
  ) {
    return this.attendancesService.getSession(tenantId, sessionId, query);
  }

  /**
   * Bulk-upserts roll-call marks for a session (checkbox grid save).
   *
   * @param {string} sessionId - Session UUID.
   * @param {UpsertAttendanceRecordsDto} dto - Student marks.
   * @returns {Promise<object>} Updated roster.
   */
  @Post('sessions/:sessionId/records')
  @Roles(...CHECKIN_ROLES)
  @ApiOperation({ summary: 'Submit attendance marks for a class session' })
  @ApiParam({ name: 'sessionId', description: 'Attendance session UUID' })
  upsertRecords(
    @TenantId() tenantId: string,
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
    @Body() dto: UpsertAttendanceRecordsDto,
  ) {
    return this.attendancesService.upsertRecords(tenantId, sessionId, dto);
  }

  /**
   * Registers a new class attendance record for a student.
   *
   * @param {CreateAttendanceDto} createAttendanceDto - The attendance details.
   * @returns {Promise<object>} The created attendance record.
   */
  @Post()
  @Roles(...CHECKIN_ROLES)
  @ApiOperation({ summary: 'Register class attendance for a student' })
  @ApiResponse({ status: 201, description: 'Attendance successfully logged.' })
  create(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendancesService.create(createAttendanceDto);
  }

  /**
   * Retrieves all recorded attendance logs across the academy.
   *
   * @returns {Promise<object[]>} A list of all attendances.
   */
  @Get()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF, Role.SPORTS_TECHNICAL_DIRECTOR)
  @ApiOperation({ summary: 'Retrieve all recorded attendance logs' })
  @ApiResponse({ status: 200, description: 'List of attendances retrieved successfully.' })
  findAll() {
    return this.attendancesService.findAll();
  }

  /**
   * Retrieves attendance logs for a specific student.
   *
   * @param {string} studentProfileId - The UUID of the student's profile.
   * @returns {Promise<object[]>} The student's attendance history.
   */
  @Get('student/:studentProfileId')
  @ApiOperation({ summary: 'Retrieve attendance logs for a specific student' })
  @ApiParam({ name: 'studentProfileId', description: 'Student profile UUID' })
  @ApiResponse({ status: 200, description: 'Student attendance history retrieved successfully.' })
  findByStudent(@Param('studentProfileId') studentProfileId: string) {
    return this.attendancesService.findByStudent(studentProfileId);
  }

  /**
   * Deletes a specific attendance record.
   *
   * @param {string} id - The UUID of the attendance record.
   * @returns {Promise<object>} The deleted record.
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
