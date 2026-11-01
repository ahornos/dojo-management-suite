/**
 * @file AppearanceSettingsTab.tsx
 * @description Design-token studio: system presets, saved custom appearances, live CSS-variable preview.
 */

import { useEffect, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { Check, Lock, Pencil, Plus, Trash2 } from 'lucide-react';
import { FormGrid, FormSection } from '@/components/forms/FormSection';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { AppearanceNameDialog } from './AppearanceNameDialog';
import { ColorField } from './ColorField';
import { academyAppearanceSchema, type AcademyAppearanceValues } from './schema';
import { SettingsFeedback } from './SettingsFeedback';
import {
  applyAcademyTheme,
  BORDER_RADII,
  DEFAULT_THEME_CONFIG,
  FONT_FAMILIES,
  FONT_SCALES,
  matchingPresetId,
  normalizeThemeConfig,
  parseAppearanceKey,
  presetAppearanceKey,
  savedAppearanceKey,
  SHADOW_STYLES,
  SPACING_DENSITIES,
  THEME_PRESET_IDS,
  THEME_PRESETS,
  type ThemeConfig,
  type ThemePresetId,
} from './theme';
import { useAcademySettings, useSavedAppearances } from './useAcademySettings';
import type { SavedAppearance } from './types';

/**
 * Maps form values onto the persistable token catalog (assets stay on the settings row).
 *
 * @param {AcademyAppearanceValues} values - Appearance form.
 * @returns {ThemeConfig} Token catalog.
 */
function tokensFromForm(values: AcademyAppearanceValues): ThemeConfig {
  return normalizeThemeConfig({
    primary: values.primary,
    secondary: values.secondary,
    contentBg: values.contentBg,
    cardBg: values.cardBg,
    sidebarBg: values.sidebarBg,
    sidebarText: values.sidebarText,
    topbarBg: values.topbarBg,
    footerBg: values.footerBg,
    textPrimary: values.textPrimary,
    textSecondary: values.textSecondary,
    textOnPrimary: values.textOnPrimary,
    success: values.success,
    warning: values.warning,
    error: values.error,
    info: values.info,
    fontFamily: values.fontFamily,
    fontScaleBase: values.fontScaleBase,
    borderRadius: values.borderRadius,
    spacingDensity: values.spacingDensity,
    shadowStyle: values.shadowStyle,
  });
}

/**
 * Look & feel tab. Form changes inject CSS variables immediately; Save persists them.
 *
 * @returns {JSX.Element} Appearance form.
 */
export function AppearanceSettingsTab(): JSX.Element {
  const { t } = useTranslation();
  const settings = useAcademySettings();
  const appearances = useSavedAppearances();
  const schema = useMemo(() => academyAppearanceSchema(), []);
  const form = useForm<AcademyAppearanceValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      logoUrl: '',
      isotypeUrl: '',
      pdfLogoUrl: '',
      ...DEFAULT_THEME_CONFIG,
    },
  });
  const watched = useWatch({ control: form.control });
  const [selectedKey, setSelectedKey] = useState('');
  const [dialog, setDialog] = useState<{ mode: 'create' | 'rename'; id?: string; name?: string } | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!settings.data || hydrated) return;
    const theme = normalizeThemeConfig(settings.data.themeConfig);
    form.reset({
      logoUrl: settings.data.logoUrl,
      isotypeUrl: settings.data.isotypeUrl,
      pdfLogoUrl: settings.data.pdfLogoUrl ?? '',
      ...theme,
    });
    const persisted = parseAppearanceKey(settings.data.activeAppearanceKey);
    if (persisted) {
      setSelectedKey(settings.data.activeAppearanceKey);
    } else {
      const preset = matchingPresetId(theme);
      setSelectedKey(preset ? presetAppearanceKey(preset) : '');
    }
    setHydrated(true);
  }, [settings.data, form, hydrated]);

  useEffect(() => {
    applyAcademyTheme(tokensFromForm(form.getValues()));
  }, [watched, form]);

  useEffect(() => {
    return () => {
      applyAcademyTheme(normalizeThemeConfig(settings.data?.themeConfig));
    };
  }, [settings.data?.themeConfig]);

  const savedThemes = appearances.data ?? [];
  const selected = parseAppearanceKey(selectedKey);
  const selectedSaved = selected?.type === 'saved' ? savedThemes.find((item) => item.id === selected.id) : undefined;

  /**
   * Writes brand assets and the full token catalog, syncing the selected custom appearance when applicable.
   *
   * @param {AcademyAppearanceValues} values - Validated appearance.
   * @returns {void}
   */
  const onSubmit = (values: AcademyAppearanceValues) => {
    const themeConfig = tokensFromForm(values);
    settings.save.mutate({
      logoUrl: values.logoUrl,
      isotypeUrl: values.isotypeUrl,
      pdfLogoUrl: values.pdfLogoUrl,
      themeConfig,
      activeAppearanceKey: selectedKey,
    });
    if (selected?.type === 'saved') {
      appearances.update.mutate({ id: selected.id, themeConfig });
    }
  };

  /**
   * Loads tokens into the studio and persists them as the live workspace appearance.
   *
   * @param {string} key - `preset:<id>` or `saved:<uuid>`.
   * @param {ThemeConfig} tokens - Catalog to apply.
   * @returns {void}
   */
  const switchAppearance = (key: string, tokens: ThemeConfig) => {
    const current = form.getValues();
    setSelectedKey(key);
    form.reset({
      logoUrl: current.logoUrl,
      isotypeUrl: current.isotypeUrl,
      pdfLogoUrl: current.pdfLogoUrl,
      ...tokens,
    });
    applyAcademyTheme(tokens);
    appearances.activate.mutate(key);
  };

  /**
   * Instantly fills every token from a professional preset and activates it.
   *
   * @param {ThemePresetId} id - Preset key.
   * @returns {void}
   */
  const applyPreset = (id: ThemePresetId) => {
    switchAppearance(presetAppearanceKey(id), THEME_PRESETS[id]);
  };

  /**
   * Activates a tenant-owned custom appearance.
   *
   * @param {SavedAppearance} appearance - Saved row.
   * @returns {void}
   */
  const applySaved = (appearance: SavedAppearance) => {
    switchAppearance(savedAppearanceKey(appearance.id), normalizeThemeConfig(appearance.themeConfig));
  };

  /**
   * Creates or renames a custom appearance from the dialog title.
   *
   * @param {string} name - Staff-facing title.
   * @returns {void}
   */
  const submitDialog = (name: string) => {
    if (!dialog) return;
    if (dialog.mode === 'create') {
      appearances.create.mutate(
        { name, themeConfig: tokensFromForm(form.getValues()), activate: true },
        {
          onSuccess: (created) => {
            setSelectedKey(savedAppearanceKey(created.id));
            setDialog(null);
          },
        },
      );
      return;
    }
    if (dialog.id) {
      appearances.update.mutate(
        { id: dialog.id, name },
        {
          onSuccess: () => setDialog(null),
        },
      );
    }
  };

  /**
   * Deletes a custom appearance after confirmation. System presets never reach this path.
   *
   * @param {SavedAppearance} appearance - Row to remove.
   * @returns {void}
   */
  const deleteSaved = (appearance: SavedAppearance) => {
    if (!window.confirm(t('settings.appearances_delete_confirm', { name: appearance.name }))) {
      return;
    }
    appearances.remove.mutate(appearance.id, {
      onSuccess: () => {
        if (selectedKey === savedAppearanceKey(appearance.id)) {
          setSelectedKey('');
        }
      },
    });
  };

  const feedbackError =
    settings.error ??
    settings.save.error ??
    appearances.error ??
    appearances.create.error ??
    appearances.update.error ??
    appearances.remove.error ??
    appearances.activate.error;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-[var(--space-gap)]">
        <SettingsFeedback error={feedbackError} success={settings.save.isSuccess} fallback="settings.save_error" />

        <FormSection title={t('settings.appearances_title')} description={t('settings.appearances_help')}>
          <FormGrid>
            <div className="space-y-2">
              <Label htmlFor="appearance-base">{t('settings.appearances_base')}</Label>
              <Select
                id="appearance-base"
                value={selectedKey}
                onChange={(event) => {
                  const next = event.target.value;
                  if (!next) return;
                  const parsed = parseAppearanceKey(next);
                  if (parsed?.type === 'preset') {
                    applyPreset(parsed.id);
                    return;
                  }
                  if (parsed?.type === 'saved') {
                    const found = savedThemes.find((item) => item.id === parsed.id);
                    if (found) applySaved(found);
                  }
                }}
              >
                <option value="" disabled>
                  {t('settings.appearances_base_placeholder')}
                </option>
                <optgroup label={t('settings.appearances_system')}>
                  {THEME_PRESET_IDS.map((id) => (
                    <option key={id} value={presetAppearanceKey(id)}>
                      {t(`settings.preset_${id}_name`)}
                    </option>
                  ))}
                </optgroup>
                {savedThemes.length > 0 ? (
                  <optgroup label={t('settings.appearances_custom')}>
                    {savedThemes.map((appearance) => (
                      <option key={appearance.id} value={savedAppearanceKey(appearance.id)}>
                        {appearance.name}
                      </option>
                    ))}
                  </optgroup>
                ) : null}
              </Select>
              <p className="text-xs text-muted-foreground">{t('settings.appearances_base_help')}</p>
            </div>
          </FormGrid>

          <div className="grid gap-[var(--space-gap)] md:grid-cols-3">
            {THEME_PRESET_IDS.map((id) => {
              const preset = THEME_PRESETS[id];
              const key = presetAppearanceKey(id);
              const isActive = selectedKey === key;
              return (
                <AppearanceCard
                  key={id}
                  title={t(`settings.preset_${id}_name`)}
                  help={t(`settings.preset_${id}_help`)}
                  tokens={preset}
                  selected={isActive}
                  readonly
                  onSelect={() => applyPreset(id)}
                />
              );
            })}
            {savedThemes.map((appearance) => {
              const key = savedAppearanceKey(appearance.id);
              return (
                <AppearanceCard
                  key={appearance.id}
                  title={appearance.name}
                  help={t('settings.appearances_custom_help')}
                  tokens={normalizeThemeConfig(appearance.themeConfig)}
                  selected={selectedKey === key}
                  onSelect={() => applySaved(appearance)}
                  onRename={() => setDialog({ mode: 'rename', id: appearance.id, name: appearance.name })}
                  onDelete={() => deleteSaved(appearance)}
                />
              );
            })}
          </div>

          {savedThemes.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t('settings.appearances_empty')}</p>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={() => setDialog({ mode: 'create' })}>
              <Plus className="h-4 w-4" aria-hidden="true" />
              {t('settings.appearances_save_as')}
            </Button>
            {selectedSaved ? (
              <Button
                type="button"
                variant="secondary"
                disabled={appearances.update.isPending}
                onClick={() =>
                  appearances.update.mutate({
                    id: selectedSaved.id,
                    themeConfig: tokensFromForm(form.getValues()),
                  })
                }
              >
                {t('settings.appearances_update')}
              </Button>
            ) : null}
          </div>
        </FormSection>

        <FormSection title={t('settings.assets_title')} description={t('settings.assets_help')}>
          <FormGrid>
            <UrlField name="logoUrl" label={t('settings.logo_url')} help={t('settings.logo_url_help')} />
            <UrlField name="isotypeUrl" label={t('settings.isotype_url')} help={t('settings.isotype_url_help')} />
            <UrlField name="pdfLogoUrl" label={t('settings.pdf_logo_url')} help={t('settings.pdf_logo_url_help')} />
          </FormGrid>
        </FormSection>

        <FormSection title={t('settings.tokens_brand')} description={t('settings.tokens_brand_help')}>
          <FormGrid>
            <ColorField name="primary" label={t('settings.color_primary')} />
            <ColorField name="secondary" label={t('settings.color_secondary')} />
            <ColorField name="textOnPrimary" label={t('settings.color_text_on_primary')} />
          </FormGrid>
        </FormSection>

        <FormSection title={t('settings.tokens_surfaces')} description={t('settings.tokens_surfaces_help')}>
          <FormGrid>
            <ColorField name="contentBg" label={t('settings.color_content')} />
            <ColorField name="cardBg" label={t('settings.color_card')} />
            <ColorField name="sidebarBg" label={t('settings.color_sidebar')} />
            <ColorField name="sidebarText" label={t('settings.color_sidebar_text')} />
            <ColorField name="topbarBg" label={t('settings.color_topbar')} />
            <ColorField name="footerBg" label={t('settings.color_footer')} />
          </FormGrid>
        </FormSection>

        <FormSection title={t('settings.tokens_text')} description={t('settings.tokens_text_help')}>
          <FormGrid>
            <ColorField name="textPrimary" label={t('settings.color_text_primary')} />
            <ColorField name="textSecondary" label={t('settings.color_text_secondary')} />
          </FormGrid>
        </FormSection>

        <FormSection title={t('settings.tokens_semantic')} description={t('settings.tokens_semantic_help')}>
          <FormGrid>
            <ColorField name="success" label={t('settings.color_success')} />
            <ColorField name="warning" label={t('settings.color_warning')} />
            <ColorField name="error" label={t('settings.color_error')} />
            <ColorField name="info" label={t('settings.color_info')} />
          </FormGrid>
        </FormSection>

        <FormSection title={t('settings.tokens_type')} description={t('settings.tokens_type_help')}>
          <FormGrid>
            <FormField
              control={form.control}
              name="fontFamily"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>{t('settings.font_family')}</FormLabel>
                  <FormControl>
                    <Select value={field.value} onChange={(event) => field.onChange(event.target.value)}>
                      {FONT_FAMILIES.map((family) => (
                        <option key={family} value={family}>
                          {family}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fontScaleBase"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>{t('settings.font_scale')}</FormLabel>
                  <FormControl>
                    <Select
                      value={String(field.value)}
                      onChange={(event) => field.onChange(Number.parseFloat(event.target.value))}
                    >
                      {FONT_SCALES.map((scale) => (
                        <option key={scale} value={scale}>
                          {t(`settings.font_scale_${String(scale).replace('.', '_')}`)}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormGrid>
        </FormSection>

        <FormSection title={t('settings.tokens_geometry')} description={t('settings.tokens_geometry_help')}>
          <FormGrid>
            <EnumField
              name="borderRadius"
              label={t('settings.border_radius')}
              values={BORDER_RADII}
              labelFor={(value) => t(`settings.radius_${value}`)}
            />
            <EnumField
              name="spacingDensity"
              label={t('settings.spacing_density')}
              values={SPACING_DENSITIES}
              labelFor={(value) => t(`settings.density_${value}`)}
            />
            <EnumField
              name="shadowStyle"
              label={t('settings.shadow_style')}
              values={SHADOW_STYLES}
              labelFor={(value) => t(`settings.shadow_${value}`)}
            />
          </FormGrid>
        </FormSection>

        <div className="dms-surface">
          <p className="mb-3 text-sm font-medium text-foreground">{t('settings.preview_title')}</p>
          <div className="flex flex-wrap items-center gap-2">
            <Button type="button">{t('settings.preview_primary')}</Button>
            <Button type="button" variant="secondary">
              {t('settings.preview_secondary')}
            </Button>
            <span className="dms-badge dms-badge-success">{t('settings.color_success')}</span>
            <span className="dms-badge dms-badge-warning">{t('settings.color_warning')}</span>
            <span className="dms-badge dms-badge-error">{t('settings.color_error')}</span>
            <span className="dms-badge dms-badge-info">{t('settings.color_info')}</span>
          </div>
        </div>

        <Button type="submit" disabled={settings.save.isPending}>
          {settings.save.isPending ? t('settings.saving') : t('settings.save')}
        </Button>
      </form>

      <AppearanceNameDialog
        open={dialog !== null}
        mode={dialog?.mode ?? 'create'}
        initialName={dialog?.name ?? ''}
        pending={appearances.create.isPending || appearances.update.isPending}
        onClose={() => setDialog(null)}
        onSubmit={submitDialog}
      />
    </Form>
  );
}

/**
 * Swatch card for a system preset or a saved custom appearance.
 *
 * @param {object} props - Title, tokens, selection, and optional mutate actions.
 * @returns {JSX.Element} Appearance card.
 */
function AppearanceCard({
  title,
  help,
  tokens,
  selected,
  readonly = false,
  onSelect,
  onRename,
  onDelete,
}: {
  title: string;
  help: string;
  tokens: ThemeConfig;
  selected: boolean;
  readonly?: boolean;
  onSelect: () => void;
  onRename?: () => void;
  onDelete?: () => void;
}): JSX.Element {
  const { t } = useTranslation();
  return (
    <div
      className={cn(
        'dms-card p-[var(--space-density)] text-left transition-colors',
        selected ? 'ring-2 ring-ring' : 'hover:border-primary/40',
      )}
    >
      <button type="button" onClick={onSelect} className="w-full text-left">
        <div className="mb-3 flex h-10 overflow-hidden" style={{ borderRadius: 'var(--radius-sm)' }}>
          <span className="flex-1" style={{ backgroundColor: tokens.sidebarBg }} />
          <span className="flex-1" style={{ backgroundColor: tokens.primary }} />
          <span className="flex-1" style={{ backgroundColor: tokens.secondary }} />
          <span className="flex-1" style={{ backgroundColor: tokens.contentBg }} />
        </div>
        <p className="flex items-center gap-2 font-semibold text-foreground">
          {title}
          {selected ? <Check className="h-4 w-4 text-primary" aria-hidden="true" /> : null}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{help}</p>
      </button>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {readonly ? (
          <Badge variant="secondary" className="gap-1">
            <Lock className="h-3 w-3" aria-hidden="true" />
            {t('settings.appearances_readonly')}
          </Badge>
        ) : (
          <>
            <Button type="button" size="sm" variant="outline" onClick={onRename}>
              <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
              {t('settings.appearances_rename')}
            </Button>
            <Button type="button" size="sm" variant="destructive" onClick={onDelete}>
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              {t('settings.appearances_delete')}
            </Button>
          </>
        )}
        {selected ? <Badge>{t('settings.appearances_active')}</Badge> : null}
      </div>
    </div>
  );
}

/**
 * Optional HTTPS URL field.
 *
 * @param {object} props - Field name, label, and help.
 * @returns {JSX.Element} Input field.
 */
function UrlField({ name, label, help }: { name: 'logoUrl' | 'isotypeUrl' | 'pdfLogoUrl'; label: string; help: string }): JSX.Element {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input {...field} placeholder="https://" />
          </FormControl>
          <p className="text-xs text-muted-foreground">{help}</p>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

/**
 * Closed-set select bound to the appearance form.
 *
 * @param {object} props - Field name, label, values, and translator.
 * @returns {JSX.Element} Select field.
 */
function EnumField<T extends string>({
  name,
  label,
  values,
  labelFor,
}: {
  name: 'borderRadius' | 'spacingDensity' | 'shadowStyle';
  label: string;
  values: readonly T[];
  labelFor: (value: T) => string;
}): JSX.Element {
  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Select value={field.value} onChange={(event) => field.onChange(event.target.value)}>
              {values.map((value) => (
                <option key={value} value={value}>
                  {labelFor(value)}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
