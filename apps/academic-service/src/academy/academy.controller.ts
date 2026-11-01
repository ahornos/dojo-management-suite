/**
 * @file academy.controller.ts
 * @description Staff HTTP API for academy operational settings, age brackets, and the weekly schedule.
 */

import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, Roles, RolesGuard, TenantId } from '@dms/shared-auth';
import { Role } from '@dms/shared-types';
import { AcademyService } from './academy.service';
import { ActivateAppearanceDto } from './dto/activate-appearance.dto';
import { CreateAgeBracketDto } from './dto/create-age-bracket.dto';
import { CreateSavedThemeDto } from './dto/create-saved-theme.dto';
import { CreateScheduleSlotDto } from './dto/create-schedule-slot.dto';
import { UpdateAcademySettingsDto } from './dto/update-academy-settings.dto';
import { UpdateAgeBracketDto } from './dto/update-age-bracket.dto';
import { UpdateSavedThemeDto } from './dto/update-saved-theme.dto';
import { UpdateScheduleSlotDto } from './dto/update-schedule-slot.dto';

const ADMIN_ROLES = [Role.SUPER_ADMIN, Role.ADMIN_STAFF] as const;
const READ_ROLES = [
  Role.SUPER_ADMIN,
  Role.ADMIN_STAFF,
  Role.SPORTS_TECHNICAL_DIRECTOR,
  Role.INSTRUCTOR,
] as const;

/**
 * Tenant-scoped academy configuration (`/academy/*`).
 */
@ApiTags('Academy Settings')
@ApiBearerAuth()
@ApiHeader({ name: 'x-school-id', required: true, description: 'Tenant (academy) identifier.' })
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('academy')
export class AcademyController {
  /**
   * @param {AcademyService} academyService - Tenant-scoped persistence.
   */
  constructor(private readonly academyService: AcademyService) {}

  /**
   * Returns this tenant's operational settings, creating a blank row when missing.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @returns {Promise<object>} Settings row.
   */
  @Get('settings')
  @ApiOperation({ summary: 'Get academy identity and theme (any authenticated tenant user)' })
  getSettings(@TenantId() tenantId: string) {
    return this.academyService.getSettings(tenantId);
  }

  /**
   * Creates or updates operational academy identity and brand.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {UpdateAcademySettingsDto} dto - Partial fields.
   * @returns {Promise<object>} Persisted settings.
   */
  @Put('settings')
  @Roles(...ADMIN_ROLES)
  @ApiOperation({ summary: 'Update academy operational settings' })
  upsertSettings(@TenantId() tenantId: string, @Body() dto: UpdateAcademySettingsDto) {
    return this.academyService.upsertSettings(tenantId, dto);
  }

  /**
   * Lists tenant-owned custom appearances. System presets are not included.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @returns {Promise<object[]>} Saved themes.
   */
  @Get('appearances')
  @Roles(...ADMIN_ROLES)
  @ApiOperation({ summary: 'List custom saved appearances' })
  listSavedThemes(@TenantId() tenantId: string) {
    return this.academyService.listSavedThemes(tenantId);
  }

  /**
   * Persists a custom appearance cloned from the current studio tokens.
   *
   * @param {string} tenantId - Academy key.
   * @param {CreateSavedThemeDto} dto - Name, tokens, optional activate.
   * @returns {Promise<object>} Created appearance.
   */
  @Post('appearances')
  @Roles(...ADMIN_ROLES)
  @ApiOperation({ summary: 'Save a custom appearance' })
  createSavedTheme(@TenantId() tenantId: string, @Body() dto: CreateSavedThemeDto) {
    return this.academyService.createSavedTheme(tenantId, dto);
  }

  /**
   * Activates a system preset or a saved custom appearance as the live workspace theme.
   *
   * @param {string} tenantId - Academy key.
   * @param {ActivateAppearanceDto} dto - Appearance key.
   * @returns {Promise<object>} Updated academy settings.
   */
  @Put('appearances/active')
  @Roles(...ADMIN_ROLES)
  @ApiOperation({ summary: 'Activate a preset or saved appearance' })
  activateAppearance(@TenantId() tenantId: string, @Body() dto: ActivateAppearanceDto) {
    return this.academyService.activateAppearance(tenantId, dto);
  }

  /**
   * Renames or overwrites tokens on a custom appearance. System presets are immutable.
   *
   * @param {string} tenantId - Academy key.
   * @param {string} id - Saved-theme UUID.
   * @param {UpdateSavedThemeDto} dto - Partial fields.
   * @returns {Promise<object>} Updated appearance.
   */
  @Patch('appearances/:id')
  @Roles(...ADMIN_ROLES)
  @ApiOperation({ summary: 'Update a custom appearance' })
  @ApiParam({ name: 'id', description: 'Saved appearance UUID' })
  updateSavedTheme(
    @TenantId() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSavedThemeDto,
  ) {
    return this.academyService.updateSavedTheme(tenantId, id, dto);
  }

