/**
 * @file StudentEditForm.tsx
 * @description Dedicated form component for editing an existing Student.
 * Consumes and sanitizes both heavy guardians and lightweight JSON emergency contacts,
 * guaranteeing strict API compliance without transmitting null values to arrays.
 */

import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { toOptionalGender } from '@/lib/domain-enums';
import { EMPTY_PERSONAL_FORM } from '../components/PersonalDataSection';
import { PersonalDataSection } from '../components/PersonalDataSection';
import { GuardianSection } from '../components/GuardianSection';
import { EmergencyContactSection } from '../components/EmergencyContactSection';
import { BankingDetailsSection } from '../components/BankingDetailsSection';
import { MandateSignatureSection } from '../components/MandateSignatureSection';
import { StudentLifecycleSection } from '../components/StudentLifecycleSection';
import { DisciplineSection, DisciplineAssignment } from '../components/DisciplineSection';
import { parseBankingDetails, type BankingDetails } from '../banking';
import { parseLeaveFields, type LeaveFormValues } from '../lifecycle';
import { StudentProfileResponse, EmergencyContactPayload, UpdateStudentPayload } from '../types';
import { UserCircle } from 'lucide-react';

interface StudentEditFormProps {
  initialData: StudentProfileResponse;
  availableUsers: any[];
  availableDisciplines: any[];
  onSubmit: (data: UpdateStudentPayload) => void;
  onCancel: () => void;
  isPending: boolean;
}

const EMPTY_LEAVE: LeaveFormValues = {
  status: 'ACTIVE',
  leaveReason: '',
  leaveNoticeMethod: '',
  customReasonDetails: '',
};

/**
 * Edits an existing student. SEPA fields are optional; if filled they are posted as a new mandate.
 *
 * @param {StudentEditFormProps} props - Current profile, lookup datasets, and handlers.
 * @returns {JSX.Element} The edit-student form.
 */
