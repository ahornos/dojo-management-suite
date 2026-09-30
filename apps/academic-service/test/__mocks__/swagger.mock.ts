export const ApiTags = () => () => {};
export const ApiOperation = () => () => {};
export const ApiResponse = () => () => {};
export const ApiParam = () => () => {};
export const ApiBearerAuth = () => () => {};
export const ApiProperty = () => () => {};
export const ApiPropertyOptional = () => () => {};
export const PartialType = (classRef: any) => class {};
export const PickType = (classRef: any, keys: any) => class {};
export const OmitType = (classRef: any, keys: any) => class {};

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