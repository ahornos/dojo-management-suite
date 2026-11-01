/**
 * @file update-academy-settings.dto.ts
 * @description Partial update for tenant identity, locale, and the design-token catalog.
 * SEPA / creditor banking stays on financial-service `TenantFinancialConfig`.
 */

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsIn,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Matches,
  Max,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { BORDER_RADII, FONT_FAMILIES, SHADOW_STYLES, SPACING_DENSITIES } from '../theme-config';

const HEX_COLOR = /^#([0-9A-Fa-f]{6})$/;
const IANA_TIMEZONES = [
  'Europe/Madrid',
  'Atlantic/Canary',
  'Europe/Lisbon',
  'Europe/Paris',
  'Europe/London',
  'UTC',
] as const;
const CURRENCIES = ['EUR'] as const;

/**
 * Trims a string. Non-strings are left unchanged.
 *
 * @param {unknown} value - Raw input.
 * @returns {unknown} Trimmed string, or the original value.
 */
function trimString(value: unknown): unknown {
  return typeof value === 'string' ? value.trim() : value;
}

/**
 * Uppercases a hex color when the value is a string.
 *
 * @param {unknown} value - Raw input.
 * @returns {unknown} Normalized hex, or the original value.
 */
function upperHex(value: unknown): unknown {
  return typeof value === 'string' ? value.trim().toUpperCase() : value;
}

/**
 * Design-token catalog persisted on `AcademySettings.themeConfig`.
 * Legacy `primaryColor` / `sidebarBackground` aliases remain accepted.
 */
export class ThemeConfigDto {
  @ApiPropertyOptional({ example: '#2563EB' })
  @Transform(({ value }) => upperHex(value))
  @IsOptional()
  @Matches(HEX_COLOR, { message: 'THEME_COLOR_INVALID' })
  primary?: string;

  @ApiPropertyOptional({ example: '#64748B' })
  @Transform(({ value }) => upperHex(value))
  @IsOptional()
  @Matches(HEX_COLOR, { message: 'THEME_COLOR_INVALID' })
  secondary?: string;

  @ApiPropertyOptional({ example: '#FFFFFF' })
  @Transform(({ value }) => upperHex(value))
  @IsOptional()
  @Matches(HEX_COLOR, { message: 'THEME_COLOR_INVALID' })
  contentBg?: string;

  @ApiPropertyOptional({ example: '#FFFFFF' })
  @Transform(({ value }) => upperHex(value))
  @IsOptional()
  @Matches(HEX_COLOR, { message: 'THEME_COLOR_INVALID' })
  cardBg?: string;

  @ApiPropertyOptional({ example: '#0F172A' })
  @Transform(({ value }) => upperHex(value))
  @IsOptional()
  @Matches(HEX_COLOR, { message: 'THEME_COLOR_INVALID' })
  sidebarBg?: string;

  @ApiPropertyOptional({ example: '#F8FAFC' })
  @Transform(({ value }) => upperHex(value))
  @IsOptional()
  @Matches(HEX_COLOR, { message: 'THEME_COLOR_INVALID' })
  sidebarText?: string;

  @ApiPropertyOptional({ example: '#FFFFFF' })
  @Transform(({ value }) => upperHex(value))
  @IsOptional()
  @Matches(HEX_COLOR, { message: 'THEME_COLOR_INVALID' })
  topbarBg?: string;

  @ApiPropertyOptional({ example: '#FFFFFF' })
  @Transform(({ value }) => upperHex(value))
  @IsOptional()
  @Matches(HEX_COLOR, { message: 'THEME_COLOR_INVALID' })
  footerBg?: string;

  @ApiPropertyOptional({ example: '#0F172A' })
  @Transform(({ value }) => upperHex(value))
  @IsOptional()
  @Matches(HEX_COLOR, { message: 'THEME_COLOR_INVALID' })
  textPrimary?: string;

