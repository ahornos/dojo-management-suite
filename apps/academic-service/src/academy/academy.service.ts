/**
 * @file academy.service.ts
 * @description Tenant-scoped academy operational settings: identity/brand, age brackets, and weekly schedule.
 */

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@dms/database/client';
import { PrismaService } from '../prisma/prisma.service';
import { DEFAULT_AGE_BRACKETS } from './default-age-brackets';
import { ActivateAppearanceDto } from './dto/activate-appearance.dto';
import { CreateAgeBracketDto } from './dto/create-age-bracket.dto';
import { CreateSavedThemeDto } from './dto/create-saved-theme.dto';
import { CreateScheduleSlotDto } from './dto/create-schedule-slot.dto';
import { UpdateAcademySettingsDto } from './dto/update-academy-settings.dto';
import { UpdateAgeBracketDto } from './dto/update-age-bracket.dto';
import { UpdateSavedThemeDto } from './dto/update-saved-theme.dto';
import { UpdateScheduleSlotDto } from './dto/update-schedule-slot.dto';
import {
  normalizeThemeConfig,
  parseAppearanceKey,
  savedAppearanceKey,
  THEME_PRESETS,
} from './theme-config';

/**
 * Persistence for academy operational configuration. Every query is scoped to `tenantId`.
 */
@Injectable()
export class AcademyService {
  /**
   * @param {PrismaService} prisma - Academic-domain Prisma client.
   */
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Returns the tenant settings row, creating a blank default when missing.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @returns {Promise<object>} Tenant identity, locale, and theme.
   */
  async getSettings(tenantId: string) {
    const row = await this.prisma.academySettings.upsert({
      where: { tenantId },
      create: { tenantId },
      update: {},
    });
    return serializeAcademySettings(row);
  }

  /**
   * Creates or updates tenant identity, locale, and white-label theme (not SEPA).
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {UpdateAcademySettingsDto} data - Partial fields to persist.
   * @returns {Promise<object>} The persisted row.
   */
  async upsertSettings(tenantId: string, data: UpdateAcademySettingsDto) {
    const tradeName = data.tradeName ?? data.brandName ?? data.displayName;
    const payload: Prisma.AcademySettingsUncheckedCreateInput = {
      tenantId,
      ...(data.legalName !== undefined ? { legalName: data.legalName } : {}),
      ...(tradeName !== undefined ? { tradeName, displayName: tradeName, brandName: tradeName } : {}),
      ...(data.taxId !== undefined ? { taxId: data.taxId } : {}),
      ...(data.officialEmail !== undefined ? { officialEmail: data.officialEmail } : {}),
      ...(data.timezone !== undefined ? { timezone: data.timezone } : {}),
      ...(data.defaultCurrency !== undefined ? { defaultCurrency: data.defaultCurrency } : {}),
      ...(data.phone !== undefined ? { phone: data.phone } : {}),
      ...(data.address !== undefined ? { address: data.address } : {}),
      ...(data.city !== undefined ? { city: data.city } : {}),
      ...(data.postalCode !== undefined ? { postalCode: data.postalCode } : {}),
      ...(data.country !== undefined ? { country: data.country } : {}),
      ...(data.logoUrl !== undefined ? { logoUrl: data.logoUrl } : {}),
      ...(data.isotypeUrl !== undefined ? { isotypeUrl: data.isotypeUrl } : {}),
      ...(data.pdfLogoUrl !== undefined ? { pdfLogoUrl: data.pdfLogoUrl } : {}),
      ...(data.website !== undefined ? { website: data.website } : {}),
      ...(data.themeConfig !== undefined ? { themeConfig: normalizeThemeConfig(data.themeConfig) } : {}),
      ...(data.activeAppearanceKey !== undefined ? { activeAppearanceKey: data.activeAppearanceKey } : {}),
    };
    const { tenantId: _tenantId, ...update } = payload;
    const row = await this.prisma.academySettings.upsert({
      where: { tenantId },
      create: payload,
      update,
    });
    return serializeAcademySettings(row);
  }

