import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/integration/**/*.test.ts'],
  setupFilesAfterEnv: ['./src/tests/setup.ts'],
  verbose: true,
  detectOpenHandles: true,
  forceExit: true
};

export default config;
