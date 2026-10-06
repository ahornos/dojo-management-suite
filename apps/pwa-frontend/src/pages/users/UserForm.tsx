/**
 * @file UserForm.tsx
 * @description Smart form screen component for user creation and editing. 
 * Manages multi-role selection, personal data, and address fields uniformly.
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  dni: '',
  birthDate: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'ES',
  roles: ['STUDENT'],
  isActive: true,
};

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
        dni: initialData.dni || '',
        birthDate: initialData.birthDate ? initialData.birthDate.substring(0, 10) : '',
        phone: initialData.phone || '',
        address: initialData.address || '',
        city: initialData.city || '',
        state: initialData.state || '',
        postalCode: initialData.postalCode || '',
        country: initialData.country || 'ES',
        roles: Array.isArray(initialData.roles) ? initialData.roles : ['STUDENT'],
        isActive: initialData.isActive ?? true,
      });
    } else {
      setFormData(emptyFormState);
    }
  }, [initialData]);

  const handleChange = (field: keyof UserFormPayload, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRoleToggle = (role: string) => {
    setFormData((prev) => {
      const currentRoles = prev.roles || [];
      if (currentRoles.includes(role)) {
        if (currentRoles.length === 1) return prev; // Keep at least one role assigned
        return { ...prev, roles: currentRoles.filter((r) => r !== role) };
      } else {
        return { ...prev, roles: [...currentRoles, role] };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="max-w-4xl shadow-md border-gray-200 mx-auto">
      <CardHeader className="bg-gray-50 border-b border-gray-100 pb-4">
        <CardTitle className="text-xl text-gray-800">
          {isEditing ? t('users.edit_modal_title') : t('users.create_title')}
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Personal Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
              {t('students.form.personal_data_title')}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">{t('users.first_name')} *</Label>
                <Input
                  id="firstName"
                  required
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">{t('users.last_name')} *</Label>
                <Input
                  id="lastName"
                  required
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t('users.email')} *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dni">{t('users.dni')}</Label>
                <Input
                  id="dni"
                  value={formData.dni}
                  onChange={(e) => handleChange('dni', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthDate">{t('users.birth_date')}</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => handleChange('birthDate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">{t('users.phone')}</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">{t('users.address')}</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">{t('users.city')}</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">{t('users.postal_code')}</Label>
                <Input
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={(e) => handleChange('postalCode', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="state">{t('users.state')}</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">{t('users.country')}</Label>
                <Input
                  id="country"
                  maxLength={2}
                  value={formData.country}
                  onChange={(e) => handleChange('country', e.target.value.toUpperCase())}
                />
              </div>
            </div>
          </div>

          {/* Multi-Role Selection Section */}
          <div className="space-y-3 border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800">
              {t('users.role')}
            </h3>
            <p className="text-xs text-gray-500">Select one or more roles assigned to this user account.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
              {AVAILABLE_ROLES.map((role) => {
                const isChecked = formData.roles?.includes(role);
                return (
                  <label key={role} className="flex items-center space-x-2 cursor-pointer text-sm font-medium text-gray-700 select-none">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleRoleToggle(role)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                    <span>{role}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Account Status & Password Section */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800">
              {t('users.status_label')} &amp; Security
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="isActive">{t('users.status_label')}</Label>
                <select
                  id="isActive"
                  value={formData.isActive ? 'true' : 'false'}
                  onChange={(e) => handleChange('isActive', e.target.value === 'true')}
                  className="w-full text-sm bg-white border border-gray-300 rounded-md px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="true">{t('users.active')}</option>
                  <option value="false">{t('users.inactive')}</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  {isEditing ? t('users.password') : `${t('users.password')} *`}
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required={!isEditing}
                  value={formData.password || ''}
                  onChange={(e) => handleChange('password', e.target.value)}
                />
                <p className="text-xs text-gray-500">{t('users.password_hint')}</p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
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