  /**
   * Lists tenant-owned custom appearances. System presets are never stored here.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @returns {Promise<object[]>} Saved themes newest-first.
   */
  async listSavedThemes(tenantId: string) {
    const rows = await this.prisma.academySavedTheme.findMany({
      where: { tenantId },
      orderBy: { updatedAt: 'desc' },
    });
    return rows.map(serializeSavedTheme);
  }

  /**
   * Persists a custom appearance. Optionally activates it as the live workspace catalog.
   *
   * @param {string} tenantId - Academy key.
   * @param {CreateSavedThemeDto} dto - Title, tokens, optional activate flag.
   * @returns {Promise<object>} Created row (normalized tokens).
   */
  async createSavedTheme(tenantId: string, dto: CreateSavedThemeDto) {
    const name = assertAppearanceName(dto.name);
    const themeConfig = normalizeThemeConfig(dto.themeConfig);
    try {
      const row = await this.prisma.$transaction(async (tx) => {
        const created = await tx.academySavedTheme.create({
          data: { tenantId, name, themeConfig },
        });
        if (dto.activate) {
          await tx.academySettings.upsert({
            where: { tenantId },
            create: { tenantId, themeConfig, activeAppearanceKey: savedAppearanceKey(created.id) },
            update: { themeConfig, activeAppearanceKey: savedAppearanceKey(created.id) },
          });
        }
        return created;
      });
      return serializeSavedTheme(row);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new BadRequestException('SAVED_THEME_NAME_EXISTS');
      }
      throw error;
    }
  }

  /**
   * Renames and/or overwrites tokens on a custom appearance. System presets cannot be addressed here.
   *
   * @param {string} tenantId - Academy key.
   * @param {string} id - Saved-theme UUID.
   * @param {UpdateSavedThemeDto} dto - Partial name / tokens.
   * @returns {Promise<object>} Updated row.
   */
  async updateSavedTheme(tenantId: string, id: string, dto: UpdateSavedThemeDto) {
    await this.requireSavedTheme(tenantId, id);
    const name = dto.name !== undefined ? assertAppearanceName(dto.name) : undefined;
    const themeConfig = dto.themeConfig !== undefined ? normalizeThemeConfig(dto.themeConfig) : undefined;
    try {
      const row = await this.prisma.$transaction(async (tx) => {
        const updated = await tx.academySavedTheme.update({
          where: { id },
          data: {
            ...(name !== undefined ? { name } : {}),
            ...(themeConfig !== undefined ? { themeConfig } : {}),
          },
        });
        if (themeConfig !== undefined) {
          const settings = await tx.academySettings.findUnique({ where: { tenantId } });
          if (settings?.activeAppearanceKey === savedAppearanceKey(id)) {
            await tx.academySettings.update({
              where: { tenantId },
              data: { themeConfig },
            });
          }
        }
        return updated;
      });
      return serializeSavedTheme(row);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new BadRequestException('SAVED_THEME_NAME_EXISTS');
      }
      throw error;
    }
  }

  /**
   * Deletes a custom appearance. System presets are not stored and cannot be deleted.
   *
   * @param {string} tenantId - Academy key.
   * @param {string} id - Saved-theme UUID.
   * @returns {Promise<{ id: string }>} Deleted id.
   */
  async deleteSavedTheme(tenantId: string, id: string) {
    await this.requireSavedTheme(tenantId, id);
    await this.prisma.$transaction(async (tx) => {
      await tx.academySavedTheme.delete({ where: { id } });
      const settings = await tx.academySettings.findUnique({ where: { tenantId } });
      if (settings?.activeAppearanceKey === savedAppearanceKey(id)) {
        await tx.academySettings.update({
          where: { tenantId },
          data: { activeAppearanceKey: '' },
        });
      }
    });
    return { id };
  }

  /**
   * Writes a system preset or saved appearance onto the live tenant catalog.
   *
   * @param {string} tenantId - Academy key.
   * @param {ActivateAppearanceDto} dto - Appearance key.
   * @returns {Promise<object>} Updated academy settings.
   */
  async activateAppearance(tenantId: string, dto: ActivateAppearanceDto) {
    const parsed = parseAppearanceKey(dto.key);
    if (!parsed) {
      throw new BadRequestException('APPEARANCE_KEY_INVALID');
    }
    const themeConfig =
      parsed.type === 'preset'
        ? THEME_PRESETS[parsed.id]
        : normalizeThemeConfig((await this.requireSavedTheme(tenantId, parsed.id)).themeConfig);
    const row = await this.prisma.academySettings.upsert({
      where: { tenantId },
      create: { tenantId, themeConfig, activeAppearanceKey: dto.key },
      update: { themeConfig, activeAppearanceKey: dto.key },
    });
    return serializeAcademySettings(row);
  }

  /**
   * Lists tenant age brackets, seeding the historical defaults on first read.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @returns {Promise<object[]>} Brackets ordered by `sortOrder`.
   */
  async listAgeBrackets(tenantId: string) {
    await this.ensureDefaultAgeBrackets(tenantId);
    return this.prisma.ageBracket.findMany({
      where: { tenantId },
      orderBy: [{ sortOrder: 'asc' }, { minAge: 'asc' }],
    });
  }

  /**
   * Creates a tenant age bracket. `code` is derived from `name` when omitted.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {CreateAgeBracketDto} dto - Name, range, optional code.
   * @returns {Promise<object>} The persisted bracket.
   */
  async createAgeBracket(tenantId: string, dto: CreateAgeBracketDto) {
    this.assertAgeRange(dto.minAge, dto.maxAge);
    const code = dto.code ?? slugCode(dto.name);
    try {
      return await this.prisma.ageBracket.create({
        data: {
          tenantId,
          code,
          name: dto.name,
          minAge: dto.minAge,
          maxAge: dto.maxAge,
          sortOrder: dto.sortOrder ?? 0,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new BadRequestException('AGE_BRACKET_CODE_EXISTS');
      }
      throw error;
    }
  }

  /**
   * Updates a tenant age bracket. `code` stays immutable.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {string} id - Bracket UUID.
   * @param {UpdateAgeBracketDto} dto - Partial fields.
   * @returns {Promise<object>} The updated bracket.
   */
  async updateAgeBracket(tenantId: string, id: string, dto: UpdateAgeBracketDto) {
    const existing = await this.requireAgeBracket(tenantId, id);
    const minAge = dto.minAge ?? existing.minAge;
    const maxAge = dto.maxAge ?? existing.maxAge;
    this.assertAgeRange(minAge, maxAge);
    return this.prisma.ageBracket.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.minAge !== undefined ? { minAge: dto.minAge } : {}),
        ...(dto.maxAge !== undefined ? { maxAge: dto.maxAge } : {}),
        ...(dto.sortOrder !== undefined ? { sortOrder: dto.sortOrder } : {}),
      },
    });
  }

  /**
   * Deletes a tenant age bracket and drops its id from schedule slots.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {string} id - Bracket UUID.
   * @returns {Promise<object>} The deleted bracket.
   */
  async deleteAgeBracket(tenantId: string, id: string) {
    await this.requireAgeBracket(tenantId, id);
    const slots = await this.prisma.academyScheduleSlot.findMany({
      where: { tenantId, ageBracketIds: { has: id } },
      select: { id: true, ageBracketIds: true },
    });
    await this.prisma.$transaction(async (tx) => {
      for (const slot of slots) {
        await tx.academyScheduleSlot.update({
          where: { id: slot.id },
          data: { ageBracketIds: slot.ageBracketIds.filter((bracketId) => bracketId !== id) },
        });
      }
      await tx.ageBracket.delete({ where: { id } });
    });
    return { id };
  }

  /**
   * Lists weekly master-calendar slots for the tenant.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @returns {Promise<object[]>} Slots ordered by weekday then start time.
   */
  async listScheduleSlots(tenantId: string) {
    return this.prisma.academyScheduleSlot.findMany({
      where: { tenantId },
      orderBy: [{ weekday: 'asc' }, { startTime: 'asc' }],
    });
  }

  /**
   * Creates a weekly class slot after validating the discipline and age brackets.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {CreateScheduleSlotDto} dto - Weekday, times, discipline, instructor.
   * @returns {Promise<object>} The persisted slot.
   */
  async createScheduleSlot(tenantId: string, dto: CreateScheduleSlotDto) {
    await this.assertDiscipline(dto.disciplineId);
    await this.assertAgeBracketIds(tenantId, dto.ageBracketIds ?? []);
    return this.prisma.academyScheduleSlot.create({
      data: {
        tenantId,
        weekday: dto.weekday,
        startTime: dto.startTime,
        endTime: dto.endTime,
        disciplineId: dto.disciplineId,
        instructorUserId: dto.instructorUserId,
        maxCapacity: dto.maxCapacity,
        ageBracketIds: dto.ageBracketIds ?? [],
        label: dto.label,
        isActive: dto.isActive ?? true,
      },
    });
  }

  /**
   * Updates a weekly class slot owned by this tenant.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {string} id - Slot UUID.
   * @param {UpdateScheduleSlotDto} dto - Partial fields.
   * @returns {Promise<object>} The updated slot.
   */
  async updateScheduleSlot(tenantId: string, id: string, dto: UpdateScheduleSlotDto) {
    await this.requireScheduleSlot(tenantId, id);
    if (dto.disciplineId) {
      await this.assertDiscipline(dto.disciplineId);
    }
    if (dto.ageBracketIds) {
      await this.assertAgeBracketIds(tenantId, dto.ageBracketIds);
    }
    return this.prisma.academyScheduleSlot.update({
      where: { id },
      data: {
        ...(dto.weekday !== undefined ? { weekday: dto.weekday } : {}),
        ...(dto.startTime !== undefined ? { startTime: dto.startTime } : {}),
        ...(dto.endTime !== undefined ? { endTime: dto.endTime } : {}),
        ...(dto.disciplineId !== undefined ? { disciplineId: dto.disciplineId } : {}),
        ...(dto.instructorUserId !== undefined ? { instructorUserId: dto.instructorUserId } : {}),
        ...(dto.maxCapacity !== undefined ? { maxCapacity: dto.maxCapacity } : {}),
        ...(dto.ageBracketIds !== undefined ? { ageBracketIds: dto.ageBracketIds } : {}),
        ...(dto.label !== undefined ? { label: dto.label } : {}),
        ...(dto.isActive !== undefined ? { isActive: dto.isActive } : {}),
      },
    });
  }

  /**
   * Deletes a weekly class slot. Existing generated sessions keep their inherited fields.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {string} id - Slot UUID.
   * @returns {Promise<object>} The deleted slot id.
   */
  async deleteScheduleSlot(tenantId: string, id: string) {
    await this.requireScheduleSlot(tenantId, id);
    await this.prisma.academyScheduleSlot.delete({ where: { id } });
    return { id };
  }

  /**
   * Inserts the historical Kids/Infantil/Juvenil/Adults brackets when the tenant has none.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @returns {Promise<void>}
   */
  async ensureDefaultAgeBrackets(tenantId: string): Promise<void> {
    const count = await this.prisma.ageBracket.count({ where: { tenantId } });
    if (count > 0) {
      return;
    }
    await this.prisma.ageBracket.createMany({
      data: DEFAULT_AGE_BRACKETS.map((row) => ({ tenantId, ...row })),
    });
  }

  /**
   * @param {number} minAge - Inclusive lower bound.
   * @param {number} maxAge - Inclusive upper bound.
   * @returns {void}
   */
  private assertAgeRange(minAge: number, maxAge: number): void {
    if (maxAge < minAge) {
      throw new BadRequestException('AGE_BRACKET_INVALID_RANGE');
    }
  }

  /**
   * @param {string} tenantId - Academy key.
   * @param {string} id - Bracket UUID.
   * @returns {Promise<{ id: string; minAge: number; maxAge: number }>} Existing row.
   */
  private async requireAgeBracket(tenantId: string, id: string) {
    const row = await this.prisma.ageBracket.findFirst({ where: { id, tenantId } });
    if (!row) {
      throw new NotFoundException('AGE_BRACKET_NOT_FOUND');
    }
    return row;
  }

  /**
   * @param {string} tenantId - Academy key.
   * @param {string} id - Slot UUID.
   * @returns {Promise<{ id: string }>} Existing row.
   */
  private async requireScheduleSlot(tenantId: string, id: string) {
    const row = await this.prisma.academyScheduleSlot.findFirst({ where: { id, tenantId } });
    if (!row) {
      throw new NotFoundException('SCHEDULE_SLOT_NOT_FOUND');
    }
    return row;
  }

  /**
   * @param {string} tenantId - Academy key.
   * @param {string} id - Saved-theme UUID.
   * @returns {Promise<object>} The row when it belongs to this tenant.
   */
  private async requireSavedTheme(tenantId: string, id: string) {
    const row = await this.prisma.academySavedTheme.findFirst({ where: { id, tenantId } });
    if (!row) {
      throw new NotFoundException('SAVED_THEME_NOT_FOUND');
    }
    return row;
  }

  /**
   * @param {string} disciplineId - Academic discipline UUID.
   * @returns {Promise<void>}
   */
  private async assertDiscipline(disciplineId: string): Promise<void> {
    const discipline = await this.prisma.discipline.findUnique({ where: { id: disciplineId } });
    if (!discipline) {
      throw new NotFoundException('DISCIPLINE_NOT_FOUND');
    }
  }

  /**
   * @param {string} tenantId - Academy key.
   * @param {string[]} ids - Claimed AgeBracket ids.
   * @returns {Promise<void>}
   */
  private async assertAgeBracketIds(tenantId: string, ids: string[]): Promise<void> {
    if (ids.length === 0) {
      return;
    }
    const found = await this.prisma.ageBracket.count({ where: { tenantId, id: { in: ids } } });
    if (found !== ids.length) {
      throw new BadRequestException('AGE_BRACKET_NOT_FOUND');
    }
  }
}

