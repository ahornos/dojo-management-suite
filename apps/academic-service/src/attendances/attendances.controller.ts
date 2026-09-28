import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AttendancesService } from './attendances.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

@ApiTags('attendances')
@Controller('attendances')
export class AttendancesController {
  constructor(private readonly attendancesService: AttendancesService) {}

  @Post()
  @ApiOperation({ summary: 'Register class attendance for a student' })
  @ApiResponse({ status: 201, description: 'Attendance successfully logged.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 404, description: 'Student profile not found.' })
  create(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendancesService.create(createAttendanceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all recorded attendance logs' })
  @ApiResponse({ status: 200, description: 'List of attendances retrieved successfully.' })
  findAll() {
    return this.attendancesService.findAll();
  }

  @Get('student/:studentProfileId')
  @ApiOperation({ summary: 'Retrieve attendance logs for a specific student' })
  @ApiParam({ name: 'studentProfileId', description: 'Student profile UUID' })
  @ApiResponse({ status: 200, description: 'Student attendance history retrieved successfully.' })
  findByStudent(@Param('studentProfileId') studentProfileId: string) {
    return this.attendancesService.findByStudent(studentProfileId);
  }
}