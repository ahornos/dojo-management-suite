/**
 * @file attendances.service.ts
 * @description Legacy per-student attendance logs (rank hours) plus session-based quick check-in.
 */

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AttendanceStatus, Prisma, StudentStatus } from '@dms/database/client';
import { AuthenticatedUser } from '@dms/shared-types';
import { AcademyService } from '../academy/academy.service';
import { GraduationsService } from '../graduations/graduations.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersDirectoryClient } from '../users-directory/users-directory.client';
import { ageInYears } from '../licenses/license-filters';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { CreateAttendanceSessionDto } from './dto/create-attendance-session.dto';
import { ListAttendanceSessionsDto } from './dto/list-attendance-sessions.dto';
import { SessionRosterQueryDto } from './dto/session-roster-query.dto';
import { UpsertAttendanceRecordsDto } from './dto/upsert-attendance-records.dto';
import {
  ageBracketForAge,
  FALLBACK_AGE_BRACKETS,
  matchesAnyAgeBracket,
  type AgeBracketRange,
} from './attendance-age';

const COUNTS_FOR_RANK: ReadonlySet<AttendanceStatus> = new Set([
  AttendanceStatus.PRESENT,
  AttendanceStatus.LATE,
]);

const ROSTER_STATUSES: StudentStatus[] = [StudentStatus.ACTIVE, StudentStatus.TRIAL];

/** Prisma interactive-transaction client. */
type TransactionClient = Parameters<Parameters<PrismaService['$transaction']>[0]>[0];

/**
 * Service responsible for handling attendance business logic,
 * tracking training hours, and counting towards grade hours (H.d.G.).
 */
