import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateDisciplineDto } from './dto/create-discipline.dto';
import { UpdateDisciplineDto } from './dto/update-discipline.dto';

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
      throw new ConflictException(`Discipline with name '${dto.name}' already exists.`);
    }

    // Create discipline with nested programs and belt ranks atomically
    return this.prisma.discipline.create({
      data: {
        name: dto.name,
        description: dto.description,
        programs: {
          create: dto.programs.map((prog) => ({
            name: prog.name,
            minAge: prog.minAge ?? 0,
            maxAge: prog.maxAge ?? 99,
            beltRanks: {
              create: prog.beltRanks.map((belt) => ({
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
      throw new NotFoundException(`Discipline with ID ${id} not found.`);
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
        throw new ConflictException(`Discipline with name '${dto.name}' already exists.`);
      }
    }

    return this.prisma.discipline.update({
      where: { id },
      data: {
        name: dto.name,
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
}