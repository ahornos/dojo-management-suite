/**
 * @file user-batch.dto.ts
 * @description Validated payload of `POST /api/internal/users/batch`.
 */

import { ArrayMaxSize, ArrayUnique, IsArray, IsUUID } from 'class-validator';
import { UserBatchRequest } from '@dms/shared-types';

/** Upper bound protecting the database from oversized `IN (...)` lookups. */
export const USER_BATCH_MAX_SIZE = 500;

/**
 * List of user identifiers to resolve.
 */
export class UserBatchDto implements UserBatchRequest {
  @IsArray()
  @ArrayMaxSize(USER_BATCH_MAX_SIZE)
  @ArrayUnique()
  @IsUUID(undefined, { each: true })
  ids: string[];
}
