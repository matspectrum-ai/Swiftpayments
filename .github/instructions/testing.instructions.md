---
applyTo: '**/*.test.ts,**/*.spec.ts,supabase/tests/**,tests/**'
---
# Testing Rules

- RED first: prove expected failure before GREEN.
- Name/annotate critical tests with requirement IDs where practical.
- Provider adapters use one shared conformance suite.
- Concurrency tests are mandatory for idempotency and terminal state races.
- Database uniqueness is verified under concurrent attempts.
- RLS requires explicit cross-tenant denial tests.
- Never mock away the behavior being accepted.
- Real provider payloads must be sanitized fixtures, not invented convenience payloads.
- E2E tests validate user-visible state but do not replace domain/API tests.
