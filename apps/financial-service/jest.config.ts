import { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    // Workspace packages are consumed from source, so tests never depend on a prior `build`.
    '^@dms/shared-types$': '<rootDir>/../../../packages/shared-types/src/index.ts',
    '^@dms/shared-types/(.*)$': '<rootDir>/../../../packages/shared-types/src/$1',
    '^@dms/shared-auth$': '<rootDir>/../../../packages/shared-auth/src/index.ts',
    '^@dms/shared-auth/(.*)$': '<rootDir>/../../../packages/shared-auth/src/$1',
    // @nestjs/passport v12 ships ESM-only, which Jest cannot parse without a transform.
    '^@nestjs/passport$': '<rootDir>/../test/__mocks__/passport.mock.ts',
    // @nestjs/swagger v12 is ESM-only as well; controllers only need its decorators to be no-ops.
    '^@nestjs/swagger$': '<rootDir>/../test/__mocks__/swagger.mock.ts',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@nestjs/jwt))',
    // The generated Prisma client is plain JS; workspace TypeScript sources must still be transformed.
    '/packages/database/',
  ],
};

export default config;