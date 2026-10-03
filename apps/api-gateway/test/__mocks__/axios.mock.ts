import { Module } from '@nestjs/common';

/**
 * @file axios.mock.ts
 * @description Mock implementation for @nestjs/axios to prevent ESM parsing issues 
 * during E2E testing, configured as a valid NestJS module.
 */
export class HttpService {
  request = jest.fn();
}

@Module({
  providers: [HttpService],
  exports: [HttpService],
})
export class HttpModule {
  static register() {
    return {
      module: HttpModule,
      providers: [HttpService],
      exports: [HttpService],
    };
  }
}