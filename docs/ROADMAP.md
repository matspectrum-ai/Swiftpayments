# Delivery Roadmap

Every phase: `Spec → Contract → RED → GREEN → Refactor → Acceptance → Commit`.

## Phase 0 — Engineering Foundation
Monorepo/tooling/app shells/strict TS/lint/Supabase local/health/CI/test harness/design tokens/architectural boundaries. See `PLAN_PHASE_0.md`.

## Phase 1 — Identity, Tenant, RBAC
Supabase Auth, merchant/member, admin role, RLS baseline, API key metadata/verifier.

## Phase 2 — KYC / Compliance / Approval
KYC evidence/private upload, incremental onboarding, admin queue, approve/reject/needs-info/suspend, recipient eligibility foundations, live gate.

## Phase 3 — Commerce shell
Products/checkouts/payment links/Order snapshots plus split-rule attachment configuration, no real provider call.

## Phase 4 — Payment + Economics Domain
Payment aggregate/state/idempotency; Fee Engine/rules/snapshot; SplitRecipient/SplitRule pure model; PaymentSplitSnapshot arithmetic/freeze; outbox; ProviderAttempt/RoutingDecision. All `FEE-*` and pure/DB `SPLIT-*` RED→GREEN before provider integration.

## Phase 5 — Provider Contract + Simulator
Canonical PixProvider port, capability model including native split, deterministic simulator, shared conformance, ambiguous timeout and split conformance.

## Phase 6 — FlevoPay
Create/query/webhook/status/error mapping; sanitized fixtures; determine and prove split capabilities. Conformance GREEN.

## Phase 7 — AkkadPag
Blocked until docs/fixtures. Same conformance, including split capability evidence. No public special contract.

## Phase 8 — Public Payments API
API-key auth, POST/GET/list, OpenAPI/Scalar, idempotency/errors/rate/correlation, optional preconfigured `split_rule_id`.

## Phase 9 — Hosted Checkout Live
Buyer fields, Order→Payment, Pix QR/copy, expiry, split-rule resolution/snapshot, Realtime UX.

## Phase 10 — Merchant Webhooks
Endpoint management/signing/replay/outbox/pgmq/retry/logs/redelivery.

## Phase 11 — Split Operations + Admin Finance
Merchant/admin split rule/recipient UI, provider recipient mappings, native split execution evidence, split reconciliation, fee/routing controls, provider attempts/logs.

## Phase 12 — Dashboards + Hardening
KPIs/cache, concurrency/load/security/privacy/backup/restore/incidents/SLO/production readiness.

## Phase 13 — Settlement-dependent modules
Only after accepted custody ADR: internal-ledger split execution, ledger accounts, reserves, balances, Pix-out payouts/cashouts and settlement reconciliation.

## Phase 14 — Optional extension domains
Tracking/referrals/rankings/achievements/advanced routing experiments, only by separate priority.
