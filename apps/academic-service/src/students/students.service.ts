/**
 * @file students.service.ts
 * @description Core service handling student profile operations within the academic bounded context.
 * Owns profiles, guardians' links, enrollments, ranks and the status audit log. Identities (users) are owned
 * by the auth-service: they are provisioned/updated over HTTP BEFORE the local Prisma transaction opens
 * (no network I/O while holding DB locks) and merged in memory when building responses.
 */

import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { Prisma } from '@dms/database/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuthenticatedUser, Role, UserSummary } from '@dms/shared-types';
import { CreateStudentDto, GuardianDto, StudentDisciplineAssignmentDto, StudentStatusEnum } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { UsersDirectoryClient } from '../users-directory/users-directory.client';

/** Roles allowed to read any student profile. */
const STAFF_READ_ROLES: Role[] = [Role.SUPER_ADMIN, Role.ADMIN_STAFF, Role.INSTRUCTOR];
/** Roles allowed to modify a student profile directly (others only propose changes). */
const STAFF_WRITE_ROLES: Role[] = [Role.SUPER_ADMIN, Role.ADMIN_STAFF];

/** Prisma interactive-transaction client; every write of a unit of work must go through the same instance. */
type TransactionClient = Parameters<Parameters<PrismaService['$transaction']>[0]>[0];

/** A guardian whose identity has already been provisioned in the auth-service. */
interface ResolvedGuardian {
  userId: string;
  relationship: string | undefined;
}

/**
 * Academic owner of student profiles, guardian links, enrollments, ranks, and status history.
 * Cross-domain identities are fetched from auth-service over HTTP, never via Prisma joins.
 */
