/**
 * @file StudentDetailPanel.tsx
 * @description Expanded directory row: personal data, guardians, academic/financial context, audit flags.
 */

import { Pencil } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { getLocalizedBeltName } from '@/lib/beltTranslations';
import { getLocalizedRelationship } from '@/lib/relationships';
import { FederationStatusBadge } from './FederationStatusBadge';
import { MandateStatusBadge } from './MandateStatusBadge';
import { useStudentMandate } from '../useStudentMandate';
import { collectAuditFlags, enrollmentDates, isStudentMinor, studentEmergencyContacts } from '../listFilters';
import { studentDisplayName, studentGender, studentPayerUserId } from '../studentIdentity';
import type { StudentProfileResponse } from '../types';

interface StudentDetailPanelProps {
  student: StudentProfileResponse;
  onEdit: () => void;
}

/**
 * Formats an ISO date for the active locale.
 *
 * @param {string | undefined} iso - Date string.
 * @param {string} locale - i18n language.
 * @returns {string} Localized date, or an em dash.
 */
function formatDate(iso: string | undefined, locale: string): string {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString(locale, { dateStyle: 'medium' });
}

/**
 * Three-column inspection panel shown under an expanded student row.
 *
 * @param {StudentDetailPanelProps} props - The student whose details are shown.
 * @returns {JSX.Element} Detail grid.
 */
