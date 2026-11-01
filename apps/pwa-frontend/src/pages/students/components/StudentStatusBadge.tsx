/**
 * @file StudentStatusBadge.tsx
 * @description Compact lifecycle badge for the first column of the student directory.
 */

import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

const STATUS_CLASS: Record<string, string> = {
  ACTIVE: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  PAUSED: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  DROPPED: 'bg-destructive/10 text-destructive border-destructive/20',
  TRIAL: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
};

interface StudentStatusBadgeProps {
  status?: string;
  className?: string;
}

/**
 * Colored status chip (Alta / Pausa / Baja / Prueba).
 *
 * @param {StudentStatusBadgeProps} props - Lifecycle status.
 * @returns {JSX.Element} Bordered badge.
 */
export function StudentStatusBadge({ status, className }: StudentStatusBadgeProps): JSX.Element {
  const { t } = useTranslation();
  const code = status || 'ACTIVE';
  const label = t(`enums.status.${code}`, { defaultValue: code });
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide',
        STATUS_CLASS[code] ?? 'bg-muted text-muted-foreground border-border',
        className,
      )}
    >
      {label}
    </span>
  );
}
