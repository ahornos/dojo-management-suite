/**
 * @file jest.config.js
 * @description Jest configuration for @dms/shared-auth.
 */
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: { '^.+\\.ts$': ['ts-jest', { tsconfig: '<rootDir>/../tsconfig.spec.json' }] },
  testEnvironment: 'node',
  // Tests consume the sibling package from source, so no prior `build` is required.
  moduleNameMapper: {
    '^@dms/shared-types$': '<rootDir>/../../shared-types/src/index.ts',
    '^@dms/shared-types/(.*)$': '<rootDir>/../../shared-types/src/$1',
  },
};
