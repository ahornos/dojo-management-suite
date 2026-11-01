/**
 * @file theme.ts
 * @description Design-token catalog, professional presets, and live CSS-variable injection.
 */

export const FONT_FAMILIES = ['Inter', 'Roboto', 'Open Sans'] as const;
export const BORDER_RADII = ['sharp', 'subtle', 'rounded'] as const;
export const SPACING_DENSITIES = ['compact', 'comfortable'] as const;
export const SHADOW_STYLES = ['flat', 'soft', 'prominent'] as const;
export const FONT_SCALES = [0.9, 1, 1.125] as const;

export type FontFamily = (typeof FONT_FAMILIES)[number];
export type BorderRadiusToken = (typeof BORDER_RADII)[number];
export type SpacingDensity = (typeof SPACING_DENSITIES)[number];
export type ShadowStyle = (typeof SHADOW_STYLES)[number];

export interface ThemeConfig {
  primary: string;
  secondary: string;
  contentBg: string;
  cardBg: string;
  sidebarBg: string;
  sidebarText: string;
  topbarBg: string;
  footerBg: string;
  textPrimary: string;
  textSecondary: string;
  textOnPrimary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  fontFamily: FontFamily;
  fontScaleBase: number;
  borderRadius: BorderRadiusToken;
  spacingDensity: SpacingDensity;
  shadowStyle: ShadowStyle;
}

export const DEFAULT_THEME_CONFIG: ThemeConfig = {
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
  fontFamily: 'Inter',
  fontScaleBase: 1,
  borderRadius: 'subtle',
  spacingDensity: 'comfortable',
  shadowStyle: 'soft',
};

export const THEME_PRESET_IDS = ['tatami', 'modern', 'performance'] as const;
export type ThemePresetId = (typeof THEME_PRESET_IDS)[number];

export const THEME_PRESETS: Record<ThemePresetId, ThemeConfig> = {
  tatami: {
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
    textOnPrimary: '#FFFFFF',
    success: '#2E7D32',
    warning: '#C5A059',
    error: '#B71C1C',
    info: '#1565C0',
    fontFamily: 'Inter',
    fontScaleBase: 1,
    borderRadius: 'subtle',
    spacingDensity: 'comfortable',
    shadowStyle: 'soft',
  },
  modern: {
    primary: '#0052CC',
    secondary: '#5C6F84',
    contentBg: '#F4F6F8',
    cardBg: '#FFFFFF',
    sidebarBg: '#0A1128',
    sidebarText: '#E8EEF6',
    topbarBg: '#1C2D50',
    footerBg: '#1C2D50',
    textPrimary: '#0A1128',
    textSecondary: '#5C6F84',
    textOnPrimary: '#FFFFFF',
    success: '#00875A',
    warning: '#FF8B00',
    error: '#DE350B',
    info: '#0065FF',
    fontFamily: 'Inter',
    fontScaleBase: 1,
    borderRadius: 'rounded',
    spacingDensity: 'comfortable',
    shadowStyle: 'soft',
  },
  performance: {
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
    textOnPrimary: '#FFFFFF',
    success: '#00875A',
    warning: '#FF8B00',
    error: '#DE350B',
    info: '#00B8D9',
    fontFamily: 'Roboto',
    fontScaleBase: 1,
    borderRadius: 'subtle',
    spacingDensity: 'compact',
    shadowStyle: 'flat',
  },
};

const FONT_STACKS: Record<FontFamily, string> = {
  Inter: 'Inter, ui-sans-serif, system-ui, sans-serif',
  Roboto: 'Roboto, ui-sans-serif, system-ui, sans-serif',
  'Open Sans': '"Open Sans", ui-sans-serif, system-ui, sans-serif',
};

const RADIUS_PX: Record<BorderRadiusToken, { base: string; sm: string; lg: string; xl: string }> = {
  sharp: { base: '0px', sm: '0px', lg: '0px', xl: '0px' },
  subtle: { base: '6px', sm: '4px', lg: '10px', xl: '12px' },
  rounded: { base: '16px', sm: '12px', lg: '22px', xl: '28px' },
};

