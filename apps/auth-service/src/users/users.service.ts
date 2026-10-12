/**
 * @file users.service.ts
 * @description Internal user directory of the auth-service. It is the ONLY place where other bounded
 * contexts (academic, financial) can resolve, provision, or update identities, replacing direct
 * access to the `users` table. Credentials never leave this service.
 */

import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, User } from '@dms/database/client';
import { Role, UserSummary } from '@dms/shared-types';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { ProvisionUserDto } from './dto/provision-user.dto';
import { UpdatePersonalDataDto } from './dto/update-personal-data.dto';

/** String columns that map 1:1 from the DTO to the `User` model. */
const TEXT_FIELDS = ['firstName', 'lastName', 'phone', 'address', 'city', 'state', 'postalCode', 'country'] as const;

/** Mutable personal-data columns shared by the create and update Prisma inputs. */
type PersonalDataPatch = Partial<Pick<User, (typeof TEXT_FIELDS)[number] | 'dni' | 'birthDate'>>;

/**
 * @class UsersService
 * @description Identity operations exposed to peer services. Depends on `PrismaService` (users table only).
 */
@Injectable()
export class UsersService {
  /**
   * @param {PrismaService} prisma - Database access limited to the identity domain.
   */
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Resolves many users in a single query (avoids N+1 across services).
   * Unknown identifiers are silently omitted from the result.
   *
   * @param {string[]} ids - User identifiers to resolve.
   * @returns {Promise<UserSummary[]>} Public projections of the users found.
   */
  async findManyByIds(ids: string[]): Promise<UserSummary[]> {
    if (ids.length === 0) {
      return [];
    }

    const users = await this.prisma.user.findMany({ where: { id: { in: ids } } });
    return users.map((user) => this.toSummary(user));
  }

  /**
   * Finds (by id, then email) or creates a user and grants it the requested role.
   * Idempotent: repeating the call never duplicates the user nor the role. New accounts get an
   * unknown random password, so they stay unusable until a password reset.
   *
   * @param {ProvisionUserDto} dto - Identity lookup keys, personal data and the role to grant.
   * @returns {Promise<UserSummary>} The resulting user.
   * @throws {NotFoundException} If `userId` is given but does not exist.
   * @throws {BadRequestException} If a new user lacks email, firstName, or lastName.
   * @throws {ConflictException} If the DNI or email belongs to another user.
   */
  async provision(dto: ProvisionUserDto): Promise<UserSummary> {
    const existing = await this.findExisting(dto);
    await this.assertDniAvailable(dto.dni, existing?.id);

    try {
      if (existing) {
        const roles = Array.from(new Set<Role>([...(existing.roles as Role[]), dto.role]));
        const updated = await this.prisma.user.update({
          where: { id: existing.id },
          data: { ...this.buildPatch(dto, true), roles },
        });
        return this.toSummary(updated);
      }

      if (!dto.email || !dto.firstName || !dto.lastName) {
        throw new BadRequestException('USER_CREATION_DATA_INCOMPLETE');
      }

      const passwordHash = await bcrypt.hash(randomBytes(12).toString('hex'), 10);
      const created = await this.prisma.user.create({
        data: {
          ...this.buildPatch(dto, true),
          email: dto.email,
          firstName: dto.firstName,
          lastName: dto.lastName,
          country: dto.country || 'ES',
          passwordHash,
          roles: [dto.role],
        },
      });
      return this.toSummary(created);
    } catch (error) {
      // Two concurrent provisions of the same email: surface a 409 instead of a 500.
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('USER_ALREADY_EXISTS');
      }
      throw error;
    }
  }

  /**
   * Updates personal data of an existing user. Absent fields are preserved; credentials and roles are untouched.
   *
   * @param {string} id - User identifier.
   * @param {UpdatePersonalDataDto} dto - Fields to update.
   * @returns {Promise<UserSummary>} The updated user.
   * @throws {NotFoundException} If the user does not exist.
   * @throws {ConflictException} If the DNI belongs to another user.
   */
  async updatePersonalData(id: string, dto: UpdatePersonalDataDto): Promise<UserSummary> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('USER_NOT_FOUND');
    }

    await this.assertDniAvailable(dto.dni, id);

    const updated = await this.prisma.user.update({ where: { id }, data: this.buildPatch(dto, false) });
    return this.toSummary(updated);
  }

  /**
   * Locates the user targeted by a provisioning request.
   *
   * @param {ProvisionUserDto} dto - Provisioning payload.
   * @returns {Promise<User | null>} The matching user, or `null` when it must be created.
   * @throws {NotFoundException} If an explicit `userId` does not exist.
   */
  private async findExisting(dto: ProvisionUserDto): Promise<User | null> {
    if (dto.userId) {
      const byId = await this.prisma.user.findUnique({ where: { id: dto.userId } });

      if (!byId) {
        throw new NotFoundException('USER_NOT_FOUND');
      }

      return byId;
    }

    return dto.email ? this.prisma.user.findUnique({ where: { email: dto.email } }) : null;
  }

  /**
   * Guarantees a DNI is not already registered to a different user.
   *
   * @param {string | undefined} dni - DNI about to be stored.
   * @param {string | undefined} ownerId - User allowed to hold it (the one being updated).
   * @returns {Promise<void>} Resolves when the DNI is free or already owned by `ownerId`.
   * @throws {ConflictException} If another user holds the DNI.
   */
  private async assertDniAvailable(dni: string | undefined, ownerId: string | undefined): Promise<void> {
    if (!dni) {
      return;
    }

    const holder = await this.prisma.user.findUnique({ where: { dni } });

    if (holder && holder.id !== ownerId) {
      throw new ConflictException('USER_DNI_ALREADY_REGISTERED');
    }
  }

  /**
   * Builds the Prisma data patch from the DTO, keeping only fields that were actually sent.
   *
   * @param {UpdatePersonalDataDto} dto - Source payload.
   * @param {boolean} skipEmpty - When `true`, empty strings are ignored (merge semantics) instead of overwriting.
   * @returns {PersonalDataPatch} Partial user data.
   */
  private buildPatch(dto: UpdatePersonalDataDto, skipEmpty: boolean): PersonalDataPatch {
    const patch: PersonalDataPatch = {};

    for (const field of TEXT_FIELDS) {
      const value = dto[field];
      if (value !== undefined && !(skipEmpty && value === '')) {
        patch[field] = value;
      }
    }

    if (dto.dni !== undefined && !(skipEmpty && dto.dni === '')) {
      // An empty DNI means "none"; storing '' would collide on the unique index.
      patch.dni = dto.dni === '' ? null : dto.dni;
    }

    if (dto.birthDate) {
      patch.birthDate = new Date(dto.birthDate);
    }

    return patch;
  }

  /**
   * Projects a persisted user to its public representation (no credentials).
   *
   * @param {User} user - Persisted user.
   * @returns {UserSummary} JSON-safe projection.
   */
  private toSummary(user: User): UserSummary {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      dni: user.dni,
      birthDate: user.birthDate ? user.birthDate.toISOString() : null,
      phone: user.phone,
      address: user.address,
      city: user.city,
      state: user.state,
      postalCode: user.postalCode,
      country: user.country,
      isActive: user.isActive,
      roles: user.roles as Role[],
    };
  }
}