export function StudentDetailPanel({ student, onEdit }: StudentDetailPanelProps): JSX.Element {
  const { t, i18n } = useTranslation();
  const { mandate, isLoading: mandateLoading } = useStudentMandate({
    mandateId: student.bankMandateId,
    payerUserId: studentPayerUserId(student),
  });
  const flags = [...collectAuditFlags(student.statusHistory)];
  const holderDniMissing =
    Boolean(mandate) &&
    (!mandate?.accountHolderDni ||
      mandate.accountHolderDni === '00000000X' ||
      mandate.accountHolderDni === 'PENDIENTE');
  if (holderDniMissing) flags.push('MISSING_HOLDER_DNI');
  const uniqueFlags = Array.from(new Set(flags));
  const { start, end } = enrollmentDates(student);
  const gender = studentGender(student);
  const { firstName, lastName } = studentDisplayName(student);
  const ranks = student.ranks ?? [];
  const guardians = student.guardians ?? [];
  const emergencyContacts = studentEmergencyContacts(student).filter(
    (contact) => contact.name?.trim() || contact.phone?.trim(),
  );
  const minor = isStudentMinor(student);

  return (
    <div className="space-y-3 rounded-lg bg-muted/30 p-4">
      <div className="flex justify-end">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={(event) => {
            event.stopPropagation();
            onEdit();
          }}
        >
          <Pencil className="h-4 w-4" />
          {t('students.detail.quick_edit')}
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <section className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {t('students.detail.title_personal')}
        </h3>
        <dl className="space-y-1.5 text-sm">
          <DetailRow label={t('students.detail.full_name')} value={`${firstName} ${lastName}`.trim() || '—'} />
          <DetailRow label={t('students.dni')} value={student.dni || '—'} />
          <DetailRow
            label={t('students.form.gender')}
            value={gender ? t(`enums.gender.${gender}`, { defaultValue: gender }) : '—'}
          />
          <DetailRow label={t('students.detail.birth_date')} value={formatDate(student.birthDate, i18n.language)} />
          <DetailRow label={t('students.detail.direct_phone')} value={student.phone || '—'} />
          <DetailRow label={t('students.detail.email')} value={student.user?.email || '—'} />
        </dl>
      </section>

      <section className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {t('students.detail.title_family')}
        </h3>
        {minor ? (
          guardians.length === 0 ? (
            <p className="text-sm italic text-muted-foreground">{t('students.detail.no_guardians')}</p>
          ) : (
            <ul className="space-y-2">
              {guardians.map((link, index) => {
                const user = link.guardian?.user;
                const name = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || '—';
                return (
                  <li key={`${name}-${index}`} className="rounded-md border border-border bg-card p-2 text-sm">
                    <div className="mb-1">
                      <span className="inline-flex rounded-md border border-primary/20 bg-primary/10 px-1.5 py-0.5 text-[11px] font-semibold text-primary">
                        {getLocalizedRelationship(link.relationship ?? undefined, t)}
                      </span>
                    </div>
                    <p className="font-medium text-foreground">{name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email || '—'}</p>
                  </li>
                );
              })}
            </ul>
          )
        ) : emergencyContacts.length === 0 ? (
          <p className="text-sm italic text-muted-foreground">{t('students.no_emergency')}</p>
        ) : (
          <ul className="space-y-2">
            {emergencyContacts.map((contact, index) => (
              <li key={`${contact.name}-${index}`} className="rounded-md border border-border bg-card p-2 text-sm">
                <div className="mb-1">
                  <span className="inline-flex rounded-md border border-primary/20 bg-primary/10 px-1.5 py-0.5 text-[11px] font-semibold text-primary">
                    {contact.relationship
                      ? getLocalizedRelationship(contact.relationship, t)
                      : t('students.table_emergency')}
                  </span>
                </div>
                <p className="font-medium text-foreground">{contact.name?.trim() || '—'}</p>
                <p className="text-xs text-muted-foreground">{contact.phone || t('students.no_phone')}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {t('students.detail.title_context')}
        </h3>
        <dl className="space-y-1.5 text-sm">
          <div>
            <dt className="text-xs text-muted-foreground">{t('students.detail.federation')}</dt>
            <dd className="mt-0.5">
              <FederationStatusBadge studentProfileId={student.id} enabled />
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">{t('students.detail.belt')}</dt>
            <dd className="text-foreground">
              {ranks.length > 0 ? (
                <ul className="space-y-1">
                  {ranks.map((rank) => (
                    <li key={rank.id} className="inline-flex flex-wrap items-center gap-1">
                      <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                        {rank.disciplineName}
                      </span>
                      <span>{getLocalizedBeltName(rank.beltName, t)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                t('students.no_discipline')
              )}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">{t('students.detail.mandate')}</dt>
            <dd className="mt-0.5">
              {mandateLoading ? (
                <span className="text-muted-foreground">{t('students.loading')}</span>
              ) : mandate ? (
                <MandateStatusBadge mandate={mandate} />
              ) : (
                <span className="text-sm italic text-muted-foreground">{t('students.detail.no_mandate')}</span>
              )}
            </dd>
          </div>
          <DetailRow label={t('students.form.account_holder_name')} value={mandate?.accountHolderName || '—'} />
          <DetailRow label={t('students.form.account_holder_dni')} value={mandate?.accountHolderDni || '—'} />
          <DetailRow label={t('students.detail.regular_fee')} value={t('students.detail.fee_unknown')} />
          <DetailRow label={t('students.detail.start_date')} value={formatDate(start, i18n.language)} />
          <DetailRow label={t('students.detail.end_date')} value={formatDate(end, i18n.language)} />
        </dl>
      </section>

      {uniqueFlags.length > 0 && (
        <div className="rounded-md border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-700 lg:col-span-3">
          <p className="mb-1 font-semibold">{t('students.detail.audit_flags')}</p>
          <ul className="list-disc space-y-0.5 pl-5">
            {uniqueFlags.map((flag) => (
              <li key={flag}>{t(`students.flags.${flag}`, { defaultValue: flag })}</li>
            ))}
          </ul>
        </div>
      )}
      </div>
    </div>
  );
}

/**
 * Label/value pair for the detail grid.
 *
 * @param {{ label: string; value: string }} props - Copy.
 * @returns {JSX.Element} Definition row.
 */
function DetailRow({ label, value }: { label: string; value: string }): JSX.Element {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-foreground">{value}</dd>
    </div>
  );
}
