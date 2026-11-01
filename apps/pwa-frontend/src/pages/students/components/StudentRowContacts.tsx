/**
 * @file StudentRowContacts.tsx
 * @description Vertically stacked guardian / emergency-contact lines for the directory row.
 */

import { useTranslation } from 'react-i18next';
import { getLocalizedRelationship } from '@/lib/relationships';
import { isStudentMinor, studentEmergencyContacts } from '../listFilters';
import type { StudentGuardianLink, StudentProfileResponse } from '../types';

interface StudentRowContactsProps {
  student: StudentProfileResponse;
}

/**
 * Dialable phone that does not toggle the accordion.
 *
 * @param {{ phone?: string }} props - Raw phone string.
 * @returns {JSX.Element} Tel link or muted fallback.
 */
function PhoneLink({ phone }: { phone?: string }): JSX.Element {
  const { t } = useTranslation();
  const trimmed = phone?.trim();
  if (!trimmed) {
    return <span className="text-muted-foreground">{t('students.no_phone')}</span>;
  }
  return (
    <a
      href={`tel:${trimmed.replace(/\s+/g, '')}`}
      className="font-medium text-primary tabular-nums hover:underline"
      onClick={(event) => event.stopPropagation()}
    >
      {trimmed}
    </a>
  );
}

/**
 * One contact line: relationship pill, name, dash, phone.
 *
 * @param {{ relationship?: string; fallbackBadge?: string; name: string; phone?: string }} props - Line copy.
 * @returns {JSX.Element} Stacked contact row.
 */
function ContactLine({
  relationship,
  fallbackBadge,
  name,
  phone,
}: {
  relationship?: string;
  fallbackBadge?: string;
  name: string;
  phone?: string;
}): JSX.Element {
  const { t } = useTranslation();
  const badge = relationship ? getLocalizedRelationship(relationship, t) : fallbackBadge;
  return (
    <div className="flex min-w-0 items-center gap-1.5 text-xs text-foreground">
      {badge ? (
        <span className="inline-flex shrink-0 rounded-md border border-primary/20 bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
          {badge}
        </span>
      ) : null}
      <span className="truncate font-medium">{name}</span>
      <span className="text-muted-foreground">-</span>
      <PhoneLink phone={phone} />
    </div>
  );
}

/**
 * Guardian lines for minors; emergency-contact lines for adults. Always stacked.
 *
 * @param {StudentRowContactsProps} props - Student whose contacts are shown.
 * @returns {JSX.Element} Vertical contact list.
 */
export function StudentRowContacts({ student }: StudentRowContactsProps): JSX.Element {
  const { t } = useTranslation();

  if (isStudentMinor(student)) {
    const guardians = (student.guardians ?? []).filter((link): link is StudentGuardianLink => Boolean(link));
    if (guardians.length === 0) {
      return <span className="text-xs italic text-muted-foreground">{t('students.detail.no_guardians')}</span>;
    }
    return (
      <div className="flex flex-col gap-1.5">
        {guardians.map((link, index) => {
          const user = link.guardian?.user;
          const name = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || '—';
          return (
            <ContactLine
              key={`${name}-${link.relationship ?? index}`}
              relationship={link.relationship ?? undefined}
              name={name}
            />
          );
        })}
      </div>
    );
  }

  const contacts = studentEmergencyContacts(student).filter((contact) => contact.name?.trim() || contact.phone?.trim());
  if (contacts.length === 0) {
    return <span className="text-xs italic text-muted-foreground">{t('students.no_emergency')}</span>;
  }

  return (
    <div className="flex flex-col gap-1.5">
      {contacts.map((contact, index) => (
        <ContactLine
          key={`${contact.name}-${index}`}
          relationship={contact.relationship || undefined}
          fallbackBadge={t('students.table_emergency')}
          name={contact.name?.trim() || '—'}
          phone={contact.phone}
        />
      ))}
    </div>
  );
}
