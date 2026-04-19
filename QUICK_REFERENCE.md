# ⚡ Quick Reference Card

## 🚀 One-Page Reliability Upgrade Guide

---

## 📦 What Was Added

### Backend (7 files)
```
kys-backend/
├── utils/
│   ├── retry.js              ← Retry with exponential backoff
│   ├── circuitBreaker.js     ← Circuit breaker pattern
│   └── healthCheck.js        ← Health check utilities
└── middleware/
    └── timeout.js            ← Request timeout middleware
```

### Frontend (1 file)
```
kys-frontend/
└── src/shared/components/
    └── ErrorBoundary.tsx     ← React error boundary
```

### Modified Files
- `kys-backend/services/groq.service.js` - Added retry + circuit breaker
- `kys-backend/utils/logger.js` - Enhanced logging
- `kys-backend/config/database.js` - Added timeouts
- `kys-backend/server.js` - Added timeout middleware
- `kys-frontend/src/shared/api/httpClient.ts` - Added retry
- `kys-frontend/src/app/providers/AppProviders.tsx` - Added error boundary

---

## 🎯 Key Features

| Feature | Location | Benefit |
|---------|----------|---------|
| **Retry Logic** | `utils/retry.js` | Auto-retry failed API calls |
| **Circuit Breaker** | `utils/circuitBreaker.js` | Fail fast when service down |
| **Request Timeout** | `middleware/timeout.js` | Prevent hanging requests |
| **Error Boundary** | `ErrorBoundary.tsx` | Catch React crashes |
| **Enhanced Logging** | `utils/logger.js` | Structured, searchable logs |
| **Health Checks** | `utils/healthCheck.js` | Monitor system status |

---

## 🔧 Quick Commands

### Test Health
```bash
curl http://localhost:5002/health
curl http://localhost:5002/api/health/ready
```

### Check Logs
```bash
# Errors
grep "error" logs.json | tail -20

# Slow queries
grep "Slow query" logs.json

# Retries
grep "retrying" logs.json

# Circuit breaker
grep "Circuit breaker" logs.json
```

### Monitor Metrics
```bash
# Circuit breaker state
curl http://localhost:5002/api/health/ready | jq .checks.groqCircuitBreaker

# Database pool
curl http://localhost:5002/health | jq .checks.database.details
```

---

## 📊 Default Configuration

```javascript
// Retry
maxAttempts: 3
initialDelay: 1000ms
maxDelay: 5000ms

// Circuit Breaker
failureThreshold: 5
successThreshold: 2
timeout: 30000ms

// Timeouts
standard: 30000ms (30s)
extended: 60000ms (60s)

// Database
queryTimeout: 10000ms (10s)
transactionTimeout: 30000ms (30s)
```

---

## 🚨 Common Issues

### Issue: Circuit Breaker Stuck OPEN
```bash
# Check status
curl /api/health/ready | jq .checks.groqCircuitBreaker

# Wait 30s for auto-recovery, or manually reset in code
```

### Issue: Requests Timing Out
```bash
# Check if legitimate slow operation
# If yes, use extendedTimeout middleware

# In route file:
const { extendedTimeout } = require('./middleware/timeout');
router.post('/slow-endpoint', extendedTimeout, handler);
```

### Issue: Too Many Retries
```bash
# Check retry logs
grep "retrying" logs.json | wc -l

# If excessive, reduce maxAttempts in retry config
```

---

## 📈 Success Metrics

| Metric | Target | Command |
|--------|--------|---------|
| Error Rate | <1% | `grep "error" logs.json \| wc -l` |
| Timeout Rate | <1% | `grep "timeout" logs.json \| wc -l` |
| Circuit State | CLOSED | `curl /api/health/ready \| jq .checks.groqCircuitBreaker.state` |
| Slow Queries | <10/hr | `grep "Slow query" logs.json \| wc -l` |
| Retry Rate | <5% | `grep "retrying" logs.json \| wc -l` |

---

## 🔄 Quick Rollback

```bash
# Backend
cd kys-backend
git revert HEAD~4..HEAD
npm install && npm start

# Frontend
cd kys-frontend
git revert HEAD~2..HEAD
npm run build
```

---

## 📚 Documentation

- **`SRE_UPGRADE_SUMMARY.md`** - Executive summary
- **`RELIABILITY_UPGRADE.md`** - Complete technical docs
- **`ROLLOUT_PLAN.md`** - Deployment guide
- **`RELIABILITY_PATTERNS.md`** - Code examples
- **`QUICK_REFERENCE.md`** - This file

---

## ✅ Pre-Deployment Checklist

- [ ] Tests passing: `npm test`
- [ ] Health checks work: `curl /health`
- [ ] Logs are structured: `grep "timestamp" logs.json`
- [ ] Circuit breaker configured: Check `groq.service.js`
- [ ] Timeouts applied: Check `server.js`
- [ ] Error boundary integrated: Check `AppProviders.tsx`
- [ ] Environment variables set: Check `.env`

---

## 🎯 Post-Deployment Validation

```bash
# 1. Check health
curl https://your-domain.com/health

# 2. Test AI endpoint
curl -X POST https://your-domain.com/api/faculty/ai-remarks \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query": "test", "studentContext": {...}}'

# 3. Monitor logs
tail -f logs.json | grep "error"

# 4. Check circuit breaker
curl https://your-domain.com/api/health/ready | jq .checks.groqCircuitBreaker
```

---

## 🆘 Emergency Contacts

**If circuit breaker stuck OPEN:**
- Wait 30s for auto-recovery
- Check Groq API status
- Verify GROQ_API_KEY is valid

**If high error rate:**
- Check logs: `grep "error" logs.json | tail -50`
- Check health: `curl /api/health/ready`
- Consider rollback if >10% errors

**If timeouts excessive:**
- Check if legitimate slow operations
- Increase timeout for specific routes
- Check database performance

---

## 💡 Pro Tips

1. **Monitor circuit breaker state** - First sign of external service issues
2. **Set up alerts** - Error rate >5%, circuit OPEN >5min
3. **Review logs daily** - Look for patterns in errors/retries
4. **Test failure scenarios** - Simulate Groq down, DB slow
5. **Keep retry attempts low** - Max 3 to avoid hammering services

---

## 🔗 Quick Links

- [Circuit Breaker Pattern](https://martinfowler.com/bliki/CircuitBreaker.html)
- [Retry Pattern](https://docs.microsoft.com/en-us/azure/architecture/patterns/retry)
- [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)

---

**Version**: 1.0.0  
**Last Updated**: 2026-04-18  
**Status**: ✅ Production Ready
