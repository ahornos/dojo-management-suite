/**
 * @file StudentCreateForm.tsx
 * @description Dedicated form component for registering a new Student.
 * Sanitizes emergency contacts payload and maps relationships properly before dispatching API requests.
 */

import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserSelector } from '../components/UserSelector';
import { PersonalDataSection } from '../components/PersonalDataSection';
import { GuardianSection } from '../components/GuardianSection';
import { EmergencyContactSection } from '../components/EmergencyContactSection';
import { DisciplineSection, DisciplineAssignment } from '../components/DisciplineSection';
import { EmergencyContactPayload } from '../types';

interface StudentCreateFormProps {
  availableUsers: any[];
  availableDisciplines: any[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isPending: boolean;
}

export function StudentCreateForm({ availableUsers, availableDisciplines, onSubmit, onCancel, isPending }: StudentCreateFormProps) {
  const { t } = useTranslation();
  
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedDisciplines, setSelectedDisciplines] = useState<DisciplineAssignment[]>([]);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', dni: '', phone: '',
    birthDate: '', address: '', city: '', state: '', postalCode: '', country: 'ES',
  });

  const [guardians, setGuardians] = useState([
    { isExistingUser: false, userId: '', firstName: '', lastName: '', email: '', phone: '', dni: '', relationship: 'Padre' }
  ]);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContactPayload[]>([
    { name: '', phone: '', relationship: 'Familiar' }
  ]);

  const isMinor = useMemo(() => {
    if (!formData.birthDate) return false;
    const birth = new Date(formData.birthDate);
    return Math.abs(new Date(Date.now() - birth.getTime()).getUTCFullYear() - 1970) < 18;
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Discard empty templates before dispatch
    const cleanGuardians = guardians.filter(g => g.userId !== '' || (g.firstName.trim() !== '' && g.email.trim() !== ''));
    const cleanEmergency = emergencyContacts.filter(c => c.name.trim() !== '' && c.phone.trim() !== '');

    // Array properties are passed as empty arrays [] instead of null to satisfy NestJS strict array validation
    const payload = {
      isExistingUser,
      userId: isExistingUser && selectedUserId ? selectedUserId : undefined,
      userData: formData,
      isMinor,
      guardians: isMinor ? cleanGuardians : [],
      emergencyContacts: !isMinor ? cleanEmergency : [],
      disciplines: selectedDisciplines,
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
          <UserSelector isExistingUser={isExistingUser} onToggleExisting={(checked) => { setIsExistingUser(checked); setSelectedUserId(''); }} selectedUserId={selectedUserId} onSelectUser={handleUserSelect} availableUsers={availableUsers} />
          
          <DisciplineSection availableDisciplines={availableDisciplines} selectedDisciplines={selectedDisciplines} onChange={setSelectedDisciplines} />
          
          <PersonalDataSection formData={formData} onChange={(field, val) => setFormData(p => ({ ...p, [field]: val }))} isMinor={isMinor} />

          <GuardianSection 
            guardians={guardians}
            onChange={(idx, field, val) => setGuardians(p => { const u = [...p]; u[idx] = { ...u[idx], [field]: val }; return u; })}
            onAdd={() => setGuardians(p => [...p, { isExistingUser: false, userId: '', firstName: '', lastName: '', email: '', phone: '', dni: '', relationship: 'Padre' }])}
            onRemove={(idx) => setGuardians(p => p.filter((_, i) => i !== idx))}
            onToggleExisting={(idx, checked) => setGuardians(p => { const u = [...p]; u[idx] = { ...u[idx], isExistingUser: checked, userId: '' }; return u; })}
            onSelectUser={(idx, id) => {
              const u = availableUsers.find(x => x.id === id);
              setGuardians(p => { const arr = [...p]; arr[idx] = { ...arr[idx], userId: id, firstName: u?.firstName||'', lastName: u?.lastName||'', email: u?.email||'', phone: u?.phone||'', dni: u?.dni||'' }; return arr; });
            }}
            availableUsers={availableUsers}
            isMinor={isMinor} 
          />

          <EmergencyContactSection 
            contacts={emergencyContacts}
            onChange={setEmergencyContacts}
            isMinor={isMinor} 
          />

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={onCancel}>{t('students.cancel')}</Button>
            <Button type="submit" disabled={isPending || (isExistingUser && !selectedUserId)}>
              {isPending ? t('students.saving') : t('students.save')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}