export function StudentEditForm({ initialData, availableUsers, availableDisciplines, onSubmit, onCancel, isPending }: StudentEditFormProps) {
  const { t } = useTranslation();

  const [formData, setFormData] = useState(EMPTY_PERSONAL_FORM);
  const [lifecycle, setLifecycle] = useState<LeaveFormValues>(EMPTY_LEAVE);
  const [leaveErrors, setLeaveErrors] = useState<Record<string, string>>({});

  const [selectedDisciplines, setSelectedDisciplines] = useState<DisciplineAssignment[]>([]);
  const [guardians, setGuardians] = useState<any[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContactPayload[]>([]);
  const [banking, setBanking] = useState<BankingDetails>({ accountHolderName: '', accountHolderDni: '', iban: '' });
  const [sepaAccepted, setSepaAccepted] = useState(false);
  const [bankingErrors, setBankingErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const latestLeave = initialData.statusHistory?.[0];
    setFormData({
      firstName: initialData.firstName || initialData.user?.firstName || '',
      lastName: initialData.lastName || initialData.user?.lastName || '',
      email: initialData.user?.email || '',
      dni: initialData.dni || '',
      phone: initialData.phone || '',
      birthDate: initialData.birthDate ? new Date(initialData.birthDate).toISOString().split('T')[0] : '',
      address: initialData.address || '',
      city: initialData.city || '',
      state: initialData.state || '',
      postalCode: initialData.postalCode || '',
      country: initialData.country || 'ES',
      gender: initialData.gender || initialData.user?.gender || '',
    });
    setLifecycle({
      status: initialData.status || 'ACTIVE',
      leaveReason: latestLeave?.leaveReason || '',
      leaveNoticeMethod: latestLeave?.leaveNoticeMethod || '',
      customReasonDetails: latestLeave?.customReasonDetails || '',
    });

    if (initialData.ranks) {
      const mappedRanks = initialData.ranks
        .map((rank: any) => ({
          disciplineId: rank.disciplineId,
          beltRankId: rank.beltRankId,
          currentStripes: rank.currentStripes ?? 0,
        }))
        .filter((d) => d.disciplineId != null);

      const uniqueDisciplines = Array.from(new Map(mappedRanks.map((item) => [item.disciplineId, item])).values());
      setSelectedDisciplines(uniqueDisciplines);
    }

    if (initialData.guardians && (initialData as any).guardians.length > 0) {
      const mappedGuardians = (initialData as any).guardians.map((g: any) => ({
        isExistingUser: false,
        userId: g.guardian?.userId || '',
        firstName: g.guardian?.user?.firstName || '',
        lastName: g.guardian?.user?.lastName || '',
        email: g.guardian?.user?.email || '',
        phone: '',
        dni: '',
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

  /**
   * Validates optional SEPA fields, leave metadata, and dispatches the academic PATCH payload.
   *
   * @param {React.FormEvent} e - Native submit event.
   * @returns {void}
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanGuardians = guardians.filter((g) => g.userId !== '' || (g.firstName.trim() !== '' && g.email.trim() !== ''));
    const cleanEmergency = emergencyContacts.filter((c) => c.name.trim() !== '' && c.phone.trim() !== '');

    const leaveResult = parseLeaveFields(lifecycle);
    if (!leaveResult.data) {
      setLeaveErrors(leaveResult.errors);
      return;
    }
    setLeaveErrors({});

    const bankingResult = parseBankingDetails(banking, false, sepaAccepted);
    if (Object.keys(bankingResult.errors).length > 0) {
      setBankingErrors(bankingResult.errors);
      return;
    }
    setBankingErrors({});

    const payload: UpdateStudentPayload = {
      userData: { ...formData, gender: toOptionalGender(formData.gender) },
      isMinor,
      status: leaveResult.data.status,
      statusReason: leaveResult.data.statusReason,
      leaveReason: leaveResult.data.leaveReason,
      leaveNoticeMethod: leaveResult.data.leaveNoticeMethod,
      customReasonDetails: leaveResult.data.customReasonDetails,
      guardians: isMinor ? cleanGuardians : [],
      emergencyContacts: !isMinor ? cleanEmergency : [],
      disciplines: selectedDisciplines,
      banking: bankingResult.data,
    };

    onSubmit(payload);
  };

  return (
    <Card className="w-full border-border shadow-md">
      <CardHeader className="border-b border-border bg-muted pb-4">
        <div className="flex items-center justify-end">
          <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-sm text-muted-foreground shadow-sm">
            <UserCircle className="h-4 w-4" />
            <span>{t('students.user_id', { id: (initialData.userId || initialData.id).slice(0, 8) })}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          <DisciplineSection
            availableDisciplines={availableDisciplines}
            selectedDisciplines={selectedDisciplines}
            onChange={setSelectedDisciplines}
          />

          <StudentLifecycleSection
            values={lifecycle}
            errors={leaveErrors}
            onChange={(field, value) => setLifecycle((prev) => ({ ...prev, [field]: value }))}
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

          <EmergencyContactSection contacts={emergencyContacts} onChange={setEmergencyContacts} isMinor={isMinor} />

          <BankingDetailsSection
            values={banking}
            sepaAccepted={sepaAccepted}
            errors={bankingErrors}
            required={false}
            onChange={(field, value) => setBanking((prev) => ({ ...prev, [field]: value }))}
            onAcceptChange={setSepaAccepted}
          >
            <MandateSignatureSection
              bankMandateId={initialData.bankMandateId}
              payerUserId={initialData.userId || initialData.user?.id || initialData.guardians?.[0]?.guardian?.user?.id || initialData.guardians?.[0]?.guardian?.userId}
            />
          </BankingDetailsSection>

          <div className="flex justify-end gap-3 border-t border-border pt-6">
            <Button type="button" variant="outline" onClick={onCancel}>
              {t('students.cancel')}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? t('students.saving') : t('students.save')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
