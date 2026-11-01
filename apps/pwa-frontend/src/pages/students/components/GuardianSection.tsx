/**
 * @file GuardianSection.tsx
 * @description Component rendering the forms for managing one or multiple legal guardians for minors.
 * Handles existing user lookups, dynamic relationship types, and unlinking.
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Field, FormGrid, FormSection } from '@/components/forms/FormSection';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { PlusCircle, Trash2, UserCircle } from 'lucide-react';
import { UnlinkGuardianModal } from './UnlinkGuardianModal';
import { GUARDIAN_RELATIONSHIP_OPTIONS } from '@/lib/relationships';

interface GuardianData {
  isExistingUser: boolean;
  userId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dni: string;
  relationship?: string;
  customRelationship?: string;
}

interface GuardianSectionProps {
  guardians: GuardianData[];
  onChange: (idx: number, field: string, val: any) => void;
  onAdd: () => void;
  onRemove: (idx: number) => void;
  onToggleExisting: (idx: number, checked: boolean) => void;
  onSelectUser: (idx: number, userId: string) => void;
  availableUsers: any[];
  isMinor: boolean;
}

/**
 * Legal-guardian fieldset shown only when the student is a minor.
 *
 * @param {GuardianSectionProps} props - Guardian rows, lookup users, and mutation callbacks.
 * @returns {JSX.Element | null} Section, or `null` for adults.
 */
export function GuardianSection({
  guardians,
  onChange,
  onAdd,
  onRemove,
  onToggleExisting,
  onSelectUser,
  availableUsers,
  isMinor,
}: GuardianSectionProps) {
  const { t } = useTranslation();
  const [unlinkIdx, setUnlinkIdx] = useState<number | null>(null);

  if (!isMinor) return null;

  const handleRelationshipChange = (idx: number, value: string) => {
    if (value === 'Otro') {
      onChange(idx, 'relationship', 'Otro');
      onChange(idx, 'customRelationship', '');
    } else {
      onChange(idx, 'relationship', value);
      onChange(idx, 'customRelationship', undefined);
    }
  };

  const confirmRemove = () => {
    if (unlinkIdx !== null) {
      onRemove(unlinkIdx);
      setUnlinkIdx(null);
    }
  };

  return (
    <FormSection
      title={t('students.form.guardians_title')}
      description={t('students.form.guardians_help')}
      actions={
        <Button type="button" variant="outline" size="sm" onClick={onAdd} className="gap-2">
          <PlusCircle className="h-4 w-4" />
          {t('students.form.add_guardian')}
        </Button>
      }
    >
      <div className="space-y-4">
        {guardians.map((guardian, idx) => {
          const isAlreadyLinked = Boolean(guardian.userId && guardian.userId.length > 0);
          const isCustomRelationship =
            guardian.relationship === 'Otro' ||
            (guardian.relationship && !GUARDIAN_RELATIONSHIP_OPTIONS.find((o) => o.value === guardian.relationship));

          return (
            <div key={idx} className="relative space-y-4 rounded-lg border border-primary/20 bg-primary/10 p-5">
              <div className="mb-2 flex items-center justify-between border-b border-primary/20 pb-2">
                <span className="font-semibold text-primary">{t('students.form.guardian_n', { n: idx + 1 })}</span>
                {guardians.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => setUnlinkIdx(idx)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t('students.form.unlink')}
                  </Button>
                )}
              </div>

              {!isAlreadyLinked ? (
                <div className="flex items-center space-x-2 rounded-lg border border-border bg-card p-3">
                  <Switch
                    checked={guardian.isExistingUser}
                    onCheckedChange={(c) => onToggleExisting(idx, c)}
                    id={`existing-guardian-${idx}`}
                  />
                  <Label htmlFor={`existing-guardian-${idx}`} className="cursor-pointer text-sm font-medium text-foreground">
                    {t('students.form.link_existing_user')}
                  </Label>
                </div>
              ) : (
                <div className="flex w-fit items-center gap-2 rounded-md border border-border bg-card p-2 text-sm text-muted-foreground">
                  <UserCircle className="h-4 w-4 text-primary" />
                  <span>{t('students.form.linked_user_note', { id: guardian.userId?.slice(0, 8) })}</span>
                </div>
              )}

              {guardian.isExistingUser && !isAlreadyLinked ? (
                <FormGrid>
                  <Field id={`guardian-user-${idx}`} label={t('students.form.search_user')} className="md:col-span-2">
                    <Select
                      id={`guardian-user-${idx}`}
                      value={guardian.userId || ''}
                      onChange={(e) => onSelectUser(idx, e.target.value)}
                    >
                      <option value="">{t('students.form.select_user')}</option>
                      {availableUsers.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.firstName} {u.lastName} ({u.email})
                        </option>
                      ))}
                    </Select>
                  </Field>
                </FormGrid>
              ) : null}

              <FormGrid>
                <Field id={`guardian-rel-${idx}`} label={t('students.form.relationship')} required>
                  <Select
                    id={`guardian-rel-${idx}`}
                    value={isCustomRelationship ? 'Otro' : guardian.relationship || ''}
                    onChange={(e) => handleRelationshipChange(idx, e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      {t('students.form.select_relationship')}
                    </option>
                    {GUARDIAN_RELATIONSHIP_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {t(opt.labelKey)}
                      </option>
                    ))}
                  </Select>
                </Field>

                {isCustomRelationship ? (
                  <Field id={`guardian-custom-rel-${idx}`} label={t('students.form.specify_relationship')} required>
                    <Input
                      id={`guardian-custom-rel-${idx}`}
                      value={guardian.customRelationship !== undefined ? guardian.customRelationship : guardian.relationship}
                      onChange={(e) => {
                        onChange(idx, 'customRelationship', e.target.value);
                        onChange(idx, 'relationship', e.target.value);
                      }}
                      placeholder={t('students.form.relationship_placeholder')}
                      required
                    />
                  </Field>
                ) : null}

                <Field id={`guardian-first-${idx}`} label={t('students.first_name')} required>
                  <Input
                    id={`guardian-first-${idx}`}
                    value={guardian.firstName}
                    onChange={(e) => onChange(idx, 'firstName', e.target.value)}
                    required
                  />
                </Field>
                <Field id={`guardian-last-${idx}`} label={t('students.last_name')} required>
                  <Input
                    id={`guardian-last-${idx}`}
                    value={guardian.lastName}
                    onChange={(e) => onChange(idx, 'lastName', e.target.value)}
                    required
                  />
                </Field>
                <Field id={`guardian-email-${idx}`} label={t('students.email')} required>
                  <Input
                    id={`guardian-email-${idx}`}
                    type="email"
                    value={guardian.email}
                    onChange={(e) => onChange(idx, 'email', e.target.value)}
                    required
                    disabled={isAlreadyLinked}
                  />
                </Field>
                <Field id={`guardian-phone-${idx}`} label={t('students.phone')} required>
                  <Input
                    id={`guardian-phone-${idx}`}
                    value={guardian.phone}
                    onChange={(e) => onChange(idx, 'phone', e.target.value)}
                    required
                  />
                </Field>
                <Field id={`guardian-dni-${idx}`} label={t('students.dni')}>
                  <Input id={`guardian-dni-${idx}`} value={guardian.dni} onChange={(e) => onChange(idx, 'dni', e.target.value)} />
                </Field>
              </FormGrid>
            </div>
          );
        })}
      </div>

      <UnlinkGuardianModal isOpen={unlinkIdx !== null} onClose={() => setUnlinkIdx(null)} onConfirm={confirmRemove} />
    </FormSection>
  );
}
