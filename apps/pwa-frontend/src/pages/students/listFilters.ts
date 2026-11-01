/**
 * @file listFilters.ts
 * @description Filter, sort, age, and audit helpers for the student directory.
 */

import { AGE_GROUPS, type AgeGroupConfig } from './config/ageGroups';
import type { EmergencyContactPayload, StudentProfileResponse, StudentStatusHistoryEntry } from './types';

/** Legal majority used by enrollment forms and the directory row contact switch. */
export const MINOR_AGE_THRESHOLD = 18;

/** Statuses selected when the directory first loads. */
export const DEFAULT_STATUS_FILTER = ['ACTIVE'] as const;

export const STUDENT_STATUS_OPTIONS = ['ACTIVE', 'PAUSED', 'DROPPED', 'TRIAL'] as const;

/**
 * @param {string | undefined} birthDate - ISO date of birth.
 * @param {Date} [today] - Reference date.
 * @returns {number} Completed years, or -1 when unknown.
 */
export function calculateAge(birthDate?: string, today: Date = new Date()): number {
  if (!birthDate) return -1;
  const birth = new Date(birthDate);
  if (Number.isNaN(birth.getTime())) return -1;
  let age = today.getFullYear() - birth.getFullYear();
  const monthDelta = today.getMonth() - birth.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }
  return age;
}

/**
 * @param {StudentProfileResponse} student - Directory row.
 * @returns {string | undefined} Birth date from the academic profile.
 */
export function studentBirthDate(student: StudentProfileResponse): string | undefined {
  return student.birthDate;
}

/**
 * @param {number} age - Completed years, or -1 when unknown.
 * @returns {AgeGroupConfig | undefined} Matching configured bracket.
 */
export function ageGroupForAge(age: number): AgeGroupConfig | undefined {
  if (age < 0) return undefined;
  return AGE_GROUPS.find((group) => age >= group.minAge && age <= group.maxAge);
}

/**
 * Minors are under 18. Unknown age falls back to “has guardians”.
 *
 * @param {StudentProfileResponse} student - Directory row.
 * @returns {boolean} Whether the row should show guardian chips instead of emergency contacts.
 */
export function isStudentMinor(student: StudentProfileResponse): boolean {
  const age = calculateAge(studentBirthDate(student));
  if (age >= 0) return age < MINOR_AGE_THRESHOLD;
  return (student.guardians ?? []).length > 0;
}

/**
 * @param {StudentProfileResponse} student - Directory row.
 * @returns {EmergencyContactPayload[]} Parsed emergency contacts.
 */
export function studentEmergencyContacts(student: StudentProfileResponse): EmergencyContactPayload[] {
  return Array.isArray(student.emergencyContacts) ? student.emergencyContacts : [];
}

export interface StudentListFilters {
  searchTerm: string;
  selectedAgeGroups: string[];
  selectedStatuses: string[];
  selectedDisciplines: string[];
}

/**
 * True when filters match the directory's initial state (ACTIVE only, no age/discipline chips).
 *
 * @param {StudentListFilters} filters - Current toolbar state.
 * @returns {boolean} Whether the clear-filters control should stay hidden.
 */
export function isDefaultStudentFilters(filters: StudentListFilters): boolean {
  const statuses = [...filters.selectedStatuses].sort();
  const defaults = [...DEFAULT_STATUS_FILTER].sort();
  return (
    filters.searchTerm.trim() === '' &&
    filters.selectedAgeGroups.length === 0 &&
    filters.selectedDisciplines.length === 0 &&
    statuses.length === defaults.length &&
    statuses.every((status, index) => status === defaults[index])
  );
}

/**
 * Filters then applies the default age → lastName → firstName sort (age ascending).
 *
 * @param {StudentProfileResponse[]} students - Unfiltered API rows.
 * @param {StudentListFilters} filters - Search and multi-selects.
 * @returns {StudentProfileResponse[]} Visible rows.
 */
export function filterAndSortStudents(
  students: StudentProfileResponse[],
  filters: StudentListFilters,
): StudentProfileResponse[] {
  const search = filters.searchTerm.trim().toLowerCase();
  const filtered = students.filter((student) => {
    const birth = studentBirthDate(student);
    if (search && !studentSearchHaystack(student).includes(search)) return false;

    const status = student.status || 'ACTIVE';
    if (filters.selectedStatuses.length > 0 && !filters.selectedStatuses.includes(status)) return false;

    const age = calculateAge(birth);
    if (filters.selectedAgeGroups.length > 0) {
      const inBracket = filters.selectedAgeGroups.some((groupId) => {
        const group = AGE_GROUPS.find((item) => item.id === groupId);
        return Boolean(group && age >= group.minAge && age <= group.maxAge);
      });
      if (!inBracket) return false;
    }

    if (filters.selectedDisciplines.length > 0) {
      const names = (student.ranks ?? []).map((rank) => rank.disciplineName);
      if (!names.some((name) => filters.selectedDisciplines.includes(name))) return false;
    }

    return true;
  });

  return filtered.sort((a, b) => compareStudentsDefault(a, b));
}

