import { UnauthorizedException } from '@nestjs/common';

export const AuthGuard = (type: string) => {
  class MockAuthGuard {
    canActivate(context: any) {
      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers['authorization'] || request.headers['Authorization'];
      
      // If no authorization header is provided, reject with 401 Unauthorized
      if (!authHeader) {
        throw new UnauthorizedException('No token provided');
      }
      
      return true;
    }
  }
  return MockAuthGuard as any;
};

export class PassportModule {
  static register(options?: any) {
    return {
      module: PassportModule,
      providers: [],
      exports: [],
    };
  }
  static registerAsync(options?: any) {
    return {
      module: PassportModule,
      providers: [],
      exports: [],
    };
  }
}

export const PassportStrategy = (strategy: any, name?: string) => {
  return class MockPassportStrategy {
    constructor(...args: any[]) {}
  };
};