# Frozen Decisions

Status values: `ACCEPTED`, `SUPERSEDED`, `PROPOSED`.

## ADR-001 — Pix-only product

**Status:** ACCEPTED

Pix is the sole payment method. No card or boleto code paths are permitted in v0.x without an explicit product RFC.

## ADR-002 — TypeScript/Supabase stack

**Status:** ACCEPTED

Next.js/React/TypeScript for web; Node.js/TypeScript/Fastify for APIs; Supabase/PostgreSQL/Auth/RLS/Storage/Realtime/Queues/Cron for platform services.

## ADR-003 — Two API boundaries

**Status:** ACCEPTED

Preserve the proven separation between platform/admin concerns and transaction processing: `platform-api` and `payment-api` are separate deployables. They share PostgreSQL initially to remain operationally light.

## ADR-004 — Provider agnosticism

**Status:** ACCEPTED

FlevoPay and AkkadPag are P0 providers and references. Merchant-facing contracts do not reveal provider identity. Both implement the same canonical `PixProvider` contract and conformance suite.

## ADR-005 — Async infrastructure

**Status:** ACCEPTED

Use transactional outbox + `pgmq` instead of RabbitMQ/Kafka. Use Realtime for UX signals only. Use `pg_cron` for scheduling.

## ADR-006 — Human and machine authentication

**Status:** ACCEPTED

Human surfaces use Supabase Auth. Public merchant systems use Swiftpay API keys (`sk_test_`/`sk_live_`). Admin access requires internal role assignments beyond authentication.

## ADR-007 — KYC/live gate

**Status:** ACCEPTED

A merchant cannot create live payments before required onboarding/KYC is approved by authorized Swiftpay staff. Suspension revokes live operational eligibility immediately.

## ADR-008 — Money representation

**Status:** ACCEPTED

Amounts use integer centavos/minor units. Rates use integer basis points. No floating-point arithmetic is allowed for money or fee calculations.

## ADR-009 — Order vs Payment

**Status:** ACCEPTED

Checkout/no-code flow uses `Order → Payment`. Public API flow creates `Payment` directly. Payment Link creation itself never creates a Payment.

## ADR-010 — Provider create ambiguity

**Status:** ACCEPTED

An ambiguous provider create outcome never triggers blind fallback/retry. The payment enters an internal reconciliation-required path until the original provider outcome is known.

## ADR-011 — Settlement/custody activation

**Status:** PROPOSED / BLOCKED

Ledger, merchant withdrawable balance and payout architecture is specified, but custody/payout activation requires the legal/commercial settlement model to be frozen first.
