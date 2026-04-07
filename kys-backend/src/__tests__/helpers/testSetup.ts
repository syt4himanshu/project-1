import { beforeAll } from 'vitest';
import { adminToken, loginAdmin } from './setup';

beforeAll(async () => {
  if (!adminToken) {
    await loginAdmin();
  }
});
