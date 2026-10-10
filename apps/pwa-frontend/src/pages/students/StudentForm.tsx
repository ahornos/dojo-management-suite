/**
 * @file StudentForm.tsx
 * @description Smart form orchestrator for Student creation and editing. 
 * Manages state initialization for existing records, computes dynamic age validation,
 * and handles multiple guardians and location metadata.
 */

import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserSelector } from './components/UserSelector';
import { PersonalDataSection } from './components/PersonalDataSection';
import { GuardianSection } from './components/GuardianSection';
import { StudentProfileResponse } from './types';

interface StudentFormProps {
  availableUsers: any[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isPending: boolean;
  mode?: 'create' | 'edit';
  initialData?: StudentProfileResponse | null;
}

export function StudentForm({ 
  availableUsers, 
  onSubmit, 
  onCancel, 
  isPending, 
  mode = 'create', 
  initialData 
}: StudentFormProps) {
  const { t } = useTranslation();
  
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', dni: '', phone: '',
    birthDate: '', address: '', city: '', state: '', postalCode: '', country: 'ES',
  });

  const [guardians, setGuardians] = useState([
    { isExistingUser: false, userId: '', firstName: '', lastName: '', email: '', phone: '', dni: '' }
  ]);

  // Load initial data if in edit mode
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData({
        firstName: initialData.user?.firstName || '',
        lastName: initialData.user?.lastName || '',
        email: initialData.user?.email || '',
        dni: initialData.user?.dni || '',
        phone: initialData.phone || '',
        birthDate: initialData.birthDate ? new Date(initialData.birthDate).toISOString().split('T')[0] : '',
        address: initialData.address || '',
        city: initialData.city || '',
        state: initialData.state || '',
        postalCode: initialData.postalCode || '',
        country: initialData.country || 'ES',
      });
      // Note: If guardians are retrieved from the API, they would be mapped here.
      // Assuming empty or existing mapping logic based on your backend response.
    }
  }, [mode, initialData]);

  // Calculate age dynamically to show Parent section
  const isMinor = useMemo(() => {
    if (!formData.birthDate) return false;
    const birth = new Date(formData.birthDate);
    const ageDiffMs = Date.now() - birth.getTime();
    const ageDate = new Date(ageDiffMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970) < 18;
  }, [formData.birthDate]);

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
    const user = availableUsers.find((u) => u.id === userId);
    if (user) {
      setFormData({
        firstName: user.firstName || '', lastName: user.lastName || '', email: user.email || '',
        dni: user.dni || '', phone: user.phone || '',
        birthDate: user.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : '',
        address: user.address || '', city: user.city || '', state: user.state || '',
        postalCode: user.postalCode || '', country: user.country || 'ES',
      });
    } else {
      setFormData({ firstName: '', lastName: '', email: '', dni: '', phone: '', birthDate: '', address: '', city: '', state: '', postalCode: '', country: 'ES' });
    }
  };

  const handleFormDataChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGuardianChange = (index: number, field: string, value: string) => {
    setGuardians((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleGuardianAdd = () => {
    if (guardians.length < 2) {
      setGuardians((prev) => [...prev, { isExistingUser: false, userId: '', firstName: '', lastName: '', email: '', phone: '', dni: '' }]);
    }
  };

  const handleGuardianRemove = (index: number) => {
    setGuardians((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGuardianToggleExisting = (index: number, checked: boolean) => {
    setGuardians((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], isExistingUser: checked, userId: '' };
      return updated;
    });
  };

  const handleGuardianSelectUser = (index: number, userId: string) => {
    setGuardians((prev) => {
      const updated = [...prev];
      const user = availableUsers.find((u) => u.id === userId);
      if (user) {
        updated[index] = {
          ...updated[index],
          userId,
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          phone: user.phone || '',
          dni: user.dni || '',
        };
      } else {
        updated[index] = { ...updated[index], userId: '', firstName: '', lastName: '', email: '', phone: '', dni: '' };
      }
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      isExistingUser: mode === 'create' ? isExistingUser : true, // In edit mode, the user always exists
      userId: mode === 'create' ? (isExistingUser ? selectedUserId : null) : initialData?.userId,
      userData: formData,
      isMinor,
      guardians: isMinor ? guardians.map(g => ({
        isExistingUser: g.isExistingUser,
        userId: g.isExistingUser ? g.userId : null,
        firstName: g.firstName,
        lastName: g.lastName,
        email: g.email,
        phone: g.phone,
        dni: g.dni,
      })) : null,
    };
    onSubmit(payload);
  };

  return (
    <Card className="max-w-4xl shadow-md border-gray-200">
      <CardHeader className="bg-gray-50 border-b border-gray-100 pb-4">
        <CardTitle className="text-xl text-gray-800">
          {mode === 'create' ? t('students.create_title') : t('users.edit_modal_title')}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Only show User Selector if we are creating a new student */}
          {mode === 'create' && (
            <UserSelector 
              isExistingUser={isExistingUser}
              onToggleExisting={(checked) => { setIsExistingUser(checked); setSelectedUserId(''); }}
              selectedUserId={selectedUserId}
              onSelectUser={handleUserSelect}
              availableUsers={availableUsers}
            />
          )}

          <PersonalDataSection 
            formData={formData} 
            onChange={handleFormDataChange} 
            isMinor={isMinor} 
          />

          <GuardianSection 
            guardians={guardians}
            onChange={handleGuardianChange}
            onAdd={handleGuardianAdd}
            onRemove={handleGuardianRemove}
            onToggleExisting={handleGuardianToggleExisting}
            onSelectUser={handleGuardianSelectUser}
            availableUsers={availableUsers}
            isMinor={isMinor} 
          />

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={onCancel}>
              {t('students.cancel')}
            </Button>
            <Button type="submit" disabled={isPending || (mode === 'create' && isExistingUser && !selectedUserId)}>
              {isPending ? t('students.saving') : t('students.save')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}