@Injectable()
export class AttendancesService {
  /**
   * @param {PrismaService} prisma - Database access limited to the academic domain.
   * @param {UsersDirectoryClient} usersClient - Resolves student identities owned by the auth-service.
   * @param {AcademyService} academyService - Tenant age brackets and weekly schedule.
   * @param {GraduationsService} graduationsService - Batch belt-eligibility for the roster.
   */
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersClient: UsersDirectoryClient,
    private readonly academyService: AcademyService,
    private readonly graduationsService: GraduationsService,
  ) {}

  /**
   * Registers a new attendance entry for audit purposes and optionally
   * counts it towards the student's active rank based on business rules.
   *
   * @param {CreateAttendanceDto} dto - Student profile ID and optional timestamp.
   * @returns {Promise<object>} The newly created attendance record.
   */
  async create(dto: CreateAttendanceDto) {
    const student = await this.prisma.studentProfile.findUnique({
      where: { id: dto.studentProfileId },
    });

    if (!student) {
      throw new NotFoundException('STUDENT_PROFILE_NOT_FOUND');
    }

    const at = dto.attendedAt ? new Date(dto.attendedAt) : new Date();
    const startOfDay = utcDay(at.toISOString());
    const endOfDay = utcEndOfDay(at.toISOString());
    const existingRankAttendanceToday = await this.prisma.attendance.findFirst({
      where: {
        studentProfileId: dto.studentProfileId,
        date: { gte: startOfDay, lte: endOfDay },
        countedForRank: true,
      },
    });
    const shouldCountForRank = !existingRankAttendanceToday;

    return this.prisma.$transaction(async (tx) => {
      const attendance = await tx.attendance.create({
        data: {
          studentProfileId: dto.studentProfileId,
          date: dto.attendedAt ? at : undefined,
          countedForRank: shouldCountForRank,
        },
      });
      if (shouldCountForRank) {
        await this.incrementActiveRankHours(tx, dto.studentProfileId);
      }
      return attendance;
    });
  }

  /**
   * Retrieves all attendance records ordered by date descending. Student names/emails are merged in memory
   * from a single batch call to the auth-service (the `users` table is not joined).
   *
   * @returns {Promise<object[]>} Attendance records with `student.user` (`firstName`, `lastName`, `email`, or `null` if unresolved).
   * @throws {ServiceUnavailableException} If the auth-service is unreachable.
   */
  async findAll() {
    const attendances = await this.prisma.attendance.findMany({
      include: { student: true },
      orderBy: { date: 'desc' },
    });

    const users = await this.usersClient.findManyByIds(attendances.map((attendance) => attendance.student.userId));

    return attendances.map((attendance) => {
      const login = attendance.student.userId ? users.get(attendance.student.userId) : undefined;
      const displayUser = login
        ? { firstName: login.firstName, lastName: login.lastName, email: login.email }
        : attendance.student.userId
          ? null
          : { firstName: attendance.student.firstName, lastName: attendance.student.lastName, email: null };

      return {
        ...attendance,
        student: {
          ...attendance.student,
          user: displayUser,
        },
      };
    });
  }

  /**
   * Deletes an attendance record by its ID.
   *
   * @param {string} id - Attendance record UUID.
   * @returns {Promise<object>} The deleted attendance record.
   */
  async remove(id: string) {
    const attendance = await this.prisma.attendance.findUnique({
      where: { id },
    });

    if (!attendance) {
      throw new NotFoundException('ATTENDANCE_NOT_FOUND');
    }

    return this.prisma.attendance.delete({
      where: { id },
    });
  }

  /**
   * Retrieves all attendance records for a specific student profile.
   *
   * @param {string} studentProfileId - Student profile UUID.
   * @returns {Promise<object[]>} Array of attendance records for the specified student.
   */
  async findByStudent(studentProfileId: string) {
    return this.prisma.attendance.findMany({
      where: { studentProfileId },
      orderBy: { date: 'desc' },
    });
  }

  /**
   * Opens a class session. Reuses an existing row for the same discipline, day, instructor, and time.
   *
   * @param {CreateAttendanceSessionDto} dto - Discipline, date, optional instructor, times, and capacity.
   * @param {AuthenticatedUser} actor - Authenticated staff member (default instructor).
   * @returns {Promise<object>} Session plus discipline label and instructor identity.
   */
  async createSession(dto: CreateAttendanceSessionDto, actor: AuthenticatedUser) {
    const discipline = await this.prisma.discipline.findUnique({ where: { id: dto.disciplineId } });
    if (!discipline) {
      throw new NotFoundException('DISCIPLINE_NOT_FOUND');
    }

    const date = utcDay(dto.date);
    const instructorUserId = dto.instructorUserId ?? actor.userId;
    const startTime = dto.startTime ?? null;
    const existing = await this.prisma.attendanceSession.findFirst({
      where: {
        disciplineId: dto.disciplineId,
        date,
        instructorUserId,
        startTime,
      },
    });

    const nextData = {
      maxCapacity: dto.maxCapacity,
      startTime,
      endTime: dto.endTime ?? null,
      isExceptional: dto.isExceptional ?? true,
      ageBracketIds: dto.ageBracketIds ?? [],
    };

    const persisted =
      existing && shouldPatchSession(existing, nextData)
        ? await this.prisma.attendanceSession.update({
            where: { id: existing.id },
            data: {
              ...(dto.maxCapacity !== undefined ? { maxCapacity: dto.maxCapacity } : {}),
              ...(dto.startTime !== undefined ? { startTime } : {}),
              ...(dto.endTime !== undefined ? { endTime: dto.endTime } : {}),
              ...(dto.ageBracketIds !== undefined ? { ageBracketIds: dto.ageBracketIds } : {}),
            },
          })
        : existing ??
          (await this.prisma.attendanceSession.create({
            data: {
              disciplineId: dto.disciplineId,
              date,
              instructorUserId,
              ...nextData,
            },
          }));

    return this.decorateSession(persisted, discipline);
  }

  /**
   * Lists class sessions, optionally narrowed by date range and discipline.
   * When a single calendar day is requested, missing master-schedule sessions are generated first.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {ListAttendanceSessionsDto} query - Date and discipline filters.
   * @returns {Promise<object[]>} Sessions with present counts and instructor names.
   */
  async listSessions(tenantId: string, query: ListAttendanceSessionsDto) {
    const generateDate =
      query.dateFrom && (!query.dateTo || query.dateFrom === query.dateTo) ? query.dateFrom : undefined;
    if (generateDate) {
      await this.ensureSessionsForDay(tenantId, generateDate);
    }

    const dateFrom = query.dateFrom ? utcDay(query.dateFrom) : undefined;
    const dateTo = query.dateTo ? utcEndOfDay(query.dateTo) : undefined;

    const sessions = await this.prisma.attendanceSession.findMany({
      where: {
        ...(query.disciplineId ? { disciplineId: query.disciplineId } : {}),
        ...(dateFrom || dateTo
          ? { date: { ...(dateFrom ? { gte: dateFrom } : {}), ...(dateTo ? { lte: dateTo } : {}) } }
          : {}),
      },
      include: { records: { select: { status: true } } },
      orderBy: [{ date: 'desc' }, { startTime: 'asc' }, { createdAt: 'desc' }],
    });

    const disciplines = await this.prisma.discipline.findMany({
      where: { id: { in: [...new Set(sessions.map((row) => row.disciplineId))] } },
      select: { id: true, name: true, acronym: true },
    });
    const disciplineById = new Map(disciplines.map((row) => [row.id, row]));
    const instructors = await this.usersClient.findManyByIds(sessions.map((row) => row.instructorUserId));

    return sessions.map((session) => {
      const presentCount = session.records.filter((row) => COUNTS_FOR_RANK.has(row.status)).length;
      const { records: _records, ...rest } = session;
      return {
        ...rest,
        presentCount,
        markedCount: session.records.length,
        discipline: disciplineById.get(session.disciplineId) ?? null,
        instructor: instructorIdentity(instructors.get(session.instructorUserId), session.instructorUserId),
      };
    });
  }

  /**
   * Session header plus the eligible roster (enrolled ACTIVE/TRIAL students) and current marks.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {string} sessionId - Session UUID.
   * @param {SessionRosterQueryDto} query - Optional age-bracket filters.
   * @returns {Promise<object>} Session, students, and present count.
   */
  async getSession(tenantId: string, sessionId: string, query: SessionRosterQueryDto) {
    const session = await this.prisma.attendanceSession.findUnique({
      where: { id: sessionId },
      include: { records: true },
    });
    if (!session) {
      throw new NotFoundException('ATTENDANCE_SESSION_NOT_FOUND');
    }

    const discipline = await this.prisma.discipline.findUnique({
      where: { id: session.disciplineId },
      select: { id: true, name: true, acronym: true },
    });

    const catalog = await this.loadAgeBrackets(tenantId);
    const selectedRanges = resolveSelectedRanges(session.ageBracketIds ?? [], catalog, query);
    const today = new Date();
    const profiles = await this.prisma.studentProfile.findMany({
      where: {
        status: { in: ROSTER_STATUSES },
        ranks: { some: { beltRank: { program: { disciplineId: session.disciplineId } } } },
      },
      select: { id: true, firstName: true, lastName: true, birthDate: true, status: true },
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
    });

    const markByStudent = new Map(session.records.map((row) => [row.studentProfileId, row]));
    const students = profiles
      .filter((profile) => matchesAnyAgeBracket(profile.birthDate, selectedRanges, today))
      .map((profile) => {
        const age = profile.birthDate ? ageInYears(profile.birthDate, today) : null;
        const mark = markByStudent.get(profile.id);
        return {
          studentProfileId: profile.id,
          firstName: profile.firstName,
          lastName: profile.lastName,
          status: profile.status,
          age,
          ageBracket: ageBracketForAge(age, catalog),
          attendanceStatus: mark?.status ?? null,
          recordId: mark?.id ?? null,
        };
      });

    const eligibility = await this.graduationsService.evaluateEligibilityBatch(
      students.map((row) => row.studentProfileId),
    );
    const eligibilityById = new Map(eligibility.map((row) => [row.studentProfileId, row]));

    const instructors = await this.usersClient.findManyByIds([session.instructorUserId]);
    const presentCount = session.records.filter((row) => COUNTS_FOR_RANK.has(row.status)).length;
    const { records: _records, ...header } = session;

    return {
      ...header,
      presentCount,
      markedCount: session.records.length,
      discipline,
      instructor: instructorIdentity(instructors.get(session.instructorUserId), session.instructorUserId),
      students: students.map((row) => {
        const grade = eligibilityById.get(row.studentProfileId);
        return {
          ...row,
          currentBelt: grade?.currentBelt ?? null,
          graduationEligible: grade?.eligibility.isEligible ?? false,
        };
      }),
    };
  }

  /**
   * Upserts roll-call marks for a session and credits rank hours for PRESENT/LATE (once per day).
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {string} sessionId - Session UUID.
   * @param {UpsertAttendanceRecordsDto} dto - Student marks.
   * @returns {Promise<object>} Updated session roster.
   */
  async upsertRecords(tenantId: string, sessionId: string, dto: UpsertAttendanceRecordsDto) {
    const session = await this.prisma.attendanceSession.findUnique({
      where: { id: sessionId },
      include: { records: true },
    });
    if (!session) {
      throw new NotFoundException('ATTENDANCE_SESSION_NOT_FOUND');
    }

    const ids = [...new Set(dto.records.map((row) => row.studentProfileId))];
    const profiles = await this.prisma.studentProfile.findMany({
      where: { id: { in: ids } },
      select: { id: true },
    });
    if (profiles.length !== ids.length) {
      throw new BadRequestException('ATTENDANCE_STUDENTS_NOT_FOUND');
    }

    const nextByStudent = new Map(session.records.map((row) => [row.studentProfileId, row.status]));
    for (const row of dto.records) {
      nextByStudent.set(row.studentProfileId, row.status as AttendanceStatus);
    }
    const presentCount = [...nextByStudent.values()].filter((status) => COUNTS_FOR_RANK.has(status)).length;
    if (session.maxCapacity !== null && presentCount > session.maxCapacity) {
      throw new BadRequestException('ATTENDANCE_SESSION_CAPACITY_EXCEEDED');
    }

    await this.prisma.$transaction(async (tx) => {
      for (const row of dto.records) {
        const status = row.status as AttendanceStatus;
        await tx.attendanceRecord.upsert({
          where: {
            sessionId_studentProfileId: { sessionId, studentProfileId: row.studentProfileId },
          },
          create: { sessionId, studentProfileId: row.studentProfileId, status },
          update: { status },
        });
        if (COUNTS_FOR_RANK.has(status)) {
          await this.creditSessionRankHour(tx, row.studentProfileId, session.date);
        }
      }
    });

    return this.getSession(tenantId, sessionId, {});
  }

  /**
   * Materializes `AttendanceSession` rows for every active master-calendar slot on that weekday.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @param {string} isoDate - Calendar day (`YYYY-MM-DD`).
   * @returns {Promise<void>}
   */
  async ensureSessionsForDay(tenantId: string, isoDate: string): Promise<void> {
    const date = utcDay(isoDate);
    const settings = await this.academyService.getSettings(tenantId);
    const weekday = isoWeekdayInTimeZone(isoDate, settings.timezone || 'Europe/Madrid');
    const slots = await this.prisma.academyScheduleSlot.findMany({
      where: { tenantId, weekday, isActive: true },
    });
    if (slots.length === 0) {
      return;
    }

    const existing = await this.prisma.attendanceSession.findMany({
      where: { date, scheduleSlotId: { in: slots.map((slot) => slot.id) } },
      select: { scheduleSlotId: true },
    });
    const have = new Set(existing.map((row) => row.scheduleSlotId).filter((id): id is string => Boolean(id)));
    const missing = slots.filter((slot) => !have.has(slot.id));
    if (missing.length === 0) {
      return;
    }

    try {
      await this.prisma.attendanceSession.createMany({
        data: missing.map((slot) => ({
          disciplineId: slot.disciplineId,
          date,
          instructorUserId: slot.instructorUserId,
          maxCapacity: slot.maxCapacity,
          scheduleSlotId: slot.id,
          startTime: slot.startTime,
          endTime: slot.endTime,
          isExceptional: false,
          ageBracketIds: slot.ageBracketIds,
        })),
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        return;
      }
      throw error;
    }
  }

  /**
   * Loads tenant age brackets, falling back to the historical product ranges.
   *
   * @param {string} tenantId - Academy key from `x-school-id`.
   * @returns {Promise<AgeBracketRange[]>} Catalog used to classify the roster.
   */
  private async loadAgeBrackets(tenantId: string): Promise<AgeBracketRange[]> {
    const rows = await this.academyService.listAgeBrackets(tenantId);
    if (rows.length === 0) {
      return FALLBACK_AGE_BRACKETS;
    }
    return rows.map((row) => ({ id: row.id, code: row.code, minAge: row.minAge, maxAge: row.maxAge }));
  }

  /**
   * Credits one rank hour the first time a student is PRESENT/LATE on this calendar day.
   *
   * @param {TransactionClient} tx - Open transaction.
   * @param {string} studentProfileId - Academic profile.
   * @param {Date} at - Session date.
   * @returns {Promise<void>}
   */
  private async creditSessionRankHour(tx: TransactionClient, studentProfileId: string, at: Date): Promise<void> {
    const startOfDay = utcDay(at.toISOString());
    const endOfDay = utcEndOfDay(at.toISOString());
    const existing = await tx.attendance.findFirst({
      where: {
        studentProfileId,
        date: { gte: startOfDay, lte: endOfDay },
        countedForRank: true,
      },
    });
    if (existing) {
      return;
    }
    await tx.attendance.create({
      data: { studentProfileId, date: at, countedForRank: true },
    });
    await this.incrementActiveRankHours(tx, studentProfileId);
  }

  /**
   * Increments hours on the most recent rank, when one exists.
   *
   * @param {TransactionClient} tx - Open transaction.
   * @param {string} studentProfileId - Academic profile.
   * @returns {Promise<void>}
   */
  private async incrementActiveRankHours(tx: TransactionClient, studentProfileId: string): Promise<void> {
    const activeRank = await tx.studentRank.findFirst({
      where: { studentProfileId },
      orderBy: { promotedAt: 'desc' },
    });
    if (!activeRank) {
      return;
    }
    await tx.studentRank.update({
      where: { id: activeRank.id },
      data: { accumulatedHours: { increment: 1 } },
    });
  }

  /**
   * Attaches catalog and instructor identity to a bare session row.
   *
   * @param {{ id: string; disciplineId: string; instructorUserId: string }} session - Persisted session.
   * @param {{ id: string; name: string; acronym: string | null }} discipline - Catalog row.
   * @returns {Promise<object>} Decorated session.
   */
  private async decorateSession(
    session: { id: string; disciplineId: string; instructorUserId: string },
    discipline: { id: string; name: string; acronym: string | null },
  ) {
    const records = await this.prisma.attendanceRecord.findMany({
      where: { sessionId: session.id },
      select: { status: true },
    });
    const instructors = await this.usersClient.findManyByIds([session.instructorUserId]);
    return {
      ...session,
      presentCount: records.filter((row) => COUNTS_FOR_RANK.has(row.status)).length,
      markedCount: records.length,
      discipline,
      instructor: instructorIdentity(instructors.get(session.instructorUserId), session.instructorUserId),
    };
  }
}

