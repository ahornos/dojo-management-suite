/**
 * @file StudentTableHeaders.tsx
 * @description Directory headers: status, age, student, gender, discipline & rank, contacts, actions.
 */

import { useTranslation } from 'react-i18next';
import { ArrowUpDown, ChevronDown, ChevronUp } from 'lucide-react';

export type SortKey = 'age' | 'firstName' | 'lastName' | 'belt';

export type SortConfig = {
  key: SortKey;
  direction: 'asc' | 'desc';
} | null;

interface StudentTableHeadersProps {
  sortConfig: SortConfig;
  onSort: (key: SortKey) => void;
}

/**
 * Sortable header row for the student directory.
 *
 * @param {StudentTableHeadersProps} props - Active sort and click handler.
 * @returns {JSX.Element} Table head.
 */
export function StudentTableHeaders({ sortConfig, onSort }: StudentTableHeadersProps): JSX.Element {
  const { t } = useTranslation();

  const SortableHeader = ({ label, sortKey }: { label: string; sortKey: SortKey }) => (
    <th
      className="group cursor-pointer select-none px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:bg-muted"
      onClick={() => onSort(sortKey)}
    >
      <div className="flex items-center space-x-1">
        <span>{t(label)}</span>
        <span className="text-muted-foreground">
          {sortConfig?.key === sortKey ? (
            sortConfig.direction === 'asc' ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )
          ) : (
            <ArrowUpDown className="h-4 w-4 opacity-0 group-hover:opacity-100" />
          )}
        </span>
      </div>
    </th>
  );

  return (
    <thead className="bg-muted">
      <tr>
        <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {t('students.table_status')}
        </th>
        <SortableHeader label="students.table_age" sortKey="age" />
        <SortableHeader label="students.table_student" sortKey="lastName" />
        <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {t('students.table_gender')}
        </th>
        <SortableHeader label="students.table_discipline_rank" sortKey="belt" />
        <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {t('students.table_contact')}
        </th>
        <th className="sticky right-0 bg-muted px-3 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {t('students.table_actions')}
        </th>
      </tr>
    </thead>
  );
}
