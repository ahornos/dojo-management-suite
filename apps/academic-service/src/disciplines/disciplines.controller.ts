import { Controller, Get, Post, Patch, Delete, Body, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, PartialType } from '@nestjs/swagger';
import { DisciplinesService } from './disciplines.service';
import { CreateBeltRankDto, CreateDisciplineDto } from './dto/create-discipline.dto';
import { UpdateDisciplineDto } from './dto/update-discipline.dto';
import { CreateProgramDto, UpdateProgramDto } from './dto/upsert-program.dto';
import { JwtAuthGuard, RolesGuard, Roles } from '@dms/shared-auth';
import { Role } from '@dms/shared-types';

class UpdateBeltRankDto extends PartialType(CreateBeltRankDto) {}

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
  /**
   * @param {DisciplinesService} disciplinesService - Academic catalog persistence.
   */
  constructor(private readonly disciplinesService: DisciplinesService) {}

  /**
   * @description Creates a new martial arts discipline along with optional programs and rank criteria.
   * @param {CreateDisciplineDto} dto - The payload containing discipline details.
   * @returns {Promise<object>} The newly created discipline object.
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
   * @returns {Promise<object[]>} An array of discipline objects.
   */
  @Get()
  @ApiOperation({ summary: 'List all disciplines with their programs and belt structures' })
  @ApiResponse({ status: 200, description: 'Returns all configured disciplines.' })
  async findAll() {
    return this.disciplinesService.findAll();
  }

  /**
   * Creates a training program under a discipline.
   *
   * @param {string} id - Discipline UUID.
   * @param {CreateProgramDto} dto - Program identity.
   * @returns {Promise<object>} Created program.
   */
  @Post(':id/programs')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF)
  @ApiOperation({ summary: 'Create a training program under a discipline' })
  @ApiParam({ name: 'id', description: 'Discipline UUID' })
  async createProgram(@Param('id', ParseUUIDPipe) id: string, @Body() dto: CreateProgramDto) {
    return this.disciplinesService.createProgram(id, dto);
  }

  /**
   * Updates a training program.
   *
   * @param {string} programId - Program UUID.
   * @param {UpdateProgramDto} dto - Partial fields.
   * @returns {Promise<object>} Updated program.
   */
  @Patch('programs/:programId')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF)
  @ApiOperation({ summary: 'Update a training program' })
  @ApiParam({ name: 'programId', description: 'Program UUID' })
  async updateProgram(@Param('programId', ParseUUIDPipe) programId: string, @Body() dto: UpdateProgramDto) {
    return this.disciplinesService.updateProgram(programId, dto);
  }

  /**
   * Deletes a training program.
   *
   * @param {string} programId - Program UUID.
   * @returns {Promise<object>} Deleted id.
   */
  @Delete('programs/:programId')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF)
  @ApiOperation({ summary: 'Delete a training program' })
  @ApiParam({ name: 'programId', description: 'Program UUID' })
  async deleteProgram(@Param('programId', ParseUUIDPipe) programId: string) {
    return this.disciplinesService.deleteProgram(programId);
  }

  /**
   * Creates a belt rank under a training program.
   *
   * @param {string} programId - Program UUID.
   * @param {CreateBeltRankDto} dto - Rank criteria.
   * @returns {Promise<object>} Created belt rank.
   */
  @Post('programs/:programId/belts')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF)
  @ApiOperation({ summary: 'Create a belt rank under a training program' })
  @ApiParam({ name: 'programId', description: 'Program UUID' })
  async createBeltRank(@Param('programId', ParseUUIDPipe) programId: string, @Body() dto: CreateBeltRankDto) {
    return this.disciplinesService.createBeltRank(programId, dto);
  }

  /**
   * Updates a belt rank.
   *
   * @param {string} id - Belt rank UUID.
   * @param {UpdateBeltRankDto} dto - Partial fields.
   * @returns {Promise<object>} Updated belt rank.
   */
  @Patch('belts/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF)
  @ApiOperation({ summary: 'Update a belt rank' })
  @ApiParam({ name: 'id', description: 'Belt rank UUID' })
  async updateBeltRank(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateBeltRankDto) {
    return this.disciplinesService.updateBeltRank(id, dto);
  }

  /**
   * Deletes a belt rank.
   *
   * @param {string} id - Belt rank UUID.
   * @returns {Promise<object>} Deleted id.
   */
  @Delete('belts/:id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF)
  @ApiOperation({ summary: 'Delete a belt rank' })
  @ApiParam({ name: 'id', description: 'Belt rank UUID' })
  async deleteBeltRank(@Param('id', ParseUUIDPipe) id: string) {
    return this.disciplinesService.deleteBeltRank(id);
  }

  /**
   * @description Updates the details of an existing discipline.
   * @param {string} id - The UUID of the discipline.
   * @param {UpdateDisciplineDto} dto - The payload with updated fields.
   * @returns {Promise<object>} The updated discipline object.
   */
  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF)
  @ApiOperation({ summary: 'Update an existing discipline details' })
  @ApiResponse({ status: 200, description: 'Discipline successfully updated.' })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateDisciplineDto) {
    return this.disciplinesService.update(id, dto);
  }

  /**
   * @description Permanently deletes a discipline configuration.
   * @param {string} id - The UUID of the discipline.
   * @returns {Promise<object>} The deleted discipline object.
   */
  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN_STAFF)
  @ApiOperation({ summary: 'Delete a discipline' })
  @ApiResponse({ status: 200, description: 'Discipline successfully deleted.' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.disciplinesService.remove(id);
  }
}
