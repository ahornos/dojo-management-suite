"use strict";
/**
 * @file users.types.ts
 * @description HTTP contracts of the auth-service internal user directory (`/api/internal/users`).
 * Consumed by academic-service and financial-service instead of querying the `users` table directly.
 * Dates travel as ISO-8601 strings because the payloads are JSON.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.INTERNAL_API_KEY_HEADER = void 0;
/**
 * HTTP header carrying the shared secret that authenticates service-to-service calls
 * to the auth-service internal user directory.
 */
exports.INTERNAL_API_KEY_HEADER = 'x-internal-api-key';
