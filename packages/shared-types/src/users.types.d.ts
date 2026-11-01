import { Gender, Role } from './common.enums';
/**
 * Public projection of a login identity. Never contains credentials.
 * Demographics (dni, birthDate, phone, address) live on StudentProfile, not here.
 */
export interface UserSummary {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    gender: Gender | null;
    isActive: boolean;
    roles: Role[];
}
/**
 * Body of `POST /api/internal/users/batch`.
 */
export interface UserBatchRequest {
    /** Unique user identifiers to resolve in a single round trip. */
    ids: string[];
}
/**
 * Body of `POST /api/internal/users/by-roles`.
 */
export interface UserByRolesRequest {
    /** Roles to match (`hasSome`). Only active users are returned. */
    roles: Role[];
}
/**
 * Roles an internal caller may grant while provisioning an identity (least privilege).
 */
export type ProvisionableRole = Role.STUDENT | Role.PARENT | Role.TRIAL;
/**
 * Login-identity fields that can be set or refreshed on a user.
 * On provisioning, non-empty values overwrite stored data and absent values are preserved.
 */
export interface UserPersonalData {
    firstName?: string;
    lastName?: string;
    gender?: Gender;
}
/**
 * Body of `POST /api/internal/users/provision`: find-or-create an identity and grant it a role.
 * The operation is idempotent, so callers may safely retry it.
 */
export interface ProvisionUserRequest extends UserPersonalData {
    /** Resolve by id first; the call fails with 404 when it does not exist. */
    userId?: string;
    /** Resolve (or create) by email when no `userId` is given. Required to create a new user. */
    email?: string;
    /** Role added to the user's existing roles. */
    role: ProvisionableRole;
}
/**
 * Body of `PATCH /api/internal/users/:id/personal-data`.
 */
export type UpdateUserPersonalDataRequest = UserPersonalData;
/**
 * HTTP header carrying the shared secret that authenticates service-to-service calls
 * to the auth-service internal user directory.
 */
export declare const INTERNAL_API_KEY_HEADER = "x-internal-api-key";
