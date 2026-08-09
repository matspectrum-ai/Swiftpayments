# Phase 0 — Engineering Foundation Plan

Status: PLANNING — approved tooling decisions recorded in ADR-012. Execution begins only on stakeholder approval.

This document is the working plan for Phase 0 of `docs/ROADMAP.md`. It is a planning/governance artifact: where it conflicts with a normative document, the normative document wins (see `AGENTS.md` precedence order).

## 1. Intake record

```yaml
problem:
  goal: "Deliver the executable foundation of the Swiftpayments monorepo: tooling, app shells, health endpoints, Supabase local, test/CI harness, design tokens and architectural import boundaries."
  user_value: "Preview/deploy run for real; later phases enter on the RED-first track; foundation unblocks all five product surfaces."
  affected_domains: [foundation, tooling, observability]
  affected_surfaces: [merchant-web, admin-web, checkout-web, platform-api, payment-api]
known_facts:
  - Repository is documentation-only (single commit, no package.json, no lockfile).
  - Stack frozen by ADR-002 (Next.js + Fastify + Supabase) and ADR-003 (two APIs, one PostgreSQL).
  - ADR-012 freezes foundation tooling: Bun, Turborepo, ESLint + Prettier; preview targets merchant-web.
  - AGENTS.md mandates strict TS, no business logic in route handlers/components, and justified new dependencies.
  - CI_CD.md defines quality gates: format, lint, typecheck, import boundaries, unit, API, pgTAP, migration validation, build, secret scan.
  - TEST_STRATEGY.md fixes Vitest, fastify.inject, pgTAP, Playwright and k6.
  - ARCHITECTURE.md fixes health endpoints (/health/live, /health/ready, /health) and import boundaries.
  - REPOSITORY_STRUCTURE.md fixes the target monorepo layout and dependency rules.
unknowns:
  - Node/Bun runtime version pinning — decided at the tooling commit.
  - Package scope naming (e.g. @swiftpay/*) — decided at the tooling commit.
  - Hosted Supabase credentials — not required until a hosted project is connected; local `supabase start` is credential-free.
risks:
  - Phase size (5 apps + 9 packages) — mitigated by small, independently reviewable commits.
  - New dependencies must be stable/GA, justified and reviewed (AGENTS.md §8).
  - Skipping RED-first violates the constitution — health contract tests must be written and fail before API shells.
  - Single-process preview cannot serve all surfaces — root dev targets merchant-web (ADR-012).
source_docs: [AGENTS.md, docs/ROADMAP.md, docs/ARCHITECTURE.md, docs/REPOSITORY_STRUCTURE.md, docs/CI_CD.md, docs/TEST_STRATEGY.md, docs/DATA_MODEL.md, docs/DECISIONS.md]
```

## 2. Problem analysis

**Facts:** everything the Phase 0 exit criteria require (monorepo, shells, strict TS, lint/format, Supabase local, health, CI, test harness, design tokens, import boundaries) is already mapped by the normative documents. No business feature exists in this phase; the "behavior" is tooling plus empty shells with health endpoints.

**Failure modes identified:**
- Three Next.js apps competing for one preview port → root `dev` script serves a single target (`merchant-web`).
- Unjustified dependency sprawl → every new dependency is introduced with a written justification in its commit.
- Foundation committed without RED evidence → health contract tests exist and fail before any API shell is implemented.
- Supabase local setup left half-done → `supabase/config.toml`, `migrations/` and extensions (`pgmq`, `pg_cron`) are committed as part of Phase 0; remote connection stays a Phase 0 optional follow-up.

## 3. Tooling decisions (ADR-012)

| Concern | Decision | Rationale |
|---|---|---|
| Package manager | **Bun** (workspaces, `packageManager` field, `bun.lockb`) | Fast installs, native TS execution, single runtime; already the Freebuff workspace default. |
| Monorepo orchestration | **Turborepo** (`turbo.json` pipelines) | Task caching and dependency-aware `dev`/`build`/`test`/`lint`/`typecheck` across apps/packages. |
| Lint / format | **ESLint (flat config, typescript-eslint) + Prettier** | Strict TS-aware linting; Prettier for deterministic formatting; satisfies CI_CD.md gates. |
| Preview target | **merchant-web** | The merchant dashboard is the showcase surface; root `dev` serves it on the injected PORT. |

Freebuff preview commands remain: install `bun install`, dev `bun run dev` (port 3000), build `bun run build`.

