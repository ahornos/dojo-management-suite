/**
 * @file StudentGenderIcon.tsx
 * @description Directory gender cell: icon only, localized tooltip on hover.
 */

import { CircleDot, Mars, Users, Venus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface StudentGenderIconProps {
  gender?: string | null;
}

const GENDER_ICON = {
  MALE: Mars,
  FEMALE: Venus,
  NON_BINARY: CircleDot,
  OTHER: Users,
} as const;

/**
 * Visual gender indicator with a hover tooltip. Empty gender renders an em dash.
 *
 * @param {StudentGenderIconProps} props - Stored gender enum.
 * @returns {JSX.Element} Icon or placeholder.
 */
export function StudentGenderIcon({ gender }: StudentGenderIconProps): JSX.Element {
  const { t } = useTranslation();
  const code = gender?.toUpperCase();
  const Icon = code && code in GENDER_ICON ? GENDER_ICON[code as keyof typeof GENDER_ICON] : undefined;
  const label = Icon
    ? t(`enums.gender.${code}`, { defaultValue: code })
    : t('students.row.gender_unknown');

  if (!Icon) {
    return (
      <span className="text-sm text-muted-foreground" title={label} aria-label={label}>
        —
      </span>
    );
  }

  return (
    <span className="group relative inline-flex items-center justify-center" title={label}>
      <Icon className="h-4 w-4 text-foreground" aria-hidden="true" />
      <span
        role="tooltip"
        className={cn(
          'pointer-events-none absolute bottom-full left-1/2 z-20 mb-1 -translate-x-1/2 whitespace-nowrap rounded-md',
          'border border-border bg-popover px-2 py-1 text-[11px] font-medium text-popover-foreground shadow-md',
          'opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100',
        )}
      >
        {label}
      </span>
      <span className="sr-only">{label}</span>
    </span>
  );
}
