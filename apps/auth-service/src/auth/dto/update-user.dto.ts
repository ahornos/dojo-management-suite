/**
 * @file update-user.dto.ts
 * @description Data Transfer Object for ADMINISTRATIVE partial user updates (`PATCH /auth/users/:id`).
 * Every field of `CreateUserDto` becomes optional while keeping its validators.
 */

import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
