import { beforeAll } from 'vitest';
import { adminToken, loginAdmin } from './setup';

beforeAll(async () => {
  if (!adminToken) {
    try {
      await loginAdmin();
    } catch (_e) {
      // Ignored for tests that mock their own server/requests
    }
  }
});
