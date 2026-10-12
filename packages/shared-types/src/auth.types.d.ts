/**
 * @file auth.types.ts
 * @description Authentication contracts shared by every microservice that validates JWTs.
 * Keeps the token payload and the `req.user` shape identical across services.
 */
import { Role } from './common.enums';
/**
 * Claims embedded in the JWT issued by the auth-service.
 */
export interface JwtPayload {
    /** Unique identifier of the authenticated user. */
    sub: string;
    /** Email address of the authenticated user. */
    email: string;
    /** Every role assigned to the user (multi-role model). */
    roles: Role[];
}
/**
 * User context injected into `req.user` by the JWT strategies.
 */
export interface AuthenticatedUser {
    /** Unique identifier of the authenticated user (JWT `sub` claim). */
    userId: string;
    /** Email address of the authenticated user. */
    email: string;
    /** Every role assigned to the user; always an array, never a single string. */
    roles: Role[];
}
