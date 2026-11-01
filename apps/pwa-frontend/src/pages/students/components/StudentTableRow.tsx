/**
 * @file StudentTableRow.tsx
 * @description Directory columns: status, age, lastName/firstName, gender, discipline & rank, stacked contacts, actions + chevron.
 */

import { ChevronRight, Pencil, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ageGroupLabel } from '../config/ageGroups';
import { ageGroupForAge, calculateAge, studentBirthDate } from '../listFilters';
import { useAgeBrackets } from '../useAgeBrackets';
import { studentDisplayName, studentGender } from '../studentIdentity';
import type { StudentProfileResponse } from '../types';
import { StudentDetailPanel } from './StudentDetailPanel';
import { StudentDisciplineRankCell } from './StudentDisciplineRankCell';
import { StudentGenderIcon } from './StudentGenderIcon';
import { StudentRowContacts } from './StudentRowContacts';
import { StudentStatusBadge } from './StudentStatusBadge';

interface StudentTableRowProps {
  student: StudentProfileResponse;
  expanded: boolean;
  onToggle: () => void;
  onEdit: (student: StudentProfileResponse) => void;
  onDelete: (id: string) => void;
}

/**
 * Formats identity as `lastName, firstName` for the directory.
 *
 * @param {StudentProfileResponse} student - Directory row.
 * @returns {string} Display name.
 */
function directoryName(student: StudentProfileResponse): string {
  const { firstName, lastName } = studentDisplayName(student);
  const last = lastName.trim();
  const first = firstName.trim();
  if (last && first) return `${last}, ${first}`;
  return last || first || '—';
}

/**
 * Directory row plus optional accordion details.
 *
 * @param {StudentTableRowProps} props - Student, expand state, and actions.
 * @returns {JSX.Element} Two table rows (summary + details).
 */
export function StudentTableRow({
  student,
  expanded,
  onToggle,
  onEdit,
  onDelete,
}: StudentTableRowProps): JSX.Element {
  const { t } = useTranslation();
  const { ageGroups } = useAgeBrackets();
  const age = calculateAge(studentBirthDate(student));
  const ageGroup = ageGroupForAge(age, ageGroups);
  const ranks = student.ranks ?? [];

  return (
    <>
      <tr
        className={cn('group cursor-pointer hover:bg-muted/60 transition-colors', expanded && 'bg-muted/40')}
        onClick={onToggle}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onToggle();
          }
        }}
        tabIndex={0}
        aria-expanded={expanded}
        aria-label={expanded ? t('students.detail.collapse') : t('students.detail.expand')}
      >
        <td className="whitespace-nowrap px-3 py-2.5">
          <StudentStatusBadge status={student.status} />
        </td>
        <td className="whitespace-nowrap px-3 py-2.5">
          <p className="text-sm font-semibold tabular-nums text-foreground">
            {age !== -1 ? t('students.row.age_years', { count: age }) : '—'}
          </p>
          {ageGroup ? (
            <p className="text-[11px] text-muted-foreground">{ageGroupLabel(ageGroup, t)}</p>
          ) : null}
        </td>
        <td className="px-3 py-2.5">
          <p className="text-sm font-medium text-foreground">{directoryName(student)}</p>
        </td>
        <td className="whitespace-nowrap px-3 py-2.5">
          <StudentGenderIcon gender={studentGender(student)} />
        </td>
        <td className="min-w-[11.5rem] whitespace-nowrap px-3 py-2.5">
          <StudentDisciplineRankCell ranks={ranks} />
        </td>
        <td className="px-3 py-2.5">
          <StudentRowContacts student={student} />
        </td>
        <td
          className={cn(
            'sticky right-0 whitespace-nowrap px-3 py-2.5 text-right group-hover:bg-muted/60',
            expanded ? 'bg-muted/40 group-hover:bg-muted/40' : 'bg-card',
          )}
        >
          <div className="inline-flex items-center justify-end gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              aria-label={t('students.edit_title')}
              onClick={(event) => {
                event.stopPropagation();
                onEdit(student);
              }}
            >
              <Pencil className="h-4 w-4 text-primary" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
              aria-label={t('users.delete')}
              onClick={(event) => {
                event.stopPropagation();
                onDelete(student.id);
              }}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              aria-expanded={expanded}
              aria-label={expanded ? t('students.detail.collapse') : t('students.detail.expand')}
              onClick={(event) => {
                event.stopPropagation();
                onToggle();
              }}
            >
              <ChevronRight
                className={cn('h-4 w-4 text-muted-foreground transition-transform', expanded && 'rotate-90')}
              />
            </Button>
          </div>
        </td>
      </tr>
      {expanded && (
        <tr className="bg-card">
          <td colSpan={7} className="px-3 pb-4 pt-0">
            <div className="overflow-hidden pt-2">
              <StudentDetailPanel student={student} onEdit={() => onEdit(student)} />
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
