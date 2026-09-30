import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * @class JwtAuthGuard
 * @description Custom AuthGuard that utilizes the Passport JWT strategy to protect routes.
 * Throws a 401 Unauthorized exception if the token is missing or invalid.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}