/**
 * @file AttendanceSession.tsx
 * @description Fast check-in grid: present/absent checkbox plus a belt-promotion shortcut when eligible.
 */

import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { LocalizedDate } from '@/components/ui/localized-date';
import { translateApiError } from '@/lib/errors';
import { cn } from '@/lib/utils';
import { ageGroupLabel, type AgeGroupConfig } from '@/pages/students/config/ageGroups';
import { useAgeBrackets } from '@/pages/students/useAgeBrackets';
import { useAgeBracketCatalog } from '@/pages/settings/useAcademySettings';
import { groupRosterByAge, rosterStudentName } from './rosterGroups';
import type { AttendanceRosterStudent, AttendanceStatus } from './types';
import { useAttendanceSession, useGraduateFromAttendance, useSaveAttendanceRecords } from './useAttendances';

/**
 * Whether a mark occupies a seat (present in the room).
 *
 * @param {AttendanceStatus | null} status - Current mark.
 * @returns {boolean} True for PRESENT and LATE.
 */
function occupiesSeat(status: AttendanceStatus | null): boolean {
  return status === 'PRESENT' || status === 'LATE';
}

/**
 * Session check-in workspace.
 *
 * @returns {JSX.Element} Roster grid.
 */
export default function AttendanceSessionPage() {
  const { t } = useTranslation();
  const { sessionId } = useParams<{ sessionId: string }>();
  const { ageGroups } = useAgeBrackets();
  const bracketsQuery = useAgeBracketCatalog();
  const [selectedCodes, setSelectedCodes] = useState<string[] | null>(null);
  const sessionQuery = useAttendanceSession(sessionId, selectedCodes ?? undefined);
  const saveRecords = useSaveAttendanceRecords();
  const graduate = useGraduateFromAttendance();
  const [marks, setMarks] = useState<Record<string, AttendanceStatus>>({});

  useEffect(() => {
    const roster = sessionQuery.data?.students;
    if (!roster) return;
    const next: Record<string, AttendanceStatus> = {};
    for (const student of roster) {
      next[student.studentProfileId] = occupiesSeat(student.attendanceStatus) ? 'PRESENT' : 'ABSENT';
    }
    setMarks(next);
  }, [sessionQuery.data]);

  const slotCodes = useMemo(() => {
    const ids = sessionQuery.data?.ageBracketIds ?? [];
    if (ids.length === 0) return [];
    return (bracketsQuery.data ?? [])
      .filter((row) => ids.includes(row.id))
      .map((row) => row.code);
  }, [sessionQuery.data?.ageBracketIds, bracketsQuery.data]);

  useEffect(() => {
    if (selectedCodes !== null) return;
    if (!sessionQuery.data) return;
    if (slotCodes.length > 0) {
      setSelectedCodes(slotCodes);
    }
  }, [selectedCodes, sessionQuery.data, slotCodes]);

  const groups = useMemo(
    () => groupRosterByAge(sessionQuery.data?.students ?? [], ageGroups),
    [sessionQuery.data?.students, ageGroups],
  );

  const presentCount = useMemo(
    () => Object.values(marks).filter((status) => occupiesSeat(status)).length,
    [marks],
  );

  const capacity = sessionQuery.data?.maxCapacity ?? null;
  const atCapacity = capacity !== null && presentCount >= capacity;

  /**
   * Toggles the present checkbox (PRESENT vs ABSENT).
   *
   * @param {AttendanceRosterStudent} student - Row.
   * @param {boolean} checked - Checkbox state.
   * @returns {void}
   */
  const onTogglePresent = (student: AttendanceRosterStudent, checked: boolean) => {
    if (checked && atCapacity && !occupiesSeat(marks[student.studentProfileId] ?? null)) {
      return;
    }
    setMarks((current) => ({ ...current, [student.studentProfileId]: checked ? 'PRESENT' : 'ABSENT' }));
  };

  /**
   * Persists every visible roster mark in one request.
   *
   * @returns {void}
   */
  const onSave = () => {
    if (!sessionId || !sessionQuery.data) return;
    saveRecords.mutate({
      sessionId,
      payload: {
        records: sessionQuery.data.students.map((student) => ({
          studentProfileId: student.studentProfileId,
          status: marks[student.studentProfileId] ?? 'ABSENT',
        })),
      },
    });
  };

  /**
   * Proposes or executes a belt promotion for an eligible student.
   *
   * @param {AttendanceRosterStudent} student - Roster row.
   * @returns {void}
   */
  const onGraduate = (student: AttendanceRosterStudent) => {
    if (!window.confirm(t('attendance.graduate_confirm', { name: rosterStudentName(student) }))) {
      return;
    }
    graduate.mutate(student.studentProfileId);
  };

  /**
   * Toggles one age-bracket code in the multi-select filter.
   *
   * @param {string} code - Age group id.
   * @param {boolean} checked - Next state.
   * @returns {void}
   */
  const onToggleBracket = (code: string, checked: boolean) => {
    setSelectedCodes((current) => {
      const base = current ?? slotCodes;
      return checked ? [...new Set([...base, code])] : base.filter((item) => item !== code);
    });
  };

  const actionError = sessionQuery.error ?? saveRecords.error ?? graduate.error;
  const disciplineLabel =
    sessionQuery.data?.discipline?.acronym?.trim() ||
    sessionQuery.data?.discipline?.name ||
    sessionQuery.data?.disciplineId;
  const filterGroups: AgeGroupConfig[] = ageGroups;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4 rounded-lg border border-border bg-card p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('attendance.checkin_title')}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {disciplineLabel ? `${disciplineLabel} · ` : ''}
            <LocalizedDate value={sessionQuery.data?.date} />
            {sessionQuery.data?.startTime && sessionQuery.data?.endTime
              ? ` · ${sessionQuery.data.startTime}–${sessionQuery.data.endTime}`
              : ''}
            {capacity !== null
              ? ` · ${t('attendance.present_of_capacity', { present: presentCount, capacity })}`
              : ` · ${t('attendance.present_count', { count: presentCount })}`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link to="/attendances">{t('attendance.back_to_sessions')}</Link>
          </Button>
          <Button type="button" disabled={!sessionQuery.data || saveRecords.isPending} onClick={onSave}>
            {saveRecords.isPending ? t('attendance.saving') : t('attendance.save')}
          </Button>
        </div>
      </div>

      {actionError ? (
        <p className="text-sm text-destructive" role="alert">
          {translateApiError(t, actionError, 'attendance.save_error')}
        </p>
      ) : null}

      {saveRecords.isSuccess ? (
        <p className="text-sm text-muted-foreground">{t('attendance.saved')}</p>
      ) : null}
      {graduate.isSuccess ? (
        <p className="text-sm text-muted-foreground">{t('attendance.graduated')}</p>
      ) : null}

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-foreground">{t('attendance.filter_age_bracket')}</legend>
        <div className="flex flex-wrap gap-3">
          {filterGroups.map((group) => {
            const codes = selectedCodes ?? slotCodes;
            const checked = codes.length === 0 || codes.includes(group.id);
            return (
              <label key={group.id} className="flex items-center gap-2 text-sm text-foreground">
                <Checkbox
                  checked={checked}
                  onChange={(event) => onToggleBracket(group.id, event.target.checked)}
                />
                {ageGroupLabel(group, t)}
              </label>
            );
          })}
        </div>
      </fieldset>

      {sessionQuery.isLoading ? (
        <p className="text-sm text-muted-foreground">{t('attendance.loading_roster')}</p>
      ) : groups.length === 0 ? (
        <p className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
          {t('attendance.roster_empty')}
        </p>
      ) : (
        groups.map((group) => (
          <section key={group.id} className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {group.labelKey ? t(group.labelKey) : group.name} · {group.students.length}
            </h2>
            <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {group.students.map((student) => {
                const status = marks[student.studentProfileId] ?? 'ABSENT';
                const present = occupiesSeat(status);
                const disableCheck = !present && atCapacity;
                return (
                  <li
                    key={student.studentProfileId}
                    className={cn(
                      'flex items-center gap-4 rounded-lg border border-border bg-card p-4 shadow-sm',
                      present && 'border-primary bg-primary/5',
                    )}
                  >
                    <Checkbox
                      className="h-7 w-7"
                      checked={present}
                      disabled={disableCheck}
                      aria-label={t('attendance.mark_present', { name: rosterStudentName(student) })}
                      onChange={(event) => onTogglePresent(student, event.target.checked)}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-semibold text-foreground">
                        {rosterStudentName(student)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {student.age !== null
                          ? t('attendance.age_years', { count: student.age })
                          : t('attendance.age_unknown')}
                        {student.currentBelt ? ` · ${student.currentBelt}` : ''}
                      </p>
                    </div>
                    {student.graduationEligible ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        disabled={graduate.isPending}
                        onClick={() => onGraduate(student)}
                      >
                        {t('attendance.graduate_action')}
                      </Button>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
