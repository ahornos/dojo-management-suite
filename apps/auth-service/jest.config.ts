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
    // Redirigimos @nestjs/jwt a un mock limpio para evitar el error de sintaxis ESM en Jest
    '^@nestjs/jwt$': '<rootDir>/src/auth/__mocks__/@nestjs/jwt.ts',
  },
};

export default config;