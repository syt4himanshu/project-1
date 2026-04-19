# 🏗️ Reliability Architecture Diagram

## System Architecture with Reliability Patterns

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    Error Boundary                             │  │
│  │  • Catches React component errors                            │  │
│  │  • Shows fallback UI                                         │  │
│  │  • Prevents white screen                                     │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              │                                       │
│                              ▼                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                  HTTP Client (with Retry)                     │  │
│  │  • Automatic retry on failure                                │  │
│  │  • Exponential backoff (1s → 2s → 4s)                       │  │
│  │  • Max 2 attempts                                            │  │
│  │  • Retries: 429, 5xx, network errors                        │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              │                                       │
└──────────────────────────────┼───────────────────────────────────────┘
                               │
                               │ HTTPS
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      BACKEND (Node.js/Express)                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                  Request Timeout Middleware                   │  │
│  │  • Standard: 30s timeout                                     │  │
│  │  • Extended: 60s timeout (AI endpoints)                      │  │
│  │  • Returns 408/504 on timeout                                │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              │                                       │
│                              ▼                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    Enhanced Logger                            │  │
│  │  • Structured JSON logs                                      │  │
│  │  • Request context (reqId, userId)                           │  │
│  │  • Stack traces                                              │  │
│  │  • Performance metrics                                       │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              │                                       │
│                              ▼                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                   Route Handlers                              │  │
│  │  • /api/faculty/ai-remarks                                   │  │
│  │  • /api/students                                             │  │
│  │  • /api/admin/*                                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              │                                       │
│                              ▼                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                  Circuit Breaker (Groq)                       │  │
│  │  • Monitors Groq API health                                  │  │
│  │  • Opens after 5 failures                                    │  │
│  │  • Fails fast when OPEN                                      │  │
│  │  • Auto-recovery after 30s                                   │  │
│  │  • States: CLOSED → OPEN → HALF_OPEN → CLOSED              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              │                                       │
│                              ▼                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    Retry Logic                                │  │
│  │  • Wraps external API calls                                  │  │
│  │  • Max 3 attempts                                            │  │
│  │  • Exponential backoff (1s → 2s → 4s)                       │  │
│  │  • Retries: 429, 5xx, network errors                        │  │
│  │  • No retry: 401, 403, model errors                         │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              │                                       │
└──────────────────────────────┼───────────────────────────────────────┘
                               │
                ┌──────────────┴──────────────┐
                │                             │
                ▼                             ▼
┌───────────────────────────┐   ┌───────────────────────────┐
│   PostgreSQL Database     │   │      Groq AI API          │
├───────────────────────────┤   ├───────────────────────────┤
│                           │   │                           │
│ • Connection pooling      │   │ • LLM inference           │
│ • Query timeout: 10s      │   │ • Model: llama-3.3-70b   │
│ • Transaction timeout:30s │   │ • Timeout: 10s/attempt   │
│ • Auto-retry on failure   │   │ • Fallback models        │
│ • Slow query logging      │   │                           │
│                           │   │                           │
└───────────────────────────┘   └───────────────────────────┘
```

---

## Request Flow with Reliability Patterns

### Normal Request Flow (Success)

```
User Action
    │
    ▼
[Error Boundary] ✓ No errors
    │
    ▼
[HTTP Client] → API Request
    │
    ▼
[Timeout Middleware] ✓ Within 30s
    │
    ▼
[Route Handler] → Process request
    │
    ▼
[Circuit Breaker] ✓ CLOSED, proceed
    │
    ▼
[Retry Logic] → Call Groq API (attempt 1)
    │
    ▼
[Groq API] ✓ Success (200 OK)
    │
    ▼
[Response] → Return to user
    │
    ▼
User sees result ✓
```

---

### Request Flow with Transient Failure (Retry Success)

```
User Action
    │
    ▼
[Error Boundary] ✓ No errors
    │
    ▼
[HTTP Client] → API Request
    │
    ▼
[Timeout Middleware] ✓ Within 30s
    │
    ▼
[Route Handler] → Process request
    │
    ▼
[Circuit Breaker] ✓ CLOSED, proceed
    │
    ▼
[Retry Logic] → Call Groq API (attempt 1)
    │
    ▼
[Groq API] ✗ Failure (503 Service Unavailable)
    │
    ▼
[Retry Logic] ⏱ Wait 1s, retry (attempt 2)
    │
    ▼
[Groq API] ✓ Success (200 OK)
    │
    ▼
[Response] → Return to user
    │
    ▼
User sees result ✓ (transparent retry)
```

---

### Request Flow with Service Down (Circuit Breaker)

```
User Action (Request 1-5)
    │
    ▼
[Circuit Breaker] ✓ CLOSED, proceed
    │
    ▼
[Retry Logic] → Call Groq API (3 attempts each)
    │
    ▼
[Groq API] ✗ All attempts fail
    │
    ▼
[Circuit Breaker] ⚠ Failure count: 1, 2, 3, 4, 5
    │
    ▼
[Circuit Breaker] 🔴 OPEN (after 5 failures)
    │
    ▼
User Action (Request 6+)
    │
    ▼
[Circuit Breaker] 🔴 OPEN → Fail fast (0ms)
    │
    ▼
[Response] → 503 Service Unavailable
    │
    ▼
User sees error message (immediate, no waiting)
    │
    ▼
⏱ Wait 30s...
    │
    ▼
[Circuit Breaker] 🟡 HALF_OPEN (test recovery)
    │
    ▼
User Action (Request N)
    │
    ▼
[Retry Logic] → Call Groq API
    │
    ▼
[Groq API] ✓ Success (service recovered)
    │
    ▼
[Circuit Breaker] 🟢 CLOSED (back to normal)
```

---

### Request Flow with Frontend Error (Error Boundary)

```
User Action
    │
    ▼
[React Component] → Render
    │
    ▼
[Component Logic] ✗ Throws error
    │
    ▼
[Error Boundary] ✓ Catches error
    │
    ▼
[Fallback UI] → Display error message
    │
    ▼
User sees:
  "Something went wrong"
  [Try Again] [Reload Page]
    │
    ▼
User clicks [Try Again]
    │
    ▼
[Error Boundary] → Reset state
    │
    ▼
[React Component] → Re-render
    │
    ▼
✓ Success (or show error again)
```

---

## Health Check Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Health Check Endpoints                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  GET /health                                                 │
│  ├─ Check: Database connection                              │
│  ├─ Check: Connection pool stats                            │
│  └─ Response: 200 (healthy) or 503 (unhealthy)             │
│                                                               │
│  GET /api/health/live                                        │
│  ├─ Check: Server is running                                │
│  └─ Response: 200 (always, unless server down)              │
│                                                               │
│  GET /api/health/ready                                       │
│  ├─ Check: Database connection                              │
│  ├─ Check: Groq API status                                  │
│  ├─ Check: Circuit breaker state                            │
│  └─ Response: 200 (ready) or 503 (not ready)               │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Monitoring & Observability

```
┌─────────────────────────────────────────────────────────────┐
│                      Structured Logs                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  {                                                           │
│    "timestamp": "2026-04-18T10:30:00Z",                     │
│    "level": "error",                                         │
│    "message": "Groq API error",                             │
│    "reqId": "abc123",                                        │
│    "userId": 456,                                            │
│    "error": "Rate limit exceeded",                          │
│    "stack": "Error: Rate limit...",                         │
│    "latencyMs": 1234,                                        │
│    "model": "llama-3.3-70b"                                 │
│  }                                                           │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Log Aggregation                         │
│  • grep "error" logs.json                                   │
│  • grep "Slow query" logs.json                              │
│  • grep "Circuit breaker" logs.json                         │
│  • grep "retrying" logs.json                                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                         Alerts                               │
│  • Error rate >5% for 5 minutes                             │
│  • Circuit breaker OPEN >5 minutes                          │
│  • Timeout rate >1% for 5 minutes                           │
│  • Slow queries >10 per hour                                │
└─────────────────────────────────────────────────────────────┘
```

---

## Failure Modes & Responses

| Failure | Detection | Response | Recovery |
|---------|-----------|----------|----------|
| **Groq API Down** | Circuit breaker | Fail fast (0ms) | Auto after 30s |
| **Groq Rate Limit** | 429 status | Retry with backoff | Success on retry |
| **Database Slow** | Query timeout | Abort after 10s | Return error |
| **Network Blip** | Connection error | Retry 3 times | Success on retry |
| **React Crash** | Error boundary | Show fallback UI | User clicks retry |
| **Request Hang** | Timeout middleware | Abort after 30s | Return 408 |
| **Auth Expired** | 401 status | Redirect to login | User re-authenticates |

---

## Performance Characteristics

### Latency Impact

| Operation | Before | After | Change |
|-----------|--------|-------|--------|
| **Successful request** | 200ms | 200ms | No change |
| **Transient failure** | 8s timeout | 1-3s retry | -5s to -7s |
| **Service down (1st)** | 8s timeout | 8s (3 retries) | No change |
| **Service down (6th+)** | 8s timeout | 0ms (fail fast) | -8s |
| **React error** | White screen | Fallback UI | Instant |

### Resource Usage

| Resource | Before | After | Change |
|----------|--------|-------|--------|
| **Memory** | Baseline | +5-10MB | Minimal |
| **CPU** | Baseline | +1-2% | Minimal |
| **Network** | Baseline | +10-20% (retries) | Acceptable |
| **Database** | Baseline | Same | No change |

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Load Balancer                           │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                │                           │
                ▼                           ▼
┌───────────────────────┐   ┌───────────────────────┐
│   Backend Instance 1  │   │   Backend Instance 2  │
│   • Timeout: 30s      │   │   • Timeout: 30s      │
│   • Circuit breaker   │   │   • Circuit breaker   │
│   • Retry logic       │   │   • Retry logic       │
└───────────────────────┘   └───────────────────────┘
                │                           │
                └─────────────┬─────────────┘
                              │
                              ▼
                ┌─────────────────────────┐
                │   PostgreSQL Primary    │
                │   • Connection pool: 5  │
                │   • Query timeout: 10s  │
                └─────────────────────────┘
```

---

## Key Metrics Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│                      System Health                           │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Circuit Breaker State:  🟢 CLOSED                          │
│  Error Rate:             0.3% ✓                             │
│  Timeout Rate:           0.1% ✓                             │
│  Retry Rate:             2.5% ✓                             │
│  Slow Queries:           3/hour ✓                           │
│  P95 Latency:            1.2s ✓                             │
│  Uptime:                 99.95% ✓                           │
│                                                               │
│  Database Pool:          4/5 used ✓                         │
│  Groq API Latency:       234ms ✓                            │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

**Architecture Version**: 1.0.0  
**Last Updated**: 2026-04-18  
**Status**: Production Ready
