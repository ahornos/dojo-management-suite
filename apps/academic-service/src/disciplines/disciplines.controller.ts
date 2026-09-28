import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { DisciplinesService } from './disciplines.service';
import { CreateDisciplineDto } from './dto/create-discipline.dto';
import { UpdateDisciplineDto } from './dto/update-discipline.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@dms/database/client';

@ApiTags('Academy Configuration & Disciplines')
@Controller('disciplines')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF)
export class DisciplinesController {
  constructor(private readonly disciplinesService: DisciplinesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a discipline with its age programs and rank criteria' })
  @ApiResponse({ status: 201, description: 'Discipline configuration successfully created.' })
  async create(@Body() dto: CreateDisciplineDto) {
    return this.disciplinesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all disciplines with their programs and belt structures' })
  @ApiResponse({ status: 200, description: 'Returns all configured disciplines.' })
  async findAll() {
    return this.disciplinesService.findAll();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing discipline details' })
  @ApiResponse({ status: 200, description: 'Discipline successfully updated.' })
  async update(@Param('id') id: string, @Body() dto: UpdateDisciplineDto) {
    return this.disciplinesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a discipline' })
  @ApiResponse({ status: 200, description: 'Discipline successfully deleted.' })
  async remove(@Param('id') id: string) {
    return this.disciplinesService.remove(id);
  }
}