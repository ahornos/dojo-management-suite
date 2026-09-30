import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DisciplinesService } from './disciplines.service';
import { CreateDisciplineDto } from './dto/create-discipline.dto';
import { UpdateDisciplineDto } from './dto/update-discipline.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@dms/database/client';

/**
 * @class DisciplinesController
 * @description Controller managing academy disciplines, age programs, and belt rank structures.
 * Protected by JWT authentication. Mutation operations are restricted to administrative roles.
 */
@ApiTags('Academy Configuration & Disciplines')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('disciplines')
export class DisciplinesController {
  constructor(private readonly disciplinesService: DisciplinesService) {}

  /**
   * @description Creates a new martial arts discipline along with its programs and rank criteria.
   * @param {CreateDisciplineDto} dto - The payload containing discipline details.
   * @returns {Promise<any>} The newly created discipline object.
   */
  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF)
  @ApiOperation({ summary: 'Create a discipline with its age programs and rank criteria' })
  @ApiResponse({ status: 201, description: 'Discipline configuration successfully created.' })
  async create(@Body() dto: CreateDisciplineDto) {
    return this.disciplinesService.create(dto);
  }

  /**
   * @description Retrieves a complete list of all configured disciplines.
   * Accessible to all authenticated users.
   * @returns {Promise<any[]>} An array of discipline objects.
   */
  @Get()
  @ApiOperation({ summary: 'List all disciplines with their programs and belt structures' })
  @ApiResponse({ status: 200, description: 'Returns all configured disciplines.' })
  async findAll() {
    return this.disciplinesService.findAll();
  }

  /**
   * @description Updates the details of an existing discipline.
   * @param {string} id - The UUID of the discipline.
   * @param {UpdateDisciplineDto} dto - The payload with updated fields.
   * @returns {Promise<any>} The updated discipline object.
   */
  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF)
  @ApiOperation({ summary: 'Update an existing discipline details' })
  @ApiResponse({ status: 200, description: 'Discipline successfully updated.' })
  async update(@Param('id') id: string, @Body() dto: UpdateDisciplineDto) {
    return this.disciplinesService.update(id, dto);
  }

  /**
   * @description Permanently deletes a discipline configuration.
   * @param {string} id - The UUID of the discipline.
   * @returns {Promise<any>} The deleted discipline object.
   */
  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF)
  @ApiOperation({ summary: 'Delete a discipline' })
  @ApiResponse({ status: 200, description: 'Discipline successfully deleted.' })
  async remove(@Param('id') id: string) {
    return this.disciplinesService.remove(id);
  }
}