/**
 * Derives a stable lowercase code from a display name.
 *
 * @param {string} name - Staff-facing label.
 * @returns {string} `kids`-style slug.
 */
/**
 * Validates a staff-facing appearance title.
 *
 * @param {string} name - Candidate title.
 * @returns {string} Trimmed title.
 */
function assertAppearanceName(name: string): string {
  const trimmed = name.trim();
  if (trimmed.length < 2 || trimmed.length > 80) {
    throw new BadRequestException('SAVED_THEME_NAME_INVALID');
  }
  return trimmed;
}

/**
 * Maps a saved-theme row to the public contract.
 *
 * @param {object} row - Prisma `AcademySavedTheme` row.
 * @returns {object} API payload with a complete `themeConfig`.
 */
function serializeSavedTheme(row: { themeConfig: Prisma.JsonValue; [key: string]: unknown }) {
  return {
    ...row,
    themeConfig: normalizeThemeConfig(row.themeConfig),
  };
}

function slugCode(name: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 40);
  return slug || 'bracket';
}

/**
 * Maps a persisted settings row to the public contract, syncing legacy name fields.
 *
 * @param {object} row - Prisma `AcademySettings` row.
 * @returns {object} API payload with a complete `themeConfig`.
 */
function serializeAcademySettings(row: {
  tradeName: string;
  brandName: string;
  displayName: string;
  timezone?: string;
  themeConfig: Prisma.JsonValue;
  [key: string]: unknown;
}) {
  const tradeName = row.tradeName || row.brandName || row.displayName || '';
  return {
    ...row,
    tradeName,
    displayName: tradeName,
    brandName: tradeName,
    timezone: row.timezone || 'Europe/Madrid',
    themeConfig: normalizeThemeConfig(row.themeConfig),
  };
}
