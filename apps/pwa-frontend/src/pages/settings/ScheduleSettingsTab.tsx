/**
 * @file ScheduleSettingsTab.tsx
 * @description Seasonal master schedule grouped Monday–Sunday with full slot CRUD.
 */

import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Pencil, Plus, Trash2 } from 'lucide-react';
import { FormGrid, FormSection } from '@/components/forms/FormSection';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useDisciplines } from '@/pages/disciplines/useDisciplines';
import { useUsers } from '@/pages/users/useUsers';
import { SettingsFeedback } from './SettingsFeedback';
import type { AgeBracket, ScheduleSlot, ScheduleSlotPayload, StaffUser } from './types';
import { useAgeBracketCatalog, useScheduleSlotMutations, useScheduleSlots } from './useAcademySettings';

const STAFF_ROLES = new Set(['SUPER_ADMIN', 'ADMIN_STAFF', 'SPORTS_TECHNICAL_DIRECTOR', 'INSTRUCTOR']);
const WEEKDAYS = [1, 2, 3, 4, 5, 6, 7] as const;

interface SlotDraft {
  weekday: string;
  startTime: string;
  endTime: string;
  disciplineId: string;
  instructorUserId: string;
  capacity: string;
  label: string;
  ageBracketIds: string[];
}

const EMPTY_DRAFT: SlotDraft = {
  weekday: '1',
  startTime: '18:00',
  endTime: '19:30',
  disciplineId: '',
  instructorUserId: '',
  capacity: '',
  label: '',
  ageBracketIds: [],
};

/**
 * Staff display name.
 *
 * @param {StaffUser} user - Directory identity.
 * @returns {string} `lastName, firstName`.
 */
function staffName(user: StaffUser): string {
  return [user.lastName?.trim(), user.firstName?.trim()].filter(Boolean).join(', ') || user.email;
}

/**
 * Builds the API payload from the slot editor draft.
 *
 * @param {SlotDraft} draft - Form state.
 * @returns {ScheduleSlotPayload} Persistable slot.
 */
function toPayload(draft: SlotDraft): ScheduleSlotPayload {
  const parsedCapacity = Number.parseInt(draft.capacity, 10);
  return {
    weekday: Number.parseInt(draft.weekday, 10),
    startTime: draft.startTime,
    endTime: draft.endTime,
    disciplineId: draft.disciplineId,
    instructorUserId: draft.instructorUserId,
    ...(Number.isFinite(parsedCapacity) && parsedCapacity > 0 ? { maxCapacity: parsedCapacity } : {}),
    ageBracketIds: draft.ageBracketIds,
    ...(draft.label.trim() ? { label: draft.label.trim() } : { label: '' }),
  };
}

/**
 * Weekly master calendar grouped by weekday.
 *
 * @returns {JSX.Element} Schedule tab.
 */
