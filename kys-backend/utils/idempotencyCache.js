const crypto = require('crypto');

/**
 * Durable idempotency cache backed by PostgreSQL `idempotency_keys` table
 * with in-memory fallback for headless unit tests / DB-degraded states.
 *
 * Prevents duplicate mutation executions across server restarts, PM2 reloads,
 * and OOM kills. Scoped per faculty user, validates request payload hash,
 * and enforces single execution via 'processing' / 'completed' / 'failed' states.
 */

function hashPayload(payload) {
  const json = JSON.stringify(payload || {});
  return crypto.createHash('sha256').update(json).digest('hex');
}

class IdempotencyCache {
  constructor() {
    this._sequelize = null;
    this._IdempotencyKey = null;
    this._fallbackMap = new Map();
  }

  _getModels() {
    if (!this._sequelize || !this._IdempotencyKey) {
      try {
        const models = require('../models');
        this._sequelize = models.sequelize;
        this._IdempotencyKey = models.IdempotencyKey;
      } catch {
        this._sequelize = null;
        this._IdempotencyKey = null;
      }
    }
    return { sequelize: this._sequelize, IdempotencyKey: this._IdempotencyKey };
  }

  _evaluateFallback(key, facultyId, operationType, requestHash) {
    const record = this._fallbackMap.get(key);
    if (!record) {
      this._fallbackMap.set(key, {
        faculty_id: facultyId,
        operation_type: operationType,
        request_hash: requestHash,
        status: 'processing',
        response_status: null,
        response_body: null,
      });
      return { action: 'NEW' };
    }

    if (record.request_hash !== requestHash) {
      return { action: 'MISMATCH' };
    }

    if (record.status === 'completed') {
      let body;
      try { body = JSON.parse(record.response_body); } catch { body = record.response_body; }
      return { action: 'HIT', status: record.response_status || 200, body };
    }

    if (record.status === 'processing') {
      return { action: 'PROCESSING' };
    }

    record.status = 'processing';
    record.request_hash = requestHash;
    return { action: 'NEW' };
  }

  async evaluate(key, facultyId, operationType, reqBody) {
    if (!key) return { action: 'NEW' };
    const requestHash = hashPayload(reqBody);

    try {
      const { IdempotencyKey } = this._getModels();
      if (IdempotencyKey) {
        const record = await IdempotencyKey.findOne({ where: { key } });

        if (!record) {
          try {
            await IdempotencyKey.create({
              key,
              faculty_id: facultyId || 0,
              operation_type: operationType || 'MUTATION',
              request_hash: requestHash,
              status: 'processing',
            });
            return { action: 'NEW' };
          } catch {
            const existing = await IdempotencyKey.findOne({ where: { key } });
            if (existing) {
              if (existing.request_hash !== requestHash) return { action: 'MISMATCH' };
              if (existing.status === 'completed') {
                let body;
                try { body = JSON.parse(existing.response_body); } catch { body = existing.response_body; }
                return { action: 'HIT', status: existing.response_status || 200, body };
              }
              return { action: 'PROCESSING' };
            }
            return { action: 'NEW' };
          }
        }

        if (record.request_hash !== requestHash) {
          return { action: 'MISMATCH' };
        }

        if (record.status === 'completed') {
          let body;
          try { body = JSON.parse(record.response_body); } catch { body = record.response_body; }
          return { action: 'HIT', status: record.response_status || 200, body };
        }

        if (record.status === 'processing') {
          return { action: 'PROCESSING' };
        }

        record.status = 'processing';
        record.request_hash = requestHash;
        if (facultyId) record.faculty_id = facultyId;
        await record.save();
        return { action: 'NEW' };
      }
    } catch {
      // Fallback to in-memory evaluation if DB query fails
    }

    return this._evaluateFallback(key, facultyId, operationType, requestHash);
  }

  async complete(key, status, body) {
    if (!key) return;
    const responseBody = JSON.stringify(body ?? null);

    const record = this._fallbackMap.get(key);
    if (record) {
      record.status = 'completed';
      record.response_status = status || 200;
      record.response_body = responseBody;
    }

    try {
      const { IdempotencyKey } = this._getModels();
      if (IdempotencyKey) {
        await IdempotencyKey.update(
          {
            status: 'completed',
            response_status: status || 200,
            response_body: responseBody,
            completed_at: new Date(),
          },
          { where: { key } },
        );
      }
    } catch {/* ignore */ }
  }

  async fail(key) {
    if (!key) return;

    const record = this._fallbackMap.get(key);
    if (record) record.status = 'failed';

    try {
      const { IdempotencyKey } = this._getModels();
      if (IdempotencyKey) {
        await IdempotencyKey.update({ status: 'failed' }, { where: { key } });
      }
    } catch {/* ignore */ }
  }

  async cleanup(retentionDays = 7) {
    try {
      const { sequelize } = this._getModels();
      if (sequelize) {
        const cutoff = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);
        await sequelize.query(
          `DELETE FROM idempotency_keys WHERE created_at < :cutoff`,
          { replacements: { cutoff } },
        );
      }
    } catch {/* ignore */ }
  }

  async clear() {
    this._fallbackMap.clear();
    try {
      const { IdempotencyKey } = this._getModels();
      if (IdempotencyKey) {
        await IdempotencyKey.destroy({ where: {}, truncate: true });
      }
    } catch {/* ignore */ }
  }
}

const idempotencyCache = new IdempotencyCache();
module.exports = { idempotencyCache, hashPayload };
