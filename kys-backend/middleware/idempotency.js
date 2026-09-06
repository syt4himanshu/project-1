const { idempotencyCache } = require('../utils/idempotencyCache');

/**
 * Middleware that inspects `X-Idempotency-Key` header on mutation requests.
 * Uses PostgreSQL `idempotency_keys` table for durable storage.
 *
 * Enforces:
 * 1. Return cached response for completed requests with matching key + payload.
 * 2. Reject concurrent requests (409 Conflict) with same key while processing.
 * 3. Reject payload mismatches (422 Unprocessable Entity) for same key.
 * 4. Atomically capture response on completion.
 */
function idempotencyMiddleware(req, res, next) {
  const idempotencyKey = req.headers['x-idempotency-key'];
  if (!idempotencyKey || req.method === 'GET' || req.method === 'HEAD') {
    return next();
  }

  const facultyId = req.currentUser?.id || null;
  const operationType = `${req.method} ${req.baseUrl}${req.path}`;

  idempotencyCache.evaluate(idempotencyKey, facultyId, operationType, req.body).then((evalResult) => {
    if (evalResult.action === 'HIT') {
      return res.status(evalResult.status || 200).json(evalResult.body);
    }

    if (evalResult.action === 'MISMATCH') {
      return res.status(422).json({
        success: false,
        error: 'Idempotency key payload mismatch: same key was submitted with different request parameters',
      });
    }

    if (evalResult.action === 'PROCESSING') {
      return res.status(409).json({
        success: false,
        error: 'Concurrent mutation in progress: a request with this idempotency key is currently executing',
      });
    }

    // Capture response
    const originalJson = res.json.bind(res);
    res.json = (body) => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        idempotencyCache.complete(idempotencyKey, res.statusCode, body).catch(() => {});
      } else {
        idempotencyCache.fail(idempotencyKey).catch(() => {});
      }
      return originalJson(body);
    };

    next();
  }).catch(() => {
    // DB or evaluation error — fail open to avoid blocking user operations
    next();
  });
}

/**
 * Periodic cleanup task for stale idempotency records.
 */
async function cleanupStaleIdempotencyKeys(retentionDays = 7) {
  await idempotencyCache.cleanup(retentionDays);
}

module.exports = { idempotencyMiddleware, cleanupStaleIdempotencyKeys };
