import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '@dms/database/client';

/**
 * Service responsible for identity management, JWT token issuance,
 * and user credentials validation.
 */
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  /**
   * Registers a new user in the system with the default STUDENT role.
   * The password is encrypted using bcrypt prior to database persistence.
   * 
   * @param dto - Data transfer object containing email, password, and name.
   * @returns The newly created user object excluding the password hash.
   * @throws {ConflictException} If the provided email is already registered in the database.
   */
  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({ where: { email: dto.email } });
    
    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(dto.password, saltRounds);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        role: Role.STUDENT, // Defaults to STUDENT[cite: 1]
      },
    });

    const { passwordHash: _, ...result } = user;
    return result;
  }

  /**
   * Authenticates a user and generates a JWT access token.
   * 
   * @param dto - Object containing access credentials (email and password).
   * @returns An object containing the JWT and public user data.
   * @throws {UnauthorizedException} If the user does not exist or the password is incorrect.
   */
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      }
    };
  }
}