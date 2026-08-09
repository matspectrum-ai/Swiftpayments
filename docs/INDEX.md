# Normative Documentation Index

`AGENTS.md` defines repository-wide law. Agents must read the documents applicable to the domain before changing behavior.

## Product and architecture
- `PRD.md` — product requirements and scope.
- `ARCHITECTURE.md` — boundaries/topology/dependencies.
- `DOMAIN_MODEL.md` — bounded contexts and aggregate ownership.
- `STATE_MACHINES.md` — authoritative lifecycle transitions.
- `DATA_MODEL.md` — logical PostgreSQL model/invariants.

## Contracts
- `API_CONTRACT.md` — public API semantics/authentication.
- `PROVIDER_CONTRACT.md` — provider adapter contract/conformance.
- `ROUTING.md` — provider eligibility/selection/ambiguity.
- `WEBHOOKS_EVENTS_ASYNC.md` — ingress, outbox, queues and merchant delivery.

## Financial / compliance
- `FEES_LEDGER_RECONCILIATION.md` — pricing, provider cost, ledger and reconciliation.
- `SPLIT_ENGINE.md` — canonical Pix split model, arithmetic, snapshots, execution and reconciliation.
- `KYC_COMPLIANCE_ADMIN.md` — onboarding/KYC/KYB/risk/manual approval.
- `SECURITY_RBAC_RLS.md` — identity, authorization, secrets, RLS/privacy.

## Product surfaces
- `CHECKOUT_ORDERS_PAYMENT_LINKS.md` — no-code commerce and split-rule attachment.
- `OBSERVABILITY_RUNBOOKS.md` — health, logs, incidents and reprocessing.

## Verification and delivery
- `TEST_STRATEGY.md`
- `CI_CD.md`
- `ROADMAP.md`
- `PLAN_PHASE_0.md`
- `DECISIONS.md`
- `OPEN_QUESTIONS.md`
- `SOURCE_MAPPING.md`

## Change rule

If code changes behavior described here, update the normative document and executable evidence in the same change. Silent drift is a release blocker.
