import { UnauthorizedException } from '@nestjs/common';

export const AuthGuard = (type: string) => {
  class MockAuthGuard {
    canActivate(context: any) {
      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers['authorization'] || request.headers['Authorization'];
      
      if (!authHeader) {
        throw new UnauthorizedException('INVALID_OR_MISSING_TOKEN');
      }

      // Unit-test stub only (real strategy is exercised by e2e): inject the production `req.user` shape.
      request.user = {
        userId: 'mock-user-id',
        email: 'mock@dojo.com',
        roles: ['SUPER_ADMIN'],
      };

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