## 4. Scope — deliverables

| # | Area | Deliverable |
|---|---|---|
| E1 | Monorepo / tooling | Root `package.json` (Bun workspaces + `packageManager`), `turbo.json`, `tsconfig.base.json` (strict), ESLint flat config + Prettier, root scripts `dev`/`build`/`test`/`lint`/`typecheck`. |
| E2 | Shared packages | Skeleton packages per `REPOSITORY_STRUCTURE.md`: `domain`, `contracts`, `db`, `providers`, `security`, `observability`, `config`, `ui` (design tokens), `testkit`. |
| E3 | API shells | `platform-api` and `payment-api` (Fastify, TS strict) with health endpoints `/health/live`, `/health/ready`, `/health`. |
| E4 | Web shells | `merchant-web`, `admin-web`, `checkout-web` (Next.js, minimal pages, no business logic). |
| E5 | Supabase local | `supabase/config.toml`, `supabase/migrations/` (schemas + `pgmq`/`pg_cron` extensions), `supabase/tests/`, `seed.sql`. |
| E6 | CI + test harness | GitHub Actions workflow with CI_CD.md gates; Vitest setup; import-boundary check; secret scan. |

## 5. Behavior IDs (traceability, per ENGINEERING_HARNESS)

| ID | Behavior | RED evidence |
|---|---|---|
| FND-001 | Root workspace resolves and installs with Bun | Install succeeds in clean state |
| FND-002 | Strict TypeScript base config applies to all apps/packages | `bun run typecheck` green; deliberate violation fails |
| FND-003 | Turborepo pipelines run dev/build/test/lint/typecheck | Pipeline run green; cache hit on re-run |
| FND-004 | ESLint + Prettier gates pass on all sources | `bun run lint`/`format --check` green |
| FND-005 | Both APIs expose /health/live, /health/ready, /health | Health contract tests RED then GREEN |
| FND-006 | Import boundaries enforced (apps → packages, never reverse) | Boundary check fails on a forbidden import |
| FND-007 | Supabase local starts with pgmq + pg_cron available | `supabase start` + extension smoke test |
| FND-008 | CI workflow runs all quality gates and secret scan | Pipeline green on foundation commit |

## 6. Execution order (commit sequence)

Each commit is independently reviewable and follows the mandated pipeline. No business feature is introduced.

1. `chore:` tooling — root `package.json` (Bun workspaces, `packageManager`), `turbo.json`, `tsconfig.base.json`, ESLint + Prettier (FND-001..004).
2. `feat:` shared packages skeletons — `config`, `observability`, `ui` design tokens, `testkit` (foundation primitives only).
3. `test:` health contract RED on both APIs + import-boundary RED (FND-005, FND-006).
4. `feat:` Fastify shells with health endpoints — GREEN for FND-005.
5. `chore:` Next.js shells — `merchant-web` → `admin-web` → `checkout-web`.
6. `chore:` Supabase local — `config.toml`, migrations, extensions (FND-007).
7. `chore:` CI workflow + secret scan (FND-008).
8. **Acceptance:** all gates green, preview ready, FND-001..008 demonstrated.

## 7. Acceptance criteria (DoD)

- All Phase 0 exit criteria from `docs/ROADMAP.md` demonstrated.
- Normative docs touched by this phase updated in the same change set.
- RED evidence exists for FND-005 and FND-006 (and any other behavior ID before its GREEN).
- `typecheck`, `lint`, `format --check` and `build` green across the workspace.
- Health endpoints respond on both APIs; preview of `merchant-web` ready.
- CI pipeline green on the foundation commit; secret scan clean.
- **No business feature implemented without RED.**

## 8. Out of scope

- Any business feature (auth, KYC, payments, checkouts, providers, webhooks).
- Hosted Supabase credentials and production wiring (requires user credentials; local only in this phase).
- Provider integrations (BLOCKER-01, BLOCKER-06 remain open).
- Settlement/custody/ledger (BLOCKER-02, ADR-011 PROPOSED).
- Production hosting choice (BLOCKER-07).

## 9. Rollback / recovery

- Phase 0 commits are additive (new directories/files, no destructive migrations or rewrites of existing behavior).
- Each commit can be reverted independently before acceptance without leaving the workspace broken.
- If a gate regresses, revert the offending commit and re-run the acceptance criteria rather than patching forward.
