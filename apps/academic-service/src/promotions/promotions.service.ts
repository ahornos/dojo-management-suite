import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

/**
 * Service responsible for evaluating martial arts promotion eligibility,
 * handling promotion workflows, and updating student belt and stripe records.
 */
@Injectable()
export class PromotionsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Evaluates whether a student is eligible for a stripe or belt promotion
   * by comparing their accumulated training hours and months in rank against
   * the requirements defined in their current belt rank.
   * 
   * @param studentProfileId - UUID of the student profile.
   * @returns An evaluation report with eligibility status and current metrics.
   * @throws NotFoundException if the student profile or active rank is not found.
   */
  async evaluatePromotionEligibility(studentProfileId: string) {
    const student = await this.prisma.studentProfile.findUnique({
      where: { id: studentProfileId },
      include: {
        ranks: {
          orderBy: { promotedAt: 'desc' },
          take: 1,
          include: {
            beltRank: {
              include: {
                program: true,
              },
            },
          },
        },
        attendances: {
          where: { countedForRank: true },
        },
      },
    });

    if (!student) {
      throw new NotFoundException(`Student profile with ID ${studentProfileId} not found.`);
    }

    const activeRank = student.ranks[0];
    if (!activeRank) {
      throw new BadRequestException(`Student has no active belt rank assigned.`);
    }

    const beltCriteria = activeRank.beltRank;

    // Calculate months spent in the current rank
    const now = new Date();
    const promotedAt = new Date(activeRank.promotedAt);
    const monthsInRank =
      (now.getFullYear() - promotedAt.getFullYear()) * 12 +
      (now.getMonth() - promotedAt.getMonth());

    // Calculate total hours from valid attendances recorded after the last promotion
    const trainingHours = student.attendances.filter(
      (att) => new Date(att.date) >= promotedAt,
    ).length; // Assuming each attendance record equals 1 training session/hour slot

    const meetsMonths = monthsInRank >= beltCriteria.minMonthsRequired;
    const meetsHours = trainingHours >= beltCriteria.minHoursRequired;
    const isEligible = meetsMonths && meetsHours;

    return {
      studentProfileId,
      currentBelt: beltCriteria.name,
      currentStripes: activeRank.currentStripes,
      maxStripes: beltCriteria.maxStripes,
      requirements: {
        minMonthsRequired: beltCriteria.minMonthsRequired,
        minHoursRequired: beltCriteria.minHoursRequired,
      },
      currentMetrics: {
        monthsInRank,
        accumulatedHours: trainingHours,
      },
      eligibility: {
        meetsMonths,
        meetsHours,
        isEligible,
      },
    };
  }

  /**
   * Creates a pending promotion request proposed by an instructor.
   * This workflow requires subsequent approval by a technical director or administrator.
   * 
   * @param studentProfileId - UUID of the student profile.
   * @param instructorId - UUID of the user proposing the promotion.
   * @returns The created PromotionRequest record.
   */
  async proposePromotion(studentProfileId: string, instructorId: string) {
    const student = await this.prisma.studentProfile.findUnique({
      where: { id: studentProfileId },
    });

    if (!student) {
      throw new NotFoundException(`Student profile with ID ${studentProfileId} not found.`);
    }

    return this.prisma.promotionRequest.create({
      data: {
        studentProfileId,
        proposedById: instructorId,
        status: 'PENDING',
      },
    });
  }

  /**
   * Executes a direct promotion for a student (Stripe or Belt rank transition).
   * If the student has not reached max stripes, a stripe is awarded.
   * If max stripes are reached, the student advances to the next belt rank in the program
   * and resets accumulated hours.
   * 
   * @param studentProfileId - UUID of the student profile.
   * @returns The updated student rank record.
   * @throws NotFoundException or BadRequestException if preconditions fail.
   */
  async executePromotion(studentProfileId: string) {
    const student = await this.prisma.studentProfile.findUnique({
      where: { id: studentProfileId },
      include: {
        ranks: {
          orderBy: { promotedAt: 'desc' },
          take: 1,
          include: {
            beltRank: {
              include: {
                program: {
                  include: {
                    beltRanks: {
                      orderBy: { order: 'asc' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!student || !student.ranks[0]) {
      throw new NotFoundException(`Active rank not found for student profile ID ${studentProfileId}.`);
    }

    const activeRank = student.ranks[0];
    const currentBelt = activeRank.beltRank;
    const programBelts = currentBelt.program.beltRanks;

    // Scenario A: Award a stripe if maximum stripes have not been reached yet
    if (activeRank.currentStripes < currentBelt.maxStripes) {
      return this.prisma.studentRank.update({
        where: { id: activeRank.id },
        data: {
          currentStripes: { increment: 1 },
          lastStripeAt: new Date(),
        },
      });
    }

    // Scenario B: Advance to the next Belt Rank in the program
    const nextBeltIndex = programBelts.findIndex((b) => b.id === currentBelt.id) + 1;
    
    if (nextBeltIndex >= programBelts.length) {
      throw new BadRequestException(`Student is already at the highest belt rank of the program.`);
    }

    const nextBelt = programBelts[nextBeltIndex];

    // Perform atomic transaction: close old rank record and create/assign the new belt rank
    return this.prisma.$transaction(async (tx) => {
      // Optional: you can archive or update history, here we create a fresh active StudentRank entry
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
}