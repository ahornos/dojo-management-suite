/**
 * @file auth.service.ts
 * @description Handles user authentication business logic including registration, 
 * credential validation, password hashing, JWT generation, and administrative user management.
 * Fully supports Role-Based Access Control (RBAC) with multiple roles per user.
 */

import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '@dms/shared-types';
import { Prisma } from '@dms/database/client';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Registers a new user via the public endpoint.
   * 
   * @param {RegisterDto} dto - Registration payload.
   * @returns {Promise<Object>} Created user profile excluding password hash.
   * @throws {BadRequestException} If the email is already registered.
   */
  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException('EMAIL_ALREADY_REGISTERED');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
        // Public sign-up is always least-privileged; elevated roles require an admin via createUser.
        roles: [Role.STUDENT],
      },
    });

    const { passwordHash, ...result } = user;
    return {
      message: 'Usuario registrado exitosamente',
      user: result,
    };
  }

  /**
   * Authenticates user credentials and issues a signed JWT token.
   * 
   * @param {LoginDto} dto - Login payload.
   * @returns {Promise<Object>} Access token and user metadata.
   * @throws {UnauthorizedException} On invalid credentials.
   */
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('INVALID_CREDENTIALS');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('INVALID_CREDENTIALS');
    }

    // Embed the roles array into the JWT payload for API Gateway authorization
    const payload = { sub: user.id, email: user.email, roles: user.roles };
    const accessToken = this.jwtService.sign(payload);

    return {
      access_token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.roles,
      },
    };
  }

  /**
   * Creates a new user account administratively from the management dashboard.
   * Includes validation for email uniqueness.
   * 
   * @param {CreateUserDto} dto - Validated payload containing user details, personal data, and roles array.
   * @returns {Promise<Object>} The created user record excluding password hash.
   * @throws {BadRequestException} If the email is already registered.
   */
  async createUser(dto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException('EMAIL_ALREADY_REGISTERED');
    }

    const hashedPassword = await bcrypt.hash(this.resolveInitialPassword(dto.password), 10);

    const newUser = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
        gender: dto.gender ?? null,
        roles: dto.roles || [Role.STUDENT],
        isActive: dto.isActive ?? true,
      },
    });

    const { passwordHash, ...result } = newUser;
    return {
      message: 'Usuario creado exitosamente',
      user: result,
    };
  }

  /**
   * Retrieves all users registered in the system.
   * 
   * @returns {Promise<Array>} List of users without sensitive password hashes.
   */
  async findAllUsers() {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return users.map(({ passwordHash, ...result }) => result);
  }

  /**
   * Updates login identity fields, roles, status, and optional password reset.
   * 
   * @param {string} id - User unique identifier.
   * @param {UpdateUserDto} dto - Validated payload with the fields to update.
   * @returns {Promise<Object>} Updated user record.
   * @throws {NotFoundException} If user is not found.
   */
  async updateUser(id: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('USER_NOT_FOUND');
    }

    const updateData: Prisma.UserUpdateInput = {
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      isActive: dto.isActive,
    };

    if (dto.gender !== undefined) {
      updateData.gender = dto.gender;
    }

    if (dto.roles) {
      updateData.roles = dto.roles;
    }

    if (dto.password?.trim()) {
      updateData.passwordHash = await bcrypt.hash(dto.password, 10);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData,
    });

    const { passwordHash, ...result } = updatedUser;
    return {
      message: 'Usuario actualizado exitosamente',
      user: result,
    };
  }

  /**
   * Deletes a user account from the system.
   * 
   * @param {string} id - User unique identifier.
   * @returns {Promise<Object>} Deletion success message.
   * @throws {NotFoundException} If user is not found.
   */
  async removeUser(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('USER_NOT_FOUND');
    }

    await this.prisma.user.delete({
      where: { id },
    });

    return {
      message: 'Usuario eliminado exitosamente',
    };
  }

  /**
   * Uses the operator-supplied password, or a cryptographically random one when omitted
   * (the account stays unusable until a password reset / email invite exists).
   *
   * @param {string | undefined} password - Optional explicit password from the admin form.
   * @returns {string} Password to hash. Never a hardcoded default.
   */
  private resolveInitialPassword(password?: string): string {
    const explicit = password?.trim();
    if (explicit) {
      return explicit;
    }
    return randomBytes(24).toString('base64url');
  }
}