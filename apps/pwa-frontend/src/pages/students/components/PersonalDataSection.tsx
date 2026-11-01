/**
 * @file PersonalDataSection.tsx
 * @description Personal identity fields including gender, aligned to the shared form grid.
 */

import { useTranslation } from 'react-i18next';
import { CountrySelector } from '@/components/forms/CountrySelector';
import { Field, FormGrid, FormSection } from '@/components/forms/FormSection';
import { DateInput } from '@/components/ui/date-input';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { GENDERS } from '@/lib/domain-enums';

export interface PersonalFormData {
  firstName: string;
  lastName: string;
  email: string;
  dni: string;
  phone: string;
  birthDate: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  gender: string;
}

/** Empty personal-data block used by create forms and reset paths. */
export const EMPTY_PERSONAL_FORM: PersonalFormData = {
  firstName: '',
  lastName: '',
  email: '',
  dni: '',
  phone: '',
  birthDate: '',
  address: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'ES',
  gender: '',
};

interface PersonalDataSectionProps {
  formData: PersonalFormData;
  onChange: (field: keyof PersonalFormData, value: string) => void;
  isMinor: boolean;
}

/**
 * Personal information + address block used by student create/edit.
 *
 * @param {PersonalDataSectionProps} props - Values, change handler, and minor highlight.
 * @returns {JSX.Element} Section.
 */
export function PersonalDataSection({ formData, onChange, isMinor }: PersonalDataSectionProps) {
  const { t } = useTranslation();

  return (
    <FormSection title={t('students.form.personal_data_title')}>
      <FormGrid>
        <Field id="firstName" label={t('users.first_name')} required>
          <Input
            id="firstName"
            required
            value={formData.firstName}
            onChange={(event) => onChange('firstName', event.target.value)}
          />
        </Field>
        <Field id="lastName" label={t('users.last_name')} required>
          <Input
            id="lastName"
            required
            value={formData.lastName}
            onChange={(event) => onChange('lastName', event.target.value)}
          />
        </Field>
        {!isMinor ? (
          <Field id="email" label={t('users.email')} required>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(event) => onChange('email', event.target.value)}
            />
          </Field>
        ) : null}
        <Field id="dni" label={t('users.dni')}>
          <Input id="dni" value={formData.dni} onChange={(event) => onChange('dni', event.target.value)} />
        </Field>
        <Field id="birthDate" label={t('users.birth_date')} required>
          <DateInput
            id="birthDate"
            required
            value={formData.birthDate}
            onChange={(event) => onChange('birthDate', event.target.value)}
            className={isMinor ? 'border-warning focus-visible:ring-warning bg-warning/10' : ''}
          />
        </Field>
        <Field id="gender" label={t('students.form.gender')}>
          <Select
            id="gender"
            value={formData.gender}
            onChange={(event) => onChange('gender', event.target.value)}
          >
            <option value="">{t('students.form.gender_placeholder')}</option>
            {GENDERS.map((gender) => (
              <option key={gender} value={gender}>
                {t(`enums.gender.${gender}`)}
              </option>
            ))}
          </Select>
        </Field>
        <Field id="phone" label={t('users.phone')}>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(event) => onChange('phone', event.target.value)}
          />
        </Field>
      </FormGrid>

      <FormGrid>
        <Field id="address" label={t('users.address')} className="md:col-span-2">
          <Input id="address" value={formData.address} onChange={(event) => onChange('address', event.target.value)} />
        </Field>
        <Field id="city" label={t('users.city')}>
          <Input id="city" value={formData.city} onChange={(event) => onChange('city', event.target.value)} />
        </Field>
        <Field id="postalCode" label={t('users.postal_code')}>
          <Input
            id="postalCode"
            value={formData.postalCode}
            onChange={(event) => onChange('postalCode', event.target.value)}
          />
        </Field>
        <Field id="state" label={t('users.state')}>
          <Input id="state" value={formData.state} onChange={(event) => onChange('state', event.target.value)} />
        </Field>
        <Field id="country" label={t('users.country')}>
          <CountrySelector
            id="country"
            value={formData.country}
            onChange={(event) => onChange('country', event.target.value)}
          />
        </Field>
      </FormGrid>
    </FormSection>
  );
}