  /**
   * Deletes a custom appearance. System presets cannot be deleted.
   *
   * @param {string} tenantId - Academy key.
   * @param {string} id - Saved-theme UUID.
   * @returns {Promise<object>} Deleted id.
   */
  @Delete('appearances/:id')
  @Roles(...ADMIN_ROLES)
  @ApiOperation({ summary: 'Delete a custom appearance' })
  @ApiParam({ name: 'id', description: 'Saved appearance UUID' })
  deleteSavedTheme(@TenantId() tenantId: string, @Param('id', ParseUUIDPipe) id: string) {
    return this.academyService.deleteSavedTheme(tenantId, id);
  }

  /**
   * Lists tenant age brackets (seeds product defaults on first read).
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @returns {Promise<object[]>} Age brackets.
   */
  @Get('age-brackets')
  @Roles(...READ_ROLES)
  @ApiOperation({ summary: 'List academy age brackets' })
  listAgeBrackets(@TenantId() tenantId: string) {
    return this.academyService.listAgeBrackets(tenantId);
  }

  /**
   * Creates a tenant age bracket.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {CreateAgeBracketDto} dto - Name and inclusive range.
   * @returns {Promise<object>} Created bracket.
   */
  @Post('age-brackets')
  @Roles(...ADMIN_ROLES)
  @ApiOperation({ summary: 'Create an age bracket' })
  createAgeBracket(@TenantId() tenantId: string, @Body() dto: CreateAgeBracketDto) {
    return this.academyService.createAgeBracket(tenantId, dto);
  }

  /**
   * Updates a tenant age bracket.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {string} id - Bracket UUID.
   * @param {UpdateAgeBracketDto} dto - Partial fields.
   * @returns {Promise<object>} Updated bracket.
   */
  @Patch('age-brackets/:id')
  @Roles(...ADMIN_ROLES)
  @ApiOperation({ summary: 'Update an age bracket' })
  @ApiParam({ name: 'id', description: 'Age bracket UUID' })
  updateAgeBracket(
    @TenantId() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAgeBracketDto,
  ) {
    return this.academyService.updateAgeBracket(tenantId, id, dto);
  }

  /**
   * Deletes a tenant age bracket.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {string} id - Bracket UUID.
   * @returns {Promise<object>} Deleted id.
   */
  @Delete('age-brackets/:id')
  @Roles(...ADMIN_ROLES)
  @ApiOperation({ summary: 'Delete an age bracket' })
  @ApiParam({ name: 'id', description: 'Age bracket UUID' })
  deleteAgeBracket(@TenantId() tenantId: string, @Param('id', ParseUUIDPipe) id: string) {
    return this.academyService.deleteAgeBracket(tenantId, id);
  }

  /**
   * Lists weekly master-calendar slots.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @returns {Promise<object[]>} Slots.
   */
  @Get('schedule-slots')
  @Roles(...ADMIN_ROLES)
  @ApiOperation({ summary: 'List weekly schedule slots' })
  listScheduleSlots(@TenantId() tenantId: string) {
    return this.academyService.listScheduleSlots(tenantId);
  }

  /**
   * Creates a weekly class slot.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {CreateScheduleSlotDto} dto - Weekday, times, discipline, instructor.
   * @returns {Promise<object>} Created slot.
   */
  @Post('schedule-slots')
  @Roles(...ADMIN_ROLES)
  @ApiOperation({ summary: 'Create a weekly schedule slot' })
  createScheduleSlot(@TenantId() tenantId: string, @Body() dto: CreateScheduleSlotDto) {
    return this.academyService.createScheduleSlot(tenantId, dto);
  }

  /**
   * Updates a weekly class slot.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {string} id - Slot UUID.
   * @param {UpdateScheduleSlotDto} dto - Partial fields.
   * @returns {Promise<object>} Updated slot.
   */
  @Patch('schedule-slots/:id')
  @Roles(...ADMIN_ROLES)
  @ApiOperation({ summary: 'Update a weekly schedule slot' })
  @ApiParam({ name: 'id', description: 'Schedule slot UUID' })
  updateScheduleSlot(
    @TenantId() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateScheduleSlotDto,
  ) {
    return this.academyService.updateScheduleSlot(tenantId, id, dto);
  }

  /**
   * Deletes a weekly class slot.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {string} id - Slot UUID.
   * @returns {Promise<object>} Deleted id.
   */
  @Delete('schedule-slots/:id')
  @Roles(...ADMIN_ROLES)
  @ApiOperation({ summary: 'Delete a weekly schedule slot' })
  @ApiParam({ name: 'id', description: 'Schedule slot UUID' })
  deleteScheduleSlot(@TenantId() tenantId: string, @Param('id', ParseUUIDPipe) id: string) {
    return this.academyService.deleteScheduleSlot(tenantId, id);
  }
}
