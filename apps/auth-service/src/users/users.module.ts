import { Module } from '@nestjs/common';
import { InternalApiKeyGuard } from './guards/internal-api-key.guard';
import { InternalUsersController } from './internal-users.controller';
import { UsersService } from './users.service';

/**
 * @class UsersModule
 * @description Internal user directory consumed by other microservices over HTTP.
 * Depends on the global PrismaModule and ConfigModule (`INTERNAL_API_KEY`).
 */
@Module({
  controllers: [InternalUsersController],
  providers: [UsersService, InternalApiKeyGuard],
  exports: [UsersService],
})
export class UsersModule {}
