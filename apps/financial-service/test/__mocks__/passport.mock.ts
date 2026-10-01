import { UnauthorizedException } from '@nestjs/common';

export const AuthGuard = (type: string) => {
  class MockAuthGuard {
    canActivate(context: any) {
      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers['authorization'] || request.headers['Authorization'];
      
      if (!authHeader) {
        throw new UnauthorizedException('No token provided');
      }

      const token = authHeader.replace('Bearer ', '');
      
      // Dynamically extract role from our smart mock token structure
      let role = 'SUPER_ADMIN';
      let sub = 'admin-uuid';
      if (token.includes('STUDENT')) {
        role = 'STUDENT';
        sub = 'student-uuid';
      }

      request.user = {
        sub,
        email: `${role.toLowerCase()}@dojo.com`,
        role,
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