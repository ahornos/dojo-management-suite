/**
 * @file users.types.ts
 * @description HTTP contracts of the auth-service internal user directory (`/api/internal/users`).
 * Consumed by academic-service and financial-service instead of querying the `users` table directly.
 * Dates travel as ISO-8601 strings because the payloads are JSON.
 */
import { Role } from './common.enums';
/**
 * Public projection of a user. Never contains credentials.
 */
export interface UserSummary {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    dni: string | null;
    birthDate: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    postalCode: string | null;
    country: string | null;
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
 * Roles an internal caller may grant while provisioning an identity (least privilege).
 */
export type ProvisionableRole = Role.STUDENT | Role.PARENT;
/**
 * Personal data that can be set or refreshed on a user.
 * On provisioning, non-empty values overwrite stored data and absent values are preserved.
 */
export interface UserPersonalData {
    firstName?: string;
    lastName?: string;
    dni?: string;
    /** ISO-8601 date string. */
    birthDate?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
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
