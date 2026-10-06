/**
 * @file CreateUserModal.tsx
 * @description Modal component containing the form to create a new system user 
 * with support for assigning multiple simultaneous system roles.
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserFormPayload } from './types';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormPayload) => void;
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
  firstName: '', lastName: '', email: '', password: '', dni: '', birthDate: '',
  phone: '', address: '', city: '', state: '', postalCode: '', country: 'ES',
  roles: ['STUDENT'], isActive: true,
};

export function CreateUserModal({ isOpen, onClose, onSubmit, isPending }: CreateUserModalProps): JSX.Element | null {
  const { t } = useTranslation();
  const [newUser, setNewUser] = useState<UserFormPayload>(emptyFormState);

  if (!isOpen) return null;

  const handleRoleToggle = (role: string) => {
    setNewUser((prev) => {
      const currentRoles = prev.roles || [];
      if (currentRoles.includes(role)) {
        // Keep at least one role assigned
        if (currentRoles.length === 1) return prev;
        return { ...prev, roles: currentRoles.filter((r) => r !== role) };
      } else {
        return { ...prev, roles: [...currentRoles, role] };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(newUser);
    setNewUser(emptyFormState); 
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <Card className="w-full max-w-2xl bg-white shadow-xl my-8">
        <CardHeader>
          <CardTitle>{t('users.create_modal_title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="create-firstName">{t('users.first_name')}</Label>
                <Input id="create-firstName" value={newUser.firstName} onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-lastName">{t('users.last_name')}</Label>
                <Input id="create-lastName" value={newUser.lastName} onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="create-email">{t('users.email')}</Label>
                <Input id="create-email" type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-password">{t('users.password')}</Label>
                <Input id="create-password" type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} required />
                <p className="text-xs text-gray-500">{t('users.password_hint')}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="create-dni">{t('users.dni')}</Label>
                <Input id="create-dni" value={newUser.dni} onChange={(e) => setNewUser({ ...newUser, dni: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-birthDate">{t('users.birth_date')}</Label>
                <Input id="create-birthDate" type="date" value={newUser.birthDate} onChange={(e) => setNewUser({ ...newUser, birthDate: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-phone">{t('users.phone')}</Label>
                <Input id="create-phone" value={newUser.phone} onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })} />
              </div>
            </div>

            {/* Multi-Role Selection Section */}
            <div className="space-y-2 border-t pt-4">
              <Label className="text-sm font-semibold text-gray-800">{t('users.role')} (Select one or more)</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                {AVAILABLE_ROLES.map((role) => {
                  const isChecked = newUser.roles?.includes(role);
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

            <div className="space-y-2">
              <Label htmlFor="create-status">{t('users.status_label')}</Label>
              <select id="create-status" value={newUser.isActive ? 'true' : 'false'} onChange={(e) => setNewUser({ ...newUser, isActive: e.target.value === 'true' })} className="w-full text-sm bg-gray-50 border border-gray-300 rounded-md px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="true">{t('users.active')}</option>
                <option value="false">{t('users.inactive')}</option>
              </select>
            </div>

            <div className="border-t pt-4 mt-4 space-y-3">
              <h3 className="text-sm font-semibold text-gray-700">{t('users.address_section')}</h3>
              <div className="space-y-2">
                <Label htmlFor="create-address">{t('users.address')}</Label>
                <Input id="create-address" value={newUser.address} onChange={(e) => setNewUser({ ...newUser, address: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="create-city">{t('users.city')}</Label>
                  <Input id="create-city" value={newUser.city} onChange={(e) => setNewUser({ ...newUser, city: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-state">{t('users.state')}</Label>
                  <Input id="create-state" value={newUser.state} onChange={(e) => setNewUser({ ...newUser, state: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-postalCode">{t('users.postal_code')}</Label>
                  <Input id="create-postalCode" value={newUser.postalCode} onChange={(e) => setNewUser({ ...newUser, postalCode: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2 w-1/2 pr-2">
                <Label htmlFor="create-country">{t('users.country')}</Label>
                <Input id="create-country" maxLength={2} value={newUser.country} onChange={(e) => setNewUser({ ...newUser, country: e.target.value.toUpperCase() })} />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                {t('users.cancel')}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? t('users.saving') : t('users.save')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}