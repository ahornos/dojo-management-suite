export class JwtService {
  sign(payload: any): string {
    // Embed role and sub in the mock token string so tests can differentiate tokens
    return `mock-token-${payload.role || 'SUPER_ADMIN'}-${payload.sub || 'user-id'}`;
  }
  verify(token: string): any {
    if (token && token.includes('STUDENT')) {
      return { sub: 'student-uuid', email: 'student@dojo.com', role: 'STUDENT' };
    }
    return { sub: 'admin-uuid', email: 'admin@dojo.com', role: 'SUPER_ADMIN' };
  }
  decode(token: string): any {
    return this.verify(token);
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