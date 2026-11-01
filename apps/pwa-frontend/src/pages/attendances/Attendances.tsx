/**
 * @file Attendances.tsx
 * @description Today's generated sessions, historical date picker, and exceptional-session opener.
 */

import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FormGrid, FormSection } from '@/components/forms/FormSection';
import { Button } from '@/components/ui/button';
import { DateInput } from '@/components/ui/date-input';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LocalizedDate } from '@/components/ui/localized-date';
import { Select } from '@/components/ui/select';
import { translateApiError } from '@/lib/errors';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';
import { useDisciplines } from '@/pages/disciplines/useDisciplines';
import { ageGroupLabel } from '@/pages/students/config/ageGroups';
import { useAgeBrackets } from '@/pages/students/useAgeBrackets';
import { useAgeBracketCatalog } from '@/pages/settings/useAcademySettings';
import { useAttendanceSessions, useCreateAttendanceSession } from './useAttendances';

type AttendanceTab = 'today' | 'history';

/**
 * Today's calendar date as `YYYY-MM-DD` in the local timezone.
 *
 * @returns {string} ISO date.
 */
function todayIsoDate(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

/**
 * Instructor display name.
 *
 * @param {{ firstName: string; lastName: string }} instructor - Directory identity.
 * @returns {string} `lastName, firstName`.
 */
function instructorName(instructor: { firstName: string; lastName: string }): string {
  return [instructor.lastName.trim(), instructor.firstName.trim()].filter(Boolean).join(', ');
}

/**
 * Hub: today's generated sessions, past-date review, and ad-hoc session creation.
 *
 * @returns {JSX.Element} Attendance workspace.
 */
export default function Attendances() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const { disciplines } = useDisciplines();
  const { ageGroups } = useAgeBrackets();
  const bracketsQuery = useAgeBracketCatalog();
  const createSession = useCreateAttendanceSession();

  const [tab, setTab] = useState<AttendanceTab>('today');
  const [historyDate, setHistoryDate] = useState(todayIsoDate());
  const [showExceptional, setShowExceptional] = useState(false);
  const [disciplineId, setDisciplineId] = useState('');
  const [capacity, setCapacity] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [ageBracketIds, setAgeBracketIds] = useState<string[]>([]);

  const date = tab === 'today' ? todayIsoDate() : historyDate;
  const sessionsQuery = useAttendanceSessions(date);
  const catalog = useMemo(
    () => (disciplines as Array<{ id: string; name: string; acronym?: string | null }> | undefined) ?? [],
    [disciplines],
  );

  /**
   * Creates an ad-hoc session and opens the check-in grid.
   *
   * @returns {void}
   */
  const onOpenExceptional = () => {
    if (!disciplineId || !date || !user?.id) return;
    const parsedCapacity = Number.parseInt(capacity, 10);
    createSession.mutate(
      {
        disciplineId,
        date,
        instructorUserId: user.id,
        isExceptional: true,
        ...(startTime ? { startTime } : {}),
        ...(endTime ? { endTime } : {}),
        ...(Number.isFinite(parsedCapacity) && parsedCapacity > 0 ? { maxCapacity: parsedCapacity } : {}),
        ...(ageBracketIds.length > 0 ? { ageBracketIds } : {}),
      },
      {
        onSuccess: (session) => {
          navigate(`/attendances/${session.id}`);
        },
      },
    );
  };

  const actionError = sessionsQuery.error ?? createSession.error;
  const sessions = sessionsQuery.data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4 rounded-lg border border-border bg-card p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('attendance.title')}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t('attendance.subtitle')}</p>
        </div>
        <Button type="button" variant="outline" onClick={() => setShowExceptional((open) => !open)}>
          {t('attendance.open_exceptional')}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label={t('attendance.title')}>
        <Button
          type="button"
          role="tab"
          aria-selected={tab === 'today'}
          variant={tab === 'today' ? 'default' : 'outline'}
          onClick={() => setTab('today')}
        >
          {t('attendance.tab_today')}
        </Button>
        <Button
          type="button"
          role="tab"
          aria-selected={tab === 'history'}
          variant={tab === 'history' ? 'default' : 'outline'}
          onClick={() => setTab('history')}
        >
          {t('attendance.tab_history')}
        </Button>
      </div>

      {tab === 'history' ? (
        <div className="max-w-xs space-y-2">
          <Label htmlFor="attendance-history-date">{t('attendance.filter_date')}</Label>
          <DateInput
            id="attendance-history-date"
            value={historyDate}
            onChange={(event) => setHistoryDate(event.target.value)}
          />
        </div>
      ) : null}

      {actionError ? (
        <p className="text-sm text-destructive" role="alert">
          {translateApiError(t, actionError, 'attendance.load_error')}
        </p>
      ) : null}

      {showExceptional ? (
        <FormSection title={t('attendance.exceptional_title')} description={t('attendance.exceptional_help')}>
          <FormGrid>
            <div className="space-y-2">
              <Label htmlFor="attendance-discipline">{t('attendance.filter_discipline')}</Label>
              <Select
                id="attendance-discipline"
                value={disciplineId}
                onChange={(event) => setDisciplineId(event.target.value)}
              >
                <option value="">{t('attendance.filter_discipline_placeholder')}</option>
                {catalog.map((discipline) => (
                  <option key={discipline.id} value={discipline.id}>
                    {discipline.acronym?.trim() || discipline.name}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="attendance-start">{t('attendance.start_time')}</Label>
              <Input id="attendance-start" type="time" value={startTime} onChange={(event) => setStartTime(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="attendance-end">{t('attendance.end_time')}</Label>
              <Input id="attendance-end" type="time" value={endTime} onChange={(event) => setEndTime(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="attendance-capacity">{t('attendance.capacity')}</Label>
              <Input
                id="attendance-capacity"
                type="number"
                min={1}
                value={capacity}
                onChange={(event) => setCapacity(event.target.value)}
                placeholder={t('attendance.capacity_optional')}
              />
            </div>
          </FormGrid>
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium text-foreground">{t('attendance.filter_age_bracket')}</legend>
            <div className="flex flex-wrap gap-3">
              {(bracketsQuery.data ?? []).map((bracket) => (
                <label key={bracket.id} className="flex items-center gap-2 text-sm text-foreground">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-primary"
                    checked={ageBracketIds.includes(bracket.id)}
                    onChange={(event) => {
                      setAgeBracketIds((current) =>
                        event.target.checked ? [...current, bracket.id] : current.filter((id) => id !== bracket.id),
                      );
                    }}
                  />
                  {bracket.name}
                </label>
              ))}
            </div>
          </fieldset>
          <Button type="button" disabled={!disciplineId || !date || createSession.isPending} onClick={onOpenExceptional}>
            {createSession.isPending ? t('attendance.opening') : t('attendance.open_exceptional')}
          </Button>
        </FormSection>
      ) : null}

      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        {sessionsQuery.isLoading ? (
          <p className="p-6 text-sm text-muted-foreground">{t('attendance.loading_sessions')}</p>
        ) : sessions.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">
            {tab === 'today' ? t('attendance.sessions_empty_today') : t('attendance.sessions_empty')}
          </p>
        ) : (
          <table className="w-full min-w-[44rem] text-left text-sm">
            <thead className="border-b border-border bg-muted text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">{t('attendance.table_time')}</th>
                <th className="px-4 py-3 font-medium">{t('attendance.table_discipline')}</th>
                <th className="px-4 py-3 font-medium">{t('attendance.table_instructor')}</th>
                <th className="px-4 py-3 font-medium">{t('attendance.table_ages')}</th>
                <th className="px-4 py-3 font-medium">{t('attendance.table_present')}</th>
                <th className="px-4 py-3 font-medium">{t('attendance.table_actions')}</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => {
                const ageLabels = (session.ageBracketIds ?? [])
                  .map((id) => {
                    const fromApi = (bracketsQuery.data ?? []).find((row) => row.id === id);
                    if (fromApi) return fromApi.name;
                    const fromGroup = ageGroups.find((row) => row.id === id);
                    return fromGroup ? ageGroupLabel(fromGroup, t) : null;
                  })
                  .filter(Boolean)
                  .join(', ');
                return (
                  <tr key={session.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 text-foreground">
                      <div className="flex flex-col">
                        <LocalizedDate value={session.date} />
                        <span className="text-xs text-muted-foreground">
                          {session.startTime && session.endTime
                            ? `${session.startTime}–${session.endTime}`
                            : t('attendance.time_unset')}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {session.discipline?.acronym?.trim() || session.discipline?.name || session.disciplineId}
                      {session.isExceptional ? (
                        <span className={cn('ml-2 rounded-md border border-border px-1.5 py-0.5 text-[11px] text-muted-foreground')}>
                          {t('attendance.exceptional_badge')}
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {instructorName(session.instructor) || t('attendance.instructor_unknown')}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{ageLabels || t('attendance.filter_age_all')}</td>
                    <td className="px-4 py-3 text-foreground">
                      {session.maxCapacity
                        ? t('attendance.present_of_capacity', {
                            present: session.presentCount,
                            capacity: session.maxCapacity,
                          })
                        : session.presentCount}
                    </td>
                    <td className="px-4 py-3">
                      <Button asChild size="sm">
                        <Link to={`/attendances/${session.id}`}>{t('attendance.open_checkin')}</Link>
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