  @ApiPropertyOptional({ example: '#64748B' })
  @Transform(({ value }) => upperHex(value))
  @IsOptional()
  @Matches(HEX_COLOR, { message: 'THEME_COLOR_INVALID' })
  textSecondary?: string;

  @ApiPropertyOptional({ example: '#FFFFFF' })
  @Transform(({ value }) => upperHex(value))
  @IsOptional()
  @Matches(HEX_COLOR, { message: 'THEME_COLOR_INVALID' })
  textOnPrimary?: string;

  @ApiPropertyOptional({ example: '#16A34A' })
  @Transform(({ value }) => upperHex(value))
  @IsOptional()
  @Matches(HEX_COLOR, { message: 'THEME_COLOR_INVALID' })
  success?: string;

  @ApiPropertyOptional({ example: '#F59E0B' })
  @Transform(({ value }) => upperHex(value))
  @IsOptional()
  @Matches(HEX_COLOR, { message: 'THEME_COLOR_INVALID' })
  warning?: string;

  @ApiPropertyOptional({ example: '#DC2626' })
  @Transform(({ value }) => upperHex(value))
  @IsOptional()
  @Matches(HEX_COLOR, { message: 'THEME_COLOR_INVALID' })
  error?: string;

  @ApiPropertyOptional({ example: '#0284C7' })
  @Transform(({ value }) => upperHex(value))
  @IsOptional()
  @Matches(HEX_COLOR, { message: 'THEME_COLOR_INVALID' })
  info?: string;

  @ApiPropertyOptional({ enum: FONT_FAMILIES })
  @IsOptional()
  @IsIn(FONT_FAMILIES)
  fontFamily?: (typeof FONT_FAMILIES)[number];

  @ApiPropertyOptional({ example: 1, description: 'Global type scale (0.85–1.25).' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0.85)
  @Max(1.25)
  fontScaleBase?: number;

  @ApiPropertyOptional({ enum: BORDER_RADII })
  @IsOptional()
  @IsIn(BORDER_RADII)
  borderRadius?: (typeof BORDER_RADII)[number];

  @ApiPropertyOptional({ enum: SPACING_DENSITIES })
  @IsOptional()
  @IsIn(SPACING_DENSITIES)
  spacingDensity?: (typeof SPACING_DENSITIES)[number];

  @ApiPropertyOptional({ enum: SHADOW_STYLES })
  @IsOptional()
  @IsIn(SHADOW_STYLES)
  shadowStyle?: (typeof SHADOW_STYLES)[number];

  /** @deprecated Prefer `primary`. */
  @ApiPropertyOptional({ deprecated: true })
  @Transform(({ value }) => upperHex(value))
  @IsOptional()
  @Matches(HEX_COLOR, { message: 'THEME_COLOR_INVALID' })
  primaryColor?: string;

  /** @deprecated Prefer `secondary`. */
  @ApiPropertyOptional({ deprecated: true })
  @Transform(({ value }) => upperHex(value))
  @IsOptional()
  @Matches(HEX_COLOR, { message: 'THEME_COLOR_INVALID' })
  secondaryColor?: string;

  /** @deprecated Prefer `sidebarBg`. */
  @ApiPropertyOptional({ deprecated: true })
  @Transform(({ value }) => upperHex(value))
  @IsOptional()
  @Matches(HEX_COLOR, { message: 'THEME_COLOR_INVALID' })
  sidebarBackground?: string;

  /** @deprecated Prefer `topbarBg`. */
  @ApiPropertyOptional({ deprecated: true })
  @Transform(({ value }) => upperHex(value))
  @IsOptional()
  @Matches(HEX_COLOR, { message: 'THEME_COLOR_INVALID' })
  topbarBackground?: string;

  /** @deprecated Prefer `contentBg`. */
  @ApiPropertyOptional({ deprecated: true })
  @Transform(({ value }) => upperHex(value))
  @IsOptional()
  @Matches(HEX_COLOR, { message: 'THEME_COLOR_INVALID' })
  contentBackground?: string;
}

/**
 * Validated body of `PUT /academy/settings`. Every field is optional.
 */
export class UpdateAcademySettingsDto {
  @ApiPropertyOptional({ description: 'Legal name (razón social) of the tenant.' })
  @Transform(({ value }) => trimString(value))
  @IsOptional()
  @IsString()
  legalName?: string;

