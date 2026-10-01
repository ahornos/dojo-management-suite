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
  transformIgnorePatterns: ['node_modules/(?!(@nestjs/jwt))'],
  moduleNameMapper: {
    '^@dms/database(.*)$': '<rootDir>/../../../packages/database$1',
    '^@dms/shared-types(.*)$': '<rootDir>/../../../packages/shared-types/src$1',
    '^@nestjs/jwt$': '<rootDir>/src/auth/__mocks__/@nestjs/jwt.ts',
  },
};

export default config;