/**
 * @file theme-config.ts
 * @description Normalizes the tenant design-token catalog stored on `AcademySettings.themeConfig`.
 * Accepts both the current token names and the previous `primaryColor` / `sidebarBackground` aliases.
 */

const HEX = /^#([0-9A-Fa-f]{6})$/;

export const FONT_FAMILIES = ['Inter', 'Roboto', 'Open Sans'] as const;
export const BORDER_RADII = ['sharp', 'subtle', 'rounded'] as const;
export const SPACING_DENSITIES = ['compact', 'comfortable'] as const;
export const SHADOW_STYLES = ['flat', 'soft', 'prominent'] as const;

export type FontFamily = (typeof FONT_FAMILIES)[number];
export type BorderRadiusToken = (typeof BORDER_RADII)[number];
export type SpacingDensity = (typeof SPACING_DENSITIES)[number];
export type ShadowStyle = (typeof SHADOW_STYLES)[number];

/** Product default aligned with `apps/pwa-frontend/src/index.css` light tokens. */
export const DEFAULT_THEME_CONFIG = {
  primary: '#2563EB',
  secondary: '#64748B',
  contentBg: '#FFFFFF',
  cardBg: '#FFFFFF',
  sidebarBg: '#0F172A',
  sidebarText: '#F8FAFC',
  topbarBg: '#FFFFFF',
  footerBg: '#FFFFFF',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  textOnPrimary: '#FFFFFF',
  success: '#16A34A',
  warning: '#F59E0B',
  error: '#DC2626',
  info: '#0284C7',
  fontFamily: 'Inter' as FontFamily,
  fontScaleBase: 1,
  borderRadius: 'subtle' as BorderRadiusToken,
  spacingDensity: 'comfortable' as SpacingDensity,
  shadowStyle: 'soft' as ShadowStyle,
};

export type ThemeConfig = typeof DEFAULT_THEME_CONFIG;

export const THEME_PRESET_IDS = ['tatami', 'modern', 'performance'] as const;
export type ThemePresetId = (typeof THEME_PRESET_IDS)[number];

export const PRESET_APPEARANCE_PREFIX = 'preset:';
export const SAVED_APPEARANCE_PREFIX = 'saved:';

/** Built-in catalogs mirrored by the PWA studio. Immutable; never persisted as saved rows. */
export const THEME_PRESETS: Record<ThemePresetId, ThemeConfig> = {
  tatami: {
    ...DEFAULT_THEME_CONFIG,
    primary: '#990000',
    secondary: '#C5A059',
    contentBg: '#F9F8F6',
    cardBg: '#FFFFFF',
    sidebarBg: '#1A1A1A',
    sidebarText: '#F5F0E8',
    topbarBg: '#2C2C2C',
    footerBg: '#2C2C2C',
    textPrimary: '#1A1A1A',
    textSecondary: '#5C564E',
    success: '#2E7D32',
    warning: '#C5A059',
    error: '#B71C1C',
    info: '#1565C0',
    borderRadius: 'subtle',
    spacingDensity: 'comfortable',
    shadowStyle: 'soft',
  },
  modern: {
    ...DEFAULT_THEME_CONFIG,
    primary: '#0052CC',
    secondary: '#5C6F84',
    contentBg: '#F4F6F8',
    sidebarBg: '#0A1128',
    sidebarText: '#E8EEF6',
    topbarBg: '#1C2D50',
    footerBg: '#1C2D50',
    textPrimary: '#0A1128',
    textSecondary: '#5C6F84',
    success: '#00875A',
    warning: '#FF8B00',
    error: '#DE350B',
    info: '#0065FF',
    borderRadius: 'rounded',
    spacingDensity: 'comfortable',
    shadowStyle: 'soft',
  },
  performance: {
    ...DEFAULT_THEME_CONFIG,
    primary: '#00875A',
    secondary: '#00B8D9',
    contentBg: '#FFFFFF',
    cardBg: '#F4F5F7',
    sidebarBg: '#091E42',
    sidebarText: '#E6EDF5',
    topbarBg: '#172B4D',
    footerBg: '#091E42',
    textPrimary: '#091E42',
    textSecondary: '#42526E',
    success: '#00875A',
    warning: '#FF8B00',
    error: '#DE350B',
    info: '#00B8D9',
    fontFamily: 'Roboto',
    borderRadius: 'subtle',
    spacingDensity: 'compact',
    shadowStyle: 'flat',
  },
};

/**
 * @param {ThemePresetId} id - Built-in preset.
 * @returns {string} `preset:<id>`.
 */
export function presetAppearanceKey(id: ThemePresetId): string {
  return `${PRESET_APPEARANCE_PREFIX}${id}`;
}

/**
 * @param {string} id - Saved-theme UUID.
 * @returns {string} `saved:<uuid>`.
 */
export function savedAppearanceKey(id: string): string {
  return `${SAVED_APPEARANCE_PREFIX}${id}`;
}

