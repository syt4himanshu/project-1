import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    testTimeout: 15000,
    globalSetup: './src/__tests__/helpers/setup.ts',
    environment: 'node',
    setupFiles: ['./src/__tests__/helpers/testSetup.ts'],
  },
});
