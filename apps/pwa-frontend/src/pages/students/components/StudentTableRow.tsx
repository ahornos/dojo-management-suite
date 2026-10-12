/**
 * @file StudentTableRow.tsx
 * @description Presentational component rendering an individual student table row.
 * Universally handles both JSON emergency contacts for adults and structured Guardians for minors.
 */

import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { getLocalizedBeltName } from '@/lib/beltTranslations';
import { getLocalizedRelationship } from '@/lib/relationships';
import { StudentProfileResponse } from '../types';
import { useMemo } from 'react';

interface StudentTableRowProps {
  student: StudentProfileResponse;
  onEdit: (student: StudentProfileResponse) => void;
  onDelete: (id: string) => void;
}

export function StudentTableRow({ student, onEdit, onDelete }: StudentTableRowProps) {
  const { t } = useTranslation();

  const calculateAge = (birthDate?: string) => {
    if (!birthDate) return -1;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const birthDate = student.user?.birthDate || student.birthDate;
  const age = calculateAge(birthDate);
  const isMinor = age !== -1 && age < 18;
  
  // Unify display logic dynamically based on data source
  const displayContacts = useMemo(() => {
    if (isMinor) {
      return (student as any).guardians?.map((g: any) => ({
        name: `${g.guardian?.user?.firstName || ''} ${g.guardian?.user?.lastName || ''}`.trim(),
        phone: g.guardian?.user?.phone || t('students.no_phone'),
        rel: getLocalizedRelationship(g.relationship, t)
      })) || [];
    } else {
      return student.emergencyContacts?.map(c => ({
        name: c.name,
        phone: c.phone,
        rel: getLocalizedRelationship(c.relationship, t)
      })) || [];
    }
  }, [student, isMinor, t]);

  return (
    <tr className="hover:bg-muted transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-foreground">
        {age !== -1 ? `${age} ${t('disciplines.years')}` : '-'}
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
        {student.user?.firstName}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
        {student.user?.lastName}
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        {student.ranks && student.ranks.length > 0 ? (
          <div className="flex flex-col gap-1.5">
            {student.ranks.map(rank => (
              <div key={rank.id} className="text-sm">
                <span className="font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded mr-1.5 inline-block">
                  {rank.disciplineName}
                </span>
                <span className="text-foreground font-medium">
                  {getLocalizedBeltName(rank.beltName, t)}
                </span>
                <span className="text-muted-foreground ml-1 text-xs">
                  ({t('belts.stripes_count', { count: rank.currentStripes })})
                </span>
              </div>
            ))}
          </div>
        ) : (
          <span className="text-xs text-muted-foreground italic">{t('students.no_discipline')}</span>
        )}
      </td>

      {/* Unified Emergency Contact Column */}
      <td className="px-6 py-4 text-sm text-muted-foreground">
        {displayContacts.length > 0 ? (
          <div className="flex flex-col gap-1.5">
            {displayContacts.map((contact: any, index: number) => (
                <div key={index} className="text-xs flex items-center">
                  <span className="font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded mr-2 border border-primary/20 whitespace-nowrap">
                    {contact.rel}
                  </span>
                  <span className="font-medium text-foreground mr-1 whitespace-nowrap">{contact.name}</span>
                  <span className="text-muted-foreground whitespace-nowrap">- {contact.phone}</span>
                </div>
            ))}
          </div>
        ) : (
          <span className="text-muted-foreground italic">{t('students.no_emergency')}</span>
        )}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onEdit(student)}>
          <Pencil className="h-4 w-4 text-primary" />
        </Button>
        <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive border-destructive/40" onClick={() => onDelete(student.id)}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </td>
    </tr>
  );
}