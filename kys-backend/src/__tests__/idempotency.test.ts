import { describe, it, expect, beforeEach } from 'vitest';
import { idempotencyCache, hashPayload } from '../../utils/idempotencyCache';
import { idempotencyMiddleware } from '../../middleware/idempotency';

describe('Idempotency Unit Tests', () => {
  beforeEach(async () => {
    await idempotencyCache.clear();
  });

  it('hashPayload computes consistent sha256 hash', () => {
    const payload1 = { a: 1, b: 'test' };
    const payload2 = { a: 1, b: 'test' };
    const payload3 = { a: 1, b: 'different' };

    expect(hashPayload(payload1)).toEqual(hashPayload(payload2));
    expect(hashPayload(payload1)).not.toEqual(hashPayload(payload3));
  });

  it('evaluates new idempotency key as NEW', async () => {
    const res = await idempotencyCache.evaluate('key-123', 101, 'POST /test', { field: 'value' });
    expect(res.action).toBe('NEW');
  });

  it('returns PROCESSING for concurrent evaluation of same key', async () => {
    await idempotencyCache.evaluate('key-456', 101, 'POST /test', { field: 'value' });
    const second = await idempotencyCache.evaluate('key-456', 101, 'POST /test', { field: 'value' });
    expect(second.action).toBe('PROCESSING');
  });

  it('returns MISMATCH for same key with different payload', async () => {
    await idempotencyCache.evaluate('key-789', 101, 'POST /test', { field: 'original' });
    const mismatch = await idempotencyCache.evaluate('key-789', 101, 'POST /test', { field: 'modified' });
    expect(mismatch.action).toBe('MISMATCH');
  });

  it('returns HIT with cached status & body when completed', async () => {
    const key = 'key-completed';
    await idempotencyCache.evaluate(key, 101, 'POST /test', { field: 'val' });
    await idempotencyCache.complete(key, 201, { message: 'Created successfully' });

    const hit = await idempotencyCache.evaluate(key, 101, 'POST /test', { field: 'val' });
    expect(hit.action).toBe('HIT');
    expect(hit.status).toBe(201);
    expect(hit.body).toEqual({ message: 'Created successfully' });
  });
});
