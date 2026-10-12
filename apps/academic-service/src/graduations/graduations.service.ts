/**
 * @file graduations.service.ts
 * @description Evaluates belt-rank eligibility, proposes or executes graduations, and rolls back rank errors.
 */

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthenticatedUser, Role } from '@dms/shared-types';
import { ProposeGraduationDto } from './dto/propose-graduation.dto';

/**
 * Roles allowed to execute a graduation directly. Holders of any of them bypass the
 * proposal workflow even when they also hold the INSTRUCTOR role.
 */
const GRADUATION_EXECUTOR_ROLES: readonly Role[] = [
  Role.SUPER_ADMIN,
  Role.ADMIN_STAFF,
  Role.SPORTS_TECHNICAL_DIRECTOR,
];

/**
 * Service responsible for evaluating martial arts graduation eligibility,
 * handling graduation workflows, executing rank updates, and rolling back errors.
 */
@Injectable()
export class GraduationsService {
  /**
   * @param {PrismaService} prisma - Academic-domain Prisma client.
   */
  constructor(private prisma: PrismaService) {}

  /**
   * Applies the graduation workflow that matches the caller's roles: instructors without an executor role
   * can only PROPOSE a graduation (pending approval); executor roles graduate the student directly.
   * The JWT carries a roles ARRAY, so every held role is evaluated.
   *
   * @param {string} studentProfileId - Student profile UUID.
   * @param {AuthenticatedUser} user - Authenticated caller.
   * @param {ProposeGraduationDto} [dto] - Optional proposal details (used only when proposing).
   * @returns {Promise<object>} The created graduation request, or the updated/created rank.
   * @throws {NotFoundException} If the student (or its active rank) does not exist.
   * @throws {BadRequestException} If the student is already at the highest belt.
   */
  async graduateOrPropose(studentProfileId: string, user: AuthenticatedUser, dto?: ProposeGraduationDto) {
    const isProposerOnly =
      user.roles.includes(Role.INSTRUCTOR) && !user.roles.some((role) => GRADUATION_EXECUTOR_ROLES.includes(role));

    if (isProposerOnly) {
      return this.proposeGraduation(studentProfileId, user.userId, dto);
    }

    return this.executeGraduation(studentProfileId);
  }

  /**
   * Compares time-in-rank and counted attendances against the active belt criteria.
   *
   * @param {string} studentProfileId - Student profile UUID.
   * @returns {Promise<object>} Current belt, metrics, and eligibility flags.
   * @throws {NotFoundException} If the student profile does not exist.
   * @throws {BadRequestException} If the student has no active rank.
   */
  async evaluateGraduationEligibility(studentProfileId: string) {
    const student = await this.prisma.studentProfile.findUnique({
      where: { id: studentProfileId },
      include: {
        ranks: {
          orderBy: { promotedAt: 'desc' },
          take: 1,
          include: { beltRank: { include: { program: true } } },
        },
        attendances: { where: { countedForRank: true } },
      },
    });

    if (!student) throw new NotFoundException('STUDENT_PROFILE_NOT_FOUND');
    
    const activeRank = student.ranks[0];
    if (!activeRank) throw new BadRequestException('STUDENT_HAS_NO_ACTIVE_RANK');

    const beltCriteria = activeRank.beltRank;
    const now = new Date();
    const promotedAt = new Date(activeRank.promotedAt);
    const monthsInRank = (now.getFullYear() - promotedAt.getFullYear()) * 12 + (now.getMonth() - promotedAt.getMonth());
    const trainingHours = student.attendances.filter((att) => new Date(att.date) >= promotedAt).length;

    const meetsMonths = monthsInRank >= beltCriteria.minMonthsRequired;
    const meetsHours = trainingHours >= beltCriteria.minHoursRequired;
    const isEligible = meetsMonths && meetsHours;

    return {
      studentProfileId,
      currentBelt: beltCriteria.name,
      currentStripes: activeRank.currentStripes,
      maxStripes: beltCriteria.maxStripes,
      requirements: { minMonthsRequired: beltCriteria.minMonthsRequired, minHoursRequired: beltCriteria.minHoursRequired },
      currentMetrics: { monthsInRank, accumulatedHours: trainingHours },
      eligibility: { meetsMonths, meetsHours, isEligible },
    };
  }

