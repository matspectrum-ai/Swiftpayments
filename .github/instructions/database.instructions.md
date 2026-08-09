---
applyTo: 'supabase/**,packages/db/**'
---
# Database Rules

- PostgreSQL is canonical state.
- Migrations are forward-only; never edit applied migrations.
- Critical idempotency/concurrency relies on DB constraints/transactions, not only pre-checks.
- Merchant ownership indexes and hot-path indexes are explicit.
- RLS policies require pgTAP positive + negative tenant tests.
- Money uses bigint/integer minor units; rates integer bps.
- Financial/audit snapshots/history are immutable by contract.
- Async messages/outbox include environment explicitly.
- Never use direct balance update as reconciliation correction; use entries/compensation if ledger enabled.
- Production migrations are deploy-controlled, not silent startup mutation.
