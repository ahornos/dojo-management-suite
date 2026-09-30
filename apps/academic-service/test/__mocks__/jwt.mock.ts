export class JwtService {
  sign(payload: any): string {
    return 'mock-jwt-token';
  }
  verify(token: string): any {
    return { sub: 'mock-user-id', email: 'mock@dojo.com', role: 'SUPER_ADMIN' };
  }
  decode(token: string): any {
    return { sub: 'mock-user-id', email: 'mock@dojo.com', role: 'SUPER_ADMIN' };
  }
}

export class JwtModule {
  static register(options: any) {
    return {
      module: JwtModule,
      providers: [JwtService],
      exports: [JwtService],
    };
  }
  static registerAsync(options: any) {
    return {
      module: JwtModule,
      providers: [JwtService],
      exports: [JwtService],
    };
  }
}