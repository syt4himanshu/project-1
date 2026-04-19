# 🚀 Incremental Rollout Plan

## Overview

This document provides a **step-by-step incremental rollout plan** for deploying reliability improvements to production without breaking existing functionality.

---

## 🎯 Rollout Strategy

**Approach**: Phased rollout with validation at each step

**Duration**: 2-3 weeks

**Risk Level**: Low (all changes are backward compatible)

---

## 📅 Phase 1: Backend Core Reliability (Week 1)

### Day 1-2: Logging & Monitoring

**Changes:**
- Enhanced logger with stack traces
- Slow query logging
- Request context tracking

**Files Modified:**
- `kys-backend/utils/logger.js`
- `kys-backend/config/database.js`

**Deployment Steps:**
1. Deploy changes to staging
2. Generate test traffic
3. Verify logs are structured and readable
4. Check slow query detection works
5. Deploy to production during low-traffic window

**Validation:**
```bash
# Check logs are working
curl https://your-domain.com/api/health
grep "timestamp" logs.json

# Verify slow query logging
# Run a slow query and check logs
```

**Rollback**: Revert logger.js and database.js

**Risk**: ⚪ Very Low (only logging changes)

---

### Day 3-4: Request Timeouts

**Changes:**
- Add timeout middleware
- Apply to all routes

**Files Modified:**
- `kys-backend/middleware/timeout.js` (new)
- `kys-backend/server.js`

**Deployment Steps:**
1. Deploy to staging
2. Test long-running requests timeout correctly
3. Verify normal requests are unaffected
4. Monitor for false positives (legitimate requests timing out)
5. Deploy to production

**Validation:**
```bash
# Test timeout works (should return 408 after 30s)
curl -X POST https://your-domain.com/api/slow-endpoint

# Test normal requests work
curl https://your-domain.com/api/health
```

**Rollback**: Remove timeout middleware from server.js

**Risk**: 🟡 Low (may timeout legitimate slow requests)

**Mitigation**: Use `extendedTimeout` for AI endpoints

---

### Day 5-7: Retry Logic & Circuit Breaker

**Changes:**
- Add retry utility
- Add circuit breaker
- Apply to Groq service

**Files Modified:**
- `kys-backend/utils/retry.js` (new)
- `kys-backend/utils/circuitBreaker.js` (new)
- `kys-backend/services/groq.service.js`

**Deployment Steps:**
1. Deploy to staging
2. Test AI remarks generation works normally
3. Simulate Groq API failures (invalid key)
4. Verify retry logic kicks in
5. Verify circuit breaker opens after 5 failures
6. Restore valid key and verify recovery
7. Deploy to production

**Validation:**
```bash
# Test AI endpoint works
curl -X POST https://your-domain.com/api/faculty/ai-remarks \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query": "test", "studentContext": {...}}'

# Check circuit breaker status
curl https://your-domain.com/api/health/ready
```

**Rollback**: Revert groq.service.js to previous version

**Risk**: 🟡 Medium (changes core AI functionality)

**Mitigation**: 
- Test thoroughly in staging
- Deploy during low-traffic window
- Monitor error rates closely

---

## 📅 Phase 2: Frontend Reliability (Week 2)

### Day 8-9: Error Boundary

**Changes:**
- Add ErrorBoundary component
- Integrate in AppProviders

**Files Modified:**
- `kys-frontend/src/shared/components/ErrorBoundary.tsx` (new)
- `kys-frontend/src/app/providers/AppProviders.tsx`

**Deployment Steps:**
1. Build and deploy to staging
2. Test normal app functionality
3. Trigger a component error (throw error in dev tools)
4. Verify error boundary catches it
5. Verify fallback UI displays
6. Deploy to production

**Validation:**
```javascript
// In browser console, trigger error
throw new Error('Test error boundary');
// Should show fallback UI, not white screen
```

**Rollback**: Remove ErrorBoundary from AppProviders.tsx

**Risk**: ⚪ Very Low (only affects error handling)

---

### Day 10-11: HTTP Client Retry

**Changes:**
- Add retry logic to HTTP client
- Exponential backoff for failed requests

**Files Modified:**
- `kys-frontend/src/shared/api/httpClient.ts`

**Deployment Steps:**
1. Build and deploy to staging
2. Test normal API calls work
3. Simulate network failures (throttle network in dev tools)
4. Verify retries happen
5. Verify user sees eventual success or clear error
6. Deploy to production

**Validation:**
```javascript
// In browser dev tools, throttle network to "Slow 3G"
// Make API calls and verify retries in Network tab
```

**Rollback**: Revert httpClient.ts

**Risk**: 🟡 Low (may increase API load slightly)

**Mitigation**: Max 2 retries prevents excessive load

---

## 📅 Phase 3: Health Checks & Monitoring (Week 3)

### Day 12-14: Enhanced Health Checks

**Changes:**
- Add comprehensive health check utility
- Update health endpoints
- Add readiness probe

**Files Modified:**
- `kys-backend/utils/healthCheck.js` (new)
- `kys-backend/server.js`

**Deployment Steps:**
1. Deploy to staging
2. Test all health endpoints
3. Verify metrics are accurate
4. Set up monitoring alerts (if using monitoring service)
5. Deploy to production

