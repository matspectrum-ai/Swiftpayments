# System Architecture

## 1. Architectural style

A **lightweight modular platform with two API deployables** and shared PostgreSQL infrastructure.

The two API boundary is preserved from the reference system because transaction/provider processing has different reliability/security concerns from merchant/admin workflows. We intentionally do **not** split every bounded context into a service.

## 2. Logical topology

```text
                  ┌──────────────────┐
                  │ merchant-web     │ Next.js
                  └────────┬─────────┘
                           │
                  ┌────────▼─────────┐
                  │ platform-api     │ Fastify
                  │ merchant/admin   │
                  │ KYC/catalog      │
                  └──────┬───────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
┌───────▼──────┐ ┌──────▼───────┐ ┌─────▼─────────┐
│ PostgreSQL   │ │ Supabase Auth │ │ Storage       │
│ + RLS        │ │ human identity│ │ private/public│
└──────┬───────┘ └───────────────┘ └───────────────┘
       │
       │ shared canonical data/outbox/pgmq
       │
┌──────▼──────────┐      ┌──────────────────┐
│ payment-api     │◄────►│ checkout-web     │ Next.js
│ public API      │      └──────────────────┘
│ Pix core/router │
│ provider ingress│
└──────┬──────────┘
       │
       ▼
┌──────────────┐
│ Pix Router   │
└───┬──────┬───┘
    ▼      ▼
 Flevo   Akkad
```

`admin-web` uses `platform-api` for admin/compliance operations. It can read privileged payment operational views through platform-safe internal application services/queries, never by browser service-role credentials.

## 3. Deployables

### `apps/merchant-web`
Merchant dashboard; no privileged secrets; browser uses Supabase Auth and platform API.

### `apps/admin-web`
Internal owners/compliance/ops. Separate authorization surface from merchant UI.

### `apps/checkout-web`
Public hosted buyer flow. Reads public checkout config; starts payment through controlled public/internal endpoint; Realtime may update UX but canonical status comes from API/database.

### `apps/platform-api`
Owns:
- merchant/member lifecycle;
- human session authorization integration;
- KYC/KYB/compliance workflow;
- admin/RBAC;
- products, orders config, checkouts and payment links config;
- provider configuration/readiness metadata;
- fee/rate-limit/settings configuration;
- dashboard query/cache orchestration;
- storage authorization;
- internal audit views.

### `apps/payment-api`
Owns:
- machine/API-key authentication;
- public Pix API;
- payment aggregate/state transitions;
- idempotency;
- fee snapshot application;
- provider eligibility/routing;
- FlevoPay/AkkadPag adapters;
- provider webhook ingress/auth/normalization;
- merchant event/outbox/webhook delivery;
- payment reconciliation jobs;
- test simulation endpoints guarded by environment.

## 4. Shared packages

```text
packages/
  domain/          # pure canonical domain, state/invariants
  contracts/       # public/internal schemas and shared types
  db/              # SQL/repositories/query helpers
  providers/       # provider contract + adapters
  security/        # authz/crypto/redaction helpers
  observability/   # logging/metrics/tracing primitives
  ui/              # shared design system
  testkit/         # fixtures/builders/provider simulator
  config/          # typed environment/config parsing
```

Dependency direction:

`apps → application/domain ports → infrastructure adapters`.

Canonical domain packages must not import provider adapter packages or web frameworks.

## 5. Data and async

- PostgreSQL is canonical state.
- Supabase Auth is human identity.
- RLS protects browser-facing tenant data.
- Supabase Storage holds KYC/private files and public product assets.
- Transactional outbox records domain events in the same DB transaction as state mutation.
- `pgmq` delivers durable async jobs/events.
- `pg_cron` schedules periodic work.
- Supabase Realtime emits UX refresh signals only.

No RabbitMQ/Kafka/Redis initially.

## 6. Internal communication

Prefer shared canonical DB + outbox over synchronous service chaining. Use authenticated internal HTTP only when a synchronous command genuinely crosses the API boundary. Never expose internal endpoints publicly by convention alone; use network/access policy + service credential validation.

## 7. Configuration

- non-secret platform/provider settings live in database configuration entities where runtime admin control is required;
- secrets live in secret manager/Vault/environment references, not JSON configuration columns;
- settings are resolved through explicit typed config services, not ad-hoc environment reads throughout code.

## 8. Health

Each API exposes:

- `GET /health/live` — process alive, no dependency checks;
- `GET /health/ready` — required dependencies ready;
- `GET /health` — operational aggregate, may alias readiness.

## 9. Correlation

Incoming `X-Correlation-Id` is accepted if safe/valid; otherwise generate a sortable opaque ID. Propagate correlation through API logs, Payment, ProviderAttempt, outbox messages, provider logs and merchant webhook deliveries.

## 10. Migration policy

Migrations are forward-only and applied through controlled deploy/CI, not arbitrary request startup code. Application startup performs readiness checks but does not silently mutate production schema.
