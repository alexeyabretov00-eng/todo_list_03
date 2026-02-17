const dotenv = require('dotenv');
const path = require('path');

const env = dotenv.config({ path: path.join(process.cwd(), '.env') }).parsed || {};

/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: ['**/__tests__/**/*.test.tsx', '**/__tests__/**/*.test.ts', '**/*.test.tsx', '**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@components$': '<rootDir>/src/components',
    '^@containers/(.*)$': '<rootDir>/src/containers/$1',
    '^@containers$': '<rootDir>/src/containers',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@hooks$': '<rootDir>/src/hooks',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@utils$': '<rootDir>/src/utils',
    '^@api/(.*)$': '<rootDir>/src/api/$1',
    '^@api$': '<rootDir>/src/api',
    '^@styles/(.*)$': '<rootDir>/src/styles/$1',
    '^@styles$': '<rootDir>/src/styles',
    '^@theme$': '<rootDir>/src/styles/theme',
    '^@assets/(.*)$': '<rootDir>/src/assets/$1',
    '^@assets$': '<rootDir>/src/assets',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@services$': '<rootDir>/src/services',
    '^@types/(.*)$': '<rootDir>/src/types/$1',
    '^@types$': '<rootDir>/src/types',
    '^@slices$': '<rootDir>/src/slices',
    '^@slices/(.*)$': '<rootDir>/src/slices/$1',
    '^@store$': '<rootDir>/src/store',
    '^@selectors$': '<rootDir>/src/selectors',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
    '!src/index.tsx',
    '!src/setupTests.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  coverageDirectory: 'coverage',
  verbose: true,
  globals: {
    ...env
  }
};
