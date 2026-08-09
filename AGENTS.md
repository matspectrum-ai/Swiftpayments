# AGENTS.md — Swiftpayments Engineering Constitution

This file is normative for every human engineer, coding agent, reviewer and automation acting on this repository.

## 1. Precedence

When instructions conflict, apply this order:

1. law, security and platform safety requirements;
2. this `AGENTS.md`;
3. normative documents linked by `docs/INDEX.md`;
4. accepted ADRs / RFCs;
5. executable contracts and tests;
6. implementation code;
7. comments and incidental examples.

Code never silently overrides a normative document. A contradiction is a blocker.

## 2. Product invariant

Swiftpayments is **Pix-only**. Pix-only constrains the payment rail, not the platform depth. Fees, split, routing, KYC/KYB, provider subaccounts, reconciliation, ledger/settlement when required, checkout, products, orders, payment links, webhooks and admin operations are valid first-class domains.

Do not add card, boleto or generic multi-method complexity without an approved RFC.

## 3. Mandatory engineering pipeline

Every implementation unit follows exactly:

1. Problem Analysis
2. Specification
3. Contracts
4. Tests RED
5. Implementation GREEN
6. Refactor
7. Technical Explanation
8. Acceptance
9. Commit

Skipping a stage requires an explicit ADR and reviewer approval.

## 4. Document-Driven Development

- Specifications are source code for intent.
- Tests are executable evidence of the specification.
- Production code implements those contracts.
- Behavioral changes require docs + contracts + tests in the same change.
- `TBD`, `OPEN`, `BLOCKER` and assumptions must be explicit.
- Before asking a stakeholder, search the repository. Ask only when absent, contradictory or explicitly open.

## 5. Architecture boundaries

Preserve:

- `merchant-web`
- `admin-web`
- `checkout-web`
- `platform-api`
- `payment-api`
- canonical domain/contracts packages
- provider adapters
- database/migrations/RLS

`platform-api` and `payment-api` are separate deployables sharing canonical PostgreSQL initially. Do not add distributed transactions or split databases without ADR.

## 6. Core domain invariants

- `Order` owns commercial context; `Payment` owns payment/financial context.
- API-direct payments do not require an Order.
- Checkout creates Order then Payment when buyer confirms.
- Creating a PaymentLink never creates Payment.
- Provider identity/raw status/provider IDs are internal.
- Merchant-facing contracts are provider-agnostic.
- Money is integer minor units; rates are integer basis points.
- Fee snapshots and split snapshots are immutable.
- Fee and split are distinct concepts: fee defines Swiftpay pricing; split defines beneficiary entitlement/allocation.
- Platform fee is deducted from gross before the canonical split allocation base unless an accepted ADR supersedes this rule.
- Provider cost is an internal Swiftpay cost and is not silently deducted from recipient entitlements.
- A split-enabled Payment must allocate exactly its `splittable_amount_minor`; no money may disappear or be created by rounding.
- Percentage split uses integer bps and deterministic remainder allocation.
- A split plan is frozen before provider create is sent and cannot mutate afterward.
- A provider that cannot execute the required split strategy is ineligible for that Payment.
- Split must never be silently dropped during fallback.
- Terminal payment state never regresses.
- Duplicate provider events are semantic no-ops after deduplication.
- Ambiguous provider create never triggers blind failover.
- `test`/`live` environment is explicit in every async command/event and financial record.
- KYC/compliance approval gates live payment creation and live split-recipient eligibility.
- Suspension blocks new live operations immediately.

## 7. Provider rules

Mandatory layering:

`Client (HTTP only) → Schema/Parser → Status Mapper → Adapter → Canonical Contract`.

Provider capabilities must explicitly declare Pix, idempotency, external merchant/subaccount requirements and split capabilities. Provider-native split identifiers never enter public contracts.

Every provider requires shared conformance tests, sanitized fixtures where available, webhook auth/status tests, ambiguity tests and split conformance tests when split capability is claimed.

## 8. Security rules

- Privileged/service-role secrets never reach browsers.
- API secrets are shown once; verifiers/hashes persisted when possible.
- KYC files private by default; short-lived authorized access only.
- Admin authorization is separate from merchant membership.
- RLS is defense in depth, not the only privileged authorization control.
- Logs mask credentials, tokens, documents and secrets.
- No secret/provider credential/private certificate committed.
- Stable/GA dependencies only unless ADR explicitly permits otherwise.

## 9. Financial integrity

- No hidden fees, hidden withholding or false merchant-facing financial state.
- `platform_fee`, `provider_cost`, `split_allocation` and `settlement` are separate facts.
- Historical fee/split calculations are never recalculated from current settings.
- Ledger entries, when enabled, are append-only; corrections are compensating entries.
- Never rewrite balances directly to repair reconciliation.
- Native-provider split and internal-ledger split are separate execution strategies behind one canonical Split Plan.
- Internal-ledger redistribution, custody, wallet/balance and Pix-out payout activation require the settlement/custody ADR.

## 10. Async and side effects

Use PostgreSQL outbox + Supabase Queues/`pgmq` for durable async work. Supabase Realtime is UX signaling only.

Critical state mutation commits before secondary effects. Webhooks, notifications and analytics cannot invalidate committed payment truth.

## 11. Code standards

- TypeScript strict mode.
- Explicit domain names; no vague domain `manager`/`helper` abstractions.
- High cohesion, low coupling.
- Pure functions for fee arithmetic, split arithmetic, routing scoring and state transition validation.
- Runtime validation at trust boundaries.
- Cursor pagination on public hot paths.
- No N+1 on hot paths.
- No business logic in React components, route handlers or provider HTTP clients.
- No raw provider payload as canonical model.

## 12. Definition of Done

A change is not done until applicable gates pass:

- normative docs updated;
- contracts updated;
- RED evidence existed;
- unit/integration/database/RLS tests green;
- provider conformance green when affected;
- split conformance green when affected;
- OpenAPI green when public behavior changes;
- security/privacy impact reviewed;
- observability added for critical paths;
- migrations validated;
- acceptance criteria demonstrated;
- phase committed.
