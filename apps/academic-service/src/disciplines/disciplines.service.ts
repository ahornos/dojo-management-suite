import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBeltRankDto, CreateDisciplineDto } from './dto/create-discipline.dto';
import { UpdateDisciplineDto } from './dto/update-discipline.dto';
import { CreateProgramDto, UpdateProgramDto } from './dto/upsert-program.dto';

/**
 * Service responsible for managing academy disciplines, age-based programs,
 * and hierarchical belt progression structures.
 */
@Injectable()
export class DisciplinesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Creates a new discipline along with its nested age programs and belt rank criteria atomically.
   * 
   * @param dto - Data Transfer Object containing discipline details, programs, and belts.
   * @returns The newly created discipline with its complete hierarchy.
   * @throws ConflictException if a discipline with the same name already exists.
   */
  async create(dto: CreateDisciplineDto) {
    // Check if discipline already exists
    const existing = await this.prisma.discipline.findUnique({
      where: { name: dto.name },
    });

    if (existing) {
      throw new ConflictException('DISCIPLINE_NAME_ALREADY_EXISTS');
    }

    // Create discipline with nested programs and belt ranks atomically
    return this.prisma.discipline.create({
      data: {
        name: dto.name,
        acronym: dto.acronym?.trim() || null,
        description: dto.description,
        programs: {
          create: (dto.programs ?? []).map((prog) => ({
            name: prog.name,
            minAge: prog.minAge ?? 0,
            maxAge: prog.maxAge ?? 99,
            beltRanks: {
              create: (prog.beltRanks ?? []).map((belt) => ({
                name: belt.name,
                order: belt.order,
                maxStripes: belt.maxStripes,
                minMonthsRequired: belt.minMonthsRequired,
                minHoursRequired: belt.minHoursRequired,
              })),
            },
          })),
        },
      },
      include: {
        programs: {
          include: {
            beltRanks: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });
  }

  /**
   * Retrieves all configured disciplines with their complete program and belt rank hierarchy.
   * 
   * @returns An array of disciplines.
   */
  async findAll() {
    return this.prisma.discipline.findMany({
      include: {
        programs: {
          include: {
            beltRanks: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });
  }

  /**
   * Finds a single discipline by its unique identifier.
   * 
   * @param id - Discipline UUID.
   * @returns The discipline object including programs and belt ranks.
   * @throws NotFoundException if the discipline does not exist.
   */
  async findOne(id: string) {
    const discipline = await this.prisma.discipline.findUnique({
      where: { id },
      include: {
        programs: {
          include: {
            beltRanks: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    if (!discipline) {
      throw new NotFoundException('DISCIPLINE_NOT_FOUND');
    }

    return discipline;
  }

  /**
   * Updates an existing discipline's general details.
   * 
   * @param id - Discipline UUID.
   * @param dto - Data Transfer Object containing fields to update.
   * @returns The updated discipline record.
   * @throws NotFoundException if the discipline does not exist.
   * @throws ConflictException if the new name is already taken by another discipline.
   */
  async update(id: string, dto: UpdateDisciplineDto) {
    await this.findOne(id); // Ensures it exists

    if (dto.name) {
      const existing = await this.prisma.discipline.findUnique({
        where: { name: dto.name },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException('DISCIPLINE_NAME_ALREADY_EXISTS');
      }
    }

    return this.prisma.discipline.update({
      where: { id },
      data: {
        name: dto.name,
        acronym: dto.acronym !== undefined ? dto.acronym?.trim() || null : undefined,
        description: dto.description,
      },
      include: {
        programs: {
          include: {
            beltRanks: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });
  }

  /**
   * Deletes a discipline from the academy system.
   * 
   * @param id - Discipline UUID.
   * @returns The deleted discipline record.
   * @throws NotFoundException if the discipline does not exist.
   */
  async remove(id: string) {
    await this.findOne(id); // Ensures it exists

    return this.prisma.discipline.delete({
      where: { id },
    });
  }

  /**
   * Creates a training program under an existing discipline.
   *
   * @param {string} disciplineId - Parent discipline UUID.
   * @param {CreateProgramDto} dto - Program name and optional age range.
   * @returns {Promise<object>} The created program.
   */
  async createProgram(disciplineId: string, dto: CreateProgramDto) {
    await this.findOne(disciplineId);
    return this.prisma.disciplineProgram.create({
      data: {
        disciplineId,
        name: dto.name,
        minAge: dto.minAge ?? 0,
        maxAge: dto.maxAge ?? 99,
      },
      include: { beltRanks: { orderBy: { order: 'asc' } } },
    });
  }

  /**
   * Updates a training program identity (name / age range).
   *
   * @param {string} programId - Program UUID.
   * @param {UpdateProgramDto} dto - Partial fields.
   * @returns {Promise<object>} The updated program.
   */
  async updateProgram(programId: string, dto: UpdateProgramDto) {
    await this.requireProgram(programId);
    return this.prisma.disciplineProgram.update({
      where: { id: programId },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.minAge !== undefined ? { minAge: dto.minAge } : {}),
        ...(dto.maxAge !== undefined ? { maxAge: dto.maxAge } : {}),
      },
      include: { beltRanks: { orderBy: { order: 'asc' } } },
    });
  }

  /**
   * Deletes a training program and its belt ranks.
   *
   * @param {string} programId - Program UUID.
   * @returns {Promise<object>} Deleted id.
   */
  async deleteProgram(programId: string) {
    await this.requireProgram(programId);
    await this.prisma.disciplineProgram.delete({ where: { id: programId } });
    return { id: programId };
  }

  /**
   * Creates a belt rank under a training program.
   *
   * @param {string} programId - Parent program UUID.
   * @param {CreateBeltRankDto} dto - Rank criteria.
   * @returns {Promise<object>} The created belt rank.
   */
  async createBeltRank(programId: string, dto: CreateBeltRankDto) {
    await this.requireProgram(programId);
    return this.prisma.beltRank.create({
      data: {
        disciplineProgramId: programId,
        name: dto.name,
        order: dto.order,
        maxStripes: dto.maxStripes,
        minMonthsRequired: dto.minMonthsRequired,
        minHoursRequired: dto.minHoursRequired,
      },
    });
  }

  /**
   * Updates a belt rank's criteria.
   *
   * @param {string} id - Belt rank UUID.
   * @param {Partial<CreateBeltRankDto>} dto - Partial fields.
   * @returns {Promise<object>} The updated belt rank.
   */
  async updateBeltRank(id: string, dto: Partial<CreateBeltRankDto>) {
    await this.requireBeltRank(id);
    return this.prisma.beltRank.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.order !== undefined ? { order: dto.order } : {}),
        ...(dto.maxStripes !== undefined ? { maxStripes: dto.maxStripes } : {}),
        ...(dto.minMonthsRequired !== undefined ? { minMonthsRequired: dto.minMonthsRequired } : {}),
        ...(dto.minHoursRequired !== undefined ? { minHoursRequired: dto.minHoursRequired } : {}),
      },
    });
  }

  /**
   * Deletes a belt rank.
   *
   * @param {string} id - Belt rank UUID.
   * @returns {Promise<object>} Deleted id.
   */
  async deleteBeltRank(id: string) {
    await this.requireBeltRank(id);
    await this.prisma.beltRank.delete({ where: { id } });
    return { id };
  }

  /**
   * @param {string} id - Program UUID.
   * @returns {Promise<object>} Existing program.
   */
  private async requireProgram(id: string) {
    const program = await this.prisma.disciplineProgram.findUnique({ where: { id } });
    if (!program) {
      throw new NotFoundException('DISCIPLINE_PROGRAM_NOT_FOUND');
    }
    return program;
  }

  /**
   * @param {string} id - Belt rank UUID.
   * @returns {Promise<object>} Existing belt rank.
   */
  private async requireBeltRank(id: string) {
    const belt = await this.prisma.beltRank.findUnique({ where: { id } });
    if (!belt) {
      throw new NotFoundException('BELT_RANK_NOT_FOUND');
    }
    return belt;
  }
}