/**
 * @file types.ts
 * @description Attendance session and check-in roster contracts.
 */

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

export interface AttendanceInstructor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface AttendanceDiscipline {
  id: string;
  name: string;
  acronym?: string | null;
}

export interface AttendanceSession {
  id: string;
  disciplineId: string;
  date: string;
  instructorUserId: string;
  maxCapacity: number | null;
  scheduleSlotId?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  isExceptional: boolean;
  ageBracketIds: string[];
  presentCount: number;
  markedCount: number;
  discipline: AttendanceDiscipline | null;
  instructor: AttendanceInstructor;
}

export interface AttendanceRosterStudent {
  studentProfileId: string;
  firstName: string;
  lastName: string;
  status: string;
  age: number | null;
  ageBracket: string | null;
  attendanceStatus: AttendanceStatus | null;
  recordId: string | null;
  currentBelt?: string | null;
  graduationEligible?: boolean;
}

export interface AttendanceSessionDetail extends AttendanceSession {
  students: AttendanceRosterStudent[];
}

export interface CreateAttendanceSessionPayload {
  disciplineId: string;
  date: string;
  instructorUserId?: string;
  maxCapacity?: number;
  isExceptional?: boolean;
  startTime?: string;
  endTime?: string;
  ageBracketIds?: string[];
}

export interface UpsertAttendanceRecordsPayload {
  records: Array<{ studentProfileId: string; status: AttendanceStatus }>;
}