**Validation:**
```bash
# Test liveness probe
curl https://your-domain.com/api/health/live

# Test readiness probe
curl https://your-domain.com/api/health/ready

# Test basic health
curl https://your-domain.com/health
```

**Rollback**: Revert server.js health endpoints

**Risk**: ⚪ Very Low (only adds endpoints)

---

## 🔍 Validation Checklist

After each phase, verify:

### Functional Tests
- [ ] Login works
- [ ] Student list loads
- [ ] Faculty dashboard loads
- [ ] AI remarks generation works
- [ ] Mentoring minutes can be added
- [ ] Reports generate correctly

### Performance Tests
- [ ] Response times are acceptable (<2s for most endpoints)
- [ ] No increase in error rates
- [ ] Database queries complete within timeout
- [ ] AI requests complete within 60s

### Reliability Tests
- [ ] App recovers from transient failures
- [ ] Circuit breaker opens on repeated failures
- [ ] Retries work for failed requests
- [ ] Timeouts prevent hanging requests
- [ ] Error boundary catches React errors

---

## 📊 Monitoring During Rollout

### Key Metrics to Watch

1. **Error Rate**
   - Target: <1% of requests
   - Alert if: >5% for 5 minutes

2. **Response Time**
   - Target: P95 <2s
   - Alert if: P95 >5s for 5 minutes

3. **Timeout Rate**
   - Target: <0.1% of requests
   - Alert if: >1% for 5 minutes

4. **Circuit Breaker State**
   - Target: CLOSED
   - Alert if: OPEN for >5 minutes

5. **Retry Rate**
   - Target: <5% of requests
   - Alert if: >20% for 5 minutes

### Monitoring Commands

```bash
# Watch error logs in real-time
tail -f logs.json | grep "error"

# Count errors per minute
grep "error" logs.json | grep "$(date +%Y-%m-%dT%H:%M)" | wc -l

# Check circuit breaker state
curl https://your-domain.com/api/health/ready | jq .checks.groqCircuitBreaker

# Monitor retry attempts
grep "retrying" logs.json | tail -20
```

---

## 🚨 Rollback Triggers

Immediately rollback if:

1. **Error rate >10%** for 5 minutes
2. **Circuit breaker stuck OPEN** for >10 minutes
3. **Timeout rate >5%** for 5 minutes
4. **Critical functionality broken** (login, AI remarks)
5. **Database connection failures**

---

## 🎯 Success Criteria

### Phase 1 Success
- [ ] Logs are structured and actionable
- [ ] Slow queries are detected
- [ ] Requests timeout gracefully
- [ ] Groq API retries work
- [ ] Circuit breaker prevents cascading failures
- [ ] No increase in error rate

### Phase 2 Success
- [ ] React errors don't crash app
- [ ] Error boundary shows fallback UI
- [ ] HTTP retries reduce failure rate
- [ ] User experience is smooth
- [ ] No increase in API load

### Phase 3 Success
- [ ] Health checks return accurate data
- [ ] Monitoring alerts are configured
- [ ] Team can diagnose issues quickly
- [ ] System is observable

---

## 📋 Pre-Deployment Checklist

Before each deployment:

- [ ] Code reviewed by at least one other developer
- [ ] All tests passing (`npm test`)
- [ ] Staging environment tested
- [ ] Rollback plan documented
- [ ] Team notified of deployment
- [ ] Monitoring dashboard open
- [ ] Low-traffic window selected (if possible)

---

## 🔄 Rollback Procedures

### Quick Rollback (Emergency)

```bash
# Backend
cd kys-backend
git revert HEAD
npm install
pm2 restart kys-backend

# Frontend
cd kys-frontend
git revert HEAD
npm run build
# Deploy static files
```

### Selective Rollback

If only one component is problematic:

**Disable retry logic:**
```javascript
// In groq.service.js, temporarily bypass retry
const completion = await groq.chat.completions.create(...);
// Skip retryWithBackoff wrapper
```

**Disable circuit breaker:**
```javascript
// In groq.service.js, temporarily bypass circuit breaker
// return groqCircuitBreaker.execute(async () => { ... });
// becomes:
return await (async () => { ... })();
```

**Disable timeout:**
```javascript
// In server.js, comment out:
// app.use(standardTimeout);
```

---

## 📞 Communication Plan

### Before Deployment
- Notify team in Slack/email
- Schedule deployment window
- Prepare rollback plan

### During Deployment
- Post status updates every 15 minutes
- Monitor error rates and metrics
- Be ready to rollback

### After Deployment
- Confirm success in team chat
- Document any issues encountered
- Update runbook if needed

---

## 🎓 Lessons Learned Template

After each phase, document:

**What went well:**
- 

**What could be improved:**
- 

**Issues encountered:**
- 

**Rollback needed:**
- Yes/No

**Time to deploy:**
- 

**Time to validate:**
- 

---

## 📚 Additional Resources

- [Blue-Green Deployment](https://martinfowler.com/bliki/BlueGreenDeployment.html)
- [Canary Releases](https://martinfowler.com/bliki/CanaryRelease.html)
- [Feature Flags](https://www.martinfowler.com/articles/feature-toggles.html)

---

**Last Updated**: 2026-04-18
**Version**: 1.0.0
