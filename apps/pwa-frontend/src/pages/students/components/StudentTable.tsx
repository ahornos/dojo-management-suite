/**
 * @file StudentTable.tsx
 * @description Student directory: default ACTIVE filter is applied upstream; this table sorts and expands rows.
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { calculateAge, compareStudentsDefault, studentBirthDate } from '../listFilters';
import type { StudentProfileResponse } from '../types';
import { StudentTableHeaders, type SortConfig, type SortKey } from './StudentTableHeaders';
import { StudentTableRow } from './StudentTableRow';

interface StudentTableProps {
  students: StudentProfileResponse[];
  isLoading: boolean;
  error: unknown;
  onEdit: (student: StudentProfileResponse) => void;
  onDelete: (id: string) => void;
}

/**
 * Renders the filtered student list with expandable rows.
 *
 * @param {StudentTableProps} props - Rows, loading, and row actions.
 * @returns {JSX.Element} Card table.
 */
export function StudentTable({ students, isLoading, error, onEdit, onDelete }: StudentTableProps): JSX.Element {
  const { t } = useTranslation();
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleSort = (key: SortKey) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const ordered = [...students].sort((a, b) => {
    if (!sortConfig) return compareStudentsDefault(a, b);
    const dir = sortConfig.direction === 'asc' ? 1 : -1;
    const ageA = calculateAge(studentBirthDate(a));
    const ageB = calculateAge(studentBirthDate(b));
    if (sortConfig.key === 'age' && ageA !== ageB) {
      const nA = ageA < 0 ? Number.POSITIVE_INFINITY : ageA;
      const nB = ageB < 0 ? Number.POSITIVE_INFINITY : ageB;
      return (nA - nB) * dir;
    }
    if (sortConfig.key === 'firstName') {
      const cmp = (a.user?.firstName ?? '').localeCompare(b.user?.firstName ?? '', undefined, { sensitivity: 'base' });
      if (cmp !== 0) return cmp * dir;
    }
    if (sortConfig.key === 'lastName') {
      const cmp = (a.user?.lastName ?? '').localeCompare(b.user?.lastName ?? '', undefined, { sensitivity: 'base' });
      if (cmp !== 0) return cmp * dir;
    }
    if (sortConfig.key === 'belt') {
      const beltA = a.ranks && a.ranks.length > 0 ? a.ranks[0].beltName.toLowerCase() : '';
      const beltB = b.ranks && b.ranks.length > 0 ? b.ranks[0].beltName.toLowerCase() : '';
      if (beltA !== beltB) return beltA.localeCompare(beltB) * dir;
    }
    return compareStudentsDefault(a, b);
  });

  if (isLoading) {
    return <div className="rounded-lg bg-card p-6 text-center text-muted-foreground shadow">{t('students.loading')}</div>;
  }
  if (error) {
    return <div className="rounded-lg bg-card p-6 text-center text-destructive shadow">{t('students.error')}</div>;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <StudentTableHeaders sortConfig={sortConfig} onSort={handleSort} />
          <tbody className="divide-y divide-border bg-card">
            {ordered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-muted-foreground">
                  {t('students.no_students')}
                </td>
              </tr>
            ) : (
              ordered.map((student) => (
                <StudentTableRow
                  key={student.id}
                  student={student}
                  expanded={expandedId === student.id}
                  onToggle={() => setExpandedId((current) => (current === student.id ? null : student.id))}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
