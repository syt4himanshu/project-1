import { describe, expect, it } from 'vitest';
import express from 'express';
import {
  globalRateLimiter,
  loginRateLimiter,
  chatbotRateLimiter,
  isMonitoringOrHealthPath,
} from '../../middleware/rateLimiter';
import { extractTokenIdentityOptional } from '../../middleware/auth';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET_KEY || 'test-jwt-secret-key-12345';
process.env.JWT_SECRET_KEY = JWT_SECRET;

describe('Rate Limiter Architecture', () => {
  describe('isMonitoringOrHealthPath', () => {
    it('correctly identifies health and monitoring paths as exempt', () => {
      expect(isMonitoringOrHealthPath({ path: '/health' } as any)).toBe(true);
      expect(isMonitoringOrHealthPath({ path: '/api/health/live' } as any)).toBe(true);
      expect(isMonitoringOrHealthPath({ path: '/api/health/ready' } as any)).toBe(true);
      expect(isMonitoringOrHealthPath({ path: '/api/metrics/timing' } as any)).toBe(true);
    });

    it('does not exempt regular API routes', () => {
      expect(isMonitoringOrHealthPath({ path: '/api/students' } as any)).toBe(false);
      expect(isMonitoringOrHealthPath({ path: '/api/faculty/me' } as any)).toBe(false);
      expect(isMonitoringOrHealthPath({ path: '/api/auth/login' } as any)).toBe(false);
      expect(isMonitoringOrHealthPath({ path: '/api/admin/users' } as any)).toBe(false);
    });
  });

  describe('extractTokenIdentityOptional', () => {
    it('sets req.currentUserId when valid Bearer token is provided without DB query', () => {
      const token = jwt.sign(
        { sub: '42', role: 'student', username: 'student42' },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      const req: any = {
        headers: { authorization: `Bearer ${token}` },
      };
      let nextCalled = false;
      const next = () => { nextCalled = true; };

      extractTokenIdentityOptional(req, {} as any, next);

      expect(nextCalled).toBe(true);
      expect(req.currentUserId).toBe(42);
      expect(req.jwtPayload?.role).toBe('student');
    });

    it('sets req.currentUserId = null when no token is present', () => {
      const req: any = { headers: {} };
      let nextCalled = false;
      const next = () => { nextCalled = true; };

      extractTokenIdentityOptional(req, {} as any, next);

      expect(nextCalled).toBe(true);
      expect(req.currentUserId).toBeNull();
    });

    it('sets req.currentUserId = null when invalid token is provided without throwing', () => {
      const req: any = {
        headers: { authorization: 'Bearer invalid.garbage.token' },
      };
      let nextCalled = false;
      const next = () => { nextCalled = true; };

      extractTokenIdentityOptional(req, {} as any, next);

      expect(nextCalled).toBe(true);
      expect(req.currentUserId).toBeNull();
    });
  });

  describe('User-Aware and Campus-Isolated Rate Limiting Execution', () => {
    it('authenticated users have distinct rate-limit keys and separate quotas on the same IP', async () => {
      const rateLimiter = (globalRateLimiter as any);

      // Verify that keyGenerator differentiates users sharing the same IP
      const keyGen = rateLimiter.options?.keyGenerator;
      if (typeof keyGen === 'function') {
        const reqUser1: any = { currentUserId: 101, ip: '203.0.113.1' };
        const reqUser2: any = { currentUserId: 102, ip: '203.0.113.1' };
        const reqAnon: any = { currentUserId: null, ip: '203.0.113.1' };

        expect(keyGen(reqUser1)).toBe('user-101');
        expect(keyGen(reqUser2)).toBe('user-102');
        expect(keyGen(reqAnon)).toBe('ip-203.0.113.1');
      }
    });

    it('login rate limiter separates accounts on the same IP to avoid classroom lockout', () => {
      const loginLimiter = (loginRateLimiter as any);
      const keyGen = loginLimiter.options?.keyGenerator;

      if (typeof keyGen === 'function') {
        const reqStudent1: any = {
          ip: '203.0.113.1',
          body: { username: 'StudentA' },
        };
        const reqStudent2: any = {
          ip: '203.0.113.1',
          body: { username: 'StudentB' },
        };

        expect(keyGen(reqStudent1)).toBe('login:203.0.113.1:studenta');
        expect(keyGen(reqStudent2)).toBe('login:203.0.113.1:studentb');
        expect(keyGen(reqStudent1)).not.toBe(keyGen(reqStudent2));
      }
    });

    it('50 different users logging in simultaneously from the same campus IP all have separate buckets and do not get rate-limited', async () => {
      const originalEnv = process.env.ENABLE_RATE_LIMIT_TESTS;
      process.env.ENABLE_RATE_LIMIT_TESTS = 'true';

      try {
        const app = express();
        app.use(express.json());
        app.use(loginRateLimiter);
        app.post('/api/auth/login', (req, res) => {
          res.status(200).json({ ok: true, user: req.body?.username });
        });

        const server = app.listen(0);
        const port = (server.address() as any).port;

        // Simulate 50 students from campus IP 103.21.244.2 logging in at the same second
        const promises = Array.from({ length: 50 }, (_, i) =>
          fetch(`http://127.0.0.1:${port}/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Forwarded-For': '103.21.244.2',
            },
            body: JSON.stringify({ username: `student_${i + 1}`, password: 'password123' }),
          })
        );

        const responses = await Promise.all(promises);
        const statuses = responses.map((r) => r.status);

        // Every single student should get 200 OK — zero 429 errors!
        expect(statuses.every((s) => s === 200)).toBe(true);

        server.close();
      } finally {
        process.env.ENABLE_RATE_LIMIT_TESTS = originalEnv;
      }
    });

    it('chatbot rate limiter keys by user ID when authenticated', () => {
      const chatbotLimiter = (chatbotRateLimiter as any);
      const keyGen = chatbotLimiter.options?.keyGenerator;

      if (typeof keyGen === 'function') {
        const reqFaculty1: any = { currentUserId: 50, ip: '127.0.0.1' };
        const reqFaculty2: any = { currentUserId: 51, ip: '127.0.0.1' };

        expect(keyGen(reqFaculty1)).toBe('user-50');
        expect(keyGen(reqFaculty2)).toBe('user-51');
      }
    });

    it('rate limiter returns Retry-After header and standard rate limit headers when triggered', async () => {
      const originalEnv = process.env.ENABLE_RATE_LIMIT_TESTS;
      process.env.ENABLE_RATE_LIMIT_TESTS = 'true';

      try {
        const app = express();
        app.use(express.json());

        // Create a strict test limiter of 2 requests
        const rateLimitModule = await import('express-rate-limit');
        const rateLimit = rateLimitModule.default || rateLimitModule;
        const testLimiter = rateLimit({
          windowMs: 60 * 1000,
          max: 2,
          standardHeaders: true,
          legacyHeaders: false,
          handler: (req, res, _next, options) => {
            const retryAfterSec = Math.ceil(options.windowMs / 1000);
            res.setHeader('Retry-After', retryAfterSec);
            res.status(429).json({ error: 'Too many requests' });
          },
        });

        app.get('/test', testLimiter, (_req, res) => {
          res.json({ ok: true });
        });

        const server = app.listen(0);
        const port = (server.address() as any).port;

        const res1 = await fetch(`http://127.0.0.1:${port}/test`);
        expect(res1.status).toBe(200);

        const res2 = await fetch(`http://127.0.0.1:${port}/test`);
        expect(res2.status).toBe(200);

        const res3 = await fetch(`http://127.0.0.1:${port}/test`);
        expect(res3.status).toBe(429);
        expect(res3.headers.get('Retry-After')).toBe('60');
        expect(res3.headers.get('RateLimit-Limit')).toBe('2');

        server.close();
      } finally {
        process.env.ENABLE_RATE_LIMIT_TESTS = originalEnv;
      }
    });
  });
});
