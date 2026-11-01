/**
 * @file rosterGroups.ts
 * @description Groups a check-in roster by tenant age brackets.
 */

import { AGE_GROUPS, type AgeGroupConfig } from '@/pages/students/config/ageGroups';
import type { AttendanceRosterStudent } from './types';

export interface RosterGroup {
  id: string;
  labelKey?: string;
  name?: string;
  students: AttendanceRosterStudent[];
}

/**
 * Splits roster rows into configured age groups plus unknown.
 *
 * @param {AttendanceRosterStudent[]} students - Session roster.
 * @param {AgeGroupConfig[]} [ageGroups] - Tenant catalog.
 * @returns {RosterGroup[]} Groups that still have students.
 */
export function groupRosterByAge(
  students: AttendanceRosterStudent[],
  ageGroups: AgeGroupConfig[] = AGE_GROUPS,
): RosterGroup[] {
  const groups: RosterGroup[] = ageGroups.map((group) => ({
    id: group.id,
    labelKey: group.labelKey,
    name: group.name,
    students: students.filter((student) => student.ageBracket === group.id),
  }));
  const unknown = students.filter((student) => !student.ageBracket);
  if (unknown.length > 0) {
    groups.push({ id: 'unknown', labelKey: 'attendance.age_unknown', students: unknown });
  }
  return groups.filter((group) => group.students.length > 0);
}

/**
 * Display name `lastName, firstName`.
 *
 * @param {AttendanceRosterStudent} student - Roster row.
 * @returns {string} Sorted name.
 */
export function rosterStudentName(student: AttendanceRosterStudent): string {
  return [student.lastName.trim(), student.firstName.trim()].filter(Boolean).join(', ');
}
