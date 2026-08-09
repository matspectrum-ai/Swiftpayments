# Swiftpayments Copilot / Coding Agent Instructions

Read `AGENTS.md` first. It is the engineering constitution.

Before changing code, identify affected normative docs in `docs/INDEX.md`. Never answer a repository question from assumptions when the repository contains a specification.

Mandatory order: Problem Analysis → Specification → Contracts → RED tests → GREEN implementation → Refactor → Acceptance → Commit.

Hard rules:
- Pix only.
- Provider details never leak to merchant contracts.
- Money integer minor units; rates basis points.
- No blind create-Pix retries/failover after ambiguous provider outcome.
- KYC/compliance gate required for live.
- Explicit `test|live` scope in async/financial state.
- Route handlers thin; business logic in application/domain layers.
- Provider client = HTTP transport only; parser/status mapper/adapter separate.
- Supabase Realtime is UX only, never payment truth.
- Outbox + pgmq for durable async effects.
- Secrets/PII/KYC never logged unredacted.
- Any behavior change updates docs/contracts/tests together.

When information is missing, search repo. Ask stakeholder only for explicit blockers in `docs/OPEN_QUESTIONS.md` or a newly discovered contradiction.
