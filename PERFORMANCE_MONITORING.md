# 📊 Performance Monitoring Guide

## Quick Reference for Performance Monitoring

---

## 🎯 Key Metrics to Monitor

### Frontend Metrics

| Metric | Target | Command |
|--------|--------|---------|
| **LCP** | <2.5s | Lighthouse audit |
| **FCP** | <1.8s | Lighthouse audit |
| **TTI** | <3.5s | Lighthouse audit |
| **Bundle Size** | <300 kB | `ls -lh dist/assets/index-*.js` |

### Backend Metrics

| Metric | Target | Command |
|--------|--------|---------|
| **API P95** | <500ms | `curl /api/metrics/timing \| jq .overall.p95` |
| **API P99** | <1000ms | `curl /api/metrics/timing \| jq .overall.p99` |
| **Slow Requests** | <5% | `grep "Slow request" logs.json \| wc -l` |
| **DB Query Time** | <100ms | Check logs for slow queries |

---

## 🔍 Monitoring Commands

### Check API Performance

```bash
# Get overall timing statistics
curl http://localhost:5002/api/metrics/timing

# Get P95 latency
curl http://localhost:5002/api/metrics/timing | jq .overall.p95

# Get slow endpoints
curl http://localhost:5002/api/metrics/timing | jq .slowEndpoints

# Pretty print all metrics
curl http://localhost:5002/api/metrics/timing | jq .
```

### Monitor Slow Requests

```bash
# Watch for slow requests in real-time
tail -f logs.json | grep "Slow request"

# Count slow requests in last hour
grep "Slow request" logs.json | grep "$(date +%Y-%m-%dT%H)" | wc -l

# Show slowest requests
grep "Slow request" logs.json | jq -r '.duration' | sort -rn | head -10
```

### Check Bundle Sizes

```bash
# List all JavaScript bundles
ls -lh kys-frontend/dist/assets/*.js

# Check main bundle size
ls -lh kys-frontend/dist/assets/index-*.js

# Check gzipped sizes
gzip -c kys-frontend/dist/assets/index-*.js | wc -c
```

### Database Performance

```bash
# Check if indexes are being used (PostgreSQL)
psql -d your_db -c "EXPLAIN ANALYZE SELECT * FROM student WHERE mentor_id = 1;"

# List all indexes
psql -d your_db -c "SELECT tablename, indexname FROM pg_indexes WHERE schemaname = 'public';"

# Check index usage statistics
psql -d your_db -c "SELECT * FROM pg_stat_user_indexes;"
```

---

## 📈 Performance Dashboards

### API Timing Dashboard

```bash
# Create a simple dashboard
watch -n 5 'curl -s http://localhost:5002/api/metrics/timing | jq "{
  count: .overall.count,
  avg: .overall.avg,
  p95: .overall.p95,
  p99: .overall.p99,
  slow_endpoints: .slowEndpoints | length
}"'
```

### Real-Time Monitoring

```bash
# Monitor requests in real-time
tail -f logs.json | jq 'select(.message == "Slow request detected") | {
  path: .path,
  duration: .duration,
  status: .status
}'
```

---

## 🚨 Alert Thresholds

### Critical Alerts

| Condition | Threshold | Action |
|-----------|-----------|--------|
| P95 latency | >1000ms | Investigate slow endpoints |
| P99 latency | >3000ms | Check database performance |
| Slow requests | >10% | Review query optimization |
| Error rate | >5% | Check logs for errors |

### Warning Alerts

| Condition | Threshold | Action |
|-----------|-----------|--------|
| P95 latency | >500ms | Monitor closely |
| Slow requests | >5% | Consider optimization |
| Bundle size | >300 kB | Review code splitting |

---

## 🔧 Troubleshooting

### High API Latency

**Symptoms**: P95 > 500ms

**Diagnosis**:
```bash
# Check slow endpoints
curl /api/metrics/timing | jq .slowEndpoints

# Check database queries
grep "Slow query" logs.json | tail -20

# Check for N+1 queries
grep "SELECT" logs.json | wc -l
```

**Solutions**:
1. Add database indexes
2. Optimize queries (use EXPLAIN ANALYZE)
3. Add caching
4. Reduce payload size

### Large Bundle Size

**Symptoms**: Main bundle > 300 kB

**Diagnosis**:
```bash
# Analyze bundle
npm run build -- --mode=production

# Check for large dependencies
npx vite-bundle-visualizer
```

**Solutions**:
1. Lazy load more routes
2. Remove unused dependencies
3. Use dynamic imports
4. Split vendor chunks

### Slow Database Queries

**Symptoms**: Queries > 100ms

**Diagnosis**:
```bash
# Check slow queries in logs
grep "Slow query" logs.json

# Analyze query plan
psql -d your_db -c "EXPLAIN ANALYZE <your-query>;"
```

**Solutions**:
1. Add missing indexes
2. Optimize WHERE clauses
3. Reduce JOIN complexity
4. Add query caching

---

## 📊 Lighthouse Audit

### Run Lighthouse

```bash
# Install Lighthouse
npm install -g lighthouse

# Run audit
lighthouse https://your-domain.com --view

# Run audit with specific categories
lighthouse https://your-domain.com --only-categories=performance --view

# Save report
lighthouse https://your-domain.com --output=html --output-path=./report.html
```

### Interpret Results

**Performance Score**:
- 90-100: Excellent ✅
- 50-89: Needs improvement 🟡
- 0-49: Poor ❌

**Key Metrics**:
- **LCP** (Largest Contentful Paint): <2.5s
- **FID** (First Input Delay): <100ms
- **CLS** (Cumulative Layout Shift): <0.1
- **FCP** (First Contentful Paint): <1.8s
- **TTI** (Time to Interactive): <3.8s

---

## 🎯 Performance Optimization Checklist

### Frontend

- [x] Code splitting implemented
- [x] Lazy loading with Suspense
- [x] Bundle size optimized
- [ ] Images optimized (WebP)
- [ ] Critical CSS inlined
- [ ] Fonts preloaded
- [ ] Service worker for caching

### Backend

- [x] Request timing middleware
- [x] Database indexes added
- [x] N+1 queries fixed
- [x] Performance monitoring
- [ ] Query result caching
- [ ] Response compression
- [ ] Connection pooling tuned

---

## 📚 Resources

- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [PostgreSQL Performance Tips](https://wiki.postgresql.org/wiki/Performance_Optimization)
- [React Performance](https://react.dev/learn/render-and-commit)
- [Vite Performance](https://vitejs.dev/guide/performance.html)

---

**Last Updated**: 2026-04-18  
**Version**: 1.0.0
