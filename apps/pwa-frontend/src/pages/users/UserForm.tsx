/**
 * @file UserForm.tsx
 * @description Smart form screen component for user creation and editing.
 * Manages multi-role selection and login identity (no StudentProfile demographics).
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Field, FormGrid, FormSection } from '@/components/forms/FormSection';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { GENDERS } from '@/lib/domain-enums';
import { UserFormPayload } from './types';

interface UserFormProps {
  initialData?: UserFormPayload | null;
  onSubmit: (data: UserFormPayload) => void;
  onCancel: () => void;
  isPending: boolean;
}

const AVAILABLE_ROLES = [
  'SUPER_ADMIN',
  'ADMIN_STAFF',
  'SPORTS_TECHNICAL_DIRECTOR',
  'INSTRUCTOR',
  'STUDENT',
  'PARENT',
];

const emptyFormState: UserFormPayload = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  gender: '',
  roles: ['STUDENT'],
  isActive: true,
};

/**
 * Full-page create/edit form for a login user (name, email, gender, roles, status, password).
 *
 * @param {UserFormProps} props - Optional initial values, submit/cancel handlers, and pending flag.
 * @returns {JSX.Element} The user form card.
 */
export function UserForm({ initialData, onSubmit, onCancel, isPending }: UserFormProps) {
  const { t } = useTranslation();
  const isEditing = !!initialData?.id;

  const [formData, setFormData] = useState<UserFormPayload>(emptyFormState);

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        email: initialData.email || '',
        password: '',
        gender: initialData.gender || '',
        roles: Array.isArray(initialData.roles) ? initialData.roles : ['STUDENT'],
        isActive: initialData.isActive ?? true,
      });
    } else {
      setFormData(emptyFormState);
    }
  }, [initialData]);

  const handleChange = (field: keyof UserFormPayload, value: string | boolean | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRoleToggle = (role: string) => {
    setFormData((prev) => {
      const currentRoles = prev.roles || [];
      if (currentRoles.includes(role)) {
        if (currentRoles.length === 1) return prev;
        return { ...prev, roles: currentRoles.filter((r) => r !== role) };
      }
      return { ...prev, roles: [...currentRoles, role] };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="w-full border-border shadow-md">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          <FormSection title={t('users.personal_section')}>
            <FormGrid>
              <Field id="firstName" label={t('users.first_name')} required>
                <Input
                  id="firstName"
                  required
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                />
              </Field>
              <Field id="lastName" label={t('users.last_name')} required>
                <Input
                  id="lastName"
                  required
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                />
              </Field>
              <Field id="email" label={t('users.email')} required>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
              </Field>
              <Field id="gender" label={t('users.gender')}>
                <Select id="gender" value={formData.gender} onChange={(e) => handleChange('gender', e.target.value)}>
                  <option value="">{t('users.gender_placeholder')}</option>
                  {GENDERS.map((gender) => (
                    <option key={gender} value={gender}>
                      {t(`enums.gender.${gender}`)}
                    </option>
                  ))}
                </Select>
              </Field>
            </FormGrid>
          </FormSection>

          <FormSection title={t('users.role')} description={t('users.select_roles')}>
            <div className="grid grid-cols-1 gap-3 rounded-lg border border-border bg-muted p-4 sm:grid-cols-2 md:grid-cols-3">
              {AVAILABLE_ROLES.map((role) => {
                const isChecked = formData.roles?.includes(role);
                return (
                  <label
                    key={role}
                    className="flex cursor-pointer select-none items-center gap-2 text-sm font-medium text-foreground"
                  >
                    <Checkbox checked={isChecked} onChange={() => handleRoleToggle(role)} />
                    <span>{t(`users.roles.${role}`)}</span>
                  </label>
                );
              })}
            </div>
          </FormSection>

          <FormSection title={t('users.status_security')}>
            <FormGrid>
              <Field id="isActive" label={t('users.status_label')}>
                <Select
                  id="isActive"
                  value={formData.isActive ? 'true' : 'false'}
                  onChange={(e) => handleChange('isActive', e.target.value === 'true')}
                >
                  <option value="true">{t('users.active')}</option>
                  <option value="false">{t('users.inactive')}</option>
                </Select>
              </Field>
              <Field
                id="password"
                label={t('users.password')}
                required={!isEditing}
                hint={t('users.password_hint')}
              >
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required={!isEditing}
                  value={formData.password || ''}
                  onChange={(e) => handleChange('password', e.target.value)}
                />
              </Field>
            </FormGrid>
          </FormSection>

          <div className="flex justify-end gap-3 border-t border-border pt-6">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
              {t('users.cancel')}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? t('users.saving') : t('users.save')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
