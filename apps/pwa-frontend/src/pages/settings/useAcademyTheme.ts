/**
 * @file useAcademyTheme.ts
 * @description Loads tenant themeConfig and injects it as live CSS variables.
 */

import { useEffect } from 'react';
import { applyAcademyFavicon, applyAcademyTheme, normalizeThemeConfig } from './theme';
import { useAcademySettings } from './useAcademySettings';

/**
 * Applies the persisted white-label catalog for the current tenant.
 *
 * @returns {void}
 */
export function useAcademyTheme(): void {
  const { data } = useAcademySettings();

  useEffect(() => {
    applyAcademyTheme(normalizeThemeConfig(data?.themeConfig));
    applyAcademyFavicon(data?.isotypeUrl);
  }, [data?.themeConfig, data?.isotypeUrl]);
}
