import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Role } from '@dms/database/client';

/**
 * Service handling student profile operations with strict data isolation.
 */
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
   * Updates a student profile.
   * - Staff members execute direct database updates.
   * - Students/Parents generate a pending ProfileUpdateRequest.
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
        birthDate: updateData.birthDate,
      },
    });
  }

  /**
   * Retrieves all student profiles.
   * Restricted to Staff roles only via controller.
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
   * Restricted strictly to super administrators.
   * 
   * @param id - Student Profile UUID.
   * @returns The deleted student profile record.
   * @throws NotFoundException if the student profile does not exist.
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