const SHADOWS: Record<ShadowStyle, string> = {
  flat: 'none',
  soft: '0 1px 3px rgb(15 23 42 / 0.08), 0 1px 2px rgb(15 23 42 / 0.04)',
  prominent: '0 14px 36px rgb(15 23 42 / 0.18), 0 4px 12px rgb(15 23 42 / 0.08)',
};

const DENSITY_SPACE: Record<SpacingDensity, { card: string; gap: string; page: string }> = {
  compact: { card: '0.75rem', gap: '0.75rem', page: '1rem' },
  comfortable: { card: '1.25rem', gap: '1.25rem', page: '1.5rem' },
};

export const PRESET_APPEARANCE_PREFIX = 'preset:';
export const SAVED_APPEARANCE_PREFIX = 'saved:';

/**
 * Builds the stable key for a built-in, immutable preset.
 *
 * @param {ThemePresetId} id - Preset identifier.
 * @returns {string} `preset:<id>`.
 */
export function presetAppearanceKey(id: ThemePresetId): string {
  return `${PRESET_APPEARANCE_PREFIX}${id}`;
}

/**
 * Builds the stable key for a tenant-owned saved appearance.
 *
 * @param {string} id - Saved-theme UUID.
 * @returns {string} `saved:<uuid>`.
 */
export function savedAppearanceKey(id: string): string {
  return `${SAVED_APPEARANCE_PREFIX}${id}`;
}

/**
 * Parses an appearance key written to `AcademySettings.activeAppearanceKey`.
 *
 * @param {string | undefined} key - Persisted key.
 * @returns {{ type: 'preset'; id: ThemePresetId } | { type: 'saved'; id: string } | null} Discriminated key.
 */
export function parseAppearanceKey(
  key: string | undefined,
): { type: 'preset'; id: ThemePresetId } | { type: 'saved'; id: string } | null {
  if (!key) return null;
  if (key.startsWith(PRESET_APPEARANCE_PREFIX)) {
    const id = key.slice(PRESET_APPEARANCE_PREFIX.length);
    return THEME_PRESET_IDS.includes(id as ThemePresetId) ? { type: 'preset', id: id as ThemePresetId } : null;
  }
  if (key.startsWith(SAVED_APPEARANCE_PREFIX)) {
    const id = key.slice(SAVED_APPEARANCE_PREFIX.length);
    return /^[0-9a-f-]{36}$/i.test(id) ? { type: 'saved', id } : null;
  }
  return null;
}

const HEX = /^#?([0-9A-Fa-f]{6})$/;

/**
 * Parses `#RRGGBB` into HSL components.
 *
 * @param {string} hex - Candidate hex color.
 * @returns {{ h: number; s: number; l: number } | null} Components, or null when invalid.
 */
export function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
  const match = HEX.exec(hex.trim());
  if (!match) return null;
  const value = Number.parseInt(match[1], 16);
  const r = ((value >> 16) & 255) / 255;
  const g = ((value >> 8) & 255) / 255;
  const b = (value & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lightness = (max + min) / 2;
  let hue = 0;
  let saturation = 0;
  if (max !== min) {
    const delta = max - min;
    saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    switch (max) {
      case r:
        hue = (g - b) / delta + (g < b ? 6 : 0);
        break;
      case g:
        hue = (b - r) / delta + 2;
        break;
      default:
        hue = (r - g) / delta + 4;
        break;
    }
    hue /= 6;
  }
  return { h: hue * 360, s: saturation * 100, l: lightness * 100 };
}

/**
 * Formats HSL components as a Tailwind CSS-variable value (`H S% L%`).
 *
 * @param {{ h: number; s: number; l: number }} hsl - Components.
 * @returns {string} Space-separated HSL triple.
 */
export function formatHsl({ h, s, l }: { h: number; s: number; l: number }): string {
  return `${Math.round(h)} ${Math.round(s)}% ${Math.round(l)}%`;
}

