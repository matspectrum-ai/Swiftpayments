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

Swiftpayments is **Pix-only**. Do not add card, boleto, recurring-card abstractions or generic payment-method complexity. The architecture may be extensible, but the product contracts must remain Pix-specific until an approved RFC changes scope.

## 3. Mandatory engineering pipeline

Every implementation unit must be executed in this exact order:

1. **Problem Analysis** — facts, unknowns, risks, failure modes.
2. **Specification** — behavior and acceptance criteria, preferably structured YAML where precision matters.
3. **Contracts** — strict interfaces, schemas, state transitions, errors and invariants.
4. **Tests RED** — tests must fail for the expected reason before implementation.
5. **Implementation GREEN** — minimum implementation that satisfies the contract.
6. **Refactor** — improve structure without changing externally observable behavior.
7. **Technical Explanation** — document decisions, trade-offs and operational effects.
8. **Acceptance** — all required gates green.
9. **Commit** — one coherent phase/result per commit.

Skipping a stage requires an explicit ADR and reviewer approval.

## 4. Document-Driven Development

- Specifications are source code for intent.
- Tests are executable evidence of the specification.
- Production code is an implementation of those contracts.
- A behavioral change requires docs + contracts + tests in the same change.
- `TBD`, `OPEN`, `BLOCKER` and assumptions must be explicit. Never invent missing provider, legal or settlement behavior.
- Before asking a stakeholder a question, search the repository. Ask only when the answer is absent, contradictory, or explicitly open.

## 5. Architecture boundaries

Preserve these logical boundaries:

- `merchant-web`
- `admin-web`
- `checkout-web`
- `platform-api`
- `payment-api`
- canonical domain/contracts packages
- provider adapters
- database/migrations/RLS

`platform-api` and `payment-api` are separate deployable boundaries but share one canonical PostgreSQL platform initially. Do not split databases or introduce distributed transactions without an ADR.

## 6. Domain invariants

- `Order` owns commercial context; `Payment` owns financial/payment context.
- API-direct payments do not require an `Order`.
- Checkout creates an `Order`, then a `Payment` when the buyer confirms.
- A `PaymentLink` never creates a `Payment` merely by being created.
- Provider identity, raw provider status and provider transaction IDs are internal.
- Merchant-facing contracts are provider-agnostic.
- Money is integer minor units. Percentages are integer basis points.
- Historical fee snapshots are immutable.
- Terminal state transitions never regress.
- Duplicate provider events are semantic no-ops after deduplication.
- Ambiguous provider timeouts must never trigger blind failover that can create a second valid Pix charge.
- Environment (`test`/`live`) is explicit in every async command/event and financial record.
- KYC/compliance approval gates all live payment creation.
- A suspended merchant cannot create live payments even with a valid API key.

## 7. Provider rules

Provider integrations use the mandatory layering:

`Client (HTTP only) → Schema/Parser → Status Mapper → Adapter → Canonical Contract`.

Clients may not contain payment-state business rules. Adapters may not leak provider types into canonical domain objects.

Every provider requires a shared conformance suite, real sanitized fixtures where available, webhook auth tests, status mapping tests and ambiguous-outcome tests.

## 8. Security rules

- Service-role/Supabase privileged secrets never reach browsers.
- API secrets are shown once; only verifiers/hashes are persisted when possible.
- KYC files are private by default and accessed via short-lived authorized URLs.
- Admin authorization is separate from merchant membership.
- RLS is defense in depth, never the only authorization check for privileged server actions.
- Logs must mask credentials, tokens, documents and secrets.
- No secret, private certificate or provider credential is committed.
- New dependencies must be stable/GA, justified and reviewed.

## 9. Financial integrity

- No hidden fee manipulation, hidden withholding or false merchant-facing payment state is allowed.
- Provider cost and Swiftpay platform fee are separate concepts.
- Ledger entries, if/when enabled by the settlement model, are append-only; corrections use compensating entries.
- Never directly rewrite a financial balance to “fix” reconciliation.
- Custody, wallet, merchant balance and payout activation require the settlement/custody ADR to be accepted first.

## 10. Async and side effects

Use PostgreSQL outbox + Supabase Queues/`pgmq` for durable async work. Use Supabase Realtime only for UX signaling, never as financial truth.

Critical state mutation commits before external secondary side effects. Webhooks, notifications, analytics and tracking must not be able to invalidate an already committed payment state.

## 11. Code standards

- TypeScript strict mode.
- Explicit domain names; no vague `data`, `manager`, `helper` abstractions in domain logic.
- High cohesion, low coupling.
- Pure calculation functions for fees/routing scoring/state transition validation.
- Runtime validation at trust boundaries.
- Cursor pagination for public hot-path collections.
- No N+1 queries in hot paths.
- No business logic in React components, route handlers or provider HTTP clients.
- No raw provider payload used as an internal canonical model.

## 12. Definition of Done

A change is not done until all applicable items pass:

- normative docs updated;
- contract updated;
- RED evidence existed;
- unit/integration/database/RLS tests green;
- provider conformance green when affected;
- OpenAPI green when public behavior changes;
- security/privacy impact reviewed;
- observability added for new critical paths;
- migrations validated;
- acceptance criteria demonstrated;
- phase committed.
