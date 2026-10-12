/**
 * @file jest.config.ts
 * @description Jest configuration file for academic-service.
 * Mocks @nestjs/swagger and @nestjs/passport during tests and restricts ts-jest to only transform .ts files
 * to prevent warnings from pre-compiled local monorepo packages (database, shared-types).
 */

export default {
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
    '^@nestjs/swagger$': '<rootDir>/../test/__mocks__/swagger.mock.ts',
    // @nestjs/passport v12 ships ESM-only, which Jest cannot parse without a transform.
    '^@nestjs/passport$': '<rootDir>/../test/__mocks__/passport.mock.ts',
  },
};