/**
 * Converts `#RRGGBB` to 0–255 RGB channels.
 *
 * @param {string} hex - Candidate hex color.
 * @returns {{ r: number; g: number; b: number } | null} Channels, or null when invalid.
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const match = HEX.exec(hex.trim());
  if (!match) return null;
  const value = Number.parseInt(match[1], 16);
  return { r: (value >> 16) & 255, g: (value >> 8) & 255, b: value & 255 };
}

/**
 * WCAG relative luminance. Greens and cyans read brighter than their HSL lightness,
 * so semantic badges (success/info) must use this instead of `hsl.l`.
 *
 * @param {{ r: number; g: number; b: number }} rgb - 0–255 channels.
 * @returns {number} Luminance in `[0, 1]`.
 */
function relativeLuminance({ r, g, b }: { r: number; g: number; b: number }): number {
  const linear = [r, g, b].map((channel) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

/**
 * Picks a readable foreground token for a given background hex using WCAG contrast.
 *
 * @param {string} hex - Background color.
 * @returns {string} HSL triple for dark or light text.
 */
export function contrastForeground(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return '210 40% 98%';
  const luminance = relativeLuminance(rgb);
  const contrastWhite = 1.05 / (luminance + 0.05);
  const contrastBlack = (luminance + 0.05) / 0.05;
  if (luminance < 0.22) return '210 40% 98%';
  if (luminance > 0.45) return '222.2 47.4% 11.2%';
  return contrastWhite >= contrastBlack ? '210 40% 98%' : '222.2 47.4% 11.2%';
}

/**
 * Derives a low-contrast border token from a surface color.
 *
 * @param {string} hex - Surface background.
 * @returns {string} HSL triple.
 */
function borderFromSurface(hex: string): string {
  const hsl = hexToHsl(hex);
  if (!hsl) return '214 32% 91%';
  const l = hsl.l > 50 ? Math.max(hsl.l - 10, 0) : Math.min(hsl.l + 14, 100);
  return formatHsl({ h: hsl.h, s: Math.min(hsl.s, 16), l });
}

/**
 * Derives a slightly shifted accent surface (sidebar hover, muted chips).
 *
 * @param {string} hex - Base surface.
 * @param {number} delta - Lightness delta.
 * @returns {string} HSL triple.
 */
function shiftLightness(hex: string, delta: number): string {
  const hsl = hexToHsl(hex);
  if (!hsl) return '210 40% 96%';
  return formatHsl({ ...hsl, l: Math.min(100, Math.max(0, hsl.l + delta)) });
}

/**
 * Coerces a persisted or partial catalog (including legacy keys) into a complete token set.
 *
 * @param {unknown} raw - API `themeConfig` payload.
 * @returns {ThemeConfig} Complete catalog.
 */
export function normalizeThemeConfig(raw: unknown): ThemeConfig {
  const source = raw && typeof raw === 'object' && !Array.isArray(raw) ? (raw as Record<string, unknown>) : {};
  const hex = (value: unknown, fallback: string): string => {
    if (typeof value !== 'string' || !HEX.test(value.trim())) return fallback;
    return `#${HEX.exec(value.trim())?.[1].toUpperCase()}`;
  };
  const family = FONT_FAMILIES.includes(source.fontFamily as FontFamily)
    ? (source.fontFamily as FontFamily)
    : DEFAULT_THEME_CONFIG.fontFamily;
  const scale = Number(source.fontScaleBase);
  return {
    primary: hex(source.primary ?? source.primaryColor, DEFAULT_THEME_CONFIG.primary),
    secondary: hex(source.secondary ?? source.secondaryColor, DEFAULT_THEME_CONFIG.secondary),
    contentBg: hex(source.contentBg ?? source.contentBackground, DEFAULT_THEME_CONFIG.contentBg),
    cardBg: hex(source.cardBg, DEFAULT_THEME_CONFIG.cardBg),
    sidebarBg: hex(source.sidebarBg ?? source.sidebarBackground, DEFAULT_THEME_CONFIG.sidebarBg),
    sidebarText: hex(source.sidebarText, DEFAULT_THEME_CONFIG.sidebarText),
    topbarBg: hex(source.topbarBg ?? source.topbarBackground, DEFAULT_THEME_CONFIG.topbarBg),
    footerBg: hex(source.footerBg, DEFAULT_THEME_CONFIG.footerBg),
    textPrimary: hex(source.textPrimary, DEFAULT_THEME_CONFIG.textPrimary),
    textSecondary: hex(source.textSecondary, DEFAULT_THEME_CONFIG.textSecondary),
    textOnPrimary: hex(source.textOnPrimary, DEFAULT_THEME_CONFIG.textOnPrimary),
    success: hex(source.success, DEFAULT_THEME_CONFIG.success),
    warning: hex(source.warning, DEFAULT_THEME_CONFIG.warning),
    error: hex(source.error, DEFAULT_THEME_CONFIG.error),
    info: hex(source.info, DEFAULT_THEME_CONFIG.info),
    fontFamily: family,
    fontScaleBase: Number.isFinite(scale) ? Math.min(1.25, Math.max(0.85, scale)) : DEFAULT_THEME_CONFIG.fontScaleBase,
    borderRadius: BORDER_RADII.includes(source.borderRadius as BorderRadiusToken)
      ? (source.borderRadius as BorderRadiusToken)
      : DEFAULT_THEME_CONFIG.borderRadius,
    spacingDensity: SPACING_DENSITIES.includes(source.spacingDensity as SpacingDensity)
      ? (source.spacingDensity as SpacingDensity)
      : DEFAULT_THEME_CONFIG.spacingDensity,
    shadowStyle: SHADOW_STYLES.includes(source.shadowStyle as ShadowStyle)
      ? (source.shadowStyle as ShadowStyle)
      : DEFAULT_THEME_CONFIG.shadowStyle,
  };
}

/**
 * Applies a token catalog to `:root` as live CSS variables consumed by Tailwind.
 *
 * @param {ThemeConfig | undefined} theme - Persisted or preview catalog.
 * @returns {void}
 */
export function applyAcademyTheme(theme?: Partial<ThemeConfig> | null): void {
  const tokens = normalizeThemeConfig(theme);
  const root = document.documentElement;
  const setHex = (hexAlias: string, hslToken: string, hex: string, foregroundToken?: string) => {
    const hsl = hexToHsl(hex);
    if (!hsl) return;
    root.style.setProperty(hexAlias, hex);
    root.style.setProperty(hslToken, formatHsl(hsl));
    if (foregroundToken) {
      root.style.setProperty(foregroundToken, contrastForeground(hex));
    }
  };

  setHex('--color-primary', '--primary', tokens.primary, '--primary-foreground');
  root.style.setProperty('--ring', hexToHsl(tokens.primary) ? formatHsl(hexToHsl(tokens.primary) as { h: number; s: number; l: number }) : '');
  setHex('--color-secondary', '--secondary', tokens.secondary, '--secondary-foreground');
  setHex('--color-content-bg', '--background', tokens.contentBg);
  setHex('--color-card-bg', '--card', tokens.cardBg, '--card-foreground');
  root.style.setProperty('--popover', hexToHsl(tokens.cardBg) ? formatHsl(hexToHsl(tokens.cardBg) as { h: number; s: number; l: number }) : '');
  root.style.setProperty('--popover-foreground', contrastForeground(tokens.cardBg));
  setHex('--color-sidebar-bg', '--sidebar', tokens.sidebarBg, '--sidebar-foreground');
  const sidebarText = hexToHsl(tokens.sidebarText);
  if (sidebarText) {
    root.style.setProperty('--sidebar-foreground', formatHsl(sidebarText));
    root.style.setProperty('--sidebar-accent-foreground', formatHsl(sidebarText));
  }
  const sidebarHsl = hexToHsl(tokens.sidebarBg);
  root.style.setProperty('--sidebar-accent', shiftLightness(tokens.sidebarBg, sidebarHsl && sidebarHsl.l > 50 ? -8 : 8));
  root.style.setProperty('--sidebar-border', borderFromSurface(tokens.sidebarBg));
  setHex('--color-topbar-bg', '--topbar', tokens.topbarBg, '--topbar-foreground');
  setHex('--color-footer-bg', '--footer', tokens.footerBg, '--footer-foreground');
  const textPrimary = hexToHsl(tokens.textPrimary);
  const textSecondary = hexToHsl(tokens.textSecondary);
  const textOnPrimary = hexToHsl(tokens.textOnPrimary);
  if (textPrimary) {
    root.style.setProperty('--color-text-primary', tokens.textPrimary);
    root.style.setProperty('--foreground', formatHsl(textPrimary));
    root.style.setProperty('--card-foreground', formatHsl(textPrimary));
  }
  if (textSecondary) {
    root.style.setProperty('--color-text-secondary', tokens.textSecondary);
    root.style.setProperty('--muted-foreground', formatHsl(textSecondary));
  }
  if (textOnPrimary) {
    root.style.setProperty('--color-text-on-primary', tokens.textOnPrimary);
    root.style.setProperty('--primary-foreground', formatHsl(textOnPrimary));
  }
  setHex('--color-success', '--success', tokens.success, '--success-foreground');
  setHex('--color-warning', '--warning', tokens.warning, '--warning-foreground');
  setHex('--color-error', '--destructive', tokens.error, '--destructive-foreground');
  setHex('--color-info', '--info', tokens.info, '--info-foreground');

  root.style.setProperty('--border', borderFromSurface(tokens.contentBg));
  root.style.setProperty('--input', borderFromSurface(tokens.cardBg));
  const contentHsl = hexToHsl(tokens.contentBg);
  root.style.setProperty('--muted', shiftLightness(tokens.contentBg, contentHsl && contentHsl.l > 50 ? -4 : 6));
  root.style.setProperty('--accent', shiftLightness(tokens.contentBg, contentHsl && contentHsl.l > 50 ? -5 : 8));
  root.style.setProperty('--accent-foreground', textPrimary ? formatHsl(textPrimary) : contrastForeground(tokens.contentBg));

  root.style.setProperty('--font-family', FONT_STACKS[tokens.fontFamily]);
  root.style.setProperty('--font-scale', String(tokens.fontScaleBase));
  const radius = RADIUS_PX[tokens.borderRadius];
  root.style.setProperty('--radius', radius.base);
  root.style.setProperty('--radius-base', radius.base);
  root.style.setProperty('--radius-sm', radius.sm);
  root.style.setProperty('--radius-lg', radius.lg);
  root.style.setProperty('--radius-xl', radius.xl);
  root.style.setProperty('--shadow-card', SHADOWS[tokens.shadowStyle]);
  const density = DENSITY_SPACE[tokens.spacingDensity];
  root.style.setProperty('--space-page', density.page);
  root.style.setProperty('--space-density', density.card);
  root.style.setProperty('--space-gap', density.gap);
  root.dataset.density = tokens.spacingDensity;
  root.dataset.radius = tokens.borderRadius;
  root.dataset.shadow = tokens.shadowStyle;
  root.dataset.font = tokens.fontFamily.replace(/\s+/g, '-').toLowerCase();
}

/**
 * Points the document favicon at the tenant isotype when one is configured.
 *
 * @param {string | undefined} isotypeUrl - Compact brand mark.
 * @returns {void}
 */
export function applyAcademyFavicon(isotypeUrl?: string): void {
  const href = isotypeUrl?.trim();
  let link = document.querySelector<HTMLLinkElement>('link[rel="icon"][data-academy="isotype"]');
  if (!href) {
    link?.remove();
    return;
  }
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    link.dataset.academy = 'isotype';
    document.head.appendChild(link);
  }
  link.href = href;
}

/**
 * Detects which preset matches the current catalog, if any.
 *
 * @param {ThemeConfig} tokens - Current tokens.
 * @returns {ThemePresetId | null} Matching preset, or null when customized.
 */
export function matchingPresetId(tokens: ThemeConfig): ThemePresetId | null {
  for (const id of THEME_PRESET_IDS) {
    const preset = THEME_PRESETS[id];
    const same = (Object.keys(preset) as Array<keyof ThemeConfig>).every((key) => preset[key] === tokens[key]);
    if (same) return id;
  }
  return null;
}
