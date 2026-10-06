/**
 * @file StudentForm.tsx
 * @description Smart form orchestrator for Student creation. Manages state for
 * existing vs new users, computes dynamic age validation, and integrates sub-components.
 */

import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserSelector } from './components/UserSelector';
import { PersonalDataSection } from './components/PersonalDataSection';
import { GuardianSection } from './components/GuardianSection';

interface StudentFormProps {
  availableUsers: any[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isPending: boolean;
}

export function StudentForm({ availableUsers, onSubmit, onCancel, isPending }: StudentFormProps) {
  const { t } = useTranslation();
  
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', dni: '', phone: '',
    birthDate: '', address: '', city: '', postalCode: '', country: 'ES',
  });

  const [parentData, setParentData] = useState({
    firstName: '', lastName: '', email: '', phone: '', dni: '',
  });

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
        address: user.address || '', city: user.city || '',
        postalCode: user.postalCode || '', country: user.country || 'ES',
      });
    } else {
      setFormData({ firstName: '', lastName: '', email: '', dni: '', phone: '', birthDate: '', address: '', city: '', postalCode: '', country: 'ES' });
    }
  };

  const handleFormDataChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleParentDataChange = (field: string, value: string) => {
    setParentData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      isExistingUser,
      userId: isExistingUser ? selectedUserId : null,
      userData: formData,
      isMinor,
      parentData: isMinor ? parentData : null, 
    };
    onSubmit(payload);
  };

  return (
    <Card className="max-w-4xl shadow-md border-gray-200">
      <CardHeader className="bg-gray-50 border-b border-gray-100 pb-4">
        <CardTitle className="text-xl text-gray-800">{t('students.create_title')}</CardTitle>
      </CardHeader>
      
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          <UserSelector 
            isExistingUser={isExistingUser}
            onToggleExisting={(checked) => { setIsExistingUser(checked); setSelectedUserId(''); }}
            selectedUserId={selectedUserId}
            onSelectUser={handleUserSelect}
            availableUsers={availableUsers}
          />

          <PersonalDataSection 
            formData={formData} 
            onChange={handleFormDataChange} 
            isMinor={isMinor} 
          />

          <GuardianSection 
            parentData={parentData} 
            onChange={handleParentDataChange} 
            isMinor={isMinor} 
          />

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={onCancel}>
              {t('students.cancel')}
            </Button>
            <Button type="submit" disabled={isPending || (isExistingUser && !selectedUserId)}>
              {isPending ? t('students.saving') : t('students.save')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}