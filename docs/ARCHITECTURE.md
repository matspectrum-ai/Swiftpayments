# System Architecture

## 1. Style

Lightweight modular platform with two API deployables and shared PostgreSQL infrastructure. Preserve domain depth while avoiding unnecessary infrastructure.

## 2. Topology

```text
merchant-web ───────┐
admin-web ──────────┼──► platform-api ─────┐
checkout-web ───────┘                      │
                                          ▼
                              PostgreSQL / Supabase
                                 Auth / RLS / Storage
                                 Outbox / pgmq / cron
                                          ▲
                                          │
Public developer ─────────────► payment-api
                                  │
                                  ├─ Payment Domain
                                  ├─ Fee Engine
                                  ├─ Split Engine
                                  ├─ Routing Engine
                                  └─ Provider Contract
                                      ├─ FlevoPay
                                      └─ AkkadPag
```

`admin-web` never receives service-role credentials. Privileged payment views pass through authorized server application services.

## 3. Deployables

### `apps/merchant-web`
Merchant dashboard: KYC, products, checkouts/links, payments, split rules/recipients, API keys/webhooks and fee visibility.

### `apps/admin-web`
Internal compliance/ops/finance: merchants, recipients, fees, split execution/reconciliation, providers, routing, audit.

### `apps/checkout-web`
Public hosted Pix buyer flow. Starts canonical Payment; Realtime only refreshes UX.

### `apps/platform-api`
Owns merchant/member lifecycle, KYC/KYB, admin/RBAC, products/orders config/checkouts/links, split-rule/recipient configuration, provider readiness/config, fee/settings/rate-limit config, storage authorization, audit/read models.

### `apps/payment-api`
Owns API-key auth, public Pix API, Payment state/idempotency, fee snapshot, split snapshot, routing, provider adapters/webhooks, outbox/merchant webhooks, provider/split reconciliation and test simulation.

## 4. Shared packages

```text
packages/
  domain/          canonical aggregates/state/invariants
  contracts/       public/internal runtime schemas
  db/              SQL/repositories/query helpers
  pricing/         fee calculations/rule resolution
  split/           pure split calculation/contracts/policies
  providers/       PixProvider contract + adapters
  security/        authz/crypto/redaction
  observability/   logs/metrics/tracing
  ui/              shared design system
  testkit/         fixtures/builders/provider simulator
  config/          typed configuration
```

Direction: `apps → application/domain ports → infrastructure adapters`. Domain/pricing/split packages never import provider implementations or web frameworks.

## 5. Data and async

- PostgreSQL is canonical state.
- Supabase Auth = human identity.
- RLS = tenant defense in depth.
- Storage = KYC/private/public product assets.
- Transactional outbox commits events atomically with state.
- `pgmq` = durable async work.
- `pg_cron` = schedules.
- Realtime = UX signals only.

No RabbitMQ/Kafka/Redis initially.

## 6. Payment creation transaction boundary

Before any external provider create is sent, persist atomically enough to reconstruct intent:

```text
Payment
+ IdempotencyRecord
+ FeeSnapshot
+ PaymentSplitSnapshot (when split enabled)
+ RoutingDecision intent/attempt metadata
```

The SplitSnapshot is immutable after provider transmission begins.

## 7. Split execution strategies

Canonical Split Engine is provider-agnostic. Execution is selected by capability/policy:

1. `native_provider` — provider receives canonical allocation mapped to its own recipient/submerchant identifiers;
2. `internal_ledger` — Swiftpay settles allocations internally only after custody/settlement ADR is accepted;
3. `unsupported` — split-enabled live Payment is rejected before provider create. Never silently remove split.

## 8. Internal communication

Prefer canonical DB + outbox over synchronous chaining. Internal HTTP must be authenticated/network-restricted.

## 9. Configuration/secrets

Runtime admin-controlled non-secret settings may live in DB. Secrets use secret references/Vault/env, never plain JSON columns.

## 10. Health/correlation/migrations

Each API exposes `/health/live`, `/health/ready`, `/health`. Propagate safe `X-Correlation-Id` through Payment, SplitSnapshot, ProviderAttempt, outbox and webhooks. Production schema evolves through controlled forward migrations; startup does not silently rewrite schema.
