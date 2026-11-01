/**
 * @file Students.tsx
 * @description Student directory list. Create/edit live on dedicated sub-routes.
 */

import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useStudents } from './useStudents';
import { StudentFilters } from './components/StudentFilters';
import { StudentTable } from './components/StudentTable';
import { TrialStudentModal } from './components/TrialStudentModal';
import { SepaSignModal } from './components/SepaSignModal';
import { Button } from '@/components/ui/button';
import { useFinancialConfig } from '@/pages/financial/useFinancialConfig';
import { useStudentMandate } from './useStudentMandate';
import {
  collectDisciplineOptions,
  DEFAULT_STATUS_FILTER,
  filterAndSortStudents,
  isDefaultStudentFilters,
} from './listFilters';
import {
  BankMandate,
  CreateTrialStudentPayload,
  StudentProfileResponse,
  StudentsListLocationState,
} from './types';

/**
 * Students administration list: filter, trial capture, delete, and links to form routes.
 *
 * @returns {JSX.Element} The students directory.
 */
export default function Students() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    students, availableDisciplines,
    isLoading, error, createTrialStudent, deleteStudent,
  } = useStudents();
  const { config } = useFinancialConfig();
  const { signMandate } = useStudentMandate({});

  const [isTrialOpen, setIsTrialOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgeGroups, setSelectedAgeGroups] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([...DEFAULT_STATUS_FILTER]);
  const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>([]);
  const [mandateWarning, setMandateWarning] = useState(false);
  const [pendingSignMandate, setPendingSignMandate] = useState<BankMandate | null>(null);
  const [signSuccess, setSignSuccess] = useState(false);

  useEffect(() => {
    const flash = location.state as StudentsListLocationState | null;
    if (!flash) return;
    if (flash.mandateFailed) setMandateWarning(true);
    if (flash.mandate) setPendingSignMandate(flash.mandate);
    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  const disciplineOptions = useMemo(
    () => collectDisciplineOptions(students, availableDisciplines as Array<{ name?: string }>),
    [students, availableDisciplines],
  );

  const visibleStudents = useMemo(
    () =>
      filterAndSortStudents(students, {
        searchTerm,
        selectedAgeGroups,
        selectedStatuses,
        selectedDisciplines,
      }),
    [students, searchTerm, selectedAgeGroups, selectedStatuses, selectedDisciplines],
  );

  const filtersAreDefault = isDefaultStudentFilters({
    searchTerm,
    selectedAgeGroups,
    selectedStatuses,
    selectedDisciplines,
  });

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedAgeGroups([]);
    setSelectedStatuses([...DEFAULT_STATUS_FILTER]);
    setSelectedDisciplines([]);
  };

  const handleEdit = (student: StudentProfileResponse) => {
    navigate(`/students/${student.id}/edit`);
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t('common.confirm_delete'))) {
      deleteStudent.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-6 rounded-lg shadow-sm border border-border">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('students.title')}</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsTrialOpen(true)}>
            {t('students.new_trial')}
          </Button>
          <Button
            onClick={() => navigate('/students/new')}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {t('students.new_student')}
          </Button>
        </div>
      </div>

      {signSuccess && (
        <div
          role="status"
          className="flex items-start justify-between gap-4 bg-primary text-primary-foreground border border-border rounded-lg p-4 shadow-sm"
        >
          <p className="text-sm font-medium">{t('students.sepa.sign_success')}</p>
          <Button
            type="button"
            variant="outline"
            className="shrink-0 bg-card text-foreground border-border hover:bg-muted"
            onClick={() => setSignSuccess(false)}
          >
            {t('common.dismiss')}
          </Button>
        </div>
      )}

      {mandateWarning && (
        <div
          role="status"
          className="flex items-start justify-between gap-4 bg-warning text-warning-foreground border border-border rounded-lg p-4 shadow-sm"
        >
          <p className="text-sm font-medium">{t('students.mandate_attach_failed')}</p>
          <Button
            type="button"
            variant="outline"
            className="shrink-0 bg-card text-foreground border-border hover:bg-muted"
            onClick={() => setMandateWarning(false)}
          >
            {t('common.dismiss')}
          </Button>
        </div>
      )}

      <StudentFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedAgeGroups={selectedAgeGroups}
        onAgeGroupsChange={setSelectedAgeGroups}
        selectedStatuses={selectedStatuses}
        onStatusesChange={setSelectedStatuses}
        selectedDisciplines={selectedDisciplines}
        onDisciplinesChange={setSelectedDisciplines}
        disciplineOptions={disciplineOptions}
        showClear={!filtersAreDefault}
        onClearFilters={handleClearFilters}
      />

      <StudentTable
        students={visibleStudents}
        isLoading={isLoading}
        error={error}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <TrialStudentModal
        isOpen={isTrialOpen}
        disciplines={availableDisciplines as { id: string; name: string }[]}
        isPending={createTrialStudent.isPending}
        error={createTrialStudent.error}
        onClose={() => {
          setIsTrialOpen(false);
          createTrialStudent.reset();
        }}
        onSubmit={(payload: CreateTrialStudentPayload) => {
          createTrialStudent.mutate(payload, { onSuccess: () => setIsTrialOpen(false) });
        }}
      />

      <SepaSignModal
        isOpen={Boolean(pendingSignMandate)}
        mandate={pendingSignMandate}
        legalName={config?.legalName ?? ''}
        creditorId={config?.creditorId ?? ''}
        isPending={signMandate.isPending}
        error={signMandate.error}
        onClose={() => {
          setPendingSignMandate(null);
          signMandate.reset();
        }}
        onConfirm={(mandateId) => {
          signMandate.mutate(mandateId, {
            onSuccess: () => {
              setPendingSignMandate(null);
              setSignSuccess(true);
            },
          });
        }}
      />
    </div>
  );
}