@Injectable()
export class StudentsService {
  /**
   * @param {PrismaService} prisma - Database access limited to the academic domain.
   * @param {UsersDirectoryClient} usersClient - HTTP client for identities owned by the auth-service.
   */
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersClient: UsersDirectoryClient,
  ) {}

  /**
   * Retrieves a single student profile with ranks, guardians and chronological status history.
   * Identities (student, guardians, and status-change authors) come from ONE batch call and are merged in memory.
   *
   * @param {string} id - Student profile UUID.
   * @param {AuthenticatedUser} requestUser - Authenticated caller (staff or the profile owner).
   * @returns {Promise<object>} Profile enriched with `user`, `guardians[].guardian.user` and `statusHistory[].changedBy`.
   * @throws {NotFoundException} If the profile does not exist.
   * @throws {ForbiddenException} If the caller is neither staff nor the owner.
   * @throws {ServiceUnavailableException} If the auth-service is unreachable.
   */
  async findOne(id: string, requestUser: AuthenticatedUser) {
    const student = await this.prisma.studentProfile.findUnique({
      where: { id },
      include: {
        statusHistory: { orderBy: { createdAt: 'desc' } },
        ranks: { include: { beltRank: { include: { program: { include: { discipline: true } } } } } },
        guardians: { include: { guardian: true } },
      },
    });

    if (!student) throw new NotFoundException('STUDENT_PROFILE_NOT_FOUND');

    this.assertCanRead(student.userId, requestUser);

    const users = await this.usersClient.findManyByIds([
      student.userId,
      ...student.guardians.map((link) => link.guardian.userId),
      ...student.statusHistory.map((entry) => entry.changedById),
    ]);

    return {
      ...student,
      user: users.get(student.userId) ?? null,
      statusHistory: student.statusHistory.map((entry) => {
        const author = entry.changedById ? users.get(entry.changedById) : undefined;
        return { ...entry, changedBy: author ? { firstName: author.firstName, lastName: author.lastName } : null };
      }),
      guardians: student.guardians.map((link) => ({
        ...link,
        guardian: { ...link.guardian, user: users.get(link.guardian.userId) ?? null },
      })),
    };
  }

  /**
   * Creates a student profile. Identities are provisioned over HTTP first (idempotent, safe to retry);
   * the profile, audit log, guardian links and ranks are then written in a single local transaction.
   * If that transaction fails, the provisioned identities stay (no cross-service rollback).
   *
   * @param {CreateStudentDto} payload - Student, guardians, emergency contacts and disciplines.
   * @param {AuthenticatedUser} [requestUser] - Caller, recorded as author of the initial status entry.
   * @returns {Promise<object>} The new profile plus the student's resolved `user`.
   * @throws {NotFoundException} If an explicit `userId` does not exist in the auth-service.
   * @throws {BadRequestException} If the user already has a student profile.
   * @throws {ConflictException} If a DNI belongs to another identity.
   * @throws {ServiceUnavailableException} If the auth-service is unreachable.
   */
  async create(payload: CreateStudentDto, requestUser?: AuthenticatedUser) {
    const { isMinor, guardians, disciplines } = payload;

    // Network I/O happens before the transaction opens so no DB locks are held while waiting on the auth-service.
    const studentUser = await this.provisionStudentIdentity(payload);
    const resolvedGuardians = isMinor && guardians?.length ? await this.provisionGuardians(guardians) : [];

    // Single atomic unit: if any step fails, nothing local is persisted.
    const studentProfile = await this.prisma.$transaction(async (tx) => {
      const profile = await this.createCoreProfile(tx, studentUser.id, payload, requestUser);
      await this.linkGuardians(tx, profile.id, resolvedGuardians);
      await this.assignDisciplines(tx, profile.id, disciplines ?? []);
      return profile;
    });

    return { ...studentProfile, user: studentUser };
  }

  /**
   * Updates personal information, guardians, discipline ranks, and logs status transitions.
   * Staff changes are applied directly; other callers only create a change request.
   * Identity changes (personal data, guardian accounts) are sent to the auth-service BEFORE the local transaction.
   *
   * @param {string} id - Student profile UUID.
   * @param {UpdateStudentDto} updateData - Partial update payload.
   * @param {AuthenticatedUser} requestUser - Authenticated caller.
   * @returns {Promise<object>} The refreshed profile (staff) or the created update request (others).
   * @throws {NotFoundException} If the profile or a referenced identity does not exist.
   * @throws {ForbiddenException} If the caller is neither staff nor the owner.
   * @throws {ConflictException} If a DNI belongs to another identity.
   * @throws {ServiceUnavailableException} If the auth-service is unreachable.
   */
  async updateProfile(id: string, updateData: UpdateStudentDto, requestUser: AuthenticatedUser) {
    const student = await this.findAuthorizedProfile(id, requestUser);
    const isStaff = (requestUser.roles || []).some((r: Role) => STAFF_WRITE_ROLES.includes(r));

    if (!isStaff) {
      return this.prisma.profileUpdateRequest.create({ data: { studentProfileId: student.id, requestedChanges: instanceToPlain(updateData) } });
    }

    // 1. Identity changes go through the auth-service, outside any DB transaction.
    if (updateData.userData) {
      const { firstName, lastName, phone, address, city, state, postalCode, country, birthDate } = updateData.userData;
      await this.usersClient.updatePersonalData(student.userId, {
        firstName, lastName, phone, address, city, state, postalCode, country, birthDate: birthDate || undefined,
      });
    }

    const resolvedGuardians: ResolvedGuardian[] =
      updateData.isMinor && updateData.guardians?.length ? await this.provisionGuardians(updateData.guardians) : [];

    await this.prisma.$transaction(async (tx) => {
      // 2. State Machine: Process lifecycle status change and write Audit Log
      if (updateData.status !== undefined && updateData.status !== student.status) {
        await tx.studentProfile.update({
          where: { id: student.id },
          data: { status: updateData.status as any },
        });

        await tx.studentStatusHistory.create({
          data: {
            studentProfileId: student.id,
            previousStatus: student.status as any,
            newStatus: updateData.status as any,
        reason: updateData.statusReason || 'Status changed manually',
        changedById: requestUser?.userId ?? null,
          },
        });
      }

      // 3. Lightweight Contacts (Adults)
      if (updateData.emergencyContacts !== undefined) {
        await tx.studentProfile.update({
          where: { id: student.id },
          data: { emergencyContacts: instanceToPlain(updateData.emergencyContacts) as Prisma.InputJsonValue },
        });
      }

      // 4. Heavy Guardians (Minors): replace the whole link set
      if (updateData.isMinor !== undefined) {
        await tx.studentGuardian.deleteMany({ where: { studentProfileId: student.id } });
        await this.linkGuardians(tx, student.id, resolvedGuardians);
      }

      // 5. Disciplines and Belts
      if (updateData.disciplines && Array.isArray(updateData.disciplines)) {
        const currentRanks = await tx.studentRank.findMany({ where: { studentProfileId: student.id }, include: { beltRank: { include: { program: true } } } });
        const targetAssignments = updateData.disciplines;
        const targetDisciplineIds = targetAssignments.map((d) => d.disciplineId);

        for (const rank of currentRanks.filter(r => !targetDisciplineIds.includes(r.beltRank.program.disciplineId))) {
          await tx.studentRank.delete({ where: { id: rank.id } });
        }

        for (const item of targetAssignments) {
          const targetBeltId = await this.resolveBeltRankId(tx, item);
          if (!targetBeltId) continue;

          const existingRank = currentRanks.find(r => r.beltRank.program.disciplineId === item.disciplineId);
          if (existingRank) {
            await tx.studentRank.update({ where: { id: existingRank.id }, data: { beltRankId: targetBeltId, currentStripes: item.currentStripes ?? existingRank.currentStripes } });
          } else {
            await tx.studentRank.create({ data: { studentProfileId: student.id, beltRankId: targetBeltId, currentStripes: item.currentStripes ?? 0 } });
          }
        }
      }
    });

    // Read after commit so the response reflects the final state.
    return this.findOne(id, requestUser);
  }

  /**
   * Lists every student profile with ranks and guardians. All identities are resolved with
   * a constant number of HTTP calls (chunked batch) and merged in memory.
   *
   * @returns {Promise<object[]>} Profiles enriched with `user` and `guardians[].guardian.user`; ranks flattened for the UI.
   * @throws {ServiceUnavailableException} If the auth-service is unreachable.
   */
  async findAll() {
    const students = await this.prisma.studentProfile.findMany({
      include: {
        ranks: { include: { beltRank: { include: { program: { include: { discipline: true } } } } } },
        guardians: { include: { guardian: true } },
      },
    });

    const users = await this.usersClient.findManyByIds(
      students.flatMap((student) => [student.userId, ...student.guardians.map((link) => link.guardian.userId)]),
    );

    return students.map(student => ({
      ...student,
      user: users.get(student.userId) ?? null,
      guardians: student.guardians.map((link) => ({
        ...link,
        guardian: { ...link.guardian, user: users.get(link.guardian.userId) ?? null },
      })),
      ranks: student.ranks.map(rank => ({
        id: rank.id, beltRankId: rank.beltRankId, disciplineId: rank.beltRank?.program?.disciplineId,
        disciplineName: rank.beltRank?.program?.discipline?.name || 'Unknown Discipline',
        beltName: rank.beltRank?.name || 'Unknown Belt', currentStripes: rank.currentStripes,
      })),
    }));
  }

  /**
   * Deletes a student profile. The identity in the auth-service is intentionally left untouched.
   *
   * @param {string} id - Student profile UUID.
   * @returns {Promise<object>} The deleted profile record.
   * @throws {NotFoundException} If the profile does not exist.
   */
  async remove(id: string) {
    const student = await this.prisma.studentProfile.findUnique({ where: { id } });
    if (!student) throw new NotFoundException('STUDENT_PROFILE_NOT_FOUND');
    return this.prisma.studentProfile.delete({ where: { id } });
  }

  /**
   * Enforces read access: staff, or the owner of the profile.
   *
   * @param {string} ownerUserId - Identity that owns the profile.
   * @param {AuthenticatedUser} requestUser - Authenticated caller.
   * @returns {void}
   * @throws {ForbiddenException} If the caller is neither staff nor the owner.
   */
  private assertCanRead(ownerUserId: string, requestUser: AuthenticatedUser): void {
    const isStaff = (requestUser.roles || []).some((r) => STAFF_READ_ROLES.includes(r));
    if (!isStaff && ownerUserId !== requestUser.userId) throw new ForbiddenException('FORBIDDEN');
  }

  /**
   * Loads the bare profile and checks access, without touching the auth-service.
   *
   * @param {string} id - Student profile UUID.
   * @param {AuthenticatedUser} requestUser - Authenticated caller.
   * @returns {Promise<{ id: string; userId: string; status: string }>} The profile row.
   * @throws {NotFoundException} If the profile does not exist.
   * @throws {ForbiddenException} If the caller is neither staff nor the owner.
   */
  private async findAuthorizedProfile(id: string, requestUser: AuthenticatedUser) {
    const student = await this.prisma.studentProfile.findUnique({ where: { id } });
    if (!student) throw new NotFoundException('STUDENT_PROFILE_NOT_FOUND');
    this.assertCanRead(student.userId, requestUser);
    return student;
  }

  /**
   * Finds or creates the student's identity in the auth-service and grants it the STUDENT role.
   * When enrolling an existing user by id only contact data is refreshed (names are kept).
   *
   * @param {CreateStudentDto} payload - Creation payload.
   * @returns {Promise<UserSummary>} The student's identity.
   */
  private provisionStudentIdentity(payload: CreateStudentDto): Promise<UserSummary> {
    const { isExistingUser, userId, userData } = payload;

    if (isExistingUser && userId) {
      const { dni, birthDate, phone, address, city, state, postalCode } = userData;
      return this.usersClient.provision({ userId, role: Role.STUDENT, dni, birthDate: birthDate || undefined, phone, address, city, state, postalCode });
    }

    return this.usersClient.provision({ ...userData, birthDate: userData.birthDate || undefined, role: Role.STUDENT });
  }

  /**
   * Finds or creates the guardians' identities in the auth-service (role PARENT), one at a time
   * so repeated emails in the same payload cannot race.
   *
   * @param {GuardianDto[]} guardians - Guardians as submitted by the client.
   * @returns {Promise<ResolvedGuardian[]>} Identity id and relationship label of each guardian.
   */
  private async provisionGuardians(guardians: GuardianDto[]): Promise<ResolvedGuardian[]> {
    const resolved: ResolvedGuardian[] = [];

    for (const guardian of guardians) {
      const user = await this.usersClient.provision({
        // Forms send '' for guardians without an account; the directory validates userId as a UUID.
        userId: guardian.userId || undefined,
        email: guardian.email,
        firstName: guardian.firstName,
        lastName: guardian.lastName,
        phone: guardian.phone,
        dni: guardian.dni,
        role: Role.PARENT,
      });

      resolved.push({
        userId: user.id,
        relationship: guardian.relationship === 'Otro' ? guardian.customRelationship : guardian.relationship,
      });
    }

    return resolved;
  }

  /**
   * Inserts the student's core profile and its initial audit-log entry.
   * Emergency contacts are only stored for adults (minors use guardians instead).
   *
   * @param {TransactionClient} tx - Active transaction client (keeps the whole creation atomic).
   * @param {string} userId - Identity the profile belongs to.
   * @param {CreateStudentDto} payload - Creation payload.
   * @param {AuthenticatedUser} [requestUser] - Caller, recorded as author of the initial status entry.
   * @returns {Promise<{ id: string }>} The persisted profile.
   * @throws {BadRequestException} If the identity already has a student profile.
   */
  private async createCoreProfile(
    tx: TransactionClient,
    userId: string,
    payload: CreateStudentDto,
    requestUser?: AuthenticatedUser,
  ) {
    const initialStatus = payload.status || StudentStatusEnum.ACTIVE;

    const existingProfile = await tx.studentProfile.findUnique({ where: { userId } });
    if (existingProfile) throw new BadRequestException('STUDENT_PROFILE_ALREADY_EXISTS');

    const profile = await tx.studentProfile.create({
      data: {
        userId,
        status: initialStatus as any, // Mapped to Prisma enum
        emergencyContacts: (!payload.isMinor && payload.emergencyContacts) ? (payload.emergencyContacts as any) : [],
      },
    });

    // Initial log of the state-machine audit history.
    await tx.studentStatusHistory.create({
      data: {
        studentProfileId: profile.id,
        previousStatus: null,
        newStatus: initialStatus as any,
        reason: 'Initial enrollment',
        changedById: requestUser?.userId ?? null,
      },
    });

    return profile;
  }

  /**
   * Links already-provisioned guardian identities to a student, creating local `Guardian` rows as needed.
   *
   * @param {TransactionClient} tx - Active transaction client.
   * @param {string} studentProfileId - Student profile UUID.
   * @param {ResolvedGuardian[]} guardians - Guardian identities and relationship labels.
   * @returns {Promise<void>} Resolves once every link row is written.
   */
  private async linkGuardians(tx: TransactionClient, studentProfileId: string, guardians: ResolvedGuardian[]): Promise<void> {
    for (const link of guardians) {
      let guardian = await tx.guardian.findUnique({ where: { userId: link.userId } });
      if (!guardian) guardian = await tx.guardian.create({ data: { userId: link.userId } });

      await tx.studentGuardian.create({
        data: { studentProfileId, guardianId: guardian.id, relationship: link.relationship },
      });
    }
  }

  /**
   * Enrolls a student in the requested disciplines, starting each at the given belt or the lowest one.
   * Disciplines without any belt rank are skipped.
   *
   * @param {TransactionClient} tx - Active transaction client.
   * @param {string} studentProfileId - Student profile UUID.
   * @param {StudentDisciplineAssignmentDto[]} disciplines - Requested enrollments.
   * @returns {Promise<void>} Resolves once every rank row is written.
   */
  private async assignDisciplines(
    tx: TransactionClient,
    studentProfileId: string,
    disciplines: StudentDisciplineAssignmentDto[],
  ): Promise<void> {
    for (const item of disciplines) {
      const beltRankId = await this.resolveBeltRankId(tx, item);

      if (beltRankId) {
        await tx.studentRank.create({
          data: { studentProfileId, beltRankId, currentStripes: item.currentStripes ?? 0 },
        });
      }
    }
  }

  /**
   * Resolves the belt a discipline assignment starts at: the explicit one, or the lowest of the discipline.
   *
   * @param {TransactionClient} tx - Active transaction client.
   * @param {StudentDisciplineAssignmentDto} item - Discipline assignment.
   * @returns {Promise<string | undefined>} Belt rank id, or `undefined` if the discipline has no belts.
   */
  private async resolveBeltRankId(tx: TransactionClient, item: StudentDisciplineAssignmentDto): Promise<string | undefined> {
    if (item.beltRankId) return item.beltRankId;

    const lowestBelt = await tx.beltRank.findFirst({
      where: { program: { disciplineId: item.disciplineId } },
      orderBy: { order: 'asc' },
    });

    return lowestBelt?.id;
  }
}
