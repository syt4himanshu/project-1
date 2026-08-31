import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    testTimeout: 15000,
    environment: 'node',
    include: [
      'src/__tests__/aiErrors.test.ts',
      'src/__tests__/circuitBreaker.aiErrors.test.ts',
      'src/__tests__/studentContextAdapter.test.ts',
      'src/__tests__/retry.test.js',
      'src/__tests__/circuitBreaker.test.js',
      'src/__tests__/groq.service.test.js',
      'src/__tests__/groq.retry.test.ts',
      'src/__tests__/aiResponseValidator.test.ts',
      'src/__tests__/healthCheck.breaker.test.ts',
      'src/__tests__/aiRequestLogging.test.ts',
    ],
  },
});