/**
 * @param {string | undefined} key - `preset:<id>` or `saved:<uuid>`.
 * @returns {{ type: 'preset'; id: ThemePresetId } | { type: 'saved'; id: string } | null} Parsed key.
 */
export function parseAppearanceKey(
  key: string | undefined,
): { type: 'preset'; id: ThemePresetId } | { type: 'saved'; id: string } | null {
  if (!key) {
    return null;
  }
  if (key.startsWith(PRESET_APPEARANCE_PREFIX)) {
    const id = key.slice(PRESET_APPEARANCE_PREFIX.length);
    return THEME_PRESET_IDS.includes(id as ThemePresetId) ? { type: 'preset', id: id as ThemePresetId } : null;
  }
  if (key.startsWith(SAVED_APPEARANCE_PREFIX)) {
    const id = key.slice(SAVED_APPEARANCE_PREFIX.length);
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)
      ? { type: 'saved', id }
      : null;
  }
  return null;
}

/**
 * @param {unknown} value - Candidate hex string.
 * @returns {string | undefined} Uppercase `#RRGGBB`, or undefined when invalid.
 */
function asHex(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }
  const trimmed = value.trim();
  return HEX.test(trimmed) ? trimmed.toUpperCase() : undefined;
}

/**
 * @param {unknown} value - Candidate enum member.
 * @param {readonly string[]} allowed - Closed set.
 * @returns {string | undefined} The value when allowed.
 */
function asEnum<T extends string>(value: unknown, allowed: readonly T[]): T | undefined {
  return typeof value === 'string' && (allowed as readonly string[]).includes(value) ? (value as T) : undefined;
}

/**
 * @param {unknown} value - Candidate scale factor.
 * @returns {number | undefined} Clamped scale, or undefined when invalid.
 */
function asScale(value: unknown): number | undefined {
  const parsed = typeof value === 'number' ? value : typeof value === 'string' ? Number.parseFloat(value) : Number.NaN;
  if (!Number.isFinite(parsed)) {
    return undefined;
  }
  return Math.min(1.25, Math.max(0.85, parsed));
}

/**
 * Coerces persisted JSON (including legacy palette keys) into a complete token catalog.
 *
 * @param {unknown} raw - Prisma JSON value.
 * @returns {ThemeConfig} Catalog with product defaults for missing keys.
 */
export function normalizeThemeConfig(raw: unknown): ThemeConfig {
  const source = raw && typeof raw === 'object' && !Array.isArray(raw) ? (raw as Record<string, unknown>) : {};
  return {
    primary: asHex(source.primary) ?? asHex(source.primaryColor) ?? DEFAULT_THEME_CONFIG.primary,
    secondary: asHex(source.secondary) ?? asHex(source.secondaryColor) ?? DEFAULT_THEME_CONFIG.secondary,
    contentBg: asHex(source.contentBg) ?? asHex(source.contentBackground) ?? DEFAULT_THEME_CONFIG.contentBg,
    cardBg: asHex(source.cardBg) ?? DEFAULT_THEME_CONFIG.cardBg,
    sidebarBg: asHex(source.sidebarBg) ?? asHex(source.sidebarBackground) ?? DEFAULT_THEME_CONFIG.sidebarBg,
    sidebarText: asHex(source.sidebarText) ?? DEFAULT_THEME_CONFIG.sidebarText,
    topbarBg: asHex(source.topbarBg) ?? asHex(source.topbarBackground) ?? DEFAULT_THEME_CONFIG.topbarBg,
    footerBg: asHex(source.footerBg) ?? DEFAULT_THEME_CONFIG.footerBg,
    textPrimary: asHex(source.textPrimary) ?? DEFAULT_THEME_CONFIG.textPrimary,
    textSecondary: asHex(source.textSecondary) ?? DEFAULT_THEME_CONFIG.textSecondary,
    textOnPrimary: asHex(source.textOnPrimary) ?? DEFAULT_THEME_CONFIG.textOnPrimary,
    success: asHex(source.success) ?? DEFAULT_THEME_CONFIG.success,
    warning: asHex(source.warning) ?? DEFAULT_THEME_CONFIG.warning,
    error: asHex(source.error) ?? DEFAULT_THEME_CONFIG.error,
    info: asHex(source.info) ?? DEFAULT_THEME_CONFIG.info,
    fontFamily: asEnum(source.fontFamily, FONT_FAMILIES) ?? DEFAULT_THEME_CONFIG.fontFamily,
    fontScaleBase: asScale(source.fontScaleBase) ?? DEFAULT_THEME_CONFIG.fontScaleBase,
    borderRadius: asEnum(source.borderRadius, BORDER_RADII) ?? DEFAULT_THEME_CONFIG.borderRadius,
    spacingDensity: asEnum(source.spacingDensity, SPACING_DENSITIES) ?? DEFAULT_THEME_CONFIG.spacingDensity,
    shadowStyle: asEnum(source.shadowStyle, SHADOW_STYLES) ?? DEFAULT_THEME_CONFIG.shadowStyle,
  };
}
