/**
 * @file students.service.ts
 * @description Service handling student profile operations with strict data isolation.
 */

import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@dms/shared-types';
import * as bcrypt from 'bcrypt';
import { CreateStudentDto } from './dto/create-student.dto';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Retrieves a single student profile. 
   * Enforces data isolation: users can only view their own profile unless they have staff roles.
   * 
   * @param id - Student Profile UUID.
   * @param requestUser - The authenticated user requesting the data.
   * @returns The student profile object.
   */
  async findOne(id: string, requestUser: any) {
    const student = await this.prisma.studentProfile.findUnique({
      where: { id },
      include: {
        user: { select: { email: true, firstName: true, lastName: true } },
        ranks: {
          include: { beltRank: { include: { program: true } } }
        },
      },
    });

    if (!student) {
      throw new NotFoundException(`Student profile with ID ${id} not found.`);
    }

    const isStaff = [Role.SUPER_ADMIN, Role.ADMIN_STAFF, Role.SPORTS_TECHNICAL_DIRECTOR, Role.INSTRUCTOR].includes(requestUser.role);
    const isOwner = student.userId === requestUser.userId;

    if (!isStaff && !isOwner) {
      throw new ForbiddenException('You are not authorized to view this profile.');
    }

    return student;
  }
  
  /**
   * Creates a new student profile and its associated user account.
   * Uses a Prisma transaction to ensure atomicity.
   * 
   * @param createStudentDto - The validated data to create the student.
   * @returns The newly created student profile with minimal user data.
   */
  async create(createStudentDto: CreateStudentDto) {
    const defaultPassword = 'ChangeMe123!';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: createStudentDto.email,
          firstName: createStudentDto.firstName,
          lastName: createStudentDto.lastName,
          passwordHash: hashedPassword,
          role: Role.STUDENT,
        },
      });

      const studentProfile = await tx.studentProfile.create({
        data: {
          userId: user.id,
          phone: createStudentDto.phone || null,
          address: createStudentDto.address || null,
          city: createStudentDto.city || null,
          state: createStudentDto.state || null,
          postalCode: createStudentDto.postalCode || null,
          country: createStudentDto.country || 'ES',
          birthDate: createStudentDto.birthDate ? new Date(createStudentDto.birthDate) : null,
        },
      });

      return {
        id: studentProfile.id,
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        }
      };
    });
  }

  /**
   * Updates a student profile.
   * Staff members execute direct updates; students generate a pending ProfileUpdateRequest.
   * 
   * @param id - Student Profile UUID.
   * @param updateData - JSON object with the requested changes.
   * @param requestUser - The authenticated user requesting the update.
   */
  async updateProfile(id: string, updateData: any, requestUser: any) {
    const student = await this.findOne(id, requestUser);
    const isStaff = [Role.SUPER_ADMIN, Role.ADMIN_STAFF].includes(requestUser.role);

    if (!isStaff) {
      return this.prisma.profileUpdateRequest.create({
        data: {
          studentProfileId: student.id,
          requestedChanges: updateData,
        },
      });
    }

    return this.prisma.studentProfile.update({
      where: { id: student.id },
      data: {
        phone: updateData.phone,
        address: updateData.address,
        city: updateData.city,
        state: updateData.state,
        postalCode: updateData.postalCode,
        country: updateData.country,
        birthDate: updateData.birthDate ? new Date(updateData.birthDate) : undefined,
      },
    });
  }

  /**
   * Retrieves all student profiles.
   */
  async findAll() {
    return this.prisma.studentProfile.findMany({
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
      },
    });
  }

  /**
   * Deletes a student profile from the database.
   * 
   * @param id - Student Profile UUID.
   * @returns The deleted student profile record.
   */
  async remove(id: string) {
    const student = await this.prisma.studentProfile.findUnique({
      where: { id },
    });

    if (!student) {
      throw new NotFoundException(`Student profile with ID ${id} not found.`);
    }

    return this.prisma.studentProfile.delete({
      where: { id },
    });
  }
}