/**
 * Calendar day at UTC midnight from an ISO date or instant.
 *
 * @param {string} iso - `YYYY-MM-DD` or ISO instant.
 * @returns {Date} UTC midnight.
 */
function utcDay(iso: string): Date {
  const source = /^\d{4}-\d{2}-\d{2}$/.test(iso) ? `${iso}T00:00:00.000Z` : iso;
  const date = new Date(source);
  if (Number.isNaN(date.getTime())) {
    throw new BadRequestException('INVALID_ATTENDANCE_DATE');
  }
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

/**
 * Inclusive end of the UTC calendar day.
 *
 * @param {string} iso - `YYYY-MM-DD` or ISO instant.
 * @returns {Date} 23:59:59.999 UTC.
 */
function utcEndOfDay(iso: string): Date {
  const start = utcDay(iso);
  return new Date(start.getTime() + 24 * 60 * 60 * 1000 - 1);
}

/**
 * Instructor display payload from the identity directory.
 *
 * @param {{ firstName: string; lastName: string; email: string } | undefined} user - Directory row.
 * @param {string} fallbackId - Logical user id.
 * @returns {{ id: string; firstName: string; lastName: string; email: string }} Identity.
 */
function instructorIdentity(
  user: { firstName: string; lastName: string; email: string } | undefined,
  fallbackId: string,
): { id: string; firstName: string; lastName: string; email: string } {
  return {
    id: fallbackId,
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    email: user?.email ?? '',
  };
}

/**
 * ISO weekday of a civil `YYYY-MM-DD` date in the tenant timezone: 1 = Monday … 7 = Sunday.
 *
 * @param {string} isoDate - Calendar day (`YYYY-MM-DD`).
 * @param {string} timeZone - IANA timezone from academy settings.
 * @returns {number} ISO weekday.
 */
function isoWeekdayInTimeZone(isoDate: string, timeZone: string): number {
  const noonUtc = new Date(`${isoDate}T12:00:00.000Z`);
  const weekdayName = new Intl.DateTimeFormat('en-US', { weekday: 'short', timeZone }).format(noonUtc);
  const map: Record<string, number> = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 };
  return map[weekdayName] ?? isoWeekday(noonUtc);
}

