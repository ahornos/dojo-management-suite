/**
 * @file StudentDisciplineRankCell.tsx
 * @description Compact discipline acronym + coloured belt/stripes badge for the student directory.
 */

import { useTranslation } from 'react-i18next';
import { Tooltip } from '@/components/ui/tooltip';
import { resolveBeltAppearance } from '@/lib/beltAppearance';
import { getLocalizedBeltShortName } from '@/lib/beltTranslations';
import { cn } from '@/lib/utils';
import type { StudentRankPayload } from '../types';

interface StudentDisciplineRankCellProps {
  ranks: StudentRankPayload[];
}

/**
 * Rank badge: solid fill with direct text, or mixed rank with a white/black inner chip.
 *
 * @param {{ rank: StudentRankPayload }} props - One student rank.
 * @returns {JSX.Element} Coloured pill.
 */
function BeltRankBadge({ rank }: { rank: StudentRankPayload }): JSX.Element {
  const { t } = useTranslation();
  const appearance = resolveBeltAppearance(rank.beltName);
  const colorName = getLocalizedBeltShortName(rank.beltName, t);
  const stripes = rank.currentStripes > 0 ? t('belts.stripe_degree', { count: rank.currentStripes }) : null;
  const label = stripes ? `${colorName} · ${stripes}` : colorName;
  const mixed = appearance.chip !== 'none';
  // Catalog black belts use a thick red bar; the compact list pill is a solid fill only.
  const outline = appearance.extraClass.includes('border-b-4') ? '' : appearance.extraClass;

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-1.5 py-0.5 text-[11px]',
        appearance.baseClass,
        outline,
        mixed ? 'font-medium' : cn('font-semibold', appearance.textClass),
      )}
    >
      {mixed ? (
        <span
          className={cn(
            'rounded px-1.5 py-0.5 font-medium',
            appearance.chip === 'white' ? 'bg-belt-white text-black' : 'bg-belt-black text-white',
          )}
        >
          {label}
        </span>
      ) : (
        label
      )}
    </span>
  );
}

/**
 * Directory cell: acronym (tooltip = full name) plus belt/stripes. Stacks when a student has several ranks.
 *
 * @param {StudentDisciplineRankCellProps} props - Flattened ranks from academic-service.
 * @returns {JSX.Element} Compact rank stack.
 */
export function StudentDisciplineRankCell({ ranks }: StudentDisciplineRankCellProps): JSX.Element {
  const { t } = useTranslation();
  if (ranks.length === 0) {
    return <span className="text-xs italic text-muted-foreground">{t('students.no_discipline')}</span>;
  }

  return (
    <div className="flex flex-col gap-1">
      {ranks.map((rank) => {
        const acronym = rank.disciplineAcronym?.trim();
        const badgeLabel = acronym || rank.disciplineName;
        return (
          <div key={rank.id} className="flex flex-nowrap items-center gap-1.5">
            <Tooltip content={rank.disciplineName}>
              <span className="inline-flex rounded-md border border-primary/20 bg-primary/10 px-1.5 py-0.5 text-[11px] font-semibold text-primary">
                {badgeLabel}
              </span>
            </Tooltip>
            <BeltRankBadge rank={rank} />
          </div>
        );
      })}
    </div>
  );
}