/**
 * Age ascending (unknown last), then last name A–Z, then first name A–Z.
 *
 * @param {StudentProfileResponse} a - Left row.
 * @param {StudentProfileResponse} b - Right row.
 * @returns {number} Comparator result.
 */
export function compareStudentsDefault(a: StudentProfileResponse, b: StudentProfileResponse): number {
  const ageA = calculateAge(studentBirthDate(a));
  const ageB = calculateAge(studentBirthDate(b));
  const normalizedA = ageA < 0 ? Number.POSITIVE_INFINITY : ageA;
  const normalizedB = ageB < 0 ? Number.POSITIVE_INFINITY : ageB;
  if (normalizedA !== normalizedB) return normalizedA - normalizedB;

  const last = (a.user?.lastName ?? '').localeCompare(b.user?.lastName ?? '', undefined, { sensitivity: 'base' });
  if (last !== 0) return last;
  return (a.user?.firstName ?? '').localeCompare(b.user?.firstName ?? '', undefined, { sensitivity: 'base' });
}

/**
 * Concatenates identity, guardian, and emergency-contact fields for the toolbar search.
 *
 * @param {StudentProfileResponse} student - Directory row.
 * @returns {string} Lowercased haystack.
 */
export function studentSearchHaystack(student: StudentProfileResponse): string {
  const guardianBits = (student.guardians ?? []).flatMap((link) => [
    link.guardian?.user?.firstName,
    link.guardian?.user?.lastName,
    link.guardian?.user?.email,
  ]);
  const emergencyBits = studentEmergencyContacts(student).flatMap((contact) => [contact.name, contact.phone]);
  return [
    student.firstName,
    student.lastName,
    student.user?.firstName,
    student.user?.lastName,
    student.dni,
    student.phone,
    student.user?.email,
    ...guardianBits,
    ...emergencyBits,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

/**
 * Distinct discipline names present on listed students.
 *
 * @param {StudentProfileResponse[]} students - API rows.
 * @param {Array<{ name?: string }>} catalog - Discipline catalog.
 * @returns {string[]} Sorted unique names.
 */
export function collectDisciplineOptions(
  students: StudentProfileResponse[],
  catalog: Array<{ name?: string }>,
): string[] {
  const names = new Set<string>();
  for (const student of students) {
    for (const rank of student.ranks ?? []) {
      if (rank.disciplineName) names.add(rank.disciplineName);
    }
  }
  for (const item of catalog) {
    if (item.name) names.add(item.name);
  }
  return Array.from(names).sort((a, b) => a.localeCompare(b));
}

const KNOWN_AUDIT_FLAGS = ['REQUIERE_DATOS_TUTOR', 'REQUIERE_VALIDACION_DATOS'] as const;

/**
 * Collects import/system flags from status history reasons and details.
 *
 * @param {StudentStatusHistoryEntry[] | undefined} history - Chronological audit log.
 * @returns {string[]} Unique flag codes or free-text notes.
 */
export function collectAuditFlags(history: StudentStatusHistoryEntry[] | undefined): string[] {
  const flags = new Set<string>();
  for (const entry of history ?? []) {
    const blobs = [entry.reason, entry.customReasonDetails].filter(Boolean) as string[];
    for (const blob of blobs) {
      for (const code of KNOWN_AUDIT_FLAGS) {
        if (blob.includes(code)) flags.add(code);
      }
    }
  }
  return Array.from(flags);
}

/**
 * @param {StudentProfileResponse} student - Directory row.
 * @returns {{ start: string | undefined; end: string | undefined }} Enrollment window.
 */
export function enrollmentDates(student: StudentProfileResponse): { start?: string; end?: string } {
  const history = student.statusHistory ?? [];
  const start = history[0]?.createdAt ?? student.createdAt;
  const leave = [...history].reverse().find((entry) => {
    const status = entry.newStatus || entry.status;
    return status === 'PAUSED' || status === 'DROPPED';
  });
  const end = student.status === 'PAUSED' || student.status === 'DROPPED' ? leave?.createdAt : undefined;
  return { start, end };
}
