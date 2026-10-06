/**
 * @file EditUserModal.tsx
 * @description Modal component containing the form to update an existing system user
 * with multi-role support.
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserFormPayload } from './types';

interface EditUserModalProps {
  user: any | null;
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

export function EditUserModal({ user, onClose, onSubmit, isPending }: EditUserModalProps): JSX.Element | null {
  const { t } = useTranslation();
  const [editingUser, setEditingUser] = useState<UserFormPayload | null>(null);

  // Sync state when the passed user object changes (modal opens)
  useEffect(() => {
    if (user) {
      setEditingUser({
        id: user.id,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        dni: user.dni || '',
        birthDate: user.birthDate ? user.birthDate.substring(0, 10) : '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        postalCode: user.postalCode || '',
        country: user.country || 'ES',
        // Ensure roles is correctly handled as an array, fallback to single role or STUDENT
        roles: Array.isArray(user.roles) ? user.roles : [user.role || 'STUDENT'],
        isActive: user.isActive ?? true,
        password: '',
      });
    }
  }, [user]);

  if (!user || !editingUser) return null;

  const handleRoleToggle = (role: string) => {
    setEditingUser((prev) => {
      if (!prev) return prev;
      const currentRoles = prev.roles || [];
      if (currentRoles.includes(role)) {
        if (currentRoles.length === 1) return prev; // Keep at least one role
        return { ...prev, roles: currentRoles.filter((r) => r !== role) };
      } else {
        return { ...prev, roles: [...currentRoles, role] };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(editingUser);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <Card className="w-full max-w-2xl bg-white shadow-xl my-8">
        <CardHeader>
          <CardTitle>{t('users.edit_modal_title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-firstName">{t('users.first_name')}</Label>
                <Input id="edit-firstName" value={editingUser.firstName} onChange={(e) => setEditingUser({ ...editingUser, firstName: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-lastName">{t('users.last_name')}</Label>
                <Input id="edit-lastName" value={editingUser.lastName} onChange={(e) => setEditingUser({ ...editingUser, lastName: e.target.value })} required />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="edit-email">{t('users.email')}</Label>
                <Input id="edit-email" type="email" value={editingUser.email} onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-dni">{t('users.dni')}</Label>
                <Input id="edit-dni" value={editingUser.dni} onChange={(e) => setEditingUser({ ...editingUser, dni: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-birthDate">{t('users.birth_date')}</Label>
                <Input id="edit-birthDate" type="date" value={editingUser.birthDate} onChange={(e) => setEditingUser({ ...editingUser, birthDate: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">{t('users.phone')}</Label>
                <Input id="edit-phone" value={editingUser.phone} onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })} />
              </div>
            </div>

            {/* Multi-Role Selection Section */}
            <div className="space-y-2 border-t pt-4">
              <Label className="text-sm font-semibold text-gray-800">{t('users.role')} (Select one or more)</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                {AVAILABLE_ROLES.map((role) => {
                  const isChecked = editingUser.roles?.includes(role);
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
              <Label htmlFor="edit-status">{t('users.status_label')}</Label>
              <select id="edit-status" value={editingUser.isActive ? 'true' : 'false'} onChange={(e) => setEditingUser({ ...editingUser, isActive: e.target.value === 'true' })} className="w-full text-sm bg-gray-50 border border-gray-300 rounded-md px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="true">{t('users.active')}</option>
                <option value="false">{t('users.inactive')}</option>
              </select>
            </div>

            <div className="border-t pt-4 mt-4 space-y-3">
              <h3 className="text-sm font-semibold text-gray-700">{t('users.address_section')}</h3>
              <div className="space-y-2">
                <Label htmlFor="edit-address">{t('users.address')}</Label>
                <Input id="edit-address" value={editingUser.address} onChange={(e) => setEditingUser({ ...editingUser, address: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="edit-city">{t('users.city')}</Label>
                  <Input id="edit-city" value={editingUser.city} onChange={(e) => setEditingUser({ ...editingUser, city: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-state">{t('users.state')}</Label>
                  <Input id="edit-state" value={editingUser.state} onChange={(e) => setEditingUser({ ...editingUser, state: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-postalCode">{t('users.postal_code')}</Label>
                  <Input id="edit-postalCode" value={editingUser.postalCode} onChange={(e) => setEditingUser({ ...editingUser, postalCode: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-country">{t('users.country')}</Label>
                  <Input id="edit-country" maxLength={2} value={editingUser.country} onChange={(e) => setEditingUser({ ...editingUser, country: e.target.value.toUpperCase() })} />
                </div>
              </div>
            </div>

            <div className="border-t pt-4 mt-4 space-y-3">
              <h3 className="text-sm font-semibold text-gray-700">{t('users.password_section')}</h3>
              <div className="space-y-2">
                <Label htmlFor="edit-password">{t('users.password')}</Label>
                <Input id="edit-password" type="password" placeholder="••••••••" value={editingUser.password || ''} onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })} />
                <p className="text-xs text-gray-500">{t('users.password_hint')}</p>
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