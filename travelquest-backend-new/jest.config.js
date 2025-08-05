//Jest configuration file for the TravelQuest backend
// This file sets up the testing environment, specifies test roots, and configures coverage reporting
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: [
    '**/__tests__/**/*.ts', 
    '**/?(*.)+(spec|test).ts',
    '**/tests/comprehensive.test.ts',
    '**/tests/moderation.test.ts',
    '**/tests/analytics.test.ts'
  ],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  // Mock ES modules that cause issues
  moduleNameMapper: {
    '^@middy/(.*)$': '<rootDir>/tests/__mocks__/@middy/$1.js'
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.test.ts',
    '!src/**/*.spec.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  // Coverage thresholds for academic excellence
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
