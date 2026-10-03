/**
 * @file swagger.mock.ts
 * @description Mock implementation for @nestjs/swagger decorators and utilities during E2E testing.
 */
export const ApiTags = () => () => {};
export const ApiOperation = () => () => {};
export const ApiBearerAuth = () => () => {};
export const ApiProperty = () => () => {};
export const ApiPropertyOptional = () => () => {};
export const ApiParam = () => () => {};
export const ApiQuery = () => () => {};
export const ApiResponse = () => () => {};

export class DocumentBuilder {
  setTitle() { return this; }
  setDescription() { return this; }
  setVersion() { return this; }
  addBearerAuth() { return this; }
  addApiKey() { return this; }
  build() { return {}; }
}

export class SwaggerModule {
  static createDocument() { return {}; }
  static setup() {}
}