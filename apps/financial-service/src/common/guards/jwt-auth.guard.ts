import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * @file jwt-auth.guard.ts
 * @description Guard enforcing JWT authentication across protected financial endpoints.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * Validates authentication context and handles unauthorized access exceptions.
   * 
   * @param err - Potential authentication error
   * @param user - Authenticated user payload extracted from JWT
   * @param info - Additional authentication context info
   * @returns The validated user object
   */
  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw err || new UnauthorizedException('Invalid or missing authentication token');
    }
    return user;
  }
}