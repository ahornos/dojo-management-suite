/**
 * @file jest.config.ts
 * @description Jest configuration file for academic-service.
 * Mocks @nestjs/swagger during tests and restricts ts-jest to only transform .ts files
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
    '^@nestjs/swagger$': '<rootDir>/../test/__mocks__/swagger.mock.ts',
  },
};