  @ApiPropertyOptional({ description: 'Public trade name shown in the workspace chrome.' })
  @Transform(({ value }) => trimString(value))
  @IsOptional()
  @IsString()
  tradeName?: string;

  @ApiPropertyOptional({ description: 'Tax identifier (CIF/NIF). Not a SEPA credential.' })
  @Transform(({ value }) => trimString(value))
  @IsOptional()
  @IsString()
  taxId?: string;

  @ApiPropertyOptional({ description: 'Official contact email.' })
  @Transform(({ value }) => trimString(value))
  @IsOptional()
  @ValidateIf((_, value) => typeof value === 'string' && value.length > 0)
  @IsEmail()
  officialEmail?: string;

  @ApiPropertyOptional({ enum: IANA_TIMEZONES, description: 'IANA timezone for daily attendance generation.' })
  @Transform(({ value }) => trimString(value))
  @IsOptional()
  @IsIn(IANA_TIMEZONES)
  timezone?: string;

  @ApiPropertyOptional({ enum: CURRENCIES, description: 'ISO 4217 default currency.' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toUpperCase() : value))
  @IsOptional()
  @IsIn(CURRENCIES)
  defaultCurrency?: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => trimString(value))
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => trimString(value))
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => trimString(value))
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => trimString(value))
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiPropertyOptional({ example: 'ES' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toUpperCase() : value))
  @IsOptional()
  @ValidateIf((_, value) => typeof value === 'string' && value.length > 0)
  @IsString()
  @Length(2, 2)
  country?: string;

  @ApiPropertyOptional({ description: 'Horizontal logo URL used in the top bar.' })
  @Transform(({ value }) => trimString(value))
  @IsOptional()
  @ValidateIf((_, value) => typeof value === 'string' && value.length > 0)
  @IsUrl({ require_protocol: true })
  logoUrl?: string;

  @ApiPropertyOptional({ description: 'Compact mark used in the sidebar and as favicon.' })
  @Transform(({ value }) => trimString(value))
  @IsOptional()
  @ValidateIf((_, value) => typeof value === 'string' && value.length > 0)
  @IsUrl({ require_protocol: true })
  isotypeUrl?: string;

  @ApiPropertyOptional({ description: 'High-resolution mark for invoices and diplomas.' })
  @Transform(({ value }) => trimString(value))
  @IsOptional()
  @ValidateIf((_, value) => typeof value === 'string' && value.length > 0)
  @IsUrl({ require_protocol: true })
  pdfLogoUrl?: string;

  @ApiPropertyOptional({ description: 'White-label design tokens injected as CSS variables.' })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ThemeConfigDto)
  themeConfig?: ThemeConfigDto;

  @ApiPropertyOptional({
    example: 'preset:tatami',
    description: 'Last activated appearance key (`preset:<id>` or `saved:<uuid>`).',
  })
  @Transform(({ value }) => trimString(value))
  @IsOptional()
  @IsString()
  activeAppearanceKey?: string;

  /** @deprecated Prefer `tradeName`. Accepted so older clients keep working. */
  @ApiPropertyOptional({ deprecated: true })
  @Transform(({ value }) => trimString(value))
  @IsOptional()
  @IsString()
  displayName?: string;

  /** @deprecated Prefer `tradeName`. */
  @ApiPropertyOptional({ deprecated: true })
  @Transform(({ value }) => trimString(value))
  @IsOptional()
  @IsString()
  brandName?: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => trimString(value))
  @IsOptional()
  @ValidateIf((_, value) => typeof value === 'string' && value.length > 0)
  @IsUrl({ require_protocol: true })
  website?: string;
}
