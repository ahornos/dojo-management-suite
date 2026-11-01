/**
 * @file date-input.tsx
 * @description Native date field that advertises the active i18n locale to the browser picker.
 */

import { useTranslation } from 'react-i18next';
import { localeTagFromLanguage } from '@/lib/i18n-locale';
import { Input } from '@/components/ui/input';

/**
 * `type="date"` input whose `lang` follows i18next (`en-US` vs `es-ES` / `ca-ES`).
 *
 * @param {Omit<React.ComponentProps<typeof Input>, 'type'>} props - Standard input props.
 * @returns {JSX.Element} Localized date control.
 */
export function DateInput(props: Omit<React.ComponentProps<typeof Input>, 'type'>): JSX.Element {
  const { i18n } = useTranslation();
  return <Input type="date" lang={localeTagFromLanguage(i18n.language)} {...props} />;
}
