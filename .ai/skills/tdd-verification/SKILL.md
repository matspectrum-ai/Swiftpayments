# Skill: TDD / Verification

Use for every implementation phase.

RED must fail for intended reason. GREEN is minimal. Refactor only after green.

Prioritize tests for:
1. financial/state invariants;
2. authorization/tenant isolation;
3. concurrency/idempotency;
4. provider ambiguity/auth;
5. public contracts;
6. user workflows;
7. performance thresholds.

Do not use broad snapshots as sole evidence for critical behavior.
