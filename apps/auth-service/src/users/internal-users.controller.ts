/**
 * @file internal-users.controller.ts
 * @description Service-to-service HTTP API exposing the user directory to the other bounded contexts.
 * Mounted at `/api/internal/users`, a prefix the API Gateway never proxies, and additionally protected
 * by a shared API key. Business logic lives in `UsersService`.
 */

import { Body, Controller, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { UserSummary } from '@dms/shared-types';
import { InternalApiKeyGuard } from './guards/internal-api-key.guard';
import { UsersService } from './users.service';
import { UserBatchDto } from './dto/user-batch.dto';
import { ProvisionUserDto } from './dto/provision-user.dto';
import { UpdatePersonalDataDto } from './dto/update-personal-data.dto';

/**
 * @class InternalUsersController
 * @description Thin HTTP layer of the internal user directory. Depends on `UsersService`.
 */
@ApiExcludeController()
@UseGuards(InternalApiKeyGuard)
@Controller('internal/users')
export class InternalUsersController {
  /**
   * @param {UsersService} usersService - Identity business logic.
   */
  constructor(private readonly usersService: UsersService) {}

  /**
   * Resolves many users at once.
   *
   * @param {UserBatchDto} dto - Identifiers to resolve.
   * @returns {Promise<UserSummary[]>} Users found (unknown ids are omitted).
   */
  @Post('batch')
  @HttpCode(HttpStatus.OK)
  batch(@Body() dto: UserBatchDto): Promise<UserSummary[]> {
    return this.usersService.findManyByIds(dto.ids);
  }

  /**
   * Finds or creates a user and grants it a role (idempotent).
   *
   * @param {ProvisionUserDto} dto - Lookup keys, personal data and role to grant.
   * @returns {Promise<UserSummary>} The resulting user.
   */
  @Post('provision')
  @HttpCode(HttpStatus.OK)
  provision(@Body() dto: ProvisionUserDto): Promise<UserSummary> {
    return this.usersService.provision(dto);
  }

  /**
   * Updates personal data of an existing user.
   *
   * @param {string} id - User identifier.
   * @param {UpdatePersonalDataDto} dto - Fields to update.
   * @returns {Promise<UserSummary>} The updated user.
   */
  @Patch(':id/personal-data')
  updatePersonalData(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdatePersonalDataDto,
  ): Promise<UserSummary> {
    return this.usersService.updatePersonalData(id, dto);
  }
}
