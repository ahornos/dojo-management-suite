import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProposeGraduationDto } from './dto/propose-graduation.dto';

/**
 * Service responsible for evaluating martial arts graduation eligibility,
 * handling graduation workflows, executing rank updates, and rolling back errors.
 */
@Injectable()
export class GraduationsService {
  constructor(private prisma: PrismaService) {}

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

    if (!student) throw new NotFoundException(`Student profile with ID ${studentProfileId} not found.`);
    
    const activeRank = student.ranks[0];
    if (!activeRank) throw new BadRequestException(`Student has no active belt rank assigned.`);

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

  async proposeGraduation(studentProfileId: string, instructorId: string, dto?: ProposeGraduationDto) {
    const student = await this.prisma.studentProfile.findUnique({
      where: { id: studentProfileId },
    });

    if (!student) {
      throw new NotFoundException(`Student profile with ID ${studentProfileId} not found.`);
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

    if (!student || !student.ranks[0]) throw new NotFoundException(`Active rank not found for student profile ID ${studentProfileId}.`);

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
    if (nextBeltIndex >= programBelts.length) throw new BadRequestException(`Student is already at the highest belt rank of the program.`);

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

  async rollbackGraduation(studentProfileId: string) {
    const student = await this.prisma.studentProfile.findUnique({
      where: { id: studentProfileId },
      include: {
        ranks: { orderBy: { promotedAt: 'desc' }, take: 2, include: { beltRank: true } },
      },
    });

    if (!student || !student.ranks[0]) throw new NotFoundException(`Active rank not found for student profile ID ${studentProfileId}.`);

    const currentRank = student.ranks[0];

    if (currentRank.currentStripes > 0) {
      return this.prisma.studentRank.update({
        where: { id: currentRank.id },
        data: { currentStripes: { decrement: 1 } },
      });
    }

    const previousRank = student.ranks[1];
    if (!previousRank) throw new BadRequestException(`Cannot rollback further: student is at their initial rank record.`);

    return this.prisma.$transaction(async (tx) => {
      await tx.studentRank.delete({ where: { id: currentRank.id } });
      return tx.studentRank.findUnique({ where: { id: previousRank.id }, include: { beltRank: true } });
    });
  }
}