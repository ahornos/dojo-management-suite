import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import {ApiTags, ApiOperation, ApiResponse, ApiParam} from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@ApiTags('students')
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @ApiOperation({ summary: 'Register a new student in the academy' })
  @ApiResponse({ status: 201, description: 'Student successfully created with their academic profile.' })
  @ApiResponse({ status: 400, description: 'Invalid input data or validation failure.' })
  @ApiResponse({ status: 404, description: 'Specified discipline does not exist.' })
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve a list of all registered students' })
  @ApiResponse({ status: 200, description: 'List of students successfully retrieved.' })
  findAll() {
    return this.studentsService.findAll();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update student details by ID' })
  @ApiParam({ name: 'id', description: 'Student User UUID' })
  @ApiResponse({ status: 200, description: 'Student successfully updated.' })
  @ApiResponse({ status: 404, description: 'Student not found.' })
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentsService.update(id, updateStudentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a student by ID' })
  @ApiParam({ name: 'id', description: 'Student User UUID' })
  @ApiResponse({ status: 200, description: 'Student successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Student not found.' })
  remove(@Param('id') id: string) {
    return this.studentsService.remove(id);
  }
}