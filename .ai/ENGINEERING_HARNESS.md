# Swiftpayments AI-Native Engineering Harness

This harness defines how an AI engineering agent turns a request into production-grade work.

## Intake protocol

For every task, create a short working record with:

```yaml
problem:
  goal: ""
  user_value: ""
  affected_domains: []
  affected_surfaces: []
known_facts: []
unknowns: []
risks: []
source_docs: []
```

Do not implement until `unknowns` that affect correctness are resolved or explicitly converted into blockers.

## Context loading

Read only what is necessary but never less than:

1. `AGENTS.md`.
2. `docs/INDEX.md`.
3. relevant domain docs.
4. relevant `.github/instructions/*.instructions.md`.
5. relevant `.ai/skills/*/SKILL.md`.
6. existing tests/contracts before existing implementation.

The desired context hierarchy is specification-first, test-second, code-third.

## Spec → Contract → Test traceability

Every non-trivial behavior gets an ID.

Examples:

- `PAY-001` payment creation.
- `PAY-007` ambiguous provider timeout.
- `KYC-004` admin approval gate.
- `FEE-003` merchant override.
- `WH-005` duplicate provider webhook.

The same ID should appear in specification/acceptance text and test name/metadata when practical.

## Mandatory output before implementation

The agent must state:

```yaml
spec_delta:
contracts_delta:
tests_to_add_first:
files_expected_to_change:
rollback_or_recovery:
```

If `spec_delta` is non-empty but no normative document is updated, stop.

## TDD protocol

### RED

Write the smallest tests proving the missing behavior. Confirm failure is caused by missing/incorrect behavior, not test setup.

### GREEN

Implement the minimum to satisfy the contract. Do not opportunistically add adjacent features.

### REFACTOR

Reduce duplication, strengthen names and boundaries. Test outcomes must remain unchanged.

## Review protocol

Review in this order:

1. domain invariant violations;
2. money/idempotency/concurrency bugs;
3. authorization/tenant isolation;
4. provider ambiguity and webhook authenticity;
5. data model/migration safety;
6. resilience and observability;
7. API compatibility;
8. maintainability/performance;
9. style.

## Change classes

- **Class A — financial/security/compliance**: mandatory human review, integration tests and auditability check.
- **Class B — public contract/provider**: mandatory contract/conformance tests.
- **Class C — ordinary product behavior**: domain/unit + E2E where user-visible.
- **Class D — refactor/docs**: behavior must remain unchanged; existing suites prove this.

## Commit protocol

Commit when a phase reaches its exit criteria. Do not accumulate unrelated phases into a single unreviewable commit.

Commit prefixes:

- `docs:` specification/governance.
- `test:` fail-first contract/acceptance.
- `feat:` minimal implementation.
- `refactor:` behavior-preserving cleanup.
- `fix:` correctness regression.
- `chore:` tooling/foundation.

## Anti-patterns

Forbidden:

- coding from chat memory when repository docs exist;
- inventing provider fields;
- implementing external I/O before its adapter contract and fixtures;
- putting provider-specific fields in `Payment` public contracts;
- treating Realtime/event delivery as source of truth;
- retrying non-idempotent provider create operations blindly;
- catching and ignoring critical financial errors;
- adding infrastructure because it is fashionable;
- changing a state machine implicitly in application code.
