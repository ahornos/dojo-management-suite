/**
 * @file students.service.ts
 * @description Core service handling student profile operations within the academic bounded context.
 * Owns profiles, guardians' links, enrollments, ranks and the status audit log. Identities (users) are owned
 * by the auth-service: they are provisioned/updated over HTTP BEFORE the local Prisma transaction opens
 * (no network I/O while holding DB locks) and merged in memory when building responses.
 *
 * Adults have a login `User` linked via `StudentProfile.userId`. Minors have no User (`userId` is null)
 * and are reachable through `StudentGuardian` → parent `User`.
 */

import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import { Prisma, StudentStatus } from '@dms/database/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuthenticatedUser, Role, UserSummary } from '@dms/shared-types';
import { CreateStudentDto, GuardianDto, StudentDisciplineAssignmentDto, StudentStatusEnum, StudentUserDataDto } from './dto/create-student.dto';
import { CreateTrialStudentDto, isTrialAdult } from './dto/create-trial-student.dto';
import { UpdateStudentDto, UpdateStudentUserDataDto } from './dto/update-student.dto';
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

/** Profile fields needed to build a public identity projection. */
interface ProfileIdentitySource {
  userId: string | null;
  firstName: string;
  lastName: string;
  dni: string | null;
  birthDate: Date | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
  gender: string | null;
}

