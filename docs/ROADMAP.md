# Delivery Roadmap

Every phase uses `Spec → Contract → RED → GREEN → Refactor → Acceptance → Commit`.

## Phase 0 — Engineering Foundation

Deliver monorepo/tooling, app shells, strict TS, lint/format, Supabase local, health endpoints, CI harness, test harness, design tokens and architectural import boundaries.

Exit: all shells build; test infrastructure works; no business feature implemented without RED.

## Phase 1 — Identity, Tenant, RBAC

Supabase Auth integration; Merchant/member; admin role assignments; tenant/RLS baseline; API key metadata/verifier model.

## Phase 2 — KYC / Compliance / Approval

KycCase/evidence/private upload; incremental onboarding; admin queue; needs-info/approve/reject/suspend; audit; live gate tests.

## Phase 3 — Commerce shell

Products; checkouts; payment links; Order snapshots; public checkout config; no real provider call initially.

## Phase 4 — Payment Domain

Payment aggregate/state machine; idempotency; fee selection/snapshot; outbox primitives; provider attempt/routing decision models.

## Phase 5 — Provider Contract + Simulator

Canonical port; parser/status contract; deterministic provider simulator; shared conformance suite; ambiguous timeout tests.

## Phase 6 — FlevoPay

Auth/create/query/webhook/status/error mapping; real sanitized fixtures; conformance GREEN.

## Phase 7 — AkkadPag

Blocked until full mapping/docs/fixtures. Same conformance suite GREEN; no special public contract.

## Phase 8 — Public Payments API

API key auth; POST/GET/list; OpenAPI/Scalar; idempotency/error/rate hooks; correlation.

## Phase 9 — Hosted Checkout Live

Buyer fields; Order → Payment; Pix QR/copy; expiry; Realtime UX refresh.

## Phase 10 — Merchant Webhooks

Endpoint management; signing/replay contract; outbox/pgmq worker; retry/delivery logs/admin redelivery.

## Phase 11 — Dashboards/Admin Operations

Merchant/admin KPIs; async cache; provider attempts/logs; fee/routing controls; reconciliation operations.

## Phase 12 — Hardening

Concurrency/load/security/privacy/backup/restore/incident runbooks, SLO validation and production readiness.

## Phase 13 — Settlement-dependent modules

Only after ADR: ledger accounts, reserves, balances, Pix-out payouts/cashouts and settlement reconciliation.

## Phase 14 — Optional extension domains

Tracking, referrals/ranking/achievements, advanced routing experiments. Disabled unless separately prioritized.
