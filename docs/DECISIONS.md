# Frozen Decisions

Status: `ACCEPTED`, `SUPERSEDED`, `PROPOSED/BLOCKED`.

## ADR-001 — Pix-only product — ACCEPTED
Pix is sole payment rail. Pix-only does not exclude fees, split, provider subaccounts, settlement or ledger domains.

## ADR-002 — TypeScript/Supabase stack — ACCEPTED
Next.js/React/TS; Node/TS/Fastify; Supabase/PostgreSQL/Auth/RLS/Storage/Realtime/Queues/Cron.

## ADR-003 — Two API boundaries — ACCEPTED
`platform-api` and `payment-api` separate deployables, shared PostgreSQL initially.

## ADR-004 — Provider agnosticism — ACCEPTED
FlevoPay/AkkadPag P0. Merchant contracts hide provider identity; same PixProvider/conformance.

## ADR-005 — Async infrastructure — ACCEPTED
Transactional outbox + pgmq; Realtime UX only; pg_cron scheduling.

## ADR-006 — Authentication — ACCEPTED
Humans Supabase Auth. Merchant systems `sk_test_`/`sk_live_`. Admin role server-controlled.

## ADR-007 — KYC/live gate — ACCEPTED
No live Payment before required compliance approval. Suspension blocks immediately.

## ADR-008 — Money — ACCEPTED
Integer centavos and integer bps; no floating point.

## ADR-009 — Order vs Payment — ACCEPTED
Checkout uses Order→Payment; API direct Payment; PaymentLink create != Payment.

## ADR-010 — Provider create ambiguity — ACCEPTED
Ambiguous create never blind-fallback/retry; reconciliation required.

## ADR-011 — Settlement/custody activation — PROPOSED/BLOCKED
Ledger/withdrawable balance/Pix-out/internal-ledger split execution require legal/commercial settlement model first.

## ADR-012 — Split Engine is P0 — ACCEPTED
Split is a first-class Pix domain, not a deferred marketplace feature. Canonical rule/snapshot/allocation semantics exist independently of provider implementation.

## ADR-013 — Fee-before-split canonical economics — ACCEPTED
`split_base = gross - platform_fee`. Provider cost is internal Swiftpay cost and does not silently reduce recipient entitlement. Changing this requires explicit ADR/API/accounting migration plan.

## ADR-014 — Split arithmetic modes — ACCEPTED
One rule version uses either percentage (sum exactly 10000 bps with deterministic remainder recipient) or fixed allocations plus exactly one remainder recipient. No implicit mixed mode.

## ADR-015 — Split execution strategy — ACCEPTED
Prefer verified provider-native split where exact. Internal-ledger split is blocked by ADR-011. If no exact strategy is eligible, fail before provider create; never drop split.

## ADR-016 — Public split input v0.x — ACCEPTED
Public Payment API accepts optional preconfigured canonical `split_rule_id`; no provider recipient IDs or arbitrary bank-data inline split payloads.
