/**
 * @file swagger.mock.ts
 * @description Mock implementation of @nestjs/swagger for Jest testing environments.
 * Organized in the test directory to keep production source code clean.
 * Preserves class references in PartialType to support DTO inheritance during unit tests.
 */

export const ApiTags = () => () => {};
export const ApiOperation = () => () => {};
export const ApiResponse = () => () => {};
export const ApiParam = () => () => {};
export const ApiBearerAuth = () => () => {};
export const ApiProperty = () => () => {};
export const ApiPropertyOptional = () => () => {};

/**
 * Returns the passed class reference directly so subclasses inherit properties properly in tests.
 */
export const PartialType = (classRef: any) => classRef;

export const PickType = (classRef: any, keys: any) => classRef;
export const OmitType = (classRef: any, keys: any) => classRef;

export class DocumentBuilder {
  setTitle() { return this; }
  setDescription() { return this; }
  setVersion() { return this; }
  addBearerAuth() { return this; }
  build() { return {}; }
}

export class SwaggerModule {
  static createDocument() { return {}; }
  static setup() {}
}