/**
 * ISO weekday from a UTC instant: 1 = Monday … 7 = Sunday.
 *
 * @param {Date} date - UTC instant.
 * @returns {number} ISO weekday.
 */
function isoWeekday(date: Date): number {
  const jsDay = date.getUTCDay();
  return jsDay === 0 ? 7 : jsDay;
}

/**
 * Whether an existing session should be patched with the incoming optional fields.
 *
 * @param {{ maxCapacity: number | null }} existing - Persisted session.
 * @param {{ maxCapacity?: number }} next - Incoming values.
 * @returns {boolean} True when capacity or times need updating.
 */
function shouldPatchSession(
  existing: { maxCapacity: number | null },
  next: { maxCapacity?: number },
): boolean {
  return next.maxCapacity !== undefined && existing.maxCapacity !== next.maxCapacity;
}

/**
 * Resolves the roster age ranges from explicit query codes, then the session's stored bracket ids.
 *
 * @param {string[]} sessionBracketIds - Logical AgeBracket ids on the session.
 * @param {AgeBracketRange[]} catalog - Tenant catalog.
 * @param {SessionRosterQueryDto} query - Optional staff override.
 * @returns {AgeBracketRange[]} Ranges to apply (empty = no age filter).
 */
function resolveSelectedRanges(
  sessionBracketIds: string[],
  catalog: AgeBracketRange[],
  query: SessionRosterQueryDto,
): AgeBracketRange[] {
  if (query.minAge !== undefined || query.maxAge !== undefined) {
    return [{ code: 'custom', minAge: query.minAge ?? 0, maxAge: query.maxAge ?? 999 }];
  }

  const queryCodes = [
    ...(query.ageBrackets ?? []),
    ...(query.ageBracket ? [query.ageBracket] : []),
  ];
  if (queryCodes.length > 0) {
    return catalog.filter((row) => queryCodes.includes(row.code));
  }

  if (sessionBracketIds.length > 0) {
    return catalog.filter((row) => row.id && sessionBracketIds.includes(row.id));
  }

  return [];
}
