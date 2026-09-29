export class JwtService {
  sign = jest.fn().mockReturnValue('mocked-jwt-token');
  verify = jest.fn().mockReturnValue({ sub: 'uuid-123', email: 'test@dojo.com', role: 'STUDENT' });
}

export class JwtModule {
  static register() {
    return {
      module: JwtModule,
      providers: [JwtService],
      exports: [JwtService],
    };
  }
}