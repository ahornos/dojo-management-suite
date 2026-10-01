import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from '@dms/shared-types';
import * as bcrypt from 'bcrypt';

/**
 * @class AuthService
 * @description Handles user authentication business logic including registration, 
 * credential validation, password hashing, and JWT generation.
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Registers a new user in the system after validating email uniqueness and securely hashing the password.
   * 
   * @param {RegisterDto} dto - Data transfer object containing user registration details.
   * @returns {Promise<Object>} A success message along with the created user profile (excluding the password hash).
   * @throws {BadRequestException} If the provided email is already registered in the database.
   */
  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException('El correo electrónico ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash: hashedPassword,
        firstName: dto.firstName,
        lastName: dto.lastName,
        role: dto.role || Role.STUDENT,
      },
    });

    const { passwordHash, ...result } = user;
    return {
      message: 'Usuario registrado exitosamente',
      user: result,
    };
  }

  /**
   * Authenticates an existing user by verifying their credentials and issues a signed JWT access token.
   * 
   * @param {LoginDto} dto - Data transfer object containing user login credentials.
   * @returns {Promise<Object>} An object containing the JWT access_token and core user profile information.
   * @throws {UnauthorizedException} If the user does not exist or if the password comparison fails.
   */
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      access_token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }
}