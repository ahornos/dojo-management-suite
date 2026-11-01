/**
 * @file CountrySelector.tsx
 * @description Reusable ISO 3166-1 alpha-2 country dropdown. Default selection is Spain (`ES`).
 */

import type { ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';
import { Select } from '@/components/ui/select';
import { COUNTRY_CODES, DEFAULT_COUNTRY } from '@/lib/countries';
import { cn } from '@/lib/utils';

interface CountrySelectorProps extends Omit<ComponentProps<'select'>, 'children'> {
  /** Current ISO code. Empty values render as Spain. */
  value?: string;
}

/**
 * Native select listing standard countries with localized labels.
 *
 * @param {CountrySelectorProps} props - Standard select props plus optional value.
 * @returns {JSX.Element} Country dropdown.
 */
export function CountrySelector({ value, className, ...props }: CountrySelectorProps): JSX.Element {
  const { t } = useTranslation();
  const selected = value && value.trim() !== '' ? value.toUpperCase() : DEFAULT_COUNTRY;

  return (
    <Select value={selected} className={cn(className)} {...props}>
      {COUNTRY_CODES.map((code) => (
        <option key={code} value={code}>
          {t(`countries.${code}`)}
        </option>
      ))}
    </Select>
  );
}
