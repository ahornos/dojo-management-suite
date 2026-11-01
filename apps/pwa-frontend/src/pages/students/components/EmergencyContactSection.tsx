/**
 * @file EmergencyContactSection.tsx
 * @description Lightweight array manager for adult emergency contacts.
 * Bypasses the heavy Guardian/User requirement, storing pure JSON text payload.
 */

import { useTranslation } from 'react-i18next';
import { Field, FormGrid, FormSection } from '@/components/forms/FormSection';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';
import { EmergencyContactPayload } from '../types';
import { EMERGENCY_RELATIONSHIP_OPTIONS } from '@/lib/relationships';

interface EmergencyContactSectionProps {
  contacts: EmergencyContactPayload[];
  onChange: (contacts: EmergencyContactPayload[]) => void;
  isMinor: boolean;
}

/**
 * Emergency-contact fieldset shown only for adult students.
 *
 * @param {EmergencyContactSectionProps} props - Contact rows and change handler.
 * @returns {JSX.Element | null} Section, or `null` for minors.
 */
export function EmergencyContactSection({ contacts, onChange, isMinor }: EmergencyContactSectionProps) {
  const { t } = useTranslation();
  if (isMinor) return null;

  const handleAdd = () => onChange([...contacts, { name: '', phone: '', relationship: 'Familiar' }]);

  const handleUpdate = (idx: number, field: string, value: string) => {
    const updated = [...contacts];
    (updated[idx] as any)[field] = value;
    onChange(updated);
  };

  const handleRemove = (idx: number) => onChange(contacts.filter((_, i) => i !== idx));

  return (
    <FormSection
      title={t('students.form.emergency_title')}
      description={t('students.form.emergency_help')}
      actions={
        <Button type="button" variant="outline" size="sm" onClick={handleAdd} className="gap-2">
          <PlusCircle className="h-4 w-4" /> {t('students.form.add_contact')}
        </Button>
      }
    >
      <div className="space-y-4">
        {contacts.map((contact, idx) => {
          const isCustom =
            contact.relationship === 'Otro' ||
            !EMERGENCY_RELATIONSHIP_OPTIONS.some((opt) => opt.value === contact.relationship);

          return (
            <div key={idx} className="space-y-4 rounded-lg border border-border bg-muted/50 p-4">
              <div className="mb-2 flex items-center justify-between border-b border-border pb-2">
                <span className="font-semibold text-foreground">{t('students.form.contact_n', { n: idx + 1 })}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => handleRemove(idx)}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> {t('common.remove')}
                </Button>
              </div>

              <FormGrid>
                <Field id={`contact-name-${idx}`} label={t('students.form.contact_name')} required>
                  <Input
                    id={`contact-name-${idx}`}
                    value={contact.name}
                    onChange={(e) => handleUpdate(idx, 'name', e.target.value)}
                    required
                    placeholder={t('students.form.contact_name_placeholder')}
                  />
                </Field>
                <Field id={`contact-phone-${idx}`} label={t('students.phone')} required>
                  <Input
                    id={`contact-phone-${idx}`}
                    value={contact.phone}
                    onChange={(e) => handleUpdate(idx, 'phone', e.target.value)}
                    required
                    placeholder={t('students.form.contact_phone_placeholder')}
                  />
                </Field>
                <Field id={`contact-rel-${idx}`} label={t('students.form.relationship')}>
                  <Select
                    id={`contact-rel-${idx}`}
                    value={isCustom ? 'Otro' : contact.relationship}
                    onChange={(e) => {
                      if (e.target.value === 'Otro') {
                        handleUpdate(idx, 'relationship', 'Otro');
                        handleUpdate(idx, 'customRelationship', '');
                      } else {
                        handleUpdate(idx, 'relationship', e.target.value);
                      }
                    }}
                  >
                    {EMERGENCY_RELATIONSHIP_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {t(opt.labelKey)}
                      </option>
                    ))}
                  </Select>
                </Field>
                {isCustom ? (
                  <Field
                    id={`contact-custom-rel-${idx}`}
                    label={t('students.form.specify_relationship')}
                    required
                    className="md:col-span-2"
                  >
                    <Input
                      id={`contact-custom-rel-${idx}`}
                      value={contact.customRelationship !== undefined ? contact.customRelationship : contact.relationship}
                      onChange={(e) => {
                        handleUpdate(idx, 'customRelationship', e.target.value);
                        handleUpdate(idx, 'relationship', e.target.value);
                      }}
                      placeholder={t('students.form.relationship_placeholder')}
                      required
                    />
                  </Field>
                ) : null}
              </FormGrid>
            </div>
          );
        })}
      </div>
    </FormSection>
  );
}