  /**
   * Creates a `PENDING` graduation request for staff review.
   *
   * @param {string} studentProfileId - Student profile UUID.
   * @param {string} instructorId - Identity of the proposing instructor.
   * @param {ProposeGraduationDto} [dto] - Optional proposed belt and stripe count.
   * @returns {Promise<object>} The persisted graduation request.
   * @throws {NotFoundException} If the student profile does not exist.
   */
  async proposeGraduation(studentProfileId: string, instructorId: string, dto?: ProposeGraduationDto) {
    const student = await this.prisma.studentProfile.findUnique({
      where: { id: studentProfileId },
    });

    if (!student) {
      throw new NotFoundException('STUDENT_PROFILE_NOT_FOUND');
    }

    return this.prisma.graduationRequest.create({
      data: {
        studentProfileId,
        proposedById: instructorId,
        proposedBeltId: dto?.proposedBeltId,
        proposedStripes: dto?.proposedStripes,
        status: 'PENDING',
      },
    });
  }

  /**
   * Awards the next stripe, or creates a new rank at the following belt when stripes are maxed.
   *
   * @param {string} studentProfileId - Student profile UUID.
   * @returns {Promise<object>} The updated or newly created `StudentRank`.
   * @throws {NotFoundException} If the student has no active rank.
   * @throws {BadRequestException} If the student is already at the highest belt.
   */
  async executeGraduation(studentProfileId: string) {
    const student = await this.prisma.studentProfile.findUnique({
      where: { id: studentProfileId },
      include: {
        ranks: {
          orderBy: { promotedAt: 'desc' },
          take: 1,
          include: { beltRank: { include: { program: { include: { beltRanks: { orderBy: { order: 'asc' } } } } } } },
        },
      },
    });

    if (!student || !student.ranks[0]) throw new NotFoundException('STUDENT_ACTIVE_RANK_NOT_FOUND');

    const activeRank = student.ranks[0];
    const currentBelt = activeRank.beltRank;
    const programBelts = currentBelt.program.beltRanks;

    if (activeRank.currentStripes < currentBelt.maxStripes) {
      return this.prisma.studentRank.update({
        where: { id: activeRank.id },
        data: { currentStripes: { increment: 1 }, lastStripeAt: new Date() },
      });
    }

    const nextBeltIndex = programBelts.findIndex((b) => b.id === currentBelt.id) + 1;
    if (nextBeltIndex >= programBelts.length) throw new BadRequestException('STUDENT_ALREADY_HIGHEST_RANK');

    const nextBelt = programBelts[nextBeltIndex];

    return this.prisma.$transaction(async (tx) => {
      return tx.studentRank.create({
        data: {
          studentProfileId,
          beltRankId: nextBelt.id,
          currentStripes: 0,
          accumulatedHours: 0,
          promotedAt: new Date(),
          lastStripeAt: new Date(),
        },
      });
    });
  }

  /**
   * Decrements the current stripe count, or deletes the newest rank to restore the previous one.
   *
   * @param {string} studentProfileId - Student profile UUID.
   * @returns {Promise<object>} The rank after rollback.
   * @throws {NotFoundException} If the student has no active rank.
   * @throws {BadRequestException} If the student is already at the initial rank with zero stripes.
   */
  async rollbackGraduation(studentProfileId: string) {
    const student = await this.prisma.studentProfile.findUnique({
      where: { id: studentProfileId },
      include: {
        ranks: { orderBy: { promotedAt: 'desc' }, take: 2, include: { beltRank: true } },
      },
    });

    if (!student || !student.ranks[0]) throw new NotFoundException('STUDENT_ACTIVE_RANK_NOT_FOUND');

    const currentRank = student.ranks[0];

    if (currentRank.currentStripes > 0) {
      return this.prisma.studentRank.update({
        where: { id: currentRank.id },
        data: { currentStripes: { decrement: 1 } },
      });
    }

    const previousRank = student.ranks[1];
    if (!previousRank) throw new BadRequestException('STUDENT_AT_INITIAL_RANK');

    return this.prisma.$transaction(async (tx) => {
      await tx.studentRank.delete({ where: { id: currentRank.id } });
      return tx.studentRank.findUnique({ where: { id: previousRank.id }, include: { beltRank: true } });
    });
  }
}