export function ScheduleSettingsTab(): JSX.Element {
  const { t } = useTranslation();
  const slotsQuery = useScheduleSlots();
  const bracketsQuery = useAgeBracketCatalog();
  const { disciplines } = useDisciplines();
  const { users } = useUsers();
  const mutations = useScheduleSlotMutations();
  const [draft, setDraft] = useState<SlotDraft>(EMPTY_DRAFT);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [openDays, setOpenDays] = useState<Record<number, boolean>>({
    1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true,
  });

  const catalog = useMemo(
    () => (disciplines as Array<{ id: string; name: string; acronym?: string | null }>) ?? [],
    [disciplines],
  );
  const instructors = useMemo(
    () => ((users as StaffUser[]) ?? []).filter((user) => (user.roles ?? []).some((role) => STAFF_ROLES.has(role))),
    [users],
  );
  const slots = slotsQuery.data ?? [];
  const brackets = bracketsQuery.data ?? [];

  /**
   * Creates or updates the current draft slot.
   *
   * @returns {void}
   */
  const onSave = () => {
    if (!draft.disciplineId || !draft.instructorUserId) return;
    const payload = toPayload(draft);
    if (editingId) {
      mutations.update.mutate(
        { id: editingId, ...payload },
        { onSuccess: () => { setDraft(EMPTY_DRAFT); setEditingId(null); } },
      );
      return;
    }
    mutations.create.mutate(payload, { onSuccess: () => setDraft(EMPTY_DRAFT) });
  };

  /**
   * Loads a slot into the editor.
   *
   * @param {ScheduleSlot} slot - Existing weekly slot.
   * @returns {void}
   */
  const onEdit = (slot: ScheduleSlot) => {
    setEditingId(slot.id);
    setDraft({
      weekday: String(slot.weekday),
      startTime: slot.startTime,
      endTime: slot.endTime,
      disciplineId: slot.disciplineId,
      instructorUserId: slot.instructorUserId,
      capacity: slot.maxCapacity ? String(slot.maxCapacity) : '',
      label: slot.label ?? '',
      ageBracketIds: slot.ageBracketIds,
    });
  };

  const isPending = mutations.create.isPending || mutations.update.isPending;

  return (
    <div className="space-y-6">
      <FormSection title={t('settings.schedule_title')} description={t('settings.schedule_help')}>
        <SettingsFeedback
          error={slotsQuery.error ?? mutations.create.error ?? mutations.update.error}
          fallback="settings.save_error"
        />
        <SlotEditor
          draft={draft}
          setDraft={setDraft}
          brackets={brackets}
          disciplines={catalog}
          instructors={instructors}
        />
        <div className="flex flex-wrap gap-2">
          <Button type="button" disabled={!draft.disciplineId || !draft.instructorUserId || isPending} onClick={onSave}>
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            {isPending ? t('settings.saving') : editingId ? t('settings.update_slot') : t('settings.add_slot')}
          </Button>
          {editingId ? (
            <Button type="button" variant="outline" onClick={() => { setEditingId(null); setDraft(EMPTY_DRAFT); }}>
              {t('settings.cancel_edit')}
            </Button>
          ) : null}
        </div>
      </FormSection>

      {slotsQuery.isLoading ? (
        <p className="text-sm text-muted-foreground">{t('settings.loading')}</p>
      ) : slots.length === 0 ? (
        <p className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">{t('settings.schedule_empty')}</p>
      ) : (
        WEEKDAYS.map((day) => {
          const daySlots = slots.filter((slot) => slot.weekday === day);
          const open = openDays[day] !== false;
          return (
            <section key={day} className="overflow-hidden rounded-lg border border-border bg-card">
              <button
                type="button"
                className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-muted/40"
                aria-expanded={open}
                onClick={() => setOpenDays((current) => ({ ...current, [day]: !open }))}
              >
                <span className="font-semibold text-foreground">
                  {t(`settings.weekday_${day}`)}
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    {t('settings.slot_count', { count: daySlots.length })}
                  </span>
                </span>
                <ChevronDown className={cn('h-4 w-4 text-muted-foreground transition-transform', !open && '-rotate-90')} />
              </button>
              {open ? (
                daySlots.length === 0 ? (
                  <p className="border-t border-border px-4 py-3 text-sm text-muted-foreground">{t('settings.day_empty')}</p>
                ) : (
                  <ul className="divide-y divide-border border-t border-border">
                    {daySlots.map((slot) => {
                      const discipline = catalog.find((row) => row.id === slot.disciplineId);
                      const instructor = instructors.find((row) => row.id === slot.instructorUserId);
                      return (
                        <li key={slot.id} className={cn('flex flex-wrap items-center justify-between gap-3 px-4 py-3', !slot.isActive && 'opacity-60')}>
                          <div>
                            <p className="font-medium text-foreground">
                              {slot.startTime}–{slot.endTime}
                              {slot.label ? <span className="ml-2 text-sm font-normal text-muted-foreground">{slot.label}</span> : null}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {discipline?.acronym?.trim() || discipline?.name || slot.disciplineId}
                              {' · '}
                              {instructor ? staffName(instructor) : slot.instructorUserId}
                              {slot.maxCapacity ? ` · ${slot.maxCapacity}` : ''}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Button type="button" size="sm" variant="outline" onClick={() => onEdit(slot)}>
                              <Pencil className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                              {t('settings.edit')}
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => mutations.update.mutate({ id: slot.id, isActive: !slot.isActive })}
                            >
                              {slot.isActive ? t('settings.deactivate') : t('settings.activate')}
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                if (window.confirm(t('settings.delete_slot_confirm'))) {
                                  mutations.remove.mutate(slot.id);
                                }
                              }}
                            >
                              <Trash2 className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                              {t('settings.delete')}
                            </Button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )
              ) : null}
            </section>
          );
        })
      )}
    </div>
  );
}

/**
 * Shared slot editor fields.
 *
 * @param {object} props - Draft state and catalogs.
 * @returns {JSX.Element} Editor grid.
 */
function SlotEditor({
  draft,
  setDraft,
  brackets,
  disciplines,
  instructors,
}: {
  draft: SlotDraft;
  setDraft: (next: SlotDraft | ((current: SlotDraft) => SlotDraft)) => void;
  brackets: AgeBracket[];
  disciplines: Array<{ id: string; name: string; acronym?: string | null }>;
  instructors: StaffUser[];
}): JSX.Element {
  const { t } = useTranslation();
  return (
    <>
      <FormGrid>
        <div className="space-y-2">
          <Label htmlFor="slot-weekday">{t('settings.weekday')}</Label>
          <Select id="slot-weekday" value={draft.weekday} onChange={(event) => setDraft({ ...draft, weekday: event.target.value })}>
            {WEEKDAYS.map((day) => (
              <option key={day} value={day}>{t(`settings.weekday_${day}`)}</option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="slot-start">{t('settings.start_time')}</Label>
          <Input id="slot-start" type="time" value={draft.startTime} onChange={(event) => setDraft({ ...draft, startTime: event.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slot-end">{t('settings.end_time')}</Label>
          <Input id="slot-end" type="time" value={draft.endTime} onChange={(event) => setDraft({ ...draft, endTime: event.target.value })} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slot-discipline">{t('settings.discipline')}</Label>
          <Select id="slot-discipline" value={draft.disciplineId} onChange={(event) => setDraft({ ...draft, disciplineId: event.target.value })}>
            <option value="">{t('settings.discipline_placeholder')}</option>
            {disciplines.map((discipline) => (
              <option key={discipline.id} value={discipline.id}>{discipline.acronym?.trim() || discipline.name}</option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="slot-instructor">{t('settings.instructor')}</Label>
          <Select id="slot-instructor" value={draft.instructorUserId} onChange={(event) => setDraft({ ...draft, instructorUserId: event.target.value })}>
            <option value="">{t('settings.instructor_placeholder')}</option>
            {instructors.map((user) => (
              <option key={user.id} value={user.id}>{staffName(user)}</option>
            ))}
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="slot-capacity">{t('settings.capacity')}</Label>
          <Input
            id="slot-capacity"
            type="number"
            min={1}
            value={draft.capacity}
            onChange={(event) => setDraft({ ...draft, capacity: event.target.value })}
            placeholder={t('settings.capacity_optional')}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="slot-label">{t('settings.slot_label')}</Label>
          <Input id="slot-label" value={draft.label} onChange={(event) => setDraft({ ...draft, label: event.target.value })} />
        </div>
      </FormGrid>
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-foreground">{t('settings.slot_age_brackets')}</legend>
        <div className="flex flex-wrap gap-3">
          {brackets.map((bracket) => (
            <label key={bracket.id} className="flex items-center gap-2 text-sm text-foreground">
              <Checkbox
                checked={draft.ageBracketIds.includes(bracket.id)}
                onChange={(event) => {
                  setDraft((current) => ({
                    ...current,
                    ageBracketIds: event.target.checked
                      ? [...current.ageBracketIds, bracket.id]
                      : current.ageBracketIds.filter((id) => id !== bracket.id),
                  }));
                }}
              />
              {bracket.name}
            </label>
          ))}
        </div>
      </fieldset>
    </>
  );
}
