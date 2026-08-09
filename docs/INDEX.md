# Normative Documentation Index

`AGENTS.md` defines repository-wide law. This index defines the canonical engineering documents that agents must read before touching a domain.

## Product and architecture

- `PRD.md` — product requirements and scope.
- `ARCHITECTURE.md` — deployable boundaries, runtime topology and dependencies.
- `DOMAIN_MODEL.md` — bounded contexts, aggregates and ownership.
- `STATE_MACHINES.md` — authoritative lifecycle transitions.
- `DATA_MODEL.md` — logical PostgreSQL model and data invariants.

## Contracts

- `API_CONTRACT.md` — public API semantics and authentication.
- `PROVIDER_CONTRACT.md` — provider adapter contract/conformance.
- `ROUTING.md` — provider eligibility, selection and ambiguity handling.
- `WEBHOOKS_EVENTS_ASYNC.md` — provider ingress, merchant delivery, outbox and queues.

## Financial / compliance

- `FEES_LEDGER_RECONCILIATION.md` — fees, provider cost, ledger design and reconciliation gates.
- `KYC_COMPLIANCE_ADMIN.md` — onboarding, KYC/KYB, risk and manual approval.
- `SECURITY_RBAC_RLS.md` — identity, authorization, secrets, RLS and privacy.

## Product surfaces

- `CHECKOUT_ORDERS_PAYMENT_LINKS.md` — catalog/no-code sales flow.
- `OBSERVABILITY_RUNBOOKS.md` — health, metrics, logs, incidents, reprocessing.

## Verification and delivery

- `TEST_STRATEGY.md` — TDD pyramid, RED rules, contract/conformance and E2E.
- `CI_CD.md` — quality gates and environments.
- `ROADMAP.md` — phase ordering and exit criteria.
- `PLAN_PHASE_0.md` — Phase 0 engineering foundation plan: tooling, shells, health, Supabase local, test/CI harness and acceptance criteria.
- `DECISIONS.md` — frozen decisions.
- `OPEN_QUESTIONS.md` — only legitimate stakeholder blockers.
- `SOURCE_MAPPING.md` — mapping from the reference architecture/rules to this TypeScript/Supabase implementation.

## Change rule

If code changes behavior described in one of these files, that document and its executable tests must change in the same PR/commit series. Silent drift is a release blocker.
