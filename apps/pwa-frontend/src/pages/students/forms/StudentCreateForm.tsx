/**
 * @file StudentCreateForm.tsx
 * @description Dedicated form component for registering a new Student.
 * Sanitizes emergency contacts payload and maps relationships properly before dispatching API requests.
 */

import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toOptionalGender } from '@/lib/domain-enums';
import { UserSelector } from '../components/UserSelector';
import { EMPTY_PERSONAL_FORM, PersonalDataSection } from '../components/PersonalDataSection';
import { GuardianSection } from '../components/GuardianSection';
import { EmergencyContactSection } from '../components/EmergencyContactSection';
import { BankingDetailsSection } from '../components/BankingDetailsSection';
import { DisciplineSection, DisciplineAssignment } from '../components/DisciplineSection';
import { parseBankingDetails, type BankingDetails } from '../banking';
import { CreateStudentPayload, EmergencyContactPayload } from '../types';

interface StudentCreateFormProps {
  availableUsers: any[];
  availableDisciplines: any[];
  onSubmit: (data: CreateStudentPayload) => void;
  onCancel: () => void;
  isPending: boolean;
}

/**
 * Registers an ACTIVE student. Banking details are required and posted to financial-service after create.
 *
 * @param {StudentCreateFormProps} props - Lookup datasets, submit/cancel handlers, and pending flag.
 * @returns {JSX.Element} The create-student form.
 */
export function StudentCreateForm({ availableUsers, availableDisciplines, onSubmit, onCancel, isPending }: StudentCreateFormProps) {
  const { t } = useTranslation();

  const [isExistingUser, setIsExistingUser] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedDisciplines, setSelectedDisciplines] = useState<DisciplineAssignment[]>([]);

  const [formData, setFormData] = useState(EMPTY_PERSONAL_FORM);

  const [guardians, setGuardians] = useState([
    { isExistingUser: false, userId: '', firstName: '', lastName: '', email: '', phone: '', dni: '', relationship: 'Padre' },
  ]);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContactPayload[]>([
    { name: '', phone: '', relationship: 'Familiar' },
  ]);
  const [banking, setBanking] = useState<BankingDetails>({ accountHolderName: '', accountHolderDni: '', iban: '' });
  const [sepaAccepted, setSepaAccepted] = useState(false);
  const [bankingErrors, setBankingErrors] = useState<Record<string, string>>({});
  const [guardianError, setGuardianError] = useState('');

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
        ...EMPTY_PERSONAL_FORM,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        gender: user.gender || '',
      });
    } else {
      setFormData(EMPTY_PERSONAL_FORM);
    }
  };

  /**
   * Validates SEPA fields (required for ACTIVE) and dispatches the academic + banking payload.
   *
   * @param {React.FormEvent} e - Native submit event.
   * @returns {void}
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanGuardians = guardians.filter((g) => g.userId !== '' || (g.firstName.trim() !== '' && g.email.trim() !== ''));
    const cleanEmergency = emergencyContacts.filter((c) => c.name.trim() !== '' && c.phone.trim() !== '');

    if (isMinor && cleanGuardians.length === 0) {
      setGuardianError(t('students.form.guardian_required_submit'));
      return;
    }
    setGuardianError('');

    const bankingResult = parseBankingDetails(banking, true, sepaAccepted);
    if (!bankingResult.data) {
      setBankingErrors(bankingResult.errors);
      return;
    }
    setBankingErrors({});

    const payload: CreateStudentPayload = {
      isExistingUser,
      userId: isExistingUser && selectedUserId ? selectedUserId : undefined,
      status: 'ACTIVE',
      userData: { ...formData, gender: toOptionalGender(formData.gender) },
      isMinor,
      guardians: isMinor ? cleanGuardians : [],
      emergencyContacts: !isMinor ? cleanEmergency : [],
      disciplines: selectedDisciplines,
      banking: bankingResult.data,
    };

    onSubmit(payload);
  };

  return (
    <Card className="w-full border-border shadow-md">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          {!isMinor ? (
            <UserSelector
              isExistingUser={isExistingUser}
              onToggleExisting={(checked) => {
                setIsExistingUser(checked);
                setSelectedUserId('');
              }}
              selectedUserId={selectedUserId}
              onSelectUser={handleUserSelect}
              availableUsers={availableUsers}
            />
          ) : null}

          <DisciplineSection
            availableDisciplines={availableDisciplines}
            selectedDisciplines={selectedDisciplines}
            onChange={setSelectedDisciplines}
          />

          <PersonalDataSection
            formData={formData}
            onChange={(field, val) => setFormData((p) => ({ ...p, [field]: val }))}
            isMinor={isMinor}
          />

          <GuardianSection
            guardians={guardians}
            onChange={(idx, field, val) =>
              setGuardians((p) => {
                const u = [...p];
                u[idx] = { ...u[idx], [field]: val };
                return u;
              })
            }
            onAdd={() =>
              setGuardians((p) => [
                ...p,
                { isExistingUser: false, userId: '', firstName: '', lastName: '', email: '', phone: '', dni: '', relationship: 'Padre' },
              ])
            }
            onRemove={(idx) => setGuardians((p) => p.filter((_, i) => i !== idx))}
            onToggleExisting={(idx, checked) =>
              setGuardians((p) => {
                const u = [...p];
                u[idx] = { ...u[idx], isExistingUser: checked, userId: '' };
                return u;
              })
            }
            onSelectUser={(idx, id) => {
              const u = availableUsers.find((x) => x.id === id);
              setGuardians((p) => {
                const arr = [...p];
                arr[idx] = {
                  ...arr[idx],
                  userId: id,
                  firstName: u?.firstName || '',
                  lastName: u?.lastName || '',
                  email: u?.email || '',
                  phone: '',
                  dni: '',
                };
                return arr;
              });
            }}
            availableUsers={availableUsers}
            isMinor={isMinor}
          />
          {guardianError ? <p className="text-sm text-destructive">{guardianError}</p> : null}

          <EmergencyContactSection contacts={emergencyContacts} onChange={setEmergencyContacts} isMinor={isMinor} />

          <BankingDetailsSection
            values={banking}
            sepaAccepted={sepaAccepted}
            errors={bankingErrors}
            required
            onChange={(field, value) => setBanking((prev) => ({ ...prev, [field]: value }))}
            onAcceptChange={setSepaAccepted}
          />

          <div className="flex justify-end gap-3 border-t border-border pt-6">
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
