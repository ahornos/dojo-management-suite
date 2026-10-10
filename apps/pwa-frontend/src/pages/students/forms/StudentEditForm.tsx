/**
 * @file StudentEditForm.tsx
 * @description Dedicated form component for editing an existing Student.
 * Consumes and sanitizes both heavy guardians and lightweight JSON emergency contacts,
 * guaranteeing strict API compliance without transmitting null values to arrays.
 */

import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PersonalDataSection } from '../components/PersonalDataSection';
import { GuardianSection } from '../components/GuardianSection';
import { EmergencyContactSection } from '../components/EmergencyContactSection';
import { DisciplineSection, DisciplineAssignment } from '../components/DisciplineSection';
import { StudentProfileResponse, EmergencyContactPayload } from '../types';
import { UserCircle } from 'lucide-react';

interface StudentEditFormProps {
  initialData: StudentProfileResponse;
  availableUsers: any[];
  availableDisciplines: any[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isPending: boolean;
}

export function StudentEditForm({ initialData, availableUsers, availableDisciplines, onSubmit, onCancel, isPending }: StudentEditFormProps) {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', dni: '', phone: '',
    birthDate: '', address: '', city: '', state: '', postalCode: '', country: 'ES',
  });

  const [selectedDisciplines, setSelectedDisciplines] = useState<DisciplineAssignment[]>([]);
  const [guardians, setGuardians] = useState<any[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContactPayload[]>([]);

  useEffect(() => {
    setFormData({
      firstName: initialData.user?.firstName || '',
      lastName: initialData.user?.lastName || '',
      email: initialData.user?.email || '',
      dni: initialData.user?.dni || '',
      phone: initialData.user?.phone || initialData.phone || '', 
      birthDate: initialData.user?.birthDate || initialData.birthDate 
        ? new Date(initialData.user?.birthDate || initialData.birthDate || '').toISOString().split('T')[0] 
        : '',
      address: initialData.user?.address || initialData.address || '',
      city: initialData.user?.city || initialData.city || '',
      state: initialData.user?.state || initialData.state || '',
      postalCode: initialData.user?.postalCode || initialData.postalCode || '',
      country: initialData.user?.country || initialData.country || 'ES',
    });

    if (initialData.ranks) {
      const mappedRanks = initialData.ranks.map((rank: any) => ({
        disciplineId: rank.disciplineId,
        beltRankId: rank.beltRankId,
        currentStripes: rank.currentStripes ?? 0,
      })).filter(d => d.disciplineId != null);
      
      const uniqueDisciplines = Array.from(new Map(mappedRanks.map(item => [item.disciplineId, item])).values());
      setSelectedDisciplines(uniqueDisciplines);
    }

    if (initialData.guardians && (initialData as any).guardians.length > 0) {
      const mappedGuardians = (initialData as any).guardians.map((g: any) => ({
        isExistingUser: false, 
        userId: g.guardian?.userId || '',
        firstName: g.guardian?.user?.firstName || '',
        lastName: g.guardian?.user?.lastName || '',
        email: g.guardian?.user?.email || '',
        phone: g.guardian?.user?.phone || '',
        dni: g.guardian?.user?.dni || '',
        relationship: g.relationship || 'Padre', 
      }));
      setGuardians(mappedGuardians);
    } else {
      setGuardians([{ isExistingUser: false, userId: '', firstName: '', lastName: '', email: '', phone: '', dni: '', relationship: 'Padre' }]);
    }

    if (initialData.emergencyContacts && initialData.emergencyContacts.length > 0) {
      setEmergencyContacts(initialData.emergencyContacts);
    } else {
      setEmergencyContacts([{ name: '', phone: '', relationship: 'Familiar' }]);
    }
  }, [initialData]);

  const isMinor = useMemo(() => {
    if (!formData.birthDate) return false;
    const birth = new Date(formData.birthDate);
    return Math.abs(new Date(Date.now() - birth.getTime()).getUTCFullYear() - 1970) < 18;
  }, [formData.birthDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Discard empty templates before dispatch
    const cleanGuardians = guardians.filter(g => g.userId !== '' || (g.firstName.trim() !== '' && g.email.trim() !== ''));
    const cleanEmergency = emergencyContacts.filter(c => c.name.trim() !== '' && c.phone.trim() !== '');

    // Arrays map cleanly to [] to satisfy backend @IsArray requirements
    const payload = {
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
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-gray-800">{t('users.edit_modal_title')}</CardTitle>
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-3 py-1 rounded-full border shadow-sm">
            <UserCircle className="w-4 h-4" />
            <span>ID: <span className="font-mono text-gray-900">{initialData.userId.slice(0, 8)}...</span></span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          
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
            <Button type="submit" disabled={isPending}>
              {isPending ? t('students.saving') : t('students.save')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}