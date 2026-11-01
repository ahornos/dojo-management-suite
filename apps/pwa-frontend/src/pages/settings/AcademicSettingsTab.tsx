/**
 * @file AcademicSettingsTab.tsx
 * @description Global age brackets plus embedded discipline / program catalog (no financial fields).
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormGrid, FormSection } from '@/components/forms/FormSection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DisciplinesCatalog } from '@/pages/disciplines/Disciplines';
import { SettingsFeedback } from './SettingsFeedback';
import { useAgeBracketCatalog, useAgeBracketMutations } from './useAcademySettings';

/**
 * Académico tab: age brackets (global) and full discipline/program CRUD.
 *
 * @returns {JSX.Element} Academic settings.
 */
export function AcademicSettingsTab(): JSX.Element {
  const { t } = useTranslation();
  const bracketsQuery = useAgeBracketCatalog();
  const mutations = useAgeBracketMutations();
  const [name, setName] = useState('');
  const [minAge, setMinAge] = useState('3');
  const [maxAge, setMaxAge] = useState('6');
  const brackets = bracketsQuery.data ?? [];

  /**
   * Creates a new tenant age bracket.
   *
   * @returns {void}
   */
  const onAdd = () => {
    const min = Number.parseInt(minAge, 10);
    const max = Number.parseInt(maxAge, 10);
    if (!name.trim() || !Number.isFinite(min) || !Number.isFinite(max)) return;
    mutations.create.mutate(
      { name: name.trim(), minAge: min, maxAge: max, sortOrder: (brackets[brackets.length - 1]?.sortOrder ?? 0) + 10 },
      { onSuccess: () => setName('') },
    );
  };

  return (
    <div className="space-y-8">
      <FormSection title={t('settings.ages_title')} description={t('settings.ages_help')}>
        <SettingsFeedback error={bracketsQuery.error ?? mutations.create.error} fallback="settings.save_error" />
        <FormGrid>
          <div className="space-y-2">
            <Label htmlFor="bracket-name">{t('settings.bracket_name')}</Label>
            <Input id="bracket-name" value={name} onChange={(event) => setName(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bracket-min">{t('settings.min_age')}</Label>
            <Input id="bracket-min" type="number" min={0} value={minAge} onChange={(event) => setMinAge(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bracket-max">{t('settings.max_age')}</Label>
            <Input id="bracket-max" type="number" min={0} value={maxAge} onChange={(event) => setMaxAge(event.target.value)} />
          </div>
        </FormGrid>
        <Button type="button" disabled={!name.trim() || mutations.create.isPending} onClick={onAdd}>
          {mutations.create.isPending ? t('settings.saving') : t('settings.add_bracket')}
        </Button>
        {bracketsQuery.isLoading ? (
          <p className="text-sm text-muted-foreground">{t('settings.loading')}</p>
        ) : (
          <ul className="divide-y divide-border rounded-lg border border-border">
            {brackets.map((bracket) => (
              <li key={bracket.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                <div>
                  <p className="font-medium text-foreground">{bracket.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {bracket.code} · {bracket.minAge}–{bracket.maxAge >= 999 ? `${bracket.minAge}+` : bracket.maxAge}
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (window.confirm(t('settings.delete_bracket_confirm'))) {
                      mutations.remove.mutate(bracket.id);
                    }
                  }}
                >
                  {t('settings.delete')}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </FormSection>

      <FormSection title={t('settings.programs_title')} description={t('settings.programs_help')}>
        <DisciplinesCatalog embedded />
      </FormSection>
    </div>
  );
}
