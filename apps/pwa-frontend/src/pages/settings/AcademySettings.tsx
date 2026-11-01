/**
 * @file AcademySettings.tsx
 * @description Centralized tenant settings workspace: identity, look & feel, schedule, academic catalog, billing.
 */

import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Building2, CalendarDays, GraduationCap, Landmark, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AcademicSettingsTab } from './AcademicSettingsTab';
import { AppearanceSettingsTab } from './AppearanceSettingsTab';
import { BillingSettingsTab } from './BillingSettingsTab';
import { GeneralSettingsTab } from './GeneralSettingsTab';
import { ScheduleSettingsTab } from './ScheduleSettingsTab';
import { SETTINGS_TABS, type SettingsTab } from './types';

const TAB_META: Array<{ id: SettingsTab; labelKey: string; icon: typeof Building2 }> = [
  { id: 'general', labelKey: 'settings.tab_general', icon: Building2 },
  { id: 'appearance', labelKey: 'settings.tab_appearance', icon: Palette },
  { id: 'schedule', labelKey: 'settings.tab_schedule', icon: CalendarDays },
  { id: 'academic', labelKey: 'settings.tab_academic', icon: GraduationCap },
  { id: 'billing', labelKey: 'settings.tab_billing', icon: Landmark },
];

/**
 * Resolves `?tab=` to a known settings tab.
 *
 * @param {string | null} raw - Query value.
 * @returns {SettingsTab} Safe tab id.
 */
function parseTab(raw: string | null): SettingsTab {
  return SETTINGS_TABS.includes(raw as SettingsTab) ? (raw as SettingsTab) : 'general';
}

/**
 * Unified academy configuration workspace with URL-addressable tabs.
 *
 * @returns {JSX.Element} Settings page.
 */
export default function AcademySettings() {
  const { t } = useTranslation();
  const [params, setParams] = useSearchParams();
  const tab = parseTab(params.get('tab'));

  /**
   * Writes the active tab to the query string so deep links and sidebar items stay in sync.
   *
   * @param {SettingsTab} next - Target tab.
   * @returns {void}
   */
  const setTab = (next: SettingsTab) => {
    const copy = new URLSearchParams(params);
    copy.set('tab', next);
    setParams(copy, { replace: true });
  };

  return (
    <div className="space-y-[var(--space-gap)]">
      <div className="dms-surface">
        <h1 className="text-2xl font-bold text-foreground">{t('settings.title')}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t('settings.subtitle')}</p>
      </div>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label={t('settings.title')}>
        {TAB_META.map((item) => {
          const Icon = item.icon;
          const selected = tab === item.id;
          return (
            <Button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={selected}
              variant={selected ? 'default' : 'outline'}
              className={cn('gap-2', selected && 'shadow-sm')}
              onClick={() => setTab(item.id)}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {t(item.labelKey)}
            </Button>
          );
        })}
      </div>

      {tab === 'general' ? <GeneralSettingsTab /> : null}
      {tab === 'appearance' ? <AppearanceSettingsTab /> : null}
      {tab === 'schedule' ? <ScheduleSettingsTab /> : null}
      {tab === 'academic' ? <AcademicSettingsTab /> : null}
      {tab === 'billing' ? <BillingSettingsTab /> : null}
    </div>
  );
}