/** Display identity returned on student payloads. Login `id`/`email` are null for minors. */
type PublicStudentIdentity = Omit<UserSummary, 'id' | 'email'> & {
  id: string | null;
  email: string | null;
};

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
   * @param {AuthenticatedUser} requestUser - Authenticated caller (staff, owner, or linked parent).
   * @returns {Promise<object>} Profile enriched with `user`, `guardians[].guardian.user` and `statusHistory[].changedBy`.
   * @throws {NotFoundException} If the profile does not exist.
   * @throws {ForbiddenException} If the caller is neither staff, owner, nor a linked guardian.
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

    this.assertCanRead(student, requestUser);

    const users = await this.usersClient.findManyByIds(this.collectIdentityIds([student]));

    return {
      ...student,
      user: this.toPublicIdentity(student, users),
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
   * Creates a student profile. Adult identities are provisioned over HTTP first (idempotent, safe to retry).
   * Minors have no User: only parent/guardian identities are provisioned, then the profile is stored with
   * `userId: null`. Academic writes run in a single local transaction.
   *
   * @param {CreateStudentDto} payload - Student, guardians, emergency contacts and disciplines.
   * @param {AuthenticatedUser} [requestUser] - Caller, recorded as author of the initial status entry.
   * @returns {Promise<object>} The new profile plus the student's resolved `user` (null id for minors).
   * @throws {NotFoundException} If an explicit `userId` does not exist in the auth-service.
   * @throws {BadRequestException} If the user already has a student profile, a minor has no guardians, or an adult has no email.
   * @throws {ConflictException} If a DNI belongs to another identity.
   * @throws {ServiceUnavailableException} If the auth-service is unreachable.
   */
  async create(payload: CreateStudentDto, requestUser?: AuthenticatedUser) {
    const { isMinor, guardians, disciplines } = payload;

    if (isMinor && !guardians?.length) {
      throw new BadRequestException('GUARDIANS_REQUIRED_FOR_MINOR');
    }
    if (!isMinor && !payload.isExistingUser && !payload.userData.email) {
      throw new BadRequestException('STUDENT_EMAIL_REQUIRED');
    }

    // Network I/O happens before the transaction opens so no DB locks are held while waiting on the auth-service.
    const studentUser = isMinor ? null : await this.provisionStudentIdentity(payload);
    const resolvedGuardians = isMinor && guardians?.length ? await this.provisionGuardians(guardians) : [];

    // Single atomic unit: if any step fails, nothing local is persisted.
    const studentProfile = await this.prisma.$transaction(async (tx) => {
      const profile = await this.createCoreProfile(tx, studentUser?.id ?? null, payload, requestUser);
      await this.linkGuardians(tx, profile.id, resolvedGuardians);
      await this.assignDisciplines(tx, profile.id, disciplines ?? []);
      return profile;
    });

    return {
      ...studentProfile,
      user: studentUser ?? this.toPublicIdentity(studentProfile, new Map()),
      guardians: resolvedGuardians.map((link) => ({
        guardian: { userId: link.userId, user: { id: link.userId } },
      })),
    };
  }

  /**
   * Registers a TRIAL prospect. Adults get a lightweight auth-service identity (`Role.TRIAL`).
   * Minors exist only as a `StudentProfile` (`userId` null) with guardian contact on emergencyContacts.
   *
   * @param {CreateTrialStudentDto} payload - Prospect identity, age-dependent contacts, and discipline.
   * @param {AuthenticatedUser} [requestUser] - Caller recorded on the initial status-history row.
   * @returns {Promise<object>} The TRIAL profile plus the provisioned identity (null user id for minors).
   * @throws {BadRequestException} If the discipline does not exist or the identity already has a profile.
   * @throws {ServiceUnavailableException} If the auth-service is unreachable.
   */
  async createTrial(payload: CreateTrialStudentDto, requestUser?: AuthenticatedUser) {
    const discipline = await this.prisma.discipline.findUnique({ where: { id: payload.disciplineId } });
    if (!discipline) {
      throw new BadRequestException('DISCIPLINE_NOT_FOUND');
    }

    const adult = isTrialAdult(payload.birthDate);
    const studentUser = adult
      ? await this.usersClient.provision({
          email: payload.email,
          firstName: payload.firstName,
          lastName: payload.lastName,
          role: Role.TRIAL,
        })
      : null;

    const emergencyContacts = adult
      ? []
      : [{ name: payload.guardianName, phone: payload.guardianPhone, relationship: 'Guardian' }];

    const studentProfile = await this.prisma.$transaction(async (tx) => {
      if (studentUser) {
        const existingProfile = await tx.studentProfile.findUnique({ where: { userId: studentUser.id } });
        if (existingProfile) {
          throw new BadRequestException('STUDENT_PROFILE_ALREADY_EXISTS');
        }
      }

      const profile = await tx.studentProfile.create({
        data: {
          userId: studentUser?.id ?? null,
          firstName: payload.firstName,
          lastName: payload.lastName,
          birthDate: new Date(payload.birthDate),
          phone: adult ? payload.phone ?? null : payload.guardianPhone ?? null,
          status: StudentStatus.TRIAL,
          emergencyContacts: emergencyContacts as Prisma.InputJsonValue,
        },
      });

      await tx.studentStatusHistory.create({
        data: {
          studentProfileId: profile.id,
          previousStatus: null,
          newStatus: StudentStatus.TRIAL,
          reason: 'Trial registration',
          changedById: requestUser?.userId ?? null,
        },
      });

      await this.assignDisciplines(tx, profile.id, [{ disciplineId: payload.disciplineId }]);
      return profile;
    });

    return { ...studentProfile, user: studentUser ?? this.toPublicIdentity(studentProfile, new Map()) };
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
   * @throws {ForbiddenException} If the caller is neither staff, owner, nor a linked guardian.
   * @throws {ConflictException} If a DNI belongs to another identity.
   * @throws {ServiceUnavailableException} If the auth-service is unreachable.
   */
  async updateProfile(id: string, updateData: UpdateStudentDto, requestUser: AuthenticatedUser) {
    const student = await this.findAuthorizedProfile(id, requestUser);
    const isStaff = (requestUser.roles || []).some((r: Role) => STAFF_WRITE_ROLES.includes(r));

    if (!isStaff) {
      return this.prisma.profileUpdateRequest.create({ data: { studentProfileId: student.id, requestedChanges: instanceToPlain(updateData) } });
    }

    // 1. Login-identity changes go through auth-service only when the student has a User.
    // Demographics stay on StudentProfile and are never PATCHed to auth.
    if (updateData.userData && student.userId) {
      const { firstName, lastName, gender } = updateData.userData;
      if (firstName !== undefined || lastName !== undefined || gender !== undefined) {
        await this.usersClient.updatePersonalData(student.userId, { firstName, lastName, gender });
      }
    }

    const resolvedGuardians: ResolvedGuardian[] =
      updateData.isMinor && updateData.guardians?.length ? await this.provisionGuardians(updateData.guardians) : [];

    await this.prisma.$transaction(async (tx) => {
      const profilePatch: Prisma.StudentProfileUpdateInput = {
        ...this.toProfileDemographics(updateData.userData),
      };
      if (updateData.bankMandateId !== undefined) {
        profilePatch.bankMandateId = updateData.bankMandateId;
      }

      // 2. State Machine: Process lifecycle status change and write Audit Log
      if (updateData.status !== undefined && updateData.status !== student.status) {
        profilePatch.status = updateData.status as StudentStatus;

        await tx.studentStatusHistory.create({
          data: {
            studentProfileId: student.id,
            previousStatus: student.status,
            newStatus: updateData.status as StudentStatus,
            reason: updateData.statusReason || 'Status changed manually',
            leaveReason: updateData.leaveReason,
            leaveNoticeMethod: updateData.leaveNoticeMethod,
            customReasonDetails: updateData.customReasonDetails,
            changedById: requestUser?.userId ?? null,
          },
        });
      }

      // 3. Lightweight Contacts (Adults)
      if (updateData.emergencyContacts !== undefined) {
        profilePatch.emergencyContacts = instanceToPlain(updateData.emergencyContacts) as Prisma.InputJsonValue;
      }

      if (Object.keys(profilePatch).length > 0) {
        await tx.studentProfile.update({
          where: { id: student.id },
          data: profilePatch,
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
        statusHistory: { orderBy: { createdAt: 'asc' }, take: 30 },
      },
    });

    const users = await this.usersClient.findManyByIds(this.collectIdentityIds(students));

    return students.map(student => ({
      ...student,
      user: this.toPublicIdentity(student, users),
      guardians: student.guardians.map((link) => ({
        ...link,
        guardian: { ...link.guardian, user: users.get(link.guardian.userId) ?? null },
      })),
      ranks: student.ranks.map((rank) => ({
        id: rank.id,
        beltRankId: rank.beltRankId,
        disciplineId: rank.beltRank?.program?.disciplineId,
        disciplineName: rank.beltRank?.program?.discipline?.name || 'Unknown Discipline',
        disciplineAcronym: rank.beltRank?.program?.discipline?.acronym ?? null,
        beltName: rank.beltRank?.name || 'Unknown Belt',
        currentStripes: rank.currentStripes,
        maxStripes: rank.beltRank?.maxStripes ?? 0,
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
   * Enforces read access: staff, the login owner, or a linked parent/guardian.
   *
   * @param {{ userId: string | null; guardians?: Array<{ guardian: { userId: string } }> }} student - Profile under inspection.
   * @param {AuthenticatedUser} requestUser - Authenticated caller.
   * @returns {void}
   * @throws {ForbiddenException} If the caller is neither staff, owner, nor a linked guardian.
   */
  private assertCanRead(
    student: { userId: string | null; guardians?: Array<{ guardian: { userId: string } }> },
    requestUser: AuthenticatedUser,
  ): void {
    const isStaff = (requestUser.roles || []).some((r) => STAFF_READ_ROLES.includes(r));
    if (isStaff) return;
    if (student.userId && student.userId === requestUser.userId) return;
    if (student.guardians?.some((link) => link.guardian.userId === requestUser.userId)) return;
    throw new ForbiddenException('FORBIDDEN');
  }

  /**
   * Loads the profile with guardian links and checks access, without touching the auth-service.
   *
   * @param {string} id - Student profile UUID.
   * @param {AuthenticatedUser} requestUser - Authenticated caller.
   * @returns {Promise<object>} The profile row including guardian links.
   * @throws {NotFoundException} If the profile does not exist.
   * @throws {ForbiddenException} If the caller is neither staff, owner, nor a linked guardian.
   */
  private async findAuthorizedProfile(id: string, requestUser: AuthenticatedUser) {
    const student = await this.prisma.studentProfile.findUnique({
      where: { id },
      include: { guardians: { include: { guardian: true } } },
    });
    if (!student) throw new NotFoundException('STUDENT_PROFILE_NOT_FOUND');
    this.assertCanRead(student, requestUser);
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
      return this.usersClient.provision({
        userId,
        role: Role.STUDENT,
        gender: userData.gender,
      });
    }

    return this.usersClient.provision({
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      gender: userData.gender,
      role: Role.STUDENT,
    });
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
   * @param {string | null} userId - Login identity, or null for minors.
   * @param {CreateStudentDto} payload - Creation payload.
   * @param {AuthenticatedUser} [requestUser] - Caller, recorded as author of the initial status entry.
   * @returns {Promise<object>} The persisted profile.
   * @throws {BadRequestException} If the identity already has a student profile.
   */
  private async createCoreProfile(
    tx: TransactionClient,
    userId: string | null,
    payload: CreateStudentDto,
    requestUser?: AuthenticatedUser,
  ) {
    const initialStatus = payload.status || StudentStatusEnum.ACTIVE;

    if (userId) {
      const existingProfile = await tx.studentProfile.findUnique({ where: { userId } });
      if (existingProfile) throw new BadRequestException('STUDENT_PROFILE_ALREADY_EXISTS');
    }

    const profile = await tx.studentProfile.create({
      data: {
        userId,
        ...this.toProfileCreateDemographics(payload.userData),
        status: initialStatus as StudentStatus,
        emergencyContacts: (!payload.isMinor && payload.emergencyContacts)
          ? (payload.emergencyContacts as unknown as Prisma.InputJsonValue)
          : [],
      },
    });

    // Initial log of the state-machine audit history.
    await tx.studentStatusHistory.create({
      data: {
        studentProfileId: profile.id,
        previousStatus: null,
        newStatus: initialStatus as StudentStatus,
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

  /**
   * Collects login and guardian identity ids, skipping null `userId` (minors).
   *
   * @param {Array<{ userId: string | null; guardians: Array<{ guardian: { userId: string } }>; statusHistory?: Array<{ changedById: string | null }> }>} students - Profiles to scan.
   * @returns {string[]} De-duplicated auth-service ids.
   */
  private collectIdentityIds(
    students: Array<{
      userId: string | null;
      guardians: Array<{ guardian: { userId: string } }>;
      statusHistory?: Array<{ changedById: string | null }>;
    }>,
  ): string[] {
    const ids: Array<string | null> = [];
    for (const student of students) {
      ids.push(student.userId);
      for (const link of student.guardians) {
        ids.push(link.guardian.userId);
      }
      for (const entry of student.statusHistory ?? []) {
        ids.push(entry.changedById);
      }
    }
    return ids.filter((id): id is string => Boolean(id));
  }

  /**
   * Merges a login User when present; otherwise projects academic demographics for minors.
   *
   * @param {ProfileIdentitySource} student - Profile demographics and optional login id.
   * @param {Map<string, UserSummary>} users - Batch-resolved identities.
   * @returns {PublicStudentIdentity | null} Public identity, or null when a login id is set but missing upstream.
   */
  private toPublicIdentity(student: ProfileIdentitySource, users: Map<string, UserSummary>): PublicStudentIdentity | null {
    if (student.userId) {
      const login = users.get(student.userId);
      return login ?? null;
    }

    return {
      id: null,
      email: null,
      firstName: student.firstName,
      lastName: student.lastName,
      gender: student.gender as UserSummary['gender'],
      isActive: false,
      roles: [],
    };
  }

  /**
   * Maps create `userData` onto academic profile columns (always written at insert).
   *
   * @param {StudentUserDataDto} userData - Personal data from the enrollment payload.
   * @returns {Prisma.StudentProfileCreateInput} Demographic fields.
   */
  private toProfileCreateDemographics(userData: StudentUserDataDto) {
    return {
      firstName: userData.firstName,
      lastName: userData.lastName,
      dni: userData.dni ?? null,
      birthDate: userData.birthDate ? new Date(userData.birthDate) : null,
      phone: userData.phone ?? null,
      address: userData.address ?? null,
      city: userData.city ?? null,
      state: userData.state ?? null,
      postalCode: userData.postalCode ?? null,
      country: userData.country ?? 'ES',
      gender: userData.gender ?? null,
    };
  }

  /**
   * Maps partial personal-data updates onto academic profile columns.
   *
   * @param {UpdateStudentUserDataDto | undefined} userData - Optional personal-data patch.
   * @returns {Prisma.StudentProfileUpdateInput} Only the fields that were sent.
   */
  private toProfileDemographics(userData?: UpdateStudentUserDataDto): Prisma.StudentProfileUpdateInput {
    if (!userData) return {};

    const data: Prisma.StudentProfileUpdateInput = {};
    if (userData.firstName !== undefined) data.firstName = userData.firstName;
    if (userData.lastName !== undefined) data.lastName = userData.lastName;
    if (userData.dni !== undefined) data.dni = userData.dni;
    if (userData.phone !== undefined) data.phone = userData.phone;
    if (userData.address !== undefined) data.address = userData.address;
    if (userData.city !== undefined) data.city = userData.city;
    if (userData.state !== undefined) data.state = userData.state;
    if (userData.postalCode !== undefined) data.postalCode = userData.postalCode;
    if (userData.country !== undefined) data.country = userData.country;
    if (userData.gender !== undefined) data.gender = userData.gender;
    if (userData.birthDate !== undefined) {
      data.birthDate = userData.birthDate ? new Date(userData.birthDate) : null;
    }